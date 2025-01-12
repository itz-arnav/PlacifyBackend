import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    username = validator.trim(username || '');
    email = validator.normalizeEmail(email || '');
    password = validator.trim(password || '');

    if (validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(400).send({ error: 'All fields (username, email, password) are required.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({ error: 'Invalid email format.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send({ error: 'User with this username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    username = validator.trim(username || '');
    password = validator.trim(password || '');

    if (validator.isEmpty(username) || validator.isEmpty(password)) {
      return res.status(400).send({ error: 'Both username/email and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    });

    if (!user) {
      return res.status(400).send({ error: 'Invalid username/email credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send({ error: 'Invalid password credentials' });
    }

    const token = jwt.sign(
      { id: user._id, authority: user.authority },
      JWT_SECRET,
      { expiresIn: '5d' }
    );

    res.status(200).send({ message: 'Logged in successfully', token });
  } catch (err) {
    next(err);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).send({ valid: true, decoded });
  } catch (err) {
    res.status(401).send({ error: 'Invalid or expired token' });
  }
};

