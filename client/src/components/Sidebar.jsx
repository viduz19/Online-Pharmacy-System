import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    FolderTree, 
    ShoppingCart, 
    Users, 
    UserPlus, 
    FileBarChart, 
    Settings, 
    LogOut, 
    MessageCircle, 
    FileText, 
    Upload, 
    Search, 
    User,
    Pill
} from 'lucide-react';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';

function Sidebar({ role }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: FolderTree },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Pharmacists', path: '/admin/users', icon: UserPlus }, // Reuse users page or specific one
        { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const pharmacistLinks = [
        { name: 'Dashboard', path: '/pharmacist/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Pill }, // Linking to shared inventory management
        { name: 'Orders', path: '/pharmacist/orders', icon: ShoppingCart },
        { name: 'Prescriptions', path: '/pharmacist/prescriptions', icon: FileText },
        { name: 'WhatsApp', path: '/pharmacist/messages', icon: MessageCircle },
        { name: 'Profile', path: '/pharmacist/profile', icon: User },
    ];

    const customerLinks = [
        { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
        { name: 'Medicines', path: '/products', icon: Pill },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'My Cart', path: '/cart', icon: ShoppingCart },
        { name: 'My Orders', path: '/customer/orders', icon: Package },
        { name: 'Upload Prescription', path: '/customer/upload-prescription', icon: Upload },
        { name: 'WhatsApp Support', path: '/customer/help', icon: MessageCircle },
        { name: 'Profile', path: '/customer/profile', icon: User },
    ];

    const upperRole = role?.toUpperCase();
    const links = upperRole === 'ADMIN' ? adminLinks : upperRole === 'PHARMACIST' ? pharmacistLinks : customerLinks;

    return (
        <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300">
            <div className="p-6">
                <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
                    <span className="mr-2">🏥</span> Viduz
                </Link>
                <div className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                    Pharmacy Management
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-inherit'}`} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
