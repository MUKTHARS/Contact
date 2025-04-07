// Database configuration
const dbConfig = {
  HOST: "localhost",
  USER: "root", // replace with your MySQL username
  PASSWORD: "1234", // replace with your MySQL password
  DB: "student_db",
  dialect: "mysql",
  pool: {
    max: 5, // maximum number of connections in pool
    min: 0, // minimum number of connections in pool
    acquire: 30000, // maximum time (ms) that pool will try to get connection before throwing error
    idle: 10000 // maximum time (ms) that a connection can be idle before being released
  }
};
const cors = require('cors');
app.use(cors());
module.exports = dbConfig;