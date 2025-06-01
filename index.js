// Load environment variables
require('dotenv').config();
const { authenticate, authorize } = require('./middleware/auth');


// Import required modules
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection setup
const client = new MongoClient('mongodb://localhost:27017');
let db;

client.connect().then(() => {
  db = client.db('e-hailing'); // or your actual DB name
  console.log("Connected to MongoDB");
});

// Registration route
const saltRounds = 10;
app.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = { name, email, password: hashedPassword, role };
    await db.collection('users').insertOne(user);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});



// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

app.delete('/admin/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  console.log("admin only"); // for debugging
  res.status(200).send("admin access");
});
