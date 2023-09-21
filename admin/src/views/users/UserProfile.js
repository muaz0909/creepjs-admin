import {Button, Col, Container, Input, Row} from "reactstrap";
import {ButtonGroup, Form} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {firestore, reformatArrayToString, reformatObjectToString} from "../../utils/constants";
import {Link, useParams} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import Map from "../../components/Common/Map";

function UserProfile(props) {
    const {id} = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const fetchData = async () => {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUserDetails(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
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
                                    <h3 className="mb-0">User Details</h3>
                                </div>
                                <div className="card-body">
                                    {
                                        isLoading ? <div className="text-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div> :
                                            <>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>Fingerprint </label>
                                                                    <input className="form-control"
                                                                           type="text"
                                                                           readOnly={true}
                                                                           maxLength={50}
                                                                           name="name"
                                                                           value={userDetails?.visitorId}
                                                                           placeholder="visitor ID"
                                                                           required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>IP Address</label><br/>
                                                                    <input className="form-control"
                                                                           type="text"
                                                                           readOnly={true}
                                                                           maxLength={50}
                                                                           name="name"
                                                                           value={userDetails?.location?.ip}
                                                                           placeholder="IP Address"
                                                                           required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group mb-3">
                                                                    <label>Browser</label>
                                                                    <input
                                                                        className="form-control"
                                                                        disabled={true}
                                                                        type="text"
                                                                        maxLength="50"
                                                                        name="title"
                                                                        value={userDetails?.browser}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <Row>
                                                        <Row>
                                                            <Col>
                                                                <h3>Location Info</h3>
                                                            </Col>
                                                        </Row>
                                                        <div className="col-sm-12">
                                                            <Row>
                                                                <Col sm="4">
                                                                    <div className="mb-3 form-group">
                                                                        <label>City</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.location?.city}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Country</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.location?.country}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col sm="4">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Location Coordinates</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.location?.loc}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col sm="4">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Postal Code</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.location?.postal}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col sm="4">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Region</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.location?.region}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col sm="4">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Timezone</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.location?.timezone}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col sm={12}>
                                                                    <Map
                                                                        location={userDetails?.location?.loc?.split(',')}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                    </Row>
                                                    <Row>
                                                        <div className="col-sm-12">
                                                            <Row>
                                                                <Col>
                                                                    <h3>Hardware Info</h3>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col sm="6">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Audio Device</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.devicesInfo?.hasAudio ? "Yes" : "No"}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6">
                                                                    <div className="mb-3 form-group">
                                                                        <label>Video Device</label>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            maxLength="50"
                                                                            disabled={true}
                                                                            name="points"
                                                                            value={userDetails?.devicesInfo?.hasVideo ? "Yes" : "No"}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Row>


                                                    <Row>
                                                        <div className="col-sm-12">
                                                            <Row>
                                                                <Col>
                                                                    <h3>WebGL Info</h3>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col sm="12">
                                                                    <div className="mb-3 form-group">
                                                                        <label>WebGL basics</label>
                                                                        <Input
                                                                            className="form-control"
                                                                            type="textarea"
                                                                            disabled={true}
                                                                            rows={5}
                                                                            name="points"
                                                                            // value={reformatArrayToString(userDetails?.userComponents?.webGLBasics?.value)}
                                                                            value={reformatObjectToString(userDetails?.userComponents?.webGLBasics?.value)}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col sm="12">
                                                                    <div className="mb-3 form-group">
                                                                        <label>WebGL Extentions</label>
                                                                        <Input
                                                                            className="form-control"
                                                                            type="textarea"
                                                                            disabled={true}
                                                                            rows={5}
                                                                            name="points"
                                                                            value={
                                                                                reformatArrayToString(userDetails?.userComponents?.webGLExtensions?.value?.extensions)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Row>


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

                                        <Link className={"btn btn-danger"} to={"/admin/users"}>
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

export default UserProfile;
