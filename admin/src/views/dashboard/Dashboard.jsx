import Header from "../../components/Headers/Header";
import {Col, Container, Row} from "reactstrap";
import {useEffect, useRef, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {firestore} from "../../utils/constants";
import DonutChart from "../../components/Common/DonutChart";
import moment from "moment";
import LineChart from "../../components/Common/LineChart";

function Dashboard() {

    const [totalUsers, setTotalUsers] = useState(0);
    const [monthlyTraffic, setMonthlyTraffic] = useState(0);
    const [totalCountries, setTotalCountries] = useState(0);
    const [newUsers, setNewUsers] = useState(0);
    const [dailyTraffic, setDailyTraffic] = useState("");
    const [chartData, setChartData] = useState({});

    const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                data: [30, 50, 20],
                backgroundColor: ['red', 'blue', 'yellow'],
            },
        ],
    };

    useEffect(() => {

        const userVisitsData = {
            labels: [], // Will contain day labels
            datasets: [
                {
                    label: 'User Visits per Day',
                    data: [], // Will contain visit counts per day
                    borderColor: 'blue',
                    fill: false,
                },
            ],
        };



        const getUsers = async () => {
            const users = await getDocs(collection(firestore, "users"));
            setTotalUsers(users.size);
            let newUsersTemp = 0;
            const distinctCountries = new Set();
            users.forEach((user) => {
                distinctCountries.add(user.data().location?.country);
            //     check if created at is of current month using momentjs
                if (moment(user.data().created_at).isSame(moment(), 'month')) {
                    newUsersTemp++;
                }
            });
            const visitsByDay = new Map();
            users.forEach((user) => {
                const createdAt = moment.unix(user.data().created_at);
                const dayKey = createdAt.format('YYYY-MM-DD'); // Format the date as 'YYYY-MM-DD'

                // Increment the visit count for the day
                if (visitsByDay.has(dayKey)) {
                    visitsByDay.set(dayKey, visitsByDay.get(dayKey) + 1);
                } else {
                    visitsByDay.set(dayKey, 1);
                }
            });

            visitsByDay.forEach((count, day) => {
                userVisitsData.labels.push(day);
                userVisitsData.datasets[0].data.push(count);
            });


            setDailyTraffic(visitsByDay)

            const countries = [...distinctCountries];
            // Count users per country
            const usersPerCountry = {};
            const countryColors = {};
            countries.forEach((country) => {
                usersPerCountry[country] = 0;
                users.forEach((user) => {
                    if (user.data().location?.country === country) {
                        usersPerCountry[country]++;
                    }
                });

                // Generate random colors for each country
                countryColors[country] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            });

            const data = {
                labels: countries,
                datasets: [
                    {
                        data: Object.values(usersPerCountry),
                        backgroundColor: Object.values(countryColors),
                    },
                ],
            };
            setNewUsers(newUsersTemp)
            setChartData(data);
            setTotalCountries(countries.length);
        };
        getUsers();
    }, [])

    return (<>
        <Header
            totalTraffic={totalUsers}
            newUsers={newUsers}
            totalCountries={totalCountries}
            allUsers={0}
        />
        <Container fluid className={""}>
            <Row>
                <Col>
                    <h1>Stats</h1>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <DonutChart
                        data={chartData}
                    />
                </Col>
                <Col md={6}>
                    <LineChart
                        data={dailyTraffic}
                    />
                </Col>
            </Row>
        </Container>
    </>)
}

export default Dashboard;
