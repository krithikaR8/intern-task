const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    },
  },
  designation: {
    type: String,
    required: true,
    enum: ['HR', 'Manager', 'Sales'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  course: {
    type: [String],
    enum: ['MCA', 'BCA', 'BSC'],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
