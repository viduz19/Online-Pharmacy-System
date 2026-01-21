import User from '../models/User.model.js';
import PharmacistProfile from '../models/PharmacistProfile.model.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { generateToken } from '../utils/token.js';
import { createAuditLog } from '../utils/auditLog.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role, address, pharmacistData } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 'User with this email already exists', 400);
        }

        // Validate role
        const allowedRoles = ['CUSTOMER', 'PHARMACIST'];
        if (!allowedRoles.includes(role)) {
            return errorResponse(res, 'Invalid role. Only CUSTOMER and PHARMACIST can register', 400);
        }

        // Create user
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            address,
        };

        // Set status based on role
        if (role === 'PHARMACIST') {
            userData.status = 'PENDING'; // Pharmacist needs admin approval
        } else {
            userData.status = 'ACTIVE'; // Customer is active immediately
        }

        const user = await User.create(userData);

        // If pharmacist, create pharmacist profile
        if (role === 'PHARMACIST') {
            if (!pharmacistData || !pharmacistData.licenseNumber || !pharmacistData.nic) {
                await User.findByIdAndDelete(user._id);
                return errorResponse(res, 'License number and NIC are required for pharmacist registration', 400);
            }

            await PharmacistProfile.create({
                user: user._id,
                licenseNumber: pharmacistData.licenseNumber,
                nic: pharmacistData.nic,
                qualifications: pharmacistData.qualifications,
                pharmacyBranch: pharmacistData.pharmacyBranch,
                yearsOfExperience: pharmacistData.yearsOfExperience,
                specialization: pharmacistData.specialization,
            });
        }

        // Create audit log
        await createAuditLog(user._id, 'USER_REGISTER', 'User', user._id, { role }, req);

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        successResponse(
            res,
            role === 'PHARMACIST'
                ? 'Registration successful. Your account is pending admin approval.'
                : 'Registration successful',
            {
                user,
                token,
            },
            201
        );
    } catch (error) {
        console.error('Registration error:', error);
        errorResponse(res, error.message || 'Error in registration', 500);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return errorResponse(res, 'Please provide email and password', 400);
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Check user status
        if (user.status === 'BLOCKED') {
            return errorResponse(res, 'Your account has been blocked. Please contact support.', 403);
        }

        if (user.status === 'PENDING' && user.role === 'PHARMACIST') {
            return errorResponse(res, 'Your account is pending admin approval', 403);
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create audit log
        await createAuditLog(user._id, 'USER_LOGIN', 'User', user._id, null, req);

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        successResponse(res, 'Login successful', {
            user,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        errorResponse(res, error.message || 'Error in login', 500);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // If pharmacist, include profile
        let pharmacistProfile = null;
        if (user.role === 'PHARMACIST') {
            pharmacistProfile = await PharmacistProfile.findOne({ user: user._id });
        }

        successResponse(res, 'User retrieved successfully', {
            user,
            pharmacistProfile,
        });
    } catch (error) {
        console.error('Get me error:', error);
        errorResponse(res, error.message || 'Error retrieving user', 500);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await user.save();

        successResponse(res, 'Profile updated successfully', { user });
    } catch (error) {
        console.error('Update profile error:', error);
        errorResponse(res, error.message || 'Error updating profile', 500);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return errorResponse(res, 'Please provide current and new password', 400);
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return errorResponse(res, 'Current password is incorrect', 400);
        }

        // Update password
        user.password = newPassword;
        await user.save();

        successResponse(res, 'Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error);
        errorResponse(res, error.message || 'Error changing password', 500);
    }
};
