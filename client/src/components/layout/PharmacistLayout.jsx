import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    ShoppingCart, 
    Package, 
    CheckCircle, 
    XCircle, 
    MessageSquare, 
    User, 
    Settings, 
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { authService } from '../../services/api.service';
import toast from 'react-hot-toast';

const sidebarItems = [
    { name: 'Dashboard', path: '/pharmacist/dashboard', icon: LayoutDashboard },
    { name: 'Pending Reviews', path: '/pharmacist/prescriptions/pending', icon: FileText },
    { name: 'Orders', path: '/pharmacist/orders', icon: ShoppingCart },
    { name: 'Inventory', path: '/pharmacist/products', icon: Package },
    { name: 'Approved', path: '/pharmacist/prescriptions/approved', icon: CheckCircle },
    { name: 'Rejected', path: '/pharmacist/prescriptions/rejected', icon: XCircle },
    { name: 'WhatsApp', path: '/pharmacist/whatsapp', icon: MessageSquare },
    { name: 'Profile', path: '/pharmacist/profile', icon: User },
    { name: 'Settings', path: '/pharmacist/settings', icon: Settings },
];

function PharmacistLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside 
                className={`${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } bg-white shadow-xl transition-all duration-300 ease-in-out fixed h-full z-30 border-r border-gray-100 font-poppins`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                        {isSidebarOpen ? (
                            <span className="text-xl font-bold text-green-600 truncate uppercase tracking-wider">Viduz Ph</span>
                        ) : (
                            <span className="text-xl font-bold text-green-600">V</span>
                        )}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5 text-gray-500" /> : <Menu className="w-5 h-5 text-gray-500" />}
                        </button>
                    </div>

                    {/* Sidebar Items */}
                    <nav className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-6 py-3.5 transition-all duration-200 group relative ${
                                    location.pathname === item.path
                                        ? 'bg-green-50 text-green-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${
                                    location.pathname === item.path ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'
                                }`} />
                                {isSidebarOpen && <span className="ml-4 text-sm font-medium">{item.name}</span>}
                                {location.pathname === item.path && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-6 bg-green-600 rounded-full" />
                                )}
                                {location.pathname === item.path && !isSidebarOpen && (
                                    <div className="absolute left-0 top-0 w-1 h-full bg-green-600" />
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
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20 border-b border-gray-100 font-poppins">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {sidebarItems.find(item => item.path === location.pathname)?.name || 'Pharmacist'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative text-gray-500 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">2</span>
                        </button>
                        
                        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</p>
                                <p className="text-xs text-green-600 font-medium capitalize tracking-tight">Licensed {currentUser?.role?.toLowerCase()}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-md ring-1 ring-green-100">
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

export default PharmacistLayout;
