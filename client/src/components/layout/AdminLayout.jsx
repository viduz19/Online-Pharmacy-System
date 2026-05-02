import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    FileText, 
    Users, 
    UserCheck, 
    TrendingUp, 
    Settings, 
    LogOut,
    Menu,
    X,
    Bell,
    User
} from 'lucide-react';
import { authService } from '../../services/api.service';
import toast from 'react-hot-toast';
import logo from "../../assets/Online Pharmacy System.png";

const sidebarItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Prescriptions', path: '/admin/prescriptions', icon: FileText },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Pharmacists', path: '/admin/pharmacists', icon: UserCheck },
    { name: 'Revenue', path: '/admin/revenue', icon: TrendingUp },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar */}
            <aside 
                className={`${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } bg-white shadow-xl transition-all duration-300 ease-in-out fixed h-full z-30 border-r border-gray-100`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                        <Link to="/" className="flex items-center gap-2 overflow-hidden">
                            <img src={logo} alt="Viduz Pharmacy Logo" className="w-10 h-10 object-contain shrink-0" />
                            {isSidebarOpen && (
                                <span className="text-lg font-bold text-blue-600 truncate">Viduz Pharmacy</span>
                            )}
                        </Link>
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Sidebar Items */}
                    <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-6 py-3 transition-all duration-200 group relative ${
                                    location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${
                                    location.pathname === item.path ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                }`} />
                                {isSidebarOpen && <span className="ml-4 text-sm font-medium">{item.name}</span>}
                                {location.pathname === item.path && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all ${
                                !isSidebarOpen && 'justify-center'
                            }`}
                        >
                            <LogOut className="w-5 h-5" />
                            {isSidebarOpen && <span className="ml-4 font-medium text-sm">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main 
                className={`flex-1 transition-all duration-300 ${
                    isSidebarOpen ? 'ml-64' : 'ml-20'
                }`}
            >
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {sidebarItems.find(item => item.path === location.pathname)?.name || 'Admin'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">3</span>
                        </button>
                        
                        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</p>
                                <p className="text-xs text-blue-600 font-medium capitalize tracking-tight">{currentUser?.role?.toLowerCase() || 'admin'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-md">
                                {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
