import {Button, Col, Container, Input, Row, Spinner} from "reactstrap";
import {ButtonGroup, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {firestore, storage} from "../../utils/constants";
import Swal from "sweetalert2";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4 as uuid} from "uuid";
import {Link} from "react-router-dom";
import CropImage from "../../components/Common/CropImage";

function EditStory(props) {
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("feature");
    const [status, setStatus] = React.useState("todo");
    const radios = [{name: " Single", value: "1"}, {name: " Group", value: "2"}];
    const statusOptions = [{name: "Active", value: "1"}, {name: "Disable", value: "2"}];
    const [fields, setFields] = useState([{title: "", heading: "", description: "", image: ""}]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [id, setId] = useState(null);
    const [tempFields, setTempFields] = useState([{title: "", heading: "", description: "", image: ""}]);
    const [category, setCategory] = useState([]);
    const [featured, setFeatured] = useState("1");
    const [categories, setCategories] = useState([]);
    const featuredOptions = [{name: "Yes", value: true}, {name: "No", value: false}];

    const getAllCategories = async () => {
        const querySnapshot = await getDocs(collection(firestore, "categories"));
        const data = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        setCategories(data)
    }

    const fetchData = async () => {
        const docRef = doc(firestore, "stories", props.match.params.id);
        const docSnap = await getDoc(docRef);
        await getAllCategories();

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setId(docSnap.id);
            setName(docSnap.data().name);
            setType(docSnap.data().type);
            setStatus(docSnap.data().status);
            setFields(docSnap.data().fields);
            setCategory(docSnap.data().category);
            setFeatured(docSnap.data().isFeatured);
            console.log("document data", docSnap.data())
            setDataLoading(false)
        } else {
            console.log("No such document!");
        }
    }


    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (type === "1") {
            setTempFields(fields);
            if (fields.length > 1) {
                setFields(fields[0])
            }
        } else {
            // setFields(tempFields);
        }
    }, [type]);

    const handleChange = (i, e) => {
        const values = [...fields];
        if (e.target.name === "image") {
            values[i][e.target.name] = e.target.files[0];
        } else {
            values[i][e.target.name] = e.target.value;
        }
        setFields(values);
    };

    async function handleUpload() {
        let uploadedFiles = [];
        for (const field of fields) {
            console.log(typeof field.image)
            if (typeof field.image === 'string') {
                uploadedFiles.push(field.image);
            } else {
                let fileExtention = field.image.name.split(".").pop();
                if (!["jpg", "jpeg", "png","gif","webp","avif"].includes(fileExtention.toLowerCase())) {
                    setIsLoading(false);
                    await Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "File is not an image",
                    });

                    return;
                }
                let imageName = "story" + uuid() + "." + fileExtention;
                const imageRef = ref(storage, `${imageName}`);
                const data = await uploadBytes(imageRef, field.image);
                const downloadUrl = await getDownloadURL(data.ref);
                uploadedFiles.push(downloadUrl);
            }
        }
        return uploadedFiles;
    }


    const handleRemove = (i) => {
        // check the length of the fields array
        if (fields.length === 1) {
            return;
        }
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    };


    const onUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const table = "stories";
        let data = {};
        const downloadUrls = await handleUpload();
        data = {
            name,
            type,
            status,
            fields: fields.map((item, index) => {
                return {
                    // ...item, image: downloadUrls[index]
                    ...(downloadUrls.length > 0 ? {...item, image: downloadUrls[index]} : {...item})
                };
            }),
            category,
            isFeatured : featured
        };
        console.log(data);
        await updateDoc(doc(firestore, table, id), data, {merge: true});
        // const docRef = await addDoc(collection(firestore, table), data);
        setIsLoading(false);
        await Swal.fire({
            icon: "success", title: "Success", text: "Story Updated Successfully"
        }).then(() => {
            props.history.push("/admin/stories");
        });
    };


    const handleAdd = () => {
        const values = [...fields];
        values.push({title: "", heading: "", description: "", image: ""});
        setFields(values);
    };


    return (<>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
                <Row>

                    <Col className="mb-5 mb-xl-0" xl="12">

                    </Col>
                </Row>
            </Container>
        </div>
        <div style={{
            marginTop: -100,
        }}>
            <Container>
                <Row>
                    <Col lg={12}>
                        <Form onSubmit={onUpdate}>


                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">Edit Story</h3>
                                </div>
                                <div className="card-body">
                                    {dataLoading ? <div className="text-center">
                                        <Spinner animation="border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                    </div>:
                                    <>
                                    <div className="row">
                                        <div className="col-sm-10">
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <div className="form-group" controlId="name">
                                                        <label>Story Title <span
                                                            className="text-danger">*</span></label>
                                                        <input className="form-control"
                                                               type="text"
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

                                                <div className="col-sm-4">
                                                    <label>Category</label>
                                                    <select className="form-control" required onChange={
                                                        event => {
                                                            setCategory(event.target.value);
                                                        }
                                                    }>
                                                        <option value="">Select Category</option>
                                                        {categories.map((singleCategory, index) => (
                                                            <option key={index}
                                                                    selected={singleCategory.id === category}
                                                                    value={singleCategory.id}>{singleCategory.name}</option>
                                                        ))}

                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-sm-2">
                                        </div>
                                    </div>
                                    {fields.map((field, idx) =>
                                        (<div key={`${field}-${idx}`}>
                                            {type === "2" && fields.length > 1 ? (<Row style={{
                                                    width: "100%"
                                                }}>
                                                    <Col sm="12">
                                                        <button
                                                            className="float-right btn-sm mb-2 btn-danger"
                                                            onClick={() => handleRemove(idx)}>
                                                            {/* remove icon   */}
                                                            <i className="fa fa-trash"/>
                                                        </button>
                                                    </Col>
                                                </Row>

                                            ) : null}

                                            <Row>
                                                <div className="col-sm-10">
                                                    <Row>
                                                        <Col sm="4">
                                                            <div className="form-group mb-3">
                                                                <label>Story Name <span
                                                                    className="text-danger">*</span> </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    maxLength="50"
                                                                    name="title"
                                                                    placeholder="Enter story name"
                                                                    value={field.title}
                                                                    onChange={(e) => handleChange(idx, e)}
                                                                    required
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm="4">
                                                            <div className="mb-3 form-group">
                                                                <label>Story Heading <span
                                                                    className="text-danger">*</span> </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    maxLength="50"
                                                                    name="heading"
                                                                    placeholder="Enter story heading"
                                                                    value={field.heading}
                                                                    onChange={(e) => handleChange(idx, e)}
                                                                    required
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm="4">
                                                            <div className="mb-3 form-group">
                                                                <label>Story Image </label>
                                                                <Input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    accept={"image/*"}
                                                                    onChange={(e) => {
                                                                        handleChange(idx, e)
                                                                    }}
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
                                                                    name="description"
                                                                    className="form-control"
                                                                    placeholder={"Enter story description"}
                                                                    id="description"
                                                                    maxLength="200"
                                                                    rows="5"
                                                                    value={field.description}
                                                                    onChange={(e) => handleChange(idx, e)}/>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <Col sm="2">
                                                    {field.image ? typeof field.image === "string" ?
                                                        <img src={field.image}
                                                             width={"150px"}
                                                             height={"150px"}
                                                             alt=""/> :
                                                        <>
                                                        <img src={URL.createObjectURL(field.image)}
                                                             width={"150px"}
                                                             height={"150px"}
                                                             alt=""
                                                        />

                                                        </>
                                                            : <img src={"http://placehold.it/150x150"}
                                                                  width={"150px"}
                                                                  height={"150px"}
                                                        // className="img-fluid"
                                                                  responsive
                                                                  alt=""
                                                    />

                                                    }
                                                </Col>
                                            </Row>

                                        </div>))}
                                    <br/>
                                    <Row>
                                        <Col>

                                            {type === "2" ? (<>
                                                    <button className="float-right mb-2 btn-sm btn-primary"
                                                            type="button"
                                                            onClick={() => handleAdd()}>
                                                        <i className="fa fa-plus"/>
                                                    </button>
                                                </>
                                            ) : null}


                                            <Row>
                                                <div className="col-sm-10">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <div className="form-group" controlId="type">
                                                                <label>Story Type <span
                                                                    className="text-danger">*</span></label><br/>
                                                                <ButtonGroup className="mb-2 float-right">
                                                                    {radios.map((radio, idx) => (<>
                                                                        <Button color="primary"
                                                                                name="radio"
                                                                                value={radio.value}
                                                                            // disabled={type !== radio.value}
                                                                                active={type === radio.value}
                                                                                onClick={(e) => setType(e.target.value)}
                                                                        >
                                                                            {radio.name}
                                                                        </Button>
                                                                    </>))}
                                                                </ButtonGroup>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="form-group" controlId="type">
                                                                <label>Story Status <span
                                                                    className="text-danger">*</span></label>
                                                                <br/>
                                                                <ButtonGroup className="mb-2 float-right">
                                                                    {statusOptions.map((statusOption, idx) => (<>
                                                                        <Button color="primary"
                                                                                name="status"
                                                                                value={statusOption.value}
                                                                                active={status === statusOption.value}
                                                                                onClick={(e) => setStatus(e.target.value)}
                                                                        >
                                                                            {statusOption.name}
                                                                        </Button>
                                                                    </>))}
                                                                </ButtonGroup>
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-4">
                                                            <label>Featured</label>
                                                            <br/>

                                                            {
                                                                console.log("featured",featured)
                                                            }
                                                            <ButtonGroup className="mb-2 float-right">
                                                                {featuredOptions.map((featuredOption, idx) => (<>
                                                                    <Button color="primary"
                                                                            name="status"
                                                                            value={featuredOption.value}
                                                                            active={featured === featuredOption.value}
                                                                            onClick={(event) => {
                                                                                if (event.target.value === "true")
                                                                                    setFeatured(true)
                                                                                else
                                                                                    setFeatured(false)
                                                                            }
                                                                            }
                                                                    >
                                                                        {featuredOption.name}
                                                                    </Button>
                                                                </>))}
                                                            </ButtonGroup>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="col-sm-2">

                                                </div>
                                            </Row>


                                        </Col>
                                    </Row>
                                    </>
                                    }

                                </div>

                                <div className="card-footer">
                                    <div className="form-group float-right">
                                        <button type="submit"
                                                disabled={!isLoading ? false : true}
                                                className="btn btn-primary">
                                            {isLoading ? <Spinner animation="border" role="status"/> : "Submit"}
                                        </button>
                                        <Link to="/admin/index" className="btn btn-danger ml-2">Back</Link>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>

    </>);
}

export default EditStory;
