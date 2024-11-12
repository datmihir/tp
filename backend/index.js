const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/User');
const contactRoutes = require('./routes/Contact');
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 3000; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database');
  }
});

app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});

/*
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

*/