import React, { Component } from "react";
import { Navigate, Redirect } from "react-router-dom";
class Logout extends Component {
  logout = () => {
    sessionStorage.clear(sessionStorage);
  };
  componentDidMount() {
    this.logout();
  }
  render() {
    return (
      <div>
        <Navigate to="/Login" />
      </div>
    );
  }
}
export default Logout;