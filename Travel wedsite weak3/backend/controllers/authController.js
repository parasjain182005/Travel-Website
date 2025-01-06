import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User registration
export const register = async (req, res) => {
    try {
        const { username, email, password, photo } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hash,
            photo
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).json({ success: false, message: 'Failed to register user. Please try again.' });
    }
};

// User login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY || 'defaultSecretKey', // Fallback for JWT secret key
            { expiresIn: '15d' }
        );

        // Remove sensitive information from response
        const { password: _, role, ...userData } = user._doc;

        // Set token in browser cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure flag in production
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        }).status(200).json({
            success: true,
            token,
            user: userData,
            role,
        });
    } catch (err) {
        console.error('Error during user login:', err);
        res.status(500).json({ success: false, message: 'Failed to login. Please try again.' });
    }
};
