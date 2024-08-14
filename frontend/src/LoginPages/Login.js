import React, { Component } from 'react';
import "./Login.css";
import { Button, FormGroup, Input } from "reactstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import ecom from "../Image/ecom.jpg";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default class Login extends Component {
  state = {
    ispassword: false,
    username: "",
    password: "",
    login: false,
    token: null,
    errors: {
      username: '',
      password: '',
    }
  };

  togglePassword = () => {
    this.setState(prevState => ({ ispassword: !prevState.ispassword }));
  };

  validateForm = () => {
    const { username, password } = this.state;
    const errors = {};
    if (!username) errors.username = 'This field is required.';
    if (!password) errors.password = 'This field is required.';
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    
    if (!this.validateForm()) return;

    try {
      const res = await axios.post("http://localhost:8000/login", { username, password });
      sessionStorage.setItem("accesstoken", res.data.token);
      sessionStorage.setItem("user", res.data.username);
      this.setState({ login: true, token: res.data.token });
    } catch (err) {
      console.error("Login failed:", err);
      this.setState({ errors: { ...this.state.errors, form: 'Invalid credentials' } });
    }
  };

  render() {
    const { login, ispassword, username, password, errors } = this.state;

    return (
      <div>
        {login ? <Navigate to="/index" /> : (
          <div>
            <br /><br />
            <div className="containers" style={{ height: "700px" }}>
              <div className="rows">
                <div className="login_form">
                  <h1 style={{"color":"#107AB0"}}>Welcome!</h1>
                  <h3>Login to your Account</h3>
                  {errors.form && <div style={{ color: "red", fontSize: 16 }}>{errors.form}</div>}

                  <FormGroup>
                    <label className="username">Username <span className="required">*</span></label>
                    {errors.username && <span className="error">{errors.username}</span>}
                    <Input
                      className="input1"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={e => this.setState({ username: e.target.value })}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label className="password">Password <span className="required">*</span></label>
                    {errors.password && <span className="error">{errors.password}</span>}
                    <Input
                      className="input1"
                      type={ispassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => this.setState({ password: e.target.value })}
                    />
                    {ispassword ? (
                      <AiFillEyeInvisible className="password-icon" onClick={this.togglePassword} />
                    ) : (
                      <AiFillEye className="password-icon" onClick={this.togglePassword} />
                    )}
                  </FormGroup>
                  <h3 style={{fontSize:"16px"}}> If you don't have account? <a href='/Register'>Register here</a></h3>
                  <Button className='loginButton' onClick={this.handleSubmit}>Login</Button>
                </div>

                <div className="images">
                  <img className="Staffimg" src={ecom} alt="Staffimg" />
                </div>
              </div>
              <br/>
             
            </div>
            <br />
          </div>
        )}
      </div>
    );
  }
}
