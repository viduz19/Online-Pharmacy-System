import AuditLog from '../models/AuditLog.model.js';

export const createAuditLog = async (userId, action, targetModel = null, targetId = null, details = null, req = null) => {
    try {
        const auditData = {
            user: userId,
            action,
            targetModel,
            targetId,
            details,
        };

        if (req) {
            auditData.ipAddress = req.ip || req.connection.remoteAddress;
            auditData.userAgent = req.get('user-agent');
        }

        await AuditLog.create(auditData);
    } catch (error) {
        console.error('Error creating audit log:', error);
        // Don't throw error - audit logging should not break the main flow
    }
};

export const getAuditLogs = async (filters = {}, page = 1, limit = 50) => {
    try {
        const query = {};

        if (filters.user) query.user = filters.user;
        if (filters.action) query.action = filters.action;
        if (filters.targetModel) query.targetModel = filters.targetModel;
        if (filters.targetId) query.targetId = filters.targetId;

        const skip = (page - 1) * limit;

        const logs = await AuditLog.find(query)
            .populate('user', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        throw error;
    }
};
