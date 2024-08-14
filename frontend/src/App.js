import React, { Component } from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import  { EmployeeList } from './components/EmployeeList';
import Login from "../src/LoginPages/Login"
import Index from './components/Index';
// import Network from './components/Network';
class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
          <Route  path='/Login' element={<Login />} />
            <Route path='/Employee' element={<EmployeeList />} />
            <Route path='/index' element={<Index />} />

        </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;