const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  
  db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.log(err);
    }
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    
    let hashedPassword = await bcrypt.hash(password, 8);
    
    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({ message: 'User registered' });
      }
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
  }

  // Query the database for the user with the provided email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
          console.error('Database query error:', err); // Log any database errors
          return res.status(500).json({ message: 'Internal server error' });
      }

      // Check if any user was found
      if (results.length === 0) {
          return res.status(401).json({ message: 'Email or Password is incorrect' });
      }

      const user = results[0];

      // Check if the password matches
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ message: 'Email or Password is incorrect' });
      }

      // Generate a JWT token
      const id = user.id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "24h"
      });

      console.log('The token is: ' + token);

      // Set cookie options
      const cookieOptions = {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expires in 24 hours
          httpOnly: true
      };

      // Set the JWT token as a cookie
      res.cookie('jwt', token, cookieOptions);

      // Send a success response with the token and user data
      return res.status(200).json({
          message: 'User logged in',
          token: token,
          user: user
      });
  });
};
