const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use(express.json())
const User = require('./route/authroutee')
const EmployeeRoutes = require('./route/employeeRoutes');


app.use('/', User)
app.use('/employees', EmployeeRoutes);
module.exports=app