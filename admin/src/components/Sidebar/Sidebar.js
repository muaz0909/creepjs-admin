/*eslint-disable*/
import {useState} from "react";
import {Link, NavLink as NavLinkRRD, Redirect} from "react-router-dom";
// nodejs library to set properties for components
import {PropTypes} from "prop-types";

// reactstrap components
import {
    Col,
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Media,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
    Row,
    UncontrolledDropdown
} from "reactstrap";
import {signOut} from "firebase/auth";
import {auth} from "../../utils/constants";

var ps;

const Sidebar = (props) => {
    const [collapseOpen, setCollapseOpen] = useState();
    const [showLogo, setShowLogo] = useState(false);
    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName) => {
        return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };
    // toggles collapse between opened and closed (true/false)
    const toggleCollapse = () => {
        setCollapseOpen((data) => !data);
    };
    // closes the collapse
    const closeCollapse = () => {
        setCollapseOpen(false);
    };

    const logoutHandler = ()=>{
        // const auth = getAuth();
        signOut(auth).then(() => {
            console.log("logged out")
            history.push("/auth/login")
            return  <Redirect from="/" to="/auth/login" />
        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }
    // creates the links that appear in the left menu / Sidebar
    const createLinks = (routes) => {
        return routes.map((prop, key) => {
          console.log("props",prop)
          console.log("key",key)
            if (prop.display === false) {
                return null;
            } else {
                return (
                    <NavItem key={key}>
                        <NavLink
                            to={prop.layout + prop.path}
                            tag={NavLinkRRD}
                            onClick={closeCollapse}
                            activeClassName="active"
                        >
                            <i className={prop.icon}/>
                            {prop.name}
                        </NavLink>
                    </NavItem>
                );
            }

        });
    };

    const {bgColor, routes, logo} = props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
        navbarBrandProps = {
            to: logo.innerLink,
            tag: Link
        };
    } else if (logo && logo.outterLink) {
        navbarBrandProps = {
            href: logo.outterLink,
            target: "_blank"
        };
    }

    return (
        <Navbar
            className="navbar-vertical fixed-left navbar-light bg-white"
            expand="md"
            id="sidenav-main"
        >
            <Container fluid>
                {/* Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                >
                    <span className="navbar-toggler-icon"/>
                </button>
                {/* Brand */}
                {logo ? (
                    <NavbarBrand className="pt-0" {...navbarBrandProps}>
                        {
                            showLogo ? (<img
                                alt={logo.imgAlt}
                                className="navbar-brand-img"
                                src={logo.imgSrc}
                            />) : null
                        }
                        {/*<img*/}
                        {/*    alt={logo.imgAlt}*/}
                        {/*    className="navbar-brand-img"*/}
                        {/*    src={logo.imgSrc}*/}
                        {/*/>*/}
                    </NavbarBrand>
                ) : null}
                {/* User */}
                <Nav className="align-items-center d-md-none">
                    {/*<UncontrolledDropdown nav>*/}
                    {/*    <DropdownToggle nav className="nav-link-icon">*/}
                    {/*        <i className="ni ni-bell-55"/>*/}
                    {/*    </DropdownToggle>*/}
                    {/*    <DropdownMenu*/}
                    {/*        aria-labelledby="navbar-default_dropdown_1"*/}
                    {/*        className="dropdown-menu-arrow"*/}
                    {/*        right*/}
                    {/*    >*/}
                    {/*        <DropdownItem>Action</DropdownItem>*/}
                    {/*        <DropdownItem>Another action</DropdownItem>*/}
                    {/*        <DropdownItem divider/>*/}
                    {/*        <DropdownItem>Something else here</DropdownItem>*/}
                    {/*    </DropdownMenu>*/}
                    {/*</UncontrolledDropdown>*/}
                    <UncontrolledDropdown nav>
                        <DropdownToggle nav>
                            <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                      alt="..."
                      src={require("../../assets/img/theme/admin.jpg")}
                  />
                </span>
                            </Media>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem href="#pablo" onClick={(e) => {
                                e.preventDefault()
                                logoutHandler();
                            }}>
                                <i className="ni ni-user-run"/>
                                <span>Logout</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
                {/* Collapse */}
                <Collapse navbar isOpen={collapseOpen}>
                    {/* Collapse header */}
                    <div className="navbar-collapse-header d-md-none">
                        <Row>
                            {logo ? (
                                <Col className="collapse-brand" xs="6">
                                    {logo.innerLink ? (
                                        <Link to={logo.innerLink}>
                                            <img alt={logo.imgAlt} src={logo.imgSrc}/>
                                        </Link>
                                    ) : (
                                        <a href={logo.outterLink}>
                                            <img alt={logo.imgAlt} src={logo.imgSrc}/>
                                        </a>
                                    )}
                                </Col>
                            ) : null}
                            <Col className="collapse-close" xs="6">
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={toggleCollapse}
                                >
                                    <span/>
                                    <span/>
                                </button>
                            </Col>
                        </Row>
                    </div>
                    {/* Form */}
                    {/*<Form className="mt-4 mb-3 d-md-none">*/}
                    {/*  <InputGroup className="input-group-rounded input-group-merge">*/}
                    {/*    <Input*/}
                    {/*      aria-label="Search"*/}
                    {/*      className="form-control-rounded form-control-prepended"*/}
                    {/*      placeholder="Search"*/}
                    {/*      type="search"*/}
                    {/*    />*/}
                    {/*    <InputGroupAddon addonType="prepend">*/}
                    {/*      <InputGroupText>*/}
                    {/*        <span className="fa fa-search" />*/}
                    {/*      </InputGroupText>*/}
                    {/*    </InputGroupAddon>*/}
                    {/*  </InputGroup>*/}
                    {/*</Form>*/}
                    {/* Navigation */}
                    <Nav navbar>{createLinks(routes)}</Nav>
                    {/* Divider */}
                    {/*<hr className="my-3" />*/}
                    {/*/!* Heading *!/*/}
                    {/*<h6 className="navbar-heading text-muted">Documentation</h6>*/}
                    {/*/!* Navigation *!/*/}
                    {/*<Nav className="mb-md-3" navbar>*/}
                    {/*  <NavItem>*/}
                    {/*    <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/overview?ref=adr-admin-sidebar">*/}
                    {/*      <i className="ni ni-spaceship" />*/}
                    {/*      Getting started*/}
                    {/*    </NavLink>*/}
                    {/*  </NavItem>*/}
                    {/*  <NavItem>*/}
                    {/*    <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/colors?ref=adr-admin-sidebar">*/}
                    {/*      <i className="ni ni-palette" />*/}
                    {/*      Foundation*/}
                    {/*    </NavLink>*/}
                    {/*  </NavItem>*/}
                    {/*  <NavItem>*/}
                    {/*    <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/alerts?ref=adr-admin-sidebar">*/}
                    {/*      <i className="ni ni-ui-04" />*/}
                    {/*      Components*/}
                    {/*    </NavLink>*/}
                    {/*  </NavItem>*/}
                    {/*</Nav>*/}
                    {/*<Nav className="mb-md-3" navbar>*/}
                    {/*  <NavItem className="active-pro active">*/}
                    {/*    <NavLink href="https://www.creative-tim.com/product/argon-dashboard-pro-react?ref=adr-admin-sidebar">*/}
                    {/*      <i className="ni ni-spaceship" />*/}
                    {/*      Upgrade to PRO*/}
                    {/*    </NavLink>*/}
                    {/*  </NavItem>*/}
                    {/*</Nav>*/}
                </Collapse>
            </Container>
        </Navbar>
    );
};

Sidebar.defaultProps = {
    routes: [{}]
};

Sidebar.propTypes = {
    // links that will be displayed inside the component
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        // innerLink is for links that will direct the user within the app
        // it will be rendered as <Link to="...">...</Link> tag
        innerLink: PropTypes.string,
        // outterLink is for links that will direct the user outside the app
        // it will be rendered as simple <a href="...">...</a> tag
        outterLink: PropTypes.string,
        // the image src of the logo
        imgSrc: PropTypes.string.isRequired,
        // the alt for the img
        imgAlt: PropTypes.string.isRequired
    })
};

export default Sidebar;
