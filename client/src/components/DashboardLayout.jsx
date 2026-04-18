import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { authService } from '../services/api.service';

function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = authService.getCurrentUser();
    const userRole = user?.role?.toUpperCase() || 'CUSTOMER';
    const role = userRole;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Toggle */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
            </button>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-30 transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static 
                transition-transform duration-300 ease-in-out
            `}>
                <Sidebar role={role} />
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto w-full relative">
                {/* Optional Header for Main Content */}
                <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 hidden lg:block">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <span>Welcome to</span>
                            <span className="font-bold text-blue-600">Viduz Pharmacy Portal</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
