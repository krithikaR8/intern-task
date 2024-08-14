const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, mobile, designation, gender, course, imageUrl } = req.body;

  try {
    const emailExists = await Employee.findOne({ email });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const employee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      imageUrl,
    });

    const createdEmployee = await employee.save();
    res.status(201).json(createdEmployee);
  } catch (error) {
    
    console.error('Server error:', error.message); // Log the error message
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all employees with search, count, and pagination
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: 'Invalid page or limit' });
    }

    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const totalCount = await Employee.countDocuments(searchQuery);

    const employees = await Employee.find(searchQuery)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
      employees
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get an employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course, imageUrl } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.mobile = mobile || employee.mobile;
      employee.designation = designation || employee.designation;
      employee.gender = gender || employee.gender;
      employee.course = course || employee.course;
      employee.imageUrl = imageUrl || employee.imageUrl;

      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const result = await Employee.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Server error:', error.message); // Log the error message
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Validation middleware for employee creation
const validateEmployee = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobile').isMobilePhone().withMessage('Valid mobile number is required'),
  // Add more validations as needed
];

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  validateEmployee
};
