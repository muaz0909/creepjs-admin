import {Card, CardBody, CardHeader, Col, Container, Row, Spinner} from "reactstrap";
import React, {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {base_url, firestore} from "../../utils/constants";
import moment from "moment";


function UserLeaderboard() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchIp, setSearchIp] = useState("");
    const [searchCity, setSearchCity] = useState("");
    const [searchStatus, setSearchStatus] = useState("all");
    const [filterCities, setFilterCities] = useState([]);


    const columns = [
        {
            name: "Visitor Id", selector: (row) => row.visitorId, sortable: true
        },
        {
            name: "IP Address", selector: (row) => row.location?.ip, sortable: true
        }, {
            name: "City/Country", selector: (row) => row.location?.city+" / " + row.location?.country , sortable: true
        }, {
            name: "Browser", selector: (row) => row.browser ?? "Not Available", sortable: true
        },
        {
            name: "Devices", cell: (row) => (
                <>
                    {
                        row.devicesInfo?.hasAudio === true ?
                            <span className="badge badge-success mr-1">Audio</span> :
                            <span className="badge badge-danger mr-1">No Audio</span>
                    }

                    {
                        row.devicesInfo?.hasVideo === true ?
                            <span className="badge badge-success">Video</span> :
                            <span className="badge badge-danger">No Video</span>

                    }
                </>)
        },
        {
            name: "last Visit", cell: (row) =>
                <span>{
                    moment(row.created_at * 1000).format("DD-MM-YYYY hh:mm:ss A")

                }</span>


        },
        {
            name: "Action", cell: (row) => (<>
                <Link
                    title="View User"
                    // className="btn-sm btn-secondary mr-1"
                    to={"/admin/user/view/" + row.id}>
                    <button className="btn-sm btn-secondary mr-1">
                        <i className="fa fa-eye"></i>
                    </button>
                </Link>
                {/*{*/}
                {/*    row.active === true || row.active === undefined ?*/}
                {/*        <button className="btn-sm btn-warning mr-1"*/}
                {/*                title="Ban User"*/}
                {/*                onClick={async () => await updateUserStatus(row.id, "false")}>*/}
                {/*            <i className="fa fa-ban"></i>*/}
                {/*        </button> :*/}
                {/*        <button*/}
                {/*            title="Unban User"*/}
                {/*            className="btn-sm btn-primary mr-1" onClick={() => updateUserStatus(row.id, "true")}>*/}
                {/*            <i className="fa fa-check"></i>*/}
                {/*        </button>*/}
                {/*}*/}
                <button
                    title="Delete User"
                    className="btn-sm btn-danger mr-1" onClick={async () => await deleteUser(row.id)}>
                    {/*  delete trash can   */}
                    <i className="fa fa-trash"></i>
                </button>

            </>)
        }];


    const applyFilter = (e) => {
        e.preventDefault();

        let tempFilterData = data;

        if (searchIp) {
            tempFilterData = tempFilterData.filter((item) => {

                console.log(item.location?.ip)
                if (item.location?.ip) {
                    if (item.location?.ip
                        .toString()
                        .toLowerCase()
                        .includes(searchIp.toLowerCase())) {
                        return item;
                    }
                }
            });
        }

        if (searchCity) {
            tempFilterData = tempFilterData.filter((item) => {
                if (item.location?.city) {
                    if (item.location?.city
                        .toString()
                        .toLowerCase()
                        .includes(searchCity.toLowerCase())) {
                        return item;
                    }
                }
                // }
            });
        }
        if (searchStatus !== "all") {
            tempFilterData = tempFilterData.filter((item) => {
                if (item.active.toString) {
                    if (item.active
                        .toString()
                        .toLowerCase()
                        .includes(searchStatus.toLowerCase())) {
                        return item;
                    }
                }
            });
        }
        setFilteredData(tempFilterData);
    }
    const clearFilter = (e) => {
        e.preventDefault();
        setSearchIp("");
        setSearchCity("");
        setSearchStatus("All");
        setFilteredData(data);
    }

    const deleteUser = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
        if (result.isConfirmed) {
            const userRef =doc(firestore, "users", id)
            deleteDoc(userRef).then(() => {
                fetchData().then(()=>{
                })
            }, (error) => {
                console.log(error)
            });
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        } else {
            Swal.fire('Cancelled', 'Your data is safe :)', 'error')
        }
    })
    }
    const updateUserStatus = async (id, active) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = base_url + "/updateUserStatus";
                axios.post(url, {
                    uid: id,
                    active: active
                }).then((response) => {
                    fetchData();
                });
                Swal.fire('Updated!', 'Data has been updated.', 'success')
            } else {
                Swal.fire('Cancelled', 'Your data is safe :)', 'error')
            }
        })
    }

    const fetchData = async () => {
        setDataLoading(true);
        const tempData = [];

        const table = "users";
        const querySnapshot = await getDocs(collection(firestore, table));
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id, ...doc.data(), index: tempData.length + 1
            });
        });

        // get distinct cities
        const cities = [];
        tempData.forEach((item) => {
            if (item.location?.city) {
                if (!cities.includes(item.location?.city)) {
                    cities.push(item.location?.city);
                }
            }
        }
        );
        console.log(cities)
        setFilterCities(cities);

        if (JSON.stringify(tempData) !== JSON.stringify(data)) {
            setData(tempData);
            setFilteredData(tempData);
        }
        setDataLoading(false);
    }

    useEffect(() => {
        fetchData().then(()=>{
        });
    }, []);
    return (<>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
                <Row>
                    <Col className="mb-5 mb-xl-0" xl="12">
                        <form onSubmit={event => applyFilter(event)}>
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <Col md="3" sm="12">
                                            <label>Search IP address</label>
                                            <input type="text" placeholder="Search IP Address" className="form-control"
                                                   value={searchIp} onChange={(e) => {
                                                setSearchIp(e.target.value)
                                            }}/>
                                        </Col>
                                        <Col md="3" sm="12">
                                            <label>Search City</label>
                                            <input type="text"
                                                   placeholder="Search City"
                                                   className="form-control" value={searchCity}
                                                   onChange={(e) => setSearchCity(e.target.value)}/>
                                        </Col>
                                        {/*<Col md="3" sm="12">*/}
                                        {/*    <label>Status</label>*/}
                                        {/*    <select name="status" id="status" className="form-control"*/}
                                        {/*            onChange={(e) => {*/}
                                        {/*                setSearchStatus(e.target.value)*/}
                                        {/*            }}>*/}
                                        {/*        <option value="all" selected={searchStatus === "all" ? "selected" : ""}*/}
                                        {/*        >All*/}
                                        {/*        </option>*/}
                                        {/*        <option value="true"*/}
                                        {/*                selected={searchStatus === "true" ? "selected" : ""}*/}
                                        {/*        >Active*/}
                                        {/*        </option>*/}
                                        {/*        <option value="false"*/}
                                        {/*                selected={searchStatus === "false" ? "selected" : ""}*/}
                                        {/*        >Banned*/}
                                        {/*        </option>*/}
                                        {/*    </select>*/}
                                        {/*</Col>*/}

                                        <Col md="6" sm="12" className="mt-4 d-flex justify-content-end float-end">
                                            <br/>
                                            <button className="btn btn-primary mr-1"
                                                    type="submit"
                                            >Apply
                                            </button>
                                            <button className="btn btn-danger float-right"
                                                    onClick={clearFilter}
                                            >Clear
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
                                        <h2>Manage Users</h2>
                                    </Col>
                                    <Col>
                                        {/*<Link className="btn btn-primary float-right" to={"/admin/stories/add"}>*/}
                                        {/*    <i className="fa fa-plus"></i> Create Story*/}
                                        {/*</Link>*/}
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {
                                    dataLoading ? <div className="text-center">
                                            <Spinner animation="border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </Spinner>
                                        </div>
                                        :
                                        <DataTable
                                            className={"table"}
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
    </>)
}

export default UserLeaderboard;
