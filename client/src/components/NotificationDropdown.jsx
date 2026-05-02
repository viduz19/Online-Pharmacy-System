import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = ({ role, color = 'blue' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, unreadCount, markAsRead } = useNotifications();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getColorClass = (type) => {
        switch (type) {
            case 'success': return 'text-green-500 bg-green-50';
            case 'warning': return 'text-amber-500 bg-amber-50';
            case 'error': return 'text-red-500 bg-red-50';
            default: return 'text-blue-500 bg-blue-50';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check className="w-4 h-4" />;
            case 'warning': return <AlertTriangle className="w-4 h-4" />;
            case 'error': return <X className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    const themeColors = {
        blue: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-red-500',
        yellow: 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 bg-red-500',
        green: 'text-green-600 hover:text-green-700 hover:bg-green-50 bg-red-500'
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative text-gray-500 transition-colors p-2 rounded-lg ${themeColors[color].split(' bg-')[0]}`}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className={`absolute top-2 right-2 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold ${themeColors[color].split(' ').pop()}`}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{unreadCount} New</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    onClick={() => {
                                        if (!notification.read) markAsRead(notification.id);
                                    }}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                >
                                    {!notification.read && (
                                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${color === 'blue' ? 'bg-blue-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    )}
                                    <div className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getColorClass(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{notification.title}</p>
                                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">{notification.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">No new notifications</p>
                                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-gray-50 text-center">
                        <Link 
                            to={`/${role.toLowerCase()}/notifications`}
                            onClick={() => setIsOpen(false)}
                            className={`text-xs font-bold uppercase tracking-widest hover:underline ${color === 'blue' ? 'text-blue-600' : color === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}
                        >
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
