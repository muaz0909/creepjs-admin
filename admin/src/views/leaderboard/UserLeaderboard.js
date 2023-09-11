import {Card, CardBody, CardHeader, Col, Container, Row, Spinner} from "reactstrap";
import React, {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore"
import DataTable from "react-data-table-component";
import {firestore} from "../../utils/constants";

function UserLeaderboard() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchStatus, setSearchStatus] = useState("all");
    const columns = [{
        name: "Ranking", selector: (row) => row.index, sortable: true
    }, {
        name: "Name", selector: (row) => row.name, sortable: true
    }, //     {
        //     name: "Photo", cell: (row) => (<>
        //         <img src={row.photoURL} alt="" height={75}/>
        //     </>)
        // }
        , {
            name: "Email", selector: (row) => row.email, sortable: true
        }, {
            name: "Likes", selector: (row) => row.likes, sortable: true
        },

        {
            name: "Dislikes", selector: (row) => row.dislikes, sortable: true
        }, {
            name: "Points", selector: (row) => row.points, sortable: true
        }];

    const fetchData = async () => {
        const table = "users";
        const tempData = [];

        // get all docs where active = true


        const querySnapshot = await getDocs(collection(firestore, table));
        querySnapshot.forEach((doc) => {
            if (doc.data().active === true && doc.data().points !== 0) {
                tempData.push({
                    id: doc.id, ...doc.data(), // index: tempData.length + 1
                });
            }
        });
        // compare tempData with data

        if (JSON.stringify(tempData) !== JSON.stringify(data)) {
            tempData.sort((a, b) => b.points - a.points);
            tempData.forEach((item, index) => {
                item.index = index + 1;
            })

            setData(tempData);
            setFilteredData(tempData);
        }
        console.log("data : ", data);
        setDataLoading(false);
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

        if (searchEmail) {
            console.log("searchEmail inside if")
            console.log("searchEmail : ", searchEmail)
            tempFilterData = tempFilterData.filter((item) => {
                console.log("item.email", item.email)
                if (item.email) {
                    console.log('inside nested if')
                    if (item.email
                        .toString()
                        .toLowerCase()
                        .includes(searchEmail.toLowerCase())) {
                        return item;
                    }
                }
                // }
            });
        }
        // if (searchStatus !== "all") {
        //     // alert("searchStatus : " + typeof searchStatus)
        //     // console.log("searchStatus",searchStatus);
        //     tempFilterData = tempFilterData.filter((item) => {
        //         if (item.active.toString) {
        //             if (item.active
        //                 .toString()
        //                 .toLowerCase()
        //                 .includes(searchStatus.toLowerCase())) {
        //                 return item;
        //             }
        //         }
        //     });
        // }


        console.log("tempFilterData", tempFilterData)

        setFilteredData(tempFilterData);
    }

    const clearFilter = (e) => {
        console.log("clearFilter")
        e.preventDefault();
        setSearchName("");
        setSearchEmail("");
        setSearchStatus("All");
        console.log("data : ", data)
        setFilteredData(data);
    }

    useEffect(() => {
        fetchData();
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
                                            <label>Search Name</label>
                                            <input type="text" placeholder="Search Name" className="form-control"
                                                   value={searchName} onChange={(e) => {
                                                setSearchName(e.target.value)
                                            }}/>
                                        </Col>
                                        <Col md="3" sm="12">
                                            <label>Search Email</label>
                                            <input type="text"
                                                   placeholder="Search Email"
                                                   className="form-control" value={searchEmail}
                                                   onChange={(e) => setSearchEmail(e.target.value)}/>
                                        </Col>
                                        <Col md="3" sm="12">
                                            {/*<label>Status</label>*/}
                                            {/*<select name="status" id="status" className="form-control"*/}
                                            {/*        onChange={(e) => {*/}
                                            {/*            setSearchStatus(e.target.value)*/}
                                            {/*        }}>*/}
                                            {/*    <option value="all" selected={searchStatus === "all" ? "selected" : ""}*/}
                                            {/*    >All*/}
                                            {/*    </option>*/}
                                            {/*    <option value="true"*/}
                                            {/*            selected={searchStatus === "true" ? "selected" : ""}*/}
                                            {/*    >Active*/}
                                            {/*    </option>*/}
                                            {/*    <option value="false"*/}
                                            {/*            selected={searchStatus === "false" ? "selected" : ""}*/}
                                            {/*    >Disable*/}
                                            {/*    </option>*/}
                                            {/*</select>*/}
                                        </Col>

                                        <Col md="3" sm="12" className="mt-4 d-flex justify-content-end">
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
                                        <h2>Users Leaderboard</h2>
                                    </Col>
                                    <Col>
                                        {/*<Link className="btn btn-primary float-right" to={"/admin/stories/add"}>*/}
                                        {/*    <i className="fa fa-plus"></i> Create Story*/}
                                        {/*</Link>*/}
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {dataLoading ? <div className="text-center">
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div> : <DataTable
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
                                />}
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </Container>
        </div>
    </>)
}

export default UserLeaderboard;