import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const user = authService.getCurrentUser();
    const role = user?.role?.toUpperCase() || 'CUSTOMER';

    const mockData = {
        ADMIN: [
            { id: 1, title: 'New Order', message: 'Order #ORD-2024-001 has been placed by Janith Perera.', type: 'info', time: '2 mins ago', read: false },
            { id: 2, title: 'Low Stock Alert', message: 'Paracetamol 500mg (Pack of 10) is below 50 units.', type: 'warning', time: '1 hour ago', read: false },
            { id: 3, title: 'New User Registered', message: 'A new pharmacist has joined the system.', type: 'success', time: '3 hours ago', read: true },
            { id: 4, title: 'System Update', message: 'The Online Pharmacy System will undergo maintenance tonight.', type: 'info', time: '5 hours ago', read: true },
        ],
        PHARMACIST: [
            { id: 1, title: 'Prescription Pending', message: 'New prescription upload from Customer #102.', type: 'info', time: '5 mins ago', read: false },
            { id: 2, title: 'Order Approved', message: 'Order #ORD-2024-005 has been approved by admin.', type: 'success', time: '2 hours ago', read: false },
            { id: 3, title: 'Medicine Recall', message: 'Batch #B123 of Amoxicillin has been recalled.', type: 'error', time: '1 day ago', read: true },
        ],
        CUSTOMER: [
            { id: 1, title: 'Order Shipped', message: 'Great news! Your order #ORD-2024-009 is on the way.', type: 'success', time: '10 mins ago', read: false },
            { id: 2, title: 'Prescription Rejected', message: 'Your prescription was rejected. Please re-upload.', type: 'error', time: '1 day ago', read: false },
            { id: 3, title: 'Promotion', message: 'Get 20% off on all vitamins this week!', type: 'info', time: '2 days ago', read: true },
        ]
    };

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            setNotifications(mockData[role] || []);
        } else {
            setNotifications([]);
        }
    }, [role, user?.id]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            markAsRead, 
            deleteNotification, 
            markAllAsRead, 
            clearAll 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
