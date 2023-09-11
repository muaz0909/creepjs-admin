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
import StoriesIndex from "./views/stories/StoriesIndex.js";
import AddStory from "./views/stories/AddStory";
import EditStory from "./views/stories/EditStory";
import ViewStory from "./views/stories/ViewStory";
import UserLeaderboard from "./views/leaderboard/UserLeaderboard";
import UsersIndex from "./views/users/UsersIndex";
import UserProfile from "./views/users/UserProfile";
import StoriesLeaderboard from "./views/leaderboard/StoriesLeaderboard";
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
    path: "/leaderboard/users",
    name: "Users Leaderboard",
    icon: "fas fa-chart-bar text-red",
    component: UserLeaderboard,
    layout: "/admin",
    display: false
  },
  {
    path: "/leaderboard/stories",
    name: "Stories Leaderboard",
    icon: "fas fa-chart-bar text-red",
    component: StoriesLeaderboard,
    layout: "/admin",
    display: false
  }

  ,
  {
    path: "/stories/add",
    name: "Add Story",
    icon: "ni ni-bullet-list-67 text-red",
    component: AddStory,
    layout: "/admin",
    display: false
  },
  {
    path: "/stories/edit/:id",
    name: "Edit Story",
    icon: "ni ni-bullet-list-67 text-red",
    component: EditStory,
    layout: "/admin",
    display: false
  },
  {
    path: "/stories/view/:id",
    name: "View Story",
    icon: "ni ni-bullet-list-67 text-red",
    component: ViewStory,
    layout: "/admin",
    display: false
  },

  {
    path: "/user/view/:id",
    name: "Show User",
    icon: "ni ni-bullet-list-67 text-red",
    component: UserProfile,
    layout: "/admin",
    display: false
  },

  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin"
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    display: false
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Register,
  //   layout: "/auth"
  // },
  // {
  //   path: "/stories",
  //   name: "Stories",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: StoriesIndex,
  //   layout: "/admin"
  // }

];
export default routes;
