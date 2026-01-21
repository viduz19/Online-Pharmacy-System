import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.model.js';
import { errorResponse } from '../utils/response.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return errorResponse(res, 'Not authorized to access this route', 401);
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return errorResponse(res, 'User not found', 404);
            }

            // Check if user is active
            if (req.user.status === 'BLOCKED') {
                return errorResponse(res, 'Your account has been blocked', 403);
            }

            if (req.user.status === 'PENDING' && req.user.role === 'PHARMACIST') {
                return errorResponse(res, 'Your account is pending admin approval', 403);
            }

            next();
        } catch (error) {
            return errorResponse(res, 'Not authorized to access this route', 401);
        }
    } catch (error) {
        return errorResponse(res, 'Server error in authentication', 500);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                `User role ${req.user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};
