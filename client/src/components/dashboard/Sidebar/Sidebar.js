import React, { useState } from "react";
import { Link } from "react-router-dom";

import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse, faEnvelope, faQuestionCircle, faFile, faCartPlus, faDownload, faEarthAsia, faImage, faUser, faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import { Alert } from "react-bootstrap/Alert";
import BodyTable from "../Body/BodyTable";
import NavBreadcrumb from "../Navbar/Breadcrumb";
import Downloads from "../../../views/Warehouse/Downloads";
import Warehouse2 from "../../../views/Warehouse/OrderDetails";
import Profile from "../../../views/Administration/Profile/Profile";
import OrderDetails from "../../../views/Warehouse/OrderDetails";
import UploadImageToS3WithNativeSdk from "../../../views/Customer Services/ImageDownloader";

import "./Sidebar.css";
import "../Navbar/Breadcrumb.css";
import WebChecker from "../../../views/Customer Services/WebChecker";

const Sidebar = (props) => {
  const [currComp, setCurrComp] = useState(<Downloads />);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(true);

  const sidebarClass = props.isOpen
    ? "flex-column sidebar open"
    : "flex-column sidebar close";

  const mainBodyClass = props.isOpen ? "main-body" : "main-body close";

  const sidebarHandler = (props) => {
    setSidebarOpen(!sidebarOpen);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNavClick = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  return (
    <div>
      <Nav
        defaultActiveKey="/home"
        fixed="left"
        className={`${sidebarClass} nav-root`}
        activeKey={selectedIndex}
        onSelect={handleNavClick}
      >
        <div className="nav-title">Warehouse</div>
        <Nav.Link
          as={Link}
          to="dashboard/downloads"
          eventKey={0}
          onClick={() => {
            setCurrComp(<Downloads />);
          }}
        >
          <FontAwesomeIcon icon={faDownload} className="icon" />
          Downloads
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="dashboard/order-details"
          eventKey={1}
          // onClick={() => props.onClick("About")}
          onClick={() => setCurrComp(<OrderDetails />)}
        >
          <FontAwesomeIcon icon={faFile} className="icon" />
          Order Details
        </Nav.Link>


        <div className="nav-title">Customer Services</div>
        <Nav.Link
          as={Link}
          to="dashboard/web-checker"
          eventKey={3}
          onClick={() => setCurrComp(<WebChecker />)}
        >
          <FontAwesomeIcon icon={faEarthAsia} className="icon" />
          Web Checker
        </Nav.Link>
        <Nav.Link as={Link} to="dashboard/image-downloader" eventKey={4} onClick={() => setCurrComp(<UploadImageToS3WithNativeSdk/>)}>
          <FontAwesomeIcon icon={faImage} className="icon" />
          Image Downloader
        </Nav.Link>

        <div className="nav-title">Administration</div>
        <Nav.Link as={Link} to="dashboard/profiles" eventKey={5} onClick={() => setCurrComp(<Profile/>)}>
          <FontAwesomeIcon icon={faUser} className="icon" />
          Profiles
        </Nav.Link>
        <Nav.Link as={Link} to="dashboard/settings" eventKey={6}>
          <FontAwesomeIcon icon={faScrewdriverWrench} className="icon" />
          Settings
        </Nav.Link>
      </Nav>
      <div className={mainBodyClass}>
        <div style={{ marginTop: "100px" }}></div>
        <BodyTable myComp={currComp} />
      </div>
    </div>
  );
};

export default Sidebar;
