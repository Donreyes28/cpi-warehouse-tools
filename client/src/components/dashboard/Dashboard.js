import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./Navbar/NavigationBar";
import Sidebar from "./Sidebar/Sidebar";
import NavBreadcrumb from "./Navbar/Breadcrumb";
import BodyTable from "./Body/BodyTable";
import {Routes, Route} from "react-router-dom";
import Downloads from "../../views/Warehouse/Downloads";
import OrderDetails from "../../views/Warehouse/OrderDetails";
import ImageDownloader from "../../views/Customer Services/ImageDownloader";
import WebChecker from "../../views/Customer Services/WebChecker";
import Profile from "../../views/Administration/Profile/Profile";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState(false);

  const selectHandler = (props) => {
    setSelectedItem(!selectedItem)
  }

  const sidebarHandler = (props) => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <NavigationBar onClick={sidebarHandler}/>
      <Sidebar isOpen={sidebarOpen} onClick={selectHandler} setSelectedItem={setSelectedItem}/>

      <Routes>
        <Route exact path="/downloads" component={Downloads} />
        <Route path="/order-details" component={OrderDetails} />
        <Route path="/web-checker" component={WebChecker} />
        <Route path="/image-downloader" component={ImageDownloader} />
        <Route path="/profiles" component={Profile} />
        <Route path="/settings" component={ImageDownloader} />
      </Routes>

    </div>
  );
};

export default Dashboard;
