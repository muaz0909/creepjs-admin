import {Button, Col, Container, Row} from "reactstrap";
import {ButtonGroup, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {firestore} from "../../utils/constants";
import {Link} from "react-router-dom";

function ViewStory(props) {
    const [name, setName] = useState("");
    const [type, setType] = useState("feature");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("todo");
    const radios = [{name: " Single", value: "1"}, {name: " Group", value: "2"}];
    const statusOptions = [{name: "Active", value: "1"}, {name: "Disable", value: "2"}];
    const featuredOptions = [{name: "Yes", value: true}, {name: "No", value: false}];
    const [featured, setFeatured] = useState("1");
    const [fields, setFields] = useState([{title: "", heading: "", description: "", image: ""}]);
    const [isLoading, setIsLoading] = useState(true);
    const [id, setId] = useState(null);


    const getCategoryName = async (id) => {
        const docRef = doc(firestore, "categories", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().name;
        } else {
            return "no category";
        }
    }
    const fetchData = async () => {
        const docRef = doc(firestore, "stories", props.match.params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            let categoryName = await getCategoryName(docSnap.data().category);
            console.log("categoryName", categoryName)
            setId(docSnap.id);
            setName(docSnap.data().name);
            setType(docSnap.data().type);
            setStatus(docSnap.data().status);
            setFields(docSnap.data().fields);
            setFeatured(docSnap.data().isFeatured);
            setCategory(categoryName);
            console.log("document data", docSnap.data())
            setIsLoading(false);
        } else {
            console.log("No such document!");
        }

    }


    useEffect(() => {
        fetchData().then(r => console.log("fetch data", r));
    }, []);


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
                    <Form>
                        <div className="card">

                            <div className="card-header">
                                <h3 className="mb-0">Story Details</h3>
                            </div>


                            <div className="card-body">
                                {isLoading ?
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    :
                                    <>
                                    <div className="row">
                                        <div className="col-sm-10">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group" controlId="name">
                                                        <label>Title </label>
                                                        <input className="form-control"
                                                               type="text"
                                                               value={name}
                                                               readOnly={true}
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
                                                    <input type="text" className="form-control" value={category}
                                                           readOnly
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-sm-2">

                                        </div>

                                        </div>
                                        {fields.map((field, idx) =>

                                            (<div key={`${field}-${idx}`}>
                                                {/*{type === "2" && fields.length > 1 ? (*/}
                                                {/*    <Row style={{*/}
                                                {/*        width: "100%"*/}
                                                {/*    }}>*/}
                                                {/*        <Col sm="12">*/}
                                                {/*            <button*/}
                                                {/*                className="float-right btn-sm mb-2 btn-danger"*/}
                                                {/*                onClick={() => handleRemove(idx)}>*/}
                                                {/*                /!* remove icon   *!/*/}
                                                {/*                <i className="fa fa-trash"/>*/}
                                                {/*            </button>*/}
                                                {/*        </Col>*/}
                                                {/*    </Row>*/}

                                                {/*) : null}*/}

                                                <Row>
                                                    <div className="col-sm-10">
                                                        <Row>
                                                            <Col sm="4">
                                                                <div className="form-group mb-3">
                                                                    <label>Story Name </label>
                                                                    <input
                                                                        className="form-control"
                                                                        disabled={true}
                                                                        type="text"
                                                                        maxLength="50"
                                                                        name="title"
                                                                        value={field.title}
                                                                        // onChange={(e) => handleChange(idx, e)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col sm="4">
                                                                <div className="mb-3 form-group">
                                                                    <label>Story Heading </label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        maxLength="50"
                                                                        disabled={true}
                                                                        name="heading"
                                                                        value={field.heading}
                                                                        // onChange={(e) => handleChange(idx, e)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col sm="4">
                                                                <div className="mb-3 form-group">

                                                                    {/*<label>Story Image <span*/}
                                                                    {/*    className="text-danger">*</span></label>*/}
                                                                    {/*<Input*/}
                                                                    {/*    type="file"*/}
                                                                    {/*    name="image"*/}
                                                                    {/*    accept={"image/*"}*/}
                                                                    {/*    onChange={(e) => {*/}
                                                                    {/*        handleChange(idx, e)*/}
                                                                    {/*    }}*/}
                                                                    {/*/>*/}


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
                                                                        disabled={true}
                                                                        className="form-control"
                                                                        id="description"
                                                                        maxLength="200"
                                                                        rows="5"
                                                                        value={field.description}
                                                                        // onChange={(e) => handleChange(idx, e)}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <Col sm="2">
                                                        Story Image
                                                        {field.image ? typeof field.image === "string" ?
                                                            <img src={field.image}
                                                                 width={"150px"}
                                                                // height={"150px"}
                                                                // className={"img-fluid"}
                                                                 alt=""/> : <img src={URL.createObjectURL(field.image)}
                                                                                 width={"150px"}
                                                                // height={"150px"}
                                                                // className={"img-fluid"}
                                                                                 alt=""
                                                            /> : <img src={"http://placehold.it/150x150"}
                                                                      width={"150px"}
                                                            // height={"150px"}
                                                            // className="img-fluid"
                                                                      responsive
                                                                      alt=""
                                                        />

                                                        }
                                                    < /Col>
                                                </Row>

                                            </div>))}
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-10">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <div className="form-group" controlId="type">
                                                                    <label>Story Type </label><br/>
                                                                    <ButtonGroup className="mb-2 float-right">
                                                                        {radios.map((radio, idx) => (<>
                                                                            <Button color="primary"
                                                                                    name="radio"
                                                                                    value={radio.value}
                                                                                    disabled={type !== radio.value}
                                                                                    active={type === radio.value}
                                                                                    onClick={(e) => setType(e.target.value)}
                                                                            >
                                                                                {radio.name}
                                                                            </Button>
                                                                        </>))}
                                                                    </ButtonGroup>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group" controlId="type">
                                                                    <label>Story Status </label>
                                                                    <br/>
                                                                    <ButtonGroup className="mb-2 float-right">
                                                                        {statusOptions.map((statusOption, idx) => (<>
                                                                            <Button color="primary"
                                                                                    name="status"
                                                                                    value={statusOption.value}
                                                                                    disabled={status !== statusOption.value}
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
                                                                <ButtonGroup className="mb-2 float-right">
                                                                    {featuredOptions.map((featuredOption, idx) => (<>
                                                                        <Button color="primary"
                                                                                name="status"
                                                                                value={featuredOption.value}
                                                                                disabled={featured !== featuredOption.value}
                                                                                active={featured === featuredOption.value}
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
                                        </div>
                                        <br/>
                                        </>
                                }
                            </div>

                            <div className="card-footer">
                                <div className="form-group float-right">
                                    {/*<button type="submit"*/}
                                    {/*        disabled={!isLoading ? false : true}*/}
                                    {/*        className="btn btn-primary">*/}
                                    {/*    {isLoading ? <Spinner animation="border" role="status"/> : "Submit"}*/}
                                    {/*</button>*/}

                                    <Link className={"btn btn-danger"} to={"/admin/index"}>
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

</>)

}

export default ViewStory;
