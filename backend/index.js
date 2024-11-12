const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/User');
const taskRoutes = require('./routes/Task');
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
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});
