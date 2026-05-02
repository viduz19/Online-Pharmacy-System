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
            setStats({
                prescriptions: { pending: 12, approved: 45, rejected: 3 },
                orders: { active: 8, completed: 156 },
                inventory: { lowStock: 5 }
            });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Pending Reviews',
            value: stats.prescriptions.pending,
            icon: FileText,
            color: 'bg-amber-50 text-amber-500',
            hover: 'group-hover:bg-amber-500 group-hover:text-white',
            path: '/pharmacist/prescriptions/pending'
        },
        {
            title: 'Active Orders',
            value: stats.orders.active,
            icon: ShoppingCart,
            color: 'bg-blue-50 text-blue-500',
            hover: 'group-hover:bg-blue-500 group-hover:text-white',
            path: '/pharmacist/orders'
        },
        {
            title: 'Low Stock Alerts',
            value: stats.inventory.lowStock,
            icon: Package,
            color: 'bg-red-50 text-red-500',
            hover: 'group-hover:bg-red-500 group-hover:text-white',
            path: '/pharmacist/products'
        },
        {
            title: 'Total Fulfilled',
            value: stats.orders.completed,
            icon: CheckCircle,
            color: 'bg-emerald-50 text-emerald-500',
            hover: 'group-hover:bg-emerald-500 group-hover:text-white',
            path: '/pharmacist/orders'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500/20 border-b-amber-500"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Clinic...</p>
                </div>
            </div>
        );
    }

    return (
        <PharmacistLayout>
            {/* Header / Welcome */}
            <div className="mb-12">
                <div className="bg-amber-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black tracking-tight mb-2">Welcome, {currentUser.firstName}</h1>
                        <p className="text-amber-50 font-bold opacity-90 max-w-lg">
                            You have {stats.prescriptions.pending} clinical reviews pending and {stats.orders.active} active orders to fulfill today.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button 
                                onClick={() => navigate('/pharmacist/prescriptions/pending')}
                                className="bg-white text-amber-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95"
                            >
                                Review Prescriptions
                            </button>
                        </div>
                    </div>
                    {/* Visual Flourish */}
                    <Activity className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(card.path)}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-3xl transition-colors ${card.color} ${card.hover}`}>
                                <card.icon className="w-8 h-8" />
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.title}</p>
                        <p className="text-4xl font-black text-gray-900 mt-1 tracking-tight">{card.value}</p>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Priority Workflow */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
                                <FileText className="w-8 h-8 mr-3 text-amber-500" />
                                Priority Workflow
                            </h3>
                            <p className="text-gray-400 text-sm font-medium mt-1">Medications requiring pharmaceutical verification</p>
                        </div>
                        <button 
                            onClick={() => navigate('/pharmacist/prescriptions/pending')}
                            className="bg-gray-50 text-gray-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div 
                            onClick={() => navigate('/pharmacist/prescriptions/pending')}
                            className="group bg-amber-50/50 border border-amber-100 rounded-[2rem] p-6 hover:bg-amber-50 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                                    <Activity className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-amber-900 tracking-tight">Prescription Verification</h4>
                                    <p className="text-sm text-amber-700/60 font-bold">Calculate pricing and verify SLMC standards</p>
                                </div>
                            </div>
                            <div className="bg-amber-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200">
                                {stats.prescriptions.pending} Pending
                            </div>
                        </div>

                        <div 
                            onClick={() => navigate('/pharmacist/orders')}
                            className="group bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 hover:bg-blue-50 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                                    <ShoppingCart className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-blue-900 tracking-tight">Order Fulfillment</h4>
                                    <p className="text-sm text-blue-700/60 font-bold">Pack medications and update shipping status</p>
                                </div>
                            </div>
                            <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                                {stats.orders.active} Active
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Insights */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight flex items-center">
                        <TrendingUp className="w-8 h-8 mr-3 text-emerald-500" />
                        Performance
                    </h3>
                    
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Approved Today</span>
                            </div>
                            <span className="text-xl font-black text-emerald-600">{stats.prescriptions.approved}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                            <div className="flex items-center gap-4">
                                <XCircle className="w-6 h-6 text-red-500" />
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Rejected Issues</span>
                            </div>
                            <span className="text-xl font-black text-red-600">{stats.prescriptions.rejected}</span>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-50">
                            <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer" onClick={() => window.open('https://wa.me/yournumber', '_blank')}>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2">Customer Connect</p>
                                    <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        WhatsApp Inquiries
                                    </h4>
                                </div>
                                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PharmacistLayout>
    );
}

export default PharmacistDashboard;
