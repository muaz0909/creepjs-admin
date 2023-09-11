import {Card, CardBody, CardHeader, Col, Container, Row, Spinner} from "reactstrap";
import React, {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore"
import DataTable from "react-data-table-component";
import {firestore} from "../../utils/constants";

function StoriesLeaderboard() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchName, setSearchName] = useState("");
    const [filterType, setFilterType] = useState("all");

    const columns = [
        {
            name: "Ranking", selector: (row) => row.index, sortable: true
        }, {
            name: "Name", selector: (row) => row.name, sortable: true
        }, {
            name: "Description",
            selector: (row) => row?.fields[0]?.description.length === 0 ? "---" : row?.fields[0]?.description.length > 20 ? row?.fields[0]?.description.substring(0, 20) + "..." : row?.fields[0]?.description,
            sortable: true
        },{
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
        },


        {
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
        },
        // {
        //     name: "Status", selector: (row) => {
        //         if (row.status === "1") {
        //             return (<span className="badge bg-success text-white">Active</span>);
        //         } else if (row.status === "2") {
        //             return (<span className="badge bg-danger text-white">disable</span>);
        //         } else {
        //             return "Deleted";
        //         }
        //     }
        // },
        {
            name: "Likes", selector: (row) => row.likes, sortable: true
        }, {
            name: "Dislikes", selector: (row) => row.dislikes, sortable: true
        }];


    async function fetchData() {
        const table = "stories";
        const tempData = [];
        const querySnapshot = await getDocs(collection(firestore, table));
        querySnapshot.forEach((doc) => {
            if (doc.data().status === "1" && doc.data().likes > 0) {
            tempData.push({
                id: doc.id, ...doc.data()
            });
            }
        });
        // compare tempData with data
        if (JSON.stringify(tempData) !== JSON.stringify(data)) {
            tempData.sort((a, b) => b.likes - a.likes);
            tempData.forEach((item, index) => {
                item.index = index + 1;
            })
            setData(tempData);
            setFilteredData(tempData);
        }
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
        setFilteredData(tempFilterData);
    }

    const clearFilter = (e) => {
        e.preventDefault();
        setFilteredData(data);
        setSearchName("");
        setFilterType("all");
    }



    useEffect(() => {
        fetchData();
    }, []);
    return (<>
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
                                            <select name="type" id="type" className="form-control"
                                                    onChange={(e) => {
                                                        setFilterType(e.target.value)
                                                    }}>
                                                <option value="all"
                                                        selected={filterType === "all"}
                                                >All
                                                </option>
                                                <option value="1"
                                                        selected={filterType === "1"}
                                                >Single
                                                </option>
                                                <option value="2"
                                                        selected={filterType === "2"}
                                                >Group
                                                </option>
                                            </select>
                                        </Col>
                                        <Col md="3" sm="12">
                                            {/*<label>Status</label>*/}
                                            {/*<select name="status" id="status" className="form-control"*/}
                                            {/*        onChange={(e) => {*/}
                                            {/*        }}>*/}
                                            {/*    <option value="all"*/}
                                            {/*    >All*/}
                                            {/*    </option>*/}
                                            {/*    <option value="1"*/}
                                            {/*    >Active*/}
                                            {/*    </option>*/}
                                            {/*    <option value="2"*/}
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
                                            onClick={event => clearFilter(event)}
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
                                        <h2>Stories Leaderboard</h2>
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
                                    </div> :
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

export default StoriesLeaderboard;