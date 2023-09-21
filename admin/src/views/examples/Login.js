// reactstrap components
import {
    Button,
    Card,
    CardBody,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Spinner,
} from "reactstrap";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useState} from "react";
import {useHistory} from "react-router-dom";
import Swal from "sweetalert2";

import {auth} from "../../utils/constants";


const Login = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [showLogo,setShowLogo]=useState(false)

    const loginHandler = async (e) => {
        e.preventDefault()
        setLoading(true);
        console.log("email", email, "pass", password);
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("success", user);
                Swal.fire({
                    title: "Success!",
                    text: "Login successful!",
                    icon: "success",
                    confirmButtonText: "Ok",
                });
                setLoading(false)
                // return <Redirect to="/admin/index"/>
                history.push("/admin/index");

            })
            .catch((error) => {
                setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                if (error.code === "auth/invalid-email" || error.code === "auth/wrong-password") {
                    setErrorMsg("Invalid email or password!");
                } else setErrorMsg("Something went wrong. Login failed!");

                console.log("login failed:", errorCode, ",", errorMessage);

                setTimeout(() => {
                    setErrorMsg(null)
                }, 5000);
            });
        setLoading(false)
    };
    return (
        <>
            <Col lg="5" md="7">
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center mb-5">
                            {
                                showLogo ? <img
                                    style={{height: 100, width: 'auto'}}
                                    alt="..."
                                    className="auth-navbar-img img-fluid"
                                    src={require("../../assets/img/brand/logo.png")}
                                /> : null

                            }
                            {/*<img*/}
                            {/*    style={{height: 100, width: 'auto'}}*/}
                            {/*    alt="..."*/}
                            {/*    className="auth-navbar-img img-fluid"*/}
                            {/*    // src={require("../../assets/img/brand/logo.png")}*/}
                            {/*/>*/}
                        </div>
                        <div className="text-center text-muted mb-4">
                            <small>Sign in with Email and Password</small>
                        </div>
                        <div style={{display: errorMsg ? "block" : "none"}} className="alert alert-danger" role="alert">
                            <strong>Error:</strong> {errorMsg}
                        </div>
                        <Form role="form" onSubmit={loginHandler}>
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-email-83"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        autoComplete="new-email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required

                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </InputGroup>
                            </FormGroup>
                            <div className="text-center">
                                <Button
                                    className="my-4"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}

                                >
                                    {loading ? (
                                        <Spinner color={"white"} size={""}>
                                            Loading...
                                        </Spinner>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};

export default Login;