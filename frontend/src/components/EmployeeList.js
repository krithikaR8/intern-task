import React, { Component } from 'react';
import "../Style/InventoryList.css"
import { Card,Form, FormGroup, Label, Input, Button, Row, Col} from 'reactstrap'
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import CsvDownload from "react-json-to-csv";
import Navbar from '../Header/Navbar';
import ReactPaginate from 'react-paginate';
import { FaEdit } from "react-icons/fa";
import { isEqual } from 'lodash';
import { MdDelete } from "react-icons/md";
import {
    IoIosArrowBack,
    IoIosArrowForward,
    IoIosRefresh,
} from "react-icons/io";
import withAuthentication from "../LoginPages/withAuthentication"

export class EmployeeList extends Component {
    constructor(){
        super();
        this.state = {
            data: [], // Holds the employee data
            currentPage: 1,
            totalPages: 1,
            
        totalCount: 0,
            getquery1: [],
            getquery2: [],
            loading: true,
            accesstoken: sessionStorage.getItem('accesstoken'),
            show: false,
            show1: false,
            next: false,
            _id: '',
            search: '',
            showdata: false,
            search1: '',
            confirmation: {
                show: false,
                itemId: null,
                action: null, // 'delete' or 'update'
                message: ''
            },
         
            errors: {},
            name: '',
            email: '',
            mobile: '',
            designation: '',
            gender: '',
            course: '',
            imageUrl: ''
        };
        

    }
    validateForm = () => {
        const { name, email, mobile, designation, gender, course, imageUrl } = this.state;
        let errors = {};
        let formIsValid = true;
    
        if (!name) {
            formIsValid = false;
            errors["name"] = "Name is required.";
        }
        if (!email) {
            formIsValid = false;
            errors["email"] = "Email is required.";
        }
        if (!mobile) {
            formIsValid = false;
            errors["mobile"] = "Mobile is required.";
        }
        if (!designation) {
            formIsValid = false;
            errors["designation"] = "Designation is required.";
        }
        if (!gender) {
            formIsValid = false;
            errors["gender"] = "Gender is required.";
        }
        if (!course) {
            formIsValid = false;
            errors["course"] = "Course is required.";
        }
        if (!imageUrl) {
            formIsValid = false;
            errors["imageUrl"] = "Image URL is required.";
        }
    
        this.setState({ errors });
        return formIsValid;
    };
    
  
    
    showConfirmationModal = (action, item) => {
        let message = '';
        if (action === 'delete') {
            message = `Are you sure you want to delete the item with ID ${item.itemId}?`;
        } else if (action === 'update') {
            message = `Are you sure you want to update the item with ID ${item.itemId}?`;
        } else if (action === 'add') {
            message = 'Are you sure you want to add this new item?';
        }
    
        this.setState({
            confirmation: {
                show: true,
                itemId: item.itemId || null,
                action: action,
                message: message
            }
        });
    };
    
