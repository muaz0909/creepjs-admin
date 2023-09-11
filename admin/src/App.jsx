import React, {useState, useEffect} from 'react'
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import {Spinner} from "reactstrap";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const App = () => {
    const [signedInUser, setSignedInUser] = useState(getAuth().currentUser);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(async () => {
        onAuthStateChanged(getAuth(), async (user) => {
            if (user && !isLoggedIn) {
                let _user = user;
                localStorage.setItem("progressUser", JSON.stringify({ ..._user }));
                setSignedInUser(_user);
                setIsLoggedIn(true);
            } else {
                setSignedInUser(null);
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        });
    }, []);
    return (
        <BrowserRouter>
            {isLoading ? (
                <div className="text-center mt-7">
                    <Spinner color={"primary"} size={""}>
                        Loading...
                    </Spinner>
                </div>
            ) : (
                <Switch>
                    <Route path="/admin" render={(props) =>  {
                        if (signedInUser) return <AdminLayout {...props} />
                        else   return <Redirect to="/auth/login"/>
                    }
                    } />
                    <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
                    <Redirect from="/" to="/auth/login" />
                </Switch>
            )}
        </BrowserRouter>
    )
}
export default App