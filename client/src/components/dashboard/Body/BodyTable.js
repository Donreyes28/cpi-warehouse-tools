import React from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";

import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Login from '../../../views/Login/Login';

import "./BodyTable.css";

function BodyTable(props) {
  return (
      <div className="table-container">
        <Card className="body-table">
          <Card.Body>
            {props.myComp}
          </Card.Body>
        </Card>
      </div>
  );
}

export default BodyTable;
