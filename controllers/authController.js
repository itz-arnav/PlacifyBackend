import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const REGISTRATION_KEY = process.env.REGISTRATION_KEY;

// Function to register a new user
export const registerUser = async (req, res, next) => {
  try {
    const { username, password, email, registrationKey } = req.body;

    // Validate the registration key
    if (registrationKey !== REGISTRATION_KEY) {
      return res.status(400).send({ error: 'Invalid access rights to this API' });
    }

    // Create and save the new user
    const user = new User({ username, password, email });
    await user.save();

    // Respond with success if user is registered
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
};

// Function to login a user and issue a JWT
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Handle non-existent user
    if (!user) {
      return res.status(400).send({ error: 'Invalid username credentials' });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Invalid password credentials' });
    }

    // Generate JWT token that includes the user ID and authority
    const token = jwt.sign(
      { id: user._id, authority: user.authority }, 
      JWT_SECRET, 
      { expiresIn: '5d' }
    );

    // Respond with the JWT token
    res.status(200).send({ message: 'Logged in successfully', token });
  } catch (err) {
    // Handle errors
    next(err);
  }
};
