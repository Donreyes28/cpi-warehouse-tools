import React from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Dropdown } from "react-bootstrap";
import NavBreadcrumb from "./Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUserAstronaut,
  faPowerOff,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";

import Avatar from "react-avatar";

import "./NavigationBar.css";

const NavigationBar = (props) => {
  return (
    <Navbar className="navbarContainer navshadow" expand="lg">
      <div className="mainContainer ">
        <div className="navbarMenu">
          <FontAwesomeIcon
            icon={faBars}
            className="headerIcon"
            onClick={props.onClick}
          />
          Warehouse Tools
          <div className="signIn">
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{
                  backgroundColor: "#222d3b",
                  border: "1px solid #222d3b",
                }}
              >
                {/* <FontAwesomeIcon icon={faUserAstronaut} className="icon"/> */}
                <Avatar
                  name="D R"
                  size="40"
                  round="20px"
                  className="headerIcon"
                ></Avatar>
                Don Reyes
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href=""><FontAwesomeIcon
                    icon={faUsersGear}
                    className="icon"
                  />Account details</Dropdown.Item>
                <Dropdown.Item href="/">
                  <FontAwesomeIcon
                    icon={faPowerOff}
                    className="icon"
                  />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default NavigationBar;

{
  /* <Dropdown>
<Dropdown.Toggle id="dropdown-basic"><FontAwesomeIcon icon={faUserAstronaut} className='icon'/>Account</Dropdown.Toggle>

<Dropdown.Menu>
  <Dropdown.Item href="">Account details</Dropdown.Item>
  <Dropdown.Item href="">Logout</Dropdown.Item>
</Dropdown.Menu>

</Dropdown> */
}
