import React, { Component } from 'react';
import './Navbar.css'; // Import CSS file for styling
import logo from "../Image/logo.png"
import {Card} from "react-bootstrap"
class Navbarslide extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    const user = sessionStorage.getItem('user');
    this.setState({ user });
  }
    render() {
        return (
            <div>
         <Card>   
        <nav class="navbar navbar-expand-lg navbar-light ">
        <img  className="logo" src={logo} /><br/>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      {/* <li class="nav-item active">
        <a class="nav-link" href="#">Supplier Management</a>
      </li> */}
      <li class="nav-item">
        <a class="nav-link" style={{fontSize:"17px"}} href="/index">Home</a>
      </li>
      <li class="nav-item">
                      <a class="nav-link"  style={{fontSize:"17px"}} href="/Employee">Employee List
                      </a>
                    </li>
                   
      
                            </ul>
                            
                        </div>
                <ul class="navbar-nav">
                <li class="nav-item">
        <a class="nav-link" style={{fontSize:"17px"}} href="/Logout">{this.state.user}</a>
      </li>
                        <li class="nav-item">
        <a class="nav-link" style={{fontSize:"17px"}} href="/Logout">Logout</a>
      </li>
                        </ul>
             
      
                      
                    </nav>
                    </Card>  
            </div>
        );
    }
}

export default Navbarslide;