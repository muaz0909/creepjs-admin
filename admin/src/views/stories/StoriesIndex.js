import React, {useEffect, useState} from "react";
import {ButtonGroup, Form} from "react-bootstrap"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner
} from "reactstrap";

import {v4 as uuid} from "uuid";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {firestore, storage} from "../../utils/constants";
import moment from "moment";
import {Link} from "react-router-dom";


function StoriesIndex() {
    const [id, setId] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [modalData, setModalData] = useState(data);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState("1");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("1");
    const [show, setShow] = useState(false);
    const radios = [{name: " Single", value: "1"}, {name: " Group", value: "2"}];
    const statusOptions = [{name: "Active", value: "1"}, {name: "Disable", value: "2"}];
    const [fields, setFields] = useState([{title: "", heading: "", description: "", image: ""}]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modalCancel, setModalCancel] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [tempFields, setTempFields] = useState([]);


    async function fetchData() {
        const table = "stories";
        const tempData = [];
        const querySnapshot = await getDocs(collection(firestore, table));
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id, ...doc.data(),
                index: tempData.length + 1
            });
        });
        // compare tempData with data
        if (JSON.stringify(tempData) !== JSON.stringify(data)) {
            tempData.sort((a, b) => b.createdAt - a.createdAt);
            setData(tempData);
            setFilteredData(tempData);
        }
        setDataLoading(false);
    }

    useEffect(() => {
        if(tempFields.length > 0){
            setFields(tempFields);
        }
    }, [tempFields])
    useEffect(() => {
        if (type === "1") {
            setTempFields(fields);
            setFields([fields[0]]);
        }
        if (type === "2") {
            if (tempFields.length > 0) {
                setFields(tempFields);
            }
        }
    }, [type]);


    useEffect(() => {
    }, [fields]);

    const handleChange = (i, e) => {
        const values = [...fields];
        if (e.target.name === "image") {
            values[i][e.target.name] = e.target.files[0];
        } else {
            values[i][e.target.name] = e.target.value;
        }
        setFields(values);
    };


    const handleAdd = () => {
        const values = [...fields];
        values.push({title: "", heading: "", description: "", image: ""});
        setFields(values);
    };

    const handleRemove = (i) => {
        // check the length of the fields array
        if (fields.length === 1) {
            return;
        }
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    };


    const onAdd = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setModalCancel(true);


        const table = "stories";
        let data = {};
        const downloadUrls = await handleUpload();
        data = {
            name,
            type,
            status,
            fields: fields.map((item, index) => {
                return {
                    ...item,
                    image: downloadUrls[index]
                };
            }),
            timestamp: moment().unix() * 1000
        };
        const docRef = await addDoc(collection(firestore, table), data);
        setIsLoading(false);
        await Swal.fire({
            icon: "success", title: "Success", text: "Story Added Successfully"
        }).then(() => {
            toggleAddModal();
            fetchData();
        });
        setModalCancel(false);
    };
    const onUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setModalCancel(true);
        const table = "stories";
        let data = {};
        const downloadUrls = await handleUpload();
        data = {
            name, type, status, fields: fields.map((item, index) => {
                return {
                    // ...item, image: downloadUrls[index]
                    ...(downloadUrls.length > 0 ? {...item, image: downloadUrls[index]} : {...item})
                };
            })
        };
        await updateDoc(doc(firestore, table, id), data);
        // const docRef = await addDoc(collection(firestore, table), data);
        setIsLoading(false);
        await Swal.fire({
            icon: "success", title: "Success", text: "Story Updated Successfully"
        }).then(() => {
            toggle();
            fetchData();
        });
        setModalCancel(false);
    };

    async function handleUpload() {
        let uploadedFiles = [];

        for (const field of fields) {
            if (typeof field.image === 'string') {
                uploadedFiles.push(field.image);

            } else {
                let fileExtention = field.image.name.split(".").pop();
                let imageName = "story" + uuid() + "." + fileExtention;
                const imageRef = ref(storage, `${imageName}`);
                const data = await uploadBytes(imageRef, field.image);
                const downloadUrl = await getDownloadURL(data.ref);
                uploadedFiles.push(downloadUrl);
            }
        }
        return uploadedFiles;
    }


    const toggleAddModal = () => {
        if (openAddModal) {
            setName("");
            setType("1");
            setStatus("1");
            setFields([{title: "", heading: "", description: "", image: ""}]);
        }
        setOpenAddModal(!openAddModal);
    }


    useEffect(() => {
        fetchData();
    }, []);

    const toggle = (row, edit) => {
        if (row) {
            setId(row.id);
            setName(row.name);
            setType(row.type);
            setStatus(row.status);
            setFields(row.fields)
        }
        if (modal) {
            setTempFields([])
            setEdit(false);
            setName("");
            setType("1");
            setStatus("1");
            setFields([{title: "", heading: "", description: "", image: ""}]);
        }
        setModal(!modal);
    }

    const applyFilter = (e) => {
        e.preventDefault();
        let tempFilterData = data;
        if (searchName) {
            tempFilterData = tempFilterData.filter((item) => {
                if (item.name) {
                    if (item.name
                        .toString()
                        .toLowerCase()
                        .includes(searchName.toLowerCase())) {
                        return item;
                    }
                }
            });
        }
        if (filterType !== "all") {
            tempFilterData = tempFilterData.filter((item) => {
                if (item.type === filterType) {
                    if (item.type
                        .toString()
                        .toLowerCase()
                        .includes(filterType.toLowerCase())) {
                        return item;
                    }
                }
            });
        }
        if (filterStatus !== "all") {
            tempFilterData = tempFilterData.filter((item) => {
                if (item.status === filterStatus) {
                    if (item.status
                        .toString()
                        .toLowerCase()
                        .includes(filterStatus.toLowerCase())) {
                        return item;
                    }
                }
            });
        }
        setFilteredData(tempFilterData);
    }

    const clearFilter = () => {
        setFilteredData(data);
        setSearchName("");
        setFilterType("all");
        setFilterStatus("all");
    }

    const columns = [{
        name: "Name", selector: (row) => row.name, sortable: true
    }, {
        name: "Description",
        selector: (row) => row.fields[0].description.length===0? "---": row.fields[0].description.length > 20 ? row.fields[0].description.substring(0, 20) + "..." : row.fields[0].description,
        sortable: true
    },
        {
            name: "Image", selector: (row) => {
                if (row?.fields[0]?.image === "") {
                    return "No Image";
                } else {
                    return (
                        <img src={row?.fields[0]?.image} alt="image" style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                        }}/>
                    )
                }
            },
            sortable: false
        },{
        name: "Type", selector: (row) => {
            if (row.type === "1") {
                return (
                    <span className="badge bg-primary text-white">
                        Single
                    </span>)
            } else if (row.type === "2") {
                return (
                    <span
                        className="badge bg-success text-white"
                    >
                        Group
                    </span>
                )
            }
        }, sortable: true
    }, {
        name: "Status", selector: (row) => {
            if (row.status === "1") {
                return (<span className="badge bg-success text-white">Active</span>);
            } else if (row.status === "2") {
                return (<span className="badge bg-danger text-white">disable</span>);
            } else {
                return "Deleted";
            }
        }
    }, {
        name: "Action", cell: (row, ind) => (<>

            <Link

                title="View Story"
                to={"/admin/stories/view/"+row.id}>
                <button className="btn-sm btn-secondary mr-1">
                    <i className="fa fa-eye"></i>
                </button>
            </Link>
            <Link
                title="Edit Story"
                to={"/admin/stories/edit/"+row.id}>
                <button className="btn-sm btn-warning mr-1">
                    <i className="fa fa-edit"></i>
                </button>
            </Link>



            <button className="btn-sm btn-danger mr-1"
                    title="Delete Story"
                    onClick={() => deleteStory(row.id)}>
                <i className="fa fa-trash"></i>
            </button>
        </>)
    }];


    const deleteStory = async (id) => {
        const table = "stories";
        // confirm before delete
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });
        if (!result.isConfirmed) {
            return;
        }
        // delete story

        const docRef = doc(firestore, table, id);
        await deleteDoc(docRef);
        await fetchData();
        await Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
    };


    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <Row>

                        <Col className="mb-5 mb-xl-0" xl="12">
                            <form onSubmit={applyFilter}>
                                <Card className="shadow">
                                    <CardHeader className="border-0">
                                        <Row className="align-items-center">
                                            <Col md="3" sm="12">
                                                <label>Search Name</label>
                                                <input type="text" placeholder="Search Name" className="form-control"
                                                       value={searchName} onChange={(e) => {
                                                    setSearchName(e.target.value)
                                                }}/>
                                            </Col>
                                            <Col md="3" sm="12">
                                                <label>Story Type</label>
                                                <select name="type" id="type" className="form-control" onChange={
                                                    (e) => {
                                                        setFilterType(e.target.value)
                                                    }
                                                }>
                                                    <option value="all"
                                                            selected={filterType === "all" ? "selected" : ""}>All
                                                    </option>
                                                    <option value="1"
                                                            selected={filterType === "1" ? "selected" : ""}>Single
                                                    </option>
                                                    <option value="2"
                                                            selected={filterType === "2" ? "selected" : ""}>Group
                                                    </option>
                                                </select>
                                            </Col>
                                            <Col md="3" sm="12">
                                                <label>Status</label>
                                                <select name="status" id="status" className="form-control" onChange={
                                                    (e) => {
                                                        setFilterStatus(e.target.value)
                                                    }
                                                }>
                                                    <option value="all"
                                                            selected={filterStatus === "all" ? "selected" : ""}>All
                                                    </option>
                                                    <option value="1"
                                                            selected={filterStatus === "1" ? "selected" : ""}>Active
                                                    </option>
                                                    <option value="2"
                                                            selected={filterStatus === "2" ? "selected" : ""}>Disable
                                                    </option>
                                                </select>
                                            </Col>
                                            <Col md="3" sm="12" className="mt-4 d-flex justify-content-end">
                                                <br/>
                                                <button className="btn btn-primary mr-1"
                                                        type="submit"
                                                >Apply
                                                </button>
                                                <button className="btn btn-danger float-right"
                                                        onClick={clearFilter}>Clear
                                                </button>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                </Card>
                            </form>

                        </Col>
                    </Row>
                </Container>
            </div>

            <div style={{
                marginTop: -100,
            }}>
                <Container fluid>
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col>
                                            <h2>Stories</h2>
                                        </Col>
                                        <Col>
                                            <Link className="btn btn-primary float-right" to={"/admin/stories/add"}>
                                                <i className="fa fa-plus"></i> Create Story
                                            </Link>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    {dataLoading ? <div className="text-center">
                                            <Spinner animation="border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </Spinner>
                                        </div> :
                                    <DataTable
                                        pagination
                                        columns={columns}
                                        data={filteredData}
                                        progressPending={dataLoading}
                                        highlightOnHover
                                        pointerOnHover
                                        paginationPerPage={10}
                                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                        paginationComponentOptions={{
                                            rowsPerPageText: "Rows per page:",
                                            rangeSeparatorText: "of",
                                            noRowsPerPage: false,
                                            selectAllRowsItem: true,
                                            selectAllRowsItemText: "All"
                                        }}
                                    />
                                    }
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={modal} toggle={toggle} backdrop={false} size="xl">
                <Form onSubmit={onUpdate}>
                    <ModalHeader toggle={toggle}>
                        {
                            edit ? "Edit Story" : "View Story"
                        }
                    </ModalHeader>
                    <ModalBody>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group" controlId="name">
                                            <label>Title <span className="text-danger">*</span></label>
                                            <input className="form-control"
                                                   type="text"
                                                   disabled={!edit}
                                                   value={name}
                                                   maxLength={50}
                                                   name="name"
                                                   placeholder="Enter story name"
                                                   onChange={event => {
                                                       setName(event.target.value);
                                                   }}
                                                   required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group" controlId="type">
                                            <label>Story Type <span className="text-danger">*</span></label><br/>
                                            <ButtonGroup className="mb-2">
                                                {radios.map((radio, idx) => (
                                                    <>
                                                        <Button color="primary"
                                                                name="radio"
                                                                value={radio.value}
                                                            // disabled={type !== radio.value}
                                                                active={type === radio.value}
                                                                onClick={(e) => setType(e.target.value)}
                                                        >
                                                            {radio.name}
                                                        </Button>
                                                    </>
                                                ))}
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group" controlId="type">
                                            <label>Story Status <span className="text-danger">*</span></label>
                                            <br/>
                                            <ButtonGroup className="mb-2">
                                                {statusOptions.map((statusOption, idx) => (
                                                    <>
                                                        <Button color="primary"
                                                                name="status"
                                                            // disabled={status !== statusOption.value}
                                                                value={statusOption.value}
                                                                active={status === statusOption.value}
                                                                onClick={(e) => setStatus(e.target.value)}
                                                            // active={this.state.rSelected === 1}
                                                        >
                                                            {statusOption.name}
                                                        </Button>
                                                    </>
                                                ))}
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </div>

                                {fields.map((field, idx) =>

                                    (<div key={`${field}-${idx}`}>
                                            {type === "2" && fields.length > 1 ? (<Row style={{
                                                    width: "100%"
                                                }}>
                                                    <Col sm="12">
                                                        {
                                                            edit ? (
                                                                <>
                                                                    <button
                                                                        className="float-right btn-sm mb-2 btn-danger"
                                                                        onClick={() => handleRemove(idx)}>
                                                                        {/* remove icon   */}
                                                                        <i className="fa fa-trash"/>
                                                                    </button>
                                                                </>
                                                            ) : null

                                                        }

                                                    </Col>
                                                </Row>

                                            ) : null}

                                            <Row>
                                                <div className="col-sm-10">
                                                    <Row>
                                                        <Col sm="4">
                                                            <div className="form-group mb-3">
                                                                <label>Story Name <span className="text-danger">*</span> </label>
                                                                <input
                                                                    className="form-control"
                                                                    readOnly={!edit}
                                                                    type="text"
                                                                    maxLength="50"
                                                                    name="title"
                                                                    value={field.title}
                                                                    onChange={(e) => handleChange(idx, e)}
                                                                    required
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm="4">
                                                            <div className="mb-3 form-group">
                                                                <label>Story Heading <span className="text-danger">*</span> </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    readOnly={!edit}
                                                                    maxLength="50"
                                                                    name="heading"
                                                                    value={field.heading}
                                                                    onChange={(e) => handleChange(idx, e)}
                                                                    required
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm="4">
                                                            <div className="mb-3 form-group">
                                                                {edit ? (
                                                                        <>
                                                                            <label>Story Image <span className="text-danger">*</span></label>
                                                                            <Input
                                                                                type="file"
                                                                                name="image"
                                                                                accept={"image/*"}
                                                                                onChange={(e) => {
                                                                                    handleChange(idx, e)
                                                                                }}
                                                                            />
                                                                        </>
                                                                    ) :
                                                                    null
                                                                }

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm="12">
                                                            {/*    text area */}
                                                            <div className="mb-3 form-group">
                                                                <label>Description</label>
                                                                <textarea
                                                                    readOnly={!edit}
                                                                    name="description"
                                                                    className="form-control"
                                                                    id="description"
                                                                    maxLength="200"
                                                                    rows="5"
                                                                    value={field.description}
                                                                    onChange={(e) => handleChange(idx, e)}/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className={"col-sm-2"}>
                                                    <Col sm="2">
                                                        <label>Story</label>
                                                        <br/>
                                                        {
                                                            field.image ?
                                                                typeof field.image === "string" ?
                                                                    <img src={
                                                                        field.image
                                                                    }
                                                                         width={"150px"}
                                                                         height={"150px"}
                                                                        // className={"img-fluid"}
                                                                         alt=""/>
                                                                    :
                                                                    <img src={
                                                                        URL.createObjectURL(field.image)
                                                                    }
                                                                         width={"150px"}
                                                                         height={"150px"}
                                                                        // className={"img-fluid"}
                                                                         alt=""
                                                                    />
                                                                :
                                                                <img src={
                                                                    "http://placehold.it/150x150"
                                                                }
                                                                     width={"150px"}
                                                                     height={"150px"}
                                                                    // className="img-fluid"
                                                                     responsive
                                                                     alt=""
                                                                />

                                                        }
                                                    < /Col>
                                                </div>
                                            </Row>

                                        </div>
                                    )
                                )}
                                <br/>
                                {type === "2" && edit ? (<Row>
                                    <Col>

                                        <button className="float-right mb-2 btn-sm btn-primary"
                                                type="button"
                                                onClick={() => handleAdd()}>
                                            <i className="fa fa-plus"/>
                                        </button>
                                    </Col>
                                </Row>) : null}


                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group">
                            {edit ?
                                <button type="submit"
                                        disabled={!isLoading ? false : true}
                                        className="btn btn-primary">
                                    {isLoading ? <Spinner animation="border" role="status"/> : "Submit"}
                                </button>
                                : ""}
                            <Button className="btn btn-danger" onClick={toggle} disabled={modalCancel}>
                                Cancel
                            </Button>
                        </div>
                    </ModalFooter>
                </Form>
            </Modal>
            <Modal isOpen={openAddModal} toggle={toggleAddModal} backdrop={false} size="xl">
                <Form onSubmit={onAdd}>
                    <ModalHeader toggle={toggleAddModal}>
                        Add New Entity
                    </ModalHeader>
                    <ModalBody className="modalBg">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group" controlId="name">
                                            <label>Title <span className="text-danger">*</span> </label>
                                            <input className="form-control" type="text" value={name}
                                                   placeholder="Enter story name"
                                                   onChange={event => {
                                                       setName(event.target.value);
                                                   }}
                                                   required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group" controlId="type">
                                            <label>Story Type <span className="text-danger">*</span> </label>
                                            <br/>
                                            <ButtonGroup className="mb-2">
                                                {radios.map((radio, idx) => {
                                                    return (
                                                        <>
                                                            <Button
                                                                color="primary"
                                                                name="radio"
                                                                value={radio.value}
                                                                active={type === radio.value}
                                                                onClick={(e) => setType(e.target.value)}
                                                            >
                                                                {radio.name}
                                                            </Button>
                                                        </>
                                                    )
                                                })
                                                }
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group" controlId="type">
                                            <label>Story Status <span className="text-danger">*</span> </label>
                                            <br/>
                                            <ButtonGroup className="mb-2">
                                                {statusOptions.map((statusOption, idx) => (
                                                    <>
                                                        <Button color="primary"
                                                                name="status"
                                                                value={statusOption.value}
                                                                active={status === statusOption.value}
                                                                onClick={(e) => setStatus(e.target.value)}
                                                            // active={this.state.rSelected === 1}
                                                        >
                                                            {statusOption.name}
                                                        </Button>
                                                    </>
                                                ))}
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                </div>

                                {fields.map((field, idx) => (
                                    <div key={`${field}-${idx}`}>
                                        {type === "2" && fields.length > 1 ? (
                                            <Row style={{
                                                width: "100%"
                                            }}>
                                                <Col sm="12">
                                                    <button className="float-right btn-sm mb-2 btn-danger"
                                                            onClick={() => handleRemove(idx)}>
                                                        {/* remove icon   */}
                                                        <i className="fa fa-trash"/>
                                                    </button>
                                                </Col>
                                            </Row>
                                        ) : null}


                                        <Row>
                                            <Col sm="10">
                                                <Row>
                                                    <Col sm="4">
                                                        <div className="mb-3 form-group">
                                                            <label>Story Name <span className="text-danger">*</span> </label>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="title"
                                                                maxLength={50}
                                                                value={field.title}
                                                                onChange={(e) => handleChange(idx, e)}
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col sm="4">
                                                        <div className="mb-3 form-group">
                                                            <label>Story Heading  <span className="text-danger">*</span> </label>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="heading"
                                                                maxLength={50}
                                                                value={field.heading}
                                                                onChange={(e) =>
                                                                    handleChange(idx, e)
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col sm="4">
                                                        <div className="form-group mb-3">
                                                            <label>Story Image  <span className="text-danger">*</span> </label>
                                                            <input
                                                                type="file"
                                                                name="image"
                                                                accept={"image/*"}
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    handleChange(idx, e)
                                                                }
                                                                }
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm="12">
                                                        {/*    text area */}
                                                        <div className="mb-3 form-group">
                                                            <label>Description</label>
                                                            <textarea
                                                                className="form-control"
                                                                name="description"
                                                                maxLength={200}
                                                                value={field.description}
                                                                onChange={(e) => handleChange(idx, e)}
                                                            />

                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>

                                                </Row>
                                            </Col>
                                            <Col sm="2">
                                                <br/>
                                                {
                                                    field.image ?
                                                        typeof field.image === "object" ?
                                                            <img src={URL.createObjectURL(field.image)}
                                                                 width={"150px"}
                                                                 height={"150px"}
                                                                 className={"img-fluid"}
                                                                 alt=""/> :
                                                            <img src="https://via.placeholder.com/150"

                                                                 width={"150px"}
                                                                 height={"150px"}
                                                                 className={"img-fluid"}
                                                                 alt=""/>
                                                        :
                                                        <img src="https://via.placeholder.com/150"

                                                             width={"150px"}
                                                             height={"150px"}
                                                             className={"img-fluid"}
                                                             alt=""/>


                                                }
                                            </Col>
                                        </Row>


                                    </div>
                                ))}
                                {type === "2" ? (<Row>
                                    <Col>
                                        <button className="float-right mb-1 btn-sm btn-primary mt-1" type="button"
                                                onClick={() => handleAdd()}>
                                            {/*  add icon  */}
                                            <i className="fa fa-plus"/>
                                        </button>
                                    </Col>
                                </Row>) : null}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group">
                            <button type="submit"
                                    disabled={!isLoading ? false : true}
                                    className="btn btn-primary">
                                {isLoading ? <Spinner animation="border" role="status"/> : "Submit"}
                            </button>
                            <Button className="btn btn-danger" onClick={toggleAddModal} disabled={modalCancel}>
                                Cancel
                            </Button>

                        </div>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    )
}

export default StoriesIndex