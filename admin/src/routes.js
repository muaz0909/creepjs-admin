/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Login from "views/examples/Login.js";
import UsersIndex from "./views/users/UsersIndex";
import UserProfile from "./views/users/UserProfile";
import Dashboard from "./views/dashboard/Dashboard";

var routes = [
    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-album-2 text-red",
        component: Dashboard,
        layout: "/admin",
        display: true
    },
    {
        path: "/users",
        name: "Manage Users",
        icon: "fas fa-users text-red",
        component: UsersIndex,
        layout: "/admin",
        display: true
    },
    {
        path: "/user/view/:id",
        name: "Show User",
        icon: "ni ni-bullet-list-67 text-red",
        component: UserProfile,
        layout: "/admin",
        display: false
    },
    {
        path: "/login",
        name: "Login",
        icon: "ni ni-key-25 text-info",
        component: Login,
        layout: "/auth",
        display: false
    }
];
export default routes;
