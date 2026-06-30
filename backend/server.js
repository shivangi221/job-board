const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Job } = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Successfully'))
  .catch((err) => console.error('❌ Database connection error:', err));

// --- AUTHENTICATION ROUTES ---

// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully! You can log in now.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create a secure token valid for 1 day
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- JOB POSTING ROUTES ---

// 3. Post a Job (Public for testing setup simplicity; add validation middleware later)
app.post('/api/jobs', async (req, res) => {
  try {
    const { employerId, title, company, location, type, description } = req.body;
    const newJob = new Job({ employerId, title, company, location, type, description });
    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post job', error: error.message });
  }
});

// 4. Get All Jobs (With optional text search filter)
app.get('/api/jobs', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      // Basic text search regex match
      query.title = { $regex: search, $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running smoothly on port ${PORT}`));



//cd C:\Users\5272s\OneDrive\Desktop\Simple tsk\job-board\backend
//node server.js
//