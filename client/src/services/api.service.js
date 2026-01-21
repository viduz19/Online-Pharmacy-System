import api from '../config/api';

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export const productService = {
    // Get all products
    getProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    // Get single product
    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
};

export const orderService = {
    // Create order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get my orders
    getMyOrders: async (params = {}) => {
        const response = await api.get('/orders/my-orders', { params });
        return response.data;
    },

    // Get order details
    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
};

export const prescriptionService = {
    // Upload prescription
    uploadPrescription: async (formData) => {
        const response = await api.post('/prescriptions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get my prescriptions
    getMyPrescriptions: async (params = {}) => {
        const response = await api.get('/prescriptions/my-prescriptions', { params });
        return response.data;
    },

    // Get pending prescriptions (Pharmacist)
    getPendingPrescriptions: async (params = {}) => {
        const response = await api.get('/prescriptions/pending', { params });
        return response.data;
    },

    // Review prescription (Pharmacist)
    reviewPrescription: async (id, data) => {
        const response = await api.patch(`/prescriptions/${id}/review`, data);
        return response.data;
    },
};

export const adminService = {
    // Get dashboard stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    // Get pending pharmacists
    getPendingPharmacists: async (params = {}) => {
        const response = await api.get('/admin/pharmacists/pending', { params });
        return response.data;
    },

    // Approve/reject pharmacist
    updatePharmacistApproval: async (id, data) => {
        const response = await api.patch(`/admin/pharmacists/${id}/approval`, data);
        return response.data;
    },
};