    handlechange=()=>{
        this.setState({
            next:true
        })
    }
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value }, () => {
            // Automatically fetch data when year or month filter changes
            if (name === "yearstate" || name === "monthstate") {
                this.getData(1);  // Start from page 1 whenever filters change
            }
        });
    };
    
    
    componentDidMount(){
        this.getData();
        
       
     
       
    }
    handleShow = () => {
        this.setState(prevState => ({
            show: !prevState.show
        }));
    }
    
    handleShow1 = (item) => {
        console.log("Item in handleShow1:", item); // Check if item has the expected properties
        this.setState({
            _id: item._id || item.id, // Adjust if your item uses a different ID field
            name: item.name || "",
            email: item.email || "",
            mobile: item.mobile || "",
            designation: item.designation || "",
            gender: item.gender || "",
            course: item.course || "",
            imageUrl: item.imageUrl || "",
            show1: true
        });
    };
    
    handleShow2 = (item) => {
        console.log("Item in handleShow1:", item); // Check if item has the expected properties
        this.setState({
            _id: item._id || item.id, // Adjust if your item uses a different ID field
            name: item.name || "",
            email: item.email || "",
            mobile: item.mobile || "",
            designation: item.designation || "",
            gender: item.gender || "",
            course: item.course || "",
            imageUrl: item.imageUrl || "",
            show1: true
        });
    };
    handleClose = () => {
        this.setState({
            show:false
        })
    }
  
    handleClose1 = () => {
        this.setState({
            show1:false
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            this.showConfirmationModal('add', {});
        } else {
            alert('Please fill all required fields.');
        }
        this.showConfirmationModal('add', {});
       
    }
    
 
    performAdd = async () => {
        const payload = {
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile,
            designation: this.state.designation,
            gender: this.state.gender,
            course: this.state.course,
            imageUrl: this.state.imageUrl
        };
    
        try {
            const response = await axios.post('http://localhost:8000/employees', payload, {
                headers: { 'Authorization': `Bearer ${this.state.accesstoken}` }
            });
    
            if (response.status === 201) {
                alert('Item inserted successfully');
                this.getData(); // Refresh the data list after the addition
            }
        } catch (error) {
            console.error('Error inserting item:', error);
            alert('Error inserting item. Check console for more details.');
        }
    };
    
    performDelete = async (id) => {
        try {
            const accesstoken = sessionStorage.getItem('accesstoken');
            if (!accesstoken) {
                alert('Authentication token not found or expired');
                return;
            }
    
            const config = {
                headers: { 'Authorization': `Bearer ${accesstoken}` }
            };
    
            await axios.delete(`http://localhost:8000/employees/${id}`, config);
            alert('Item deleted successfully');
            this.getData(); // Refresh data after deletion
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        }
    };
    
    
    performUpdate = async () => {
        const payload = {
            name: this.state.name,
            email: this.state.email,
            mobile: this.state.mobile,
            designation: this.state.designation,
            gender: this.state.gender,
            course: this.state.course,
            imageUrl: this.state.imageUrl
        };
    
        const config = {
            headers: { 'Authorization': `Bearer ${this.state.accesstoken}` }
        };
    
        try {
            const response = await axios.put(`http://127.0.0.1:8000/employees/${this.state._id}`, payload, config);
    
            if (response.status === 200) {
                alert('Item updated successfully');
                this.getData(); // Refresh the data list after the update
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item. Check console for more details.');
        }
    };
    
      componentDidUpdate(prevProps, prevState) {
        if (prevState.someValue !== this.state.someValue) {
            if (this.state.anotherValue !== 'new value') {
                this.setState({ anotherValue: 'new value' });
            }
        }
    }
     
    handleSubmit1 = async (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            this.showConfirmationModal('update', this.state);
            console.log("_id in handleSubmit1:", this.state._id);
        } else {
            alert('Please fill all required fields.');
        }
        this.showConfirmationModal('update', this.state);
        console.log("_id in handleSubmit1:", this.state._id); 
    
        
    };

  
    
  
      handleSearch = async () => {
          this.getData();
       
    }
    getData = async () => {
        const { search, accesstoken, currentPage } = this.state;

        let url = `http://localhost:8000/employees?page=${currentPage}`;
        if (search) {
            url += `&search=${search}`;
        }

        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${accesstoken}` }
            });
    
            this.setState({
                data: response.data.employees || [],
                totalCount: response.data.totalCount || 0,
                totalPages: response.data.totalPages || 1,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            this.setState({ loading: false });
        }
    };

    
      getdata1 = async () => {
          this.getData();
        
      };
     
      confirmAction = async () => {
        const { action, itemId } = this.state.confirmation;
        if (action === 'delete') {
            await this.performDelete(itemId);
        } else if (action === 'update') {
            await this.performUpdate();
        } else if (action === 'add') {
            await this.performAdd();
        }
    
        // Close the confirmation modal
        this.setState({ confirmation: { ...this.state.confirmation, show: false } });
    };
    
    handleDelete = (id) => {
        this.showConfirmationModal('delete', { itemId: id });
    };
    // Method to handle page change
    handlePageChange = (selectedItem) => {
        const selectedPage = selectedItem.selected + 1;
        this.setState({ currentPage: selectedPage }, () => {
            this.getData();
        });
    };
    handleSearchChange = (event) => {
        this.setState({ search: event.target.value });
    };

    // Method to handle search submit
    handleSearchSubmit = (event) => {
        event.preventDefault();
        this.setState({ currentPage: 1 }, () => {
            this.getData();
        });
    };
 
    render() {
        return (
            <div>
                <Navbar /><br />
                
                <form onSubmit={this.handleSearchSubmit}>
                    <input 
                        type="text" 
                        value={this.state.search}
                        onChange={this.handleSearchChange}
                        placeholder="Search employees..."
                    />
                    <button type="submit" style={{ backgroundColor: "#107AB0", color: "white" }}>Search</button><br />
                    <label style={{marginLeft:"500px"}}>total Count:{this.state.totalCount}</label>
                </form>
        <Button style={{float:"right", marginRight:"350px"}} onClick={this.handleShow}>Create Employee List</Button><br/><br/>
        <table id="customers" style={{marginLeft:"200px"}}>
     
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Image</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
         
            {this.state.data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.designation}</td>
                <td>{item.gender}</td>
                <td>{item.course}</td>
                <td><img src={item.imageUrl} alt="profile" style={{ width: '50px', height: '50px' }} /></td>
                <td><FaEdit onClick={() => {
    console.log("Item before opening modal:", item); // Log the item
    this.handleShow1(item);
}} /></td>
             <td><MdDelete onClick={() => this.handleDelete(item._id)} /></td>
              </tr>
            ))}
    
        </table>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <Label for="name">Name:</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mobile">Mobile:</Label>
              <Input
                type="text"
                id="mobile"
                name="mobile"
                value={this.state.mobile}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="designation">Designation:</Label>
              <Input
                type="select"
                id="designation"
                name="designation"
                value={this.state.designation}
                onChange={this.handleInputChange}
                            >
                                 <option value="">Select Designation</option>
                                 
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option></Input>
            </FormGroup>
            <FormGroup>
              <Label for="gender">Gender:</Label>
              <Input
                type="select"
                id="gender"
                name="gender"
                value={this.state.gender}
                onChange={this.handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="course">Course:</Label>
              <Input
                type="select"
                id="course"
                name="course"
                value={this.state.course}
                onChange={this.handleInputChange}
              ><option value="">Select Course</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
              <option value="BSC">BSC</option></Input>
            </FormGroup>
            <FormGroup>
              <Label for="imageUrl">Image :</Label>
              <Input
                type="File"
                id="imageUrl"
                name="imageUrl"
                value={this.state.imageUrl}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Add Employee
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.show1} onHide={this.handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <Label for="name">Name:</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mobile">Mobile:</Label>
              <Input
                type="text"
                id="mobile"
                name="mobile"
                value={this.state.mobile}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="designation">Designation:</Label>
              <Input
                type="select"
                id="designation"
                name="designation"
                value={this.state.designation}
                onChange={this.handleInputChange}
                            >
                                 <option value="">Select Designation</option>
                                 
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option></Input>
            </FormGroup>
            <FormGroup>
              <Label for="gender">Gender:</Label>
              <Input
                type="select"
                id="gender"
                name="gender"
                value={this.state.gender}
                onChange={this.handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="course">Course:</Label>
              <Input
                type="select"
                id="course"
                name="course"
                value={this.state.course}
                onChange={this.handleInputChange}
              ><option value="">Select Course</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
              <option value="BSC">BSC</option></Input>
            </FormGroup>
            <FormGroup>
              <Label for="imageUrl">Image:</Label>
              <Input
                type="file"
                id="imageUrl"
                name="imageUrl"
                value={this.state.imageUrl}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose1}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit1}>
              Update Employee
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.confirmation.show} onHide={() => this.setState({ confirmation: { ...this.state.confirmation, show: false } })}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.confirmation.message}</Modal.Body>
          <Modal.Footer>
  <Button variant="secondary" onClick={() => this.setState({ confirmation: { ...this.state.confirmation, show: false } })}>
    Cancel
  </Button>
  <Button variant="danger" onClick={this.confirmAction}>
    Confirm
  </Button>
</Modal.Footer>
        </Modal>
<br/>
        <ReactPaginate
                    previousLabel={<IoIosArrowBack />}
                    nextLabel={<IoIosArrowForward />}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={ this.state.totalPages }
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
      </div>
    );
  }
}


export default withAuthentication(EmployeeList);