import { Bell, Check, Info, AlertTriangle, X, Trash2, CheckCircle } from 'lucide-react';
import { authService } from '../services/api.service';
import { useNotifications } from '../context/NotificationContext';
import AdminLayout from '../components/layout/AdminLayout';
import PharmacistLayout from '../components/layout/PharmacistLayout';
import CustomerLayout from '../components/layout/CustomerLayout';
import toast from 'react-hot-toast';

const Notifications = () => {
    const user = authService.getCurrentUser();
    const role = user?.role?.toUpperCase() || 'CUSTOMER';
    const { 
        notifications, 
        markAsRead, 
        deleteNotification, 
        markAllAsRead, 
        clearAll 
    } = useNotifications();

    const handleMarkAsRead = (id) => {
        markAsRead(id);
        toast.success('Notification marked as read');
    };

    const handleDelete = (id) => {
        deleteNotification(id);
        toast.success('Notification deleted');
    };

    const handleMarkAllAsRead = () => {
        if (notifications.length === 0) return;
        if (notifications.every(n => n.read)) {
            toast.error('All notifications are already read');
            return;
        }
        markAllAsRead();
        toast.success('All notifications marked as read');
    };

    const handleClearAll = () => {
        if (notifications.length === 0) {
            toast.error('No notifications to clear');
            return;
        }
        clearAll();
        toast.success('All notifications cleared');
    };

    const Layout = role === 'ADMIN' ? AdminLayout : role === 'PHARMACIST' ? PharmacistLayout : CustomerLayout;
    const themeColor = role === 'ADMIN' ? 'blue' : role === 'PHARMACIST' ? 'yellow' : 'green';

    const getColorClass = (type) => {
        switch (type) {
            case 'success': return 'text-green-500 bg-green-50 border-green-100';
            case 'warning': return 'text-amber-500 bg-amber-50 border-amber-100';
            case 'error': return 'text-red-500 bg-red-50 border-red-100';
            default: return 'text-blue-500 bg-blue-50 border-blue-100';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'error': return <X className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Bell className={`w-8 h-8 ${themeColor === 'blue' ? 'text-blue-600' : themeColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`} />
                            Notifications
                        </h1>
                        <p className="text-gray-500 mt-1">Stay updated with the latest activities in your pharmacy portal.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Mark all as read
                        </button>
                        <button 
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear all
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`p-6 bg-white rounded-2xl border transition-all hover:shadow-md relative overflow-hidden group ${
                                    !notification.read ? 'border-l-4 border-l-blue-500 shadow-sm' : 'border-gray-100'
                                }`}
                                style={!notification.read && themeColor !== 'blue' ? { borderLeftColor: themeColor === 'yellow' ? '#ca8a04' : '#16a34a' } : {}}
                            >
                                {!notification.read && (
                                    <div className={`absolute top-6 right-6 w-3 h-3 rounded-full animate-pulse ${
                                        themeColor === 'blue' ? 'bg-blue-500' : themeColor === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></div>
                                )}
                                
                                <div className="flex gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getColorClass(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`text-lg font-bold text-gray-900 ${!notification.read ? 'pr-8' : ''}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        
                                        <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.read && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className={`text-sm font-bold ${themeColor === 'blue' ? 'text-blue-600' : themeColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'} hover:underline`}
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="w-10 h-10 text-gray-200" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">All caught up!</h2>
                            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                                You don't have any notifications at the moment. We'll let you know when something important happens.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Notifications;
