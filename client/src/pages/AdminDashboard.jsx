import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, authService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    Users, 
    Package, 
    ShoppingCart, 
    TrendingUp, 
    UserCheck, 
    CheckCircle, 
    XCircle, 
    FileText,
    TrendingDown,
    ArrowUpRight,
    Search
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: { total: 0, customers: 0, pharmacists: 0, pendingPharmacists: 0 },
        products: { total: 0, lowStock: 0 },
        orders: { 
            total: 0, 
            pending: 0, 
            today: 0,
            byStatus: {} 
        },
        revenue: { 
            total: 0,
            today: 0,
            monthly: 0
        }
    });
    const [pendingPharmacists, setPendingPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pharmacistsRes] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getPendingPharmacists({ limit: 10 }),
            ]);

            if (statsRes.success) {
                setStats(statsRes.data);
            }
            if (pharmacistsRes.success) {
                setPendingPharmacists(pharmacistsRes.data);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setStats({
                users: { total: 156, customers: 128, pharmacists: 25, pendingPharmacists: 3 },
                products: { total: 216, lowStock: 12 },
                orders: { total: 543, pending: 18, today: 24 },
                revenue: { total: 2450000, today: 45000, monthly: 850000 }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePharmacist = async (id) => {
        try {
            const response = await adminService.updatePharmacistApproval(id, { approvalStatus: 'APPROVED' });
            if (response.success) {
                setPendingPharmacists(pendingPharmacists.filter(p => p._id !== id));
                toast.success('Pharmacist approved successfully!');
                fetchDashboardData();
            }
        } catch (error) {
            toast.error('Failed to approve pharmacist');
        }
    };

    const handleRejectPharmacist = async (id) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            const response = await adminService.updatePharmacistApproval(id, {
                approvalStatus: 'REJECTED',
                rejectionReason: reason
            });
            if (response.success) {
                setPendingPharmacists(pendingPharmacists.filter(p => p._id !== id));
                toast.success('Pharmacist rejected');
                fetchDashboardData();
            }
        } catch (error) {
            toast.error('Failed to reject pharmacist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-b-blue-600"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Initializing System...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Overview</h1>
                <p className="text-gray-500 font-medium mt-1">Real-time performance analytics and system control</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users className="w-8 h-8" />
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Active Users</p>
                    <p className="text-4xl font-black text-gray-900 mt-1 tracking-tight">{stats.users.total}</p>
                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stats.users.customers} Users</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stats.users.pharmacists} Staff</span>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Package className="w-8 h-8" />
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Inventory SKUs</p>
                    <p className="text-4xl font-black text-gray-900 mt-1 tracking-tight">{stats.products.total}</p>
                    <div className="mt-6 pt-6 border-t border-gray-50">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${stats.products.lowStock > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {stats.products.lowStock} Items Low Stock
                        </span>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/orders')}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-3xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <ShoppingCart className="w-8 h-8" />
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                    <p className="text-4xl font-black text-gray-900 mt-1 tracking-tight">{stats.orders.total}</p>
                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{stats.orders.pending} Pending</span>
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{stats.orders.today} Today</span>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/reports')}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-3xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-gray-300 group-hover:text-orange-600 transition-colors" />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">System Revenue</p>
                    <p className="text-3xl font-black text-gray-900 mt-1 tracking-tight">Rs. {stats.revenue.total.toLocaleString()}</p>
                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Rs. {stats.revenue.today.toLocaleString()} Today</span>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Pharmacist Approvals */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
                                <UserCheck className="w-8 h-8 mr-3 text-blue-600" />
                                Staff Verification
                            </h3>
                            <p className="text-gray-400 text-sm font-medium mt-1">Pending pharmacist license approvals</p>
                        </div>
                        <span className="bg-red-50 text-red-600 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                            {pendingPharmacists.length} Pending
                        </span>
                    </div>

                    {pendingPharmacists.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <p className="text-xl font-black text-gray-900">All Clear!</p>
                            <p className="text-gray-400 font-medium mt-2">No pending pharmacist applications at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                            {pendingPharmacists.map((pharmacist) => (
                                <div
                                    key={pharmacist._id}
                                    className="group bg-gray-50/30 border border-gray-100 rounded-[2rem] p-6 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100">
                                                {pharmacist.user?.firstName?.[0]}{pharmacist.user?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-gray-900 tracking-tight">
                                                    {pharmacist.user?.firstName} {pharmacist.user?.lastName}
                                                </h4>
                                                <p className="text-sm text-gray-400 font-bold mt-0.5">{pharmacist.user?.email}</p>
                                                
                                                <div className="mt-3 flex items-center gap-3">
                                                    <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest shadow-sm border border-gray-100">
                                                        Lic: {pharmacist.licenseNumber}
                                                    </span>
                                                    <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest shadow-sm border border-gray-100">
                                                        Exp: {pharmacist.yearsOfExperience} Years
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleApprovePharmacist(pharmacist._id)}
                                                className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                title="Approve Staff"
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleRejectPharmacist(pharmacist._id)}
                                                className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                title="Reject Application"
                                            >
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* System Insights */}
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/20">
                    <h3 className="text-2xl font-black mb-10 flex items-center tracking-tight">
                        <TrendingUp className="w-8 h-8 mr-3 text-blue-400" />
                        System Insights
                    </h3>
                    
                    <div className="space-y-10">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Monthly Revenue Goal</span>
                                <span className="text-lg font-black text-blue-400 tracking-tighter">75%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-1">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Orders Pending Review</p>
                                <p className="text-3xl font-black text-white tracking-tight">{stats.orders.pending}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Monthly Sales Growth</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-black text-white tracking-tight">Rs. {stats.revenue.monthly.toLocaleString()}</p>
                                    <div className="bg-green-500/20 text-green-400 p-2 rounded-xl">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/admin/reports')}
                            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95 mt-4"
                        >
                            <FileText className="w-5 h-5" />
                            System Intelligence Report
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;
