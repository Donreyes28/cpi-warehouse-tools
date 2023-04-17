import React from "react";

import "./Login.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Login = () => {
  return (
    <div class="login-page">
      <div class="form">
      <label className="login-label">Login</label>
        <form class="register-form">
          <input type="text" placeholder="name" />
          <input type="password" placeholder="password" />
          <input type="text" placeholder="email address" />
          <button>create</button>
          <p class="message">
            Already registered? <a href="#">Sign In</a>
          </p>
        </form>
        <form class="login-form">
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <Button type="submit" href="/dashboard" className="login-button">login</Button>
          <p class="message">
            Forgot password? <a href="#">Click here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
