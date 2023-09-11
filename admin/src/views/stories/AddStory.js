import {Button, Col, Container, Row, Spinner} from "reactstrap";
import {ButtonGroup, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4 as uuid} from "uuid";


import {firestore, storage} from "../../utils/constants";
import moment from "moment/moment";
import {addDoc, collection, getDocs} from "firebase/firestore";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";


function AddStory(props) {
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("1");
    const [status, setStatus] = React.useState("1");
    const radios = [{name: " Single", value: "1"}, {name: " Group", value: "2"}];
    const statusOptions = [{name: "Active", value: "1"}, {name: "Disable", value: "2"}];
    const [fields, setFields] = useState([{title: "", heading: "", description: "", image: ""}]);
    const [isLoading, setIsLoading] = useState(false);
    const featuredOptions = [{name: "Yes", value: true}, {name: "No", value: false}];
    const [featured, setFeatured] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const getAllCategories = async () => {
        const querySnapshot = await getDocs(collection(firestore, "categories"));
        const data = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        setCategories(data);
    }


    async function handleUpload() {
        let uploadedFiles = [];

        for (const field of fields) {
            console.log(typeof field.image)
            if (typeof field.image === 'string') {
                uploadedFiles.push(field.image);

            } else {
                let fileExtention = field.image.name.split(".").pop();
                // if file is not an image, return error

                if (!["jpg", "jpeg", "png"].includes(fileExtention.toLowerCase())) {
                    await Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "File is not an image",
                    });

                    setIsLoading(false);
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

    useEffect(() => {
        getAllCategories().then(r => r);
    }, []);


    const handleChange = (i, e) => {
        const values = [...fields];
        if (e.target.name === "image") {
            values[i][e.target.name] = e.target.files[0];
        } else {
            values[i][e.target.name] = e.target.value;
        }
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


    const handleAdd = () => {
        const values = [...fields];
        values.push({title: "", heading: "", description: "", image: ""});
        setFields(values);
    };


    const onAdd = async (e) => {
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
                    ...item,
                    image: downloadUrls[index]
                };
            }),
            createdAt: moment().unix() * 1000,
            dislikes: 0,
            likes: 0,
            isFeatured: featured,
            price: 0,
            category: category,
        };
        const docRef = await addDoc(collection(firestore, table), data);
        setIsLoading(false);
        await Swal.fire({
            icon: "success", title: "Success", text: "Story Added Successfully"
        }).then(() => {
            props.history.push("/admin/index");
        });

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
                        <Form onSubmit={onAdd}>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">Add Story</h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-10">
                                            <Row>
                                                <div className="col-sm-4">
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

                                                <div className="col-sm-4">
                                                    <div className="form-group" controlId="name">
                                                        <label>Category <span className="text-danger">*</span> </label>
                                                        <select name="" id="" className="form-control" required
                                                                onChange={e => {
                                                                    setCategory(e.target.value);
                                                                }
                                                                }>
                                                            <option value="">Select Category</option>
                                                            {categories.map((oneCategory) => {
                                                                return <option
                                                                    value={oneCategory.id}>{oneCategory.name}</option>
                                                            })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>


                                            </Row>
                                        </div>
                                        <div className="col-sm-2"></div>
                                    </div>

                                    {fields.map((field, idx) => (<div key={`${field}-${idx}`}>
                                        {type === "2" && fields.length > 1 ? (<Row style={{
                                            width: "100%"
                                        }}>
                                            <Col sm="12">
                                                <button className="float-right btn-sm mb-2 btn-danger"
                                                        onClick={() => handleRemove(idx)}>
                                                    {/* remove icon   */}
                                                    <i className="fa fa-trash"/>
                                                </button>
                                            </Col>
                                        </Row>) : null}


                                        <Row>
                                            <Col sm="10">
                                                <Row>
                                                    <Col sm="4">
                                                        <div className="mb-3 form-group">
                                                            <label>Story Name <span
                                                                className="text-danger">*</span> </label>
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                className="form-control"
                                                                placeholder={"Enter story name"}
                                                                maxLength={50}
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
                                                                name="heading"
                                                                placeholder={"Enter story heading"}
                                                                maxLength={50}
                                                                value={field.heading}
                                                                onChange={(e) => handleChange(idx, e)}
                                                                required
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col sm="4">
                                                        <div className="form-group mb-3">
                                                            <label>Story Image <span
                                                                className="text-danger">*</span> </label>
                                                            <input
                                                                className={"form-control"}
                                                                type="file"
                                                                name="image"
                                                                accept={"image/*"}
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    handleChange(idx, e)
                                                                }}
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
                                                                placeholder={"Enter story description"}
                                                                maxLength={200}
                                                                title={"Enter story description"}
                                                                rows={4}
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
                                                {field.image ? typeof field.image === "object" ?
                                                        <img src={URL.createObjectURL(field.image)}
                                                             width={"150px"}
                                                             height={"150px"}
                                                            // className={"img-fluid"}
                                                             alt=""/> : <img src="https://via.placeholder.com/150"

                                                                             width={"150px"}
                                                                             height={"150px"}
                                                            // className={"img-fluid"}
                                                                             alt=""/> :
                                                    <img src="https://via.placeholder.com/150"

                                                         width={"150px"}
                                                         height={"150px"}
                                                        // className={"img-fluid"}
                                                         alt=""/>


                                                }
                                            </Col>
                                        </Row>


                                    </div>))}
                                    {type === "2" ? (<Row>
                                        <Col>
                                            <button className="float-right mb-1 btn-sm btn-primary mt-1"
                                                    type="button"
                                                    onClick={() => handleAdd()}>
                                                {/*  add icon  */}
                                                <i className="fa fa-plus"/>
                                            </button>
                                        </Col>
                                    </Row>) : null}

                                    <div className="row">
                                        <div className="col-sm-10">
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <div className="form-group" controlId="type">
                                                        <label>Story Type <span className="text-danger">*</span>
                                                        </label>
                                                        <br/>
                                                        <ButtonGroup className="mb-2 float-right">
                                                            {radios.map((radio, idx) => {
                                                                return (<>
                                                                    <Button
                                                                        color="primary"
                                                                        name="radio"
                                                                        value={radio.value}
                                                                        active={type === radio.value}
                                                                        onClick={(e) => setType(e.target.value)}
                                                                    >
                                                                        {radio.name}
                                                                    </Button>
                                                                </>)
                                                            })}
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="form-group" controlId="type">
                                                        <label>Story Status <span className="text-danger">*</span>
                                                        </label>
                                                        <br/>
                                                        <ButtonGroup className="mb-2 float-right">
                                                            {statusOptions.map((statusOption, idx) => (<>
                                                                <Button color="primary"
                                                                        name="status"
                                                                        value={statusOption.value}
                                                                        active={status === statusOption.value}
                                                                        onClick={(e) => setStatus(e.target.value)}
                                                                    // active={this.state.rSelected === 1}
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
                                                    <ButtonGroup className="mb-2 float-right">
                                                        {featuredOptions.map((featuredOption, idx) => (<>
                                                            <Button color="primary"
                                                                    name="status"
                                                                    value={featuredOption.value}
                                                                    active={featured === featuredOption.value}
                                                                    onClick={(event) => {
                                                                        if (event.target.value === "true") {
                                                                            setFeatured(true)
                                                                        } else {
                                                                            setFeatured(false)
                                                                        }
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
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="form-group float-right">
                                        <button type="submit"
                                                disabled={!isLoading ? false : true}
                                                className="btn btn-primary">
                                            {isLoading ? <Spinner animation="border" role="status"/> : "Submit"}
                                        </button>
                                        {/*<Button className="btn btn-danger">*/}
                                        {/*    Cancel*/}
                                        {/*</Button>*/}

                                        <Link to="/admin/index" className="btn btn-danger">
                                            Back
                                        </Link>


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

export default AddStory;
