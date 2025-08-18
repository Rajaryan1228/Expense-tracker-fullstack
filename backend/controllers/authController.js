const User = require('../models/User'); // Assuming you have a User model defined
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register user handler function
const registerUser = async (req, res) => {
  // Your registration logic here
  // e.g. create the user in your database and respond accordingly
  const { fullName, email, password, profileImageUrl } = req.body;

  // Check if user already exists
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user handler function
const loginUser = async (req, res) => {
  // Your login logic here
  // e.g. authenticate user, generate token, respond
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

// Get user info handler function (add if needed)
const getUserInfo = async (req, res) => {
  // Your logic to get user info here
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user info', error: error.message });
  } 
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  generateToken,
};
