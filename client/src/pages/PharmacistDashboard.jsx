import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pharmacistService, authService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    FileText, 
    CheckCircle, 
    XCircle, 
    ShoppingCart, 
    Activity,
    TrendingUp,
    Package,
    ArrowUpRight,
    Search,
    MessageSquare
} from 'lucide-react';
import PharmacistLayout from '../components/layout/PharmacistLayout';

function PharmacistDashboard() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser() || { firstName: 'Pharmacist' };
    const [stats, setStats] = useState({
        prescriptions: { pending: 0, approved: 0, rejected: 0 },
        orders: { active: 0, completed: 0 },
        inventory: { lowStock: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await pharmacistService.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching pharmacist stats:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Pending Reviews',
            value: stats.prescriptions.pending,
            icon: FileText,
            color: 'bg-yellow-50 text-yellow-600',
            bg: 'bg-yellow-600',
            path: '/pharmacist/prescriptions/pending'
        },
        {
            title: 'Active Orders',
            value: stats.orders.active,
            icon: ShoppingCart,
            color: 'bg-blue-50 text-blue-600',
            bg: 'bg-blue-600',
            path: '/pharmacist/orders'
        },
        {
            title: 'Low Stock Items',
            value: stats.inventory.lowStock,
            icon: Package,
            color: 'bg-red-50 text-red-600',
            bg: 'bg-red-600',
            path: '/pharmacist/products'
        },
        {
            title: 'Approved Today',
            value: stats.prescriptions.approved,
            icon: CheckCircle,
            color: 'bg-green-50 text-green-600',
            bg: 'bg-green-600',
            path: '/pharmacist/prescriptions/approved'
        }
    ];

    if (loading) {
        return (
            <PharmacistLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </PharmacistLayout>
        );
    }

    return (
        <PharmacistLayout>
            <div className="space-y-8 font-poppins">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-green-100">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back, Dr. {currentUser.firstName}! 👋</h2>
                        <p className="text-green-50 font-medium max-w-md opacity-90">
                            You have {stats.prescriptions.pending} prescriptions waiting for review and {stats.orders.active} active orders to fulfill.
                        </p>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-10 -mb-20 w-80 h-80 bg-black/5 rounded-full blur-2xl"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(card.path)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col group active:scale-95"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.color}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-tight">{card.title}</span>
                            <span className="text-3xl font-bold text-gray-900 mt-1">{card.value}</span>
                        </button>
                    ))}
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Workflow */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Priority Tasks</h3>
                                <p className="text-sm text-gray-500 mt-1 font-medium">Items requiring your clinical attention</p>
                            </div>
                            <button 
                                onClick={() => navigate('/pharmacist/prescriptions/pending')}
                                className="text-sm font-bold text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                View All
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border border-yellow-100 group hover:bg-yellow-100/50 cursor-pointer transition-all" onClick={() => navigate('/pharmacist/prescriptions/pending')}>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-yellow-600 font-bold border border-yellow-100">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-yellow-900 text-base">New Prescription Uploads</p>
                                        <p className="text-sm text-yellow-700 opacity-80 font-medium">Requires price calculation and verification</p>
                                    </div>
                                </div>
                                <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {stats.prescriptions.pending} Pending
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 group hover:bg-blue-100/50 cursor-pointer transition-all" onClick={() => navigate('/pharmacist/orders')}>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                                        <ShoppingCart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-900 text-base">Preparing Orders</p>
                                        <p className="text-sm text-blue-700 opacity-80 font-medium">Verify packing and notify delivery team</p>
                                    </div>
                                </div>
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {stats.orders.active} Ready
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 group hover:bg-green-100/50 cursor-pointer transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 font-bold border border-green-100">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-900 text-base">WhatsApp Support</p>
                                        <p className="text-sm text-green-700 opacity-80 font-medium">Customer inquiries about availability</p>
                                    </div>
                                </div>
                                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    Connect
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-poppins">Monthly Summary</h3>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 font-poppins tracking-tight">Approved Orders</p>
                                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Successful fulfillment</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-green-600">{stats.prescriptions.approved}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                            <XCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 font-poppins tracking-tight">Rejected Items</p>
                                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Invalid prescriptions</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-red-600">{stats.prescriptions.rejected}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 font-poppins tracking-tight">Completed Fulfillment</p>
                                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Delivered to customers</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-blue-600">{stats.orders.completed}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-green-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                           <div className="relative z-10 transition-transform group-hover:scale-105 duration-300">
                                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Pharmacist Note</p>
                                <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                                    "Ensure all Rx medicines are cross-verified with SLMC license standards before approval."
                                </p>
                           </div>
                           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </PharmacistLayout>
    );
}

export default PharmacistDashboard;
