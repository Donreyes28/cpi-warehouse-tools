import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SnackbarProvider from 'react-simple-snackbar';

import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./views/Login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import PageNotFound from "./views/PageNotFound/PageNotFound";

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/dashboard/*" element={<Dashboard />} />
              <Route exact path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </Router>
    );
  }
}

export default App;
