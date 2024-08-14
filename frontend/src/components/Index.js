import React, { Component } from 'react';
import { Card ,Row,Col} from 'reactstrap';
import Navbar from '../Header/Navbar';
import "../Style/index.css"
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdInventory } from "react-icons/md";
import { FaViruses } from "react-icons/fa";
import { FaServicestack } from "react-icons/fa";
import withAuthentication from "../LoginPages/withAuthentication"

class Index extends Component {
    constructor(){
        super();
        this.state = {
         
            user: sessionStorage.getItem('user'),
           
        }      
           
    }
    render() {
        return (
            <div>
                <Navbar />
                <br/>
                <h1>Welcome Admin panel</h1>
                
            </div>
        );
    }
}

export default withAuthentication(Index);