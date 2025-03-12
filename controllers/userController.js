const User = require('../models/User');
require('dotenv').config();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    await user.save();
    return res.status(200).json({ msg: 'User created.' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (!password == user.password) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    return res.status(200).json({ msg: 'Login sucess...' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



// @route   GET api/users
// @desc    Get all users
// @access  Public
exports.getUsers = async (req, res) => {
  try {
    const products = await User.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};