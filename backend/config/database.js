const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI)
    .then(con => {
      console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    })
    .catch(err => {
      console.error(`MongoDB connection error: ${err.message}`);
      process.exit(1); // Exit the process with failure
    });
};

module.exports = connectDatabase;
