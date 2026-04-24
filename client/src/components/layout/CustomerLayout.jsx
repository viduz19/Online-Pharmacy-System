import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    FileText, 
    Upload, 
    MessageCircle, 
    User, 
    Settings, 
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { authService } from '../../services/api.service';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import logo from "../../assets/Online Pharmacy System.png";

const sidebarItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Orders', path: '/customer/orders', icon: Package },
    { name: 'Prescriptions', path: '/customer/prescriptions', icon: FileText },
    { name: 'Upload Prescription', path: '/customer/upload-prescription', icon: Upload },
    { name: 'WhatsApp Support', path: '#whatsapp', icon: MessageCircle },
    { name: 'Profile', path: '/customer/profile', icon: User },
    { name: 'Settings', path: '/customer/settings', icon: Settings },
];

function CustomerLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = authService.getCurrentUser() || { firstName: 'Customer' };
    const { getCartCount } = useCart();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleWhatsAppSupport = () => {
        const phoneNumber = '+94771234567'; 
        const message = 'Hello, I have a question about my order/prescription.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
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
                                <span className="text-lg font-bold text-green-600 truncate">Viduz Pharmacy</span>
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
                            <div key={item.name}>
                                {item.path === '#whatsapp' ? (
                                    <button
                                        onClick={handleWhatsAppSupport}
                                        className="w-full flex items-center px-6 py-3 transition-all duration-200 group text-gray-600 hover:bg-green-50 hover:text-green-600"
                                    >
                                        <item.icon className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                                        {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
                                    </button>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-6 py-3 transition-all duration-200 group ${
                                            location.pathname === item.path
                                                ? 'bg-green-50 text-green-600 font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                                        }`}
                                    >
                                        <div className="relative">
                                            <item.icon className={`w-5 h-5 ${
                                                location.pathname === item.path ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'
                                            }`} />
                                            {item.name === 'Cart' && getCartCount() > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                                    {getCartCount()}
                                                </span>
                                            )}
                                        </div>
                                        {isSidebarOpen && <span className="ml-4">{item.name}</span>}
                                        {location.pathname === item.path && isSidebarOpen && (
                                            <div className="ml-auto w-1.5 h-6 bg-green-600 rounded-full" />
                                        )}
                                    </Link>
                                )}
                            </div>
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
                            {sidebarItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
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
                                <p className="text-xs text-green-600 font-medium capitalize tracking-tight">{currentUser?.role?.toLowerCase() || 'customer'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border-2 border-white shadow-md">
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

export default CustomerLayout;
