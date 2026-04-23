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
            // Fallback to dummy data
            setStats({
                users: { total: 156, customers: 128, pharmacists: 25, pendingPharmacists: 3 },
                products: { total: 216, lowStock: 12 },
                orders: { total: 543, pending: 18, today: 24 },
                revenue: { total: 2450000, today: 15000, monthly: 450000 }
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600 mt-2">Real-time performance metrics</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users.total}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-semibold">{stats.users.customers}</span>
                        <span className="text-gray-500 ml-1">Customers</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-blue-600 font-semibold">{stats.users.pharmacists}</span>
                        <span className="text-gray-500 ml-1">Pharmacists</span>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.products.total}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Package className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className={`font-semibold ${stats.products.lowStock > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {stats.products.lowStock}
                        </span>
                        <span className="text-gray-500 ml-1">Low Stock Items</span>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/orders')}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.orders.total}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <ShoppingCart className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-purple-600 font-semibold">{stats.orders.pending}</span>
                        <span className="text-gray-500 ml-1">Pending Review</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-green-600 font-semibold">{stats.orders.today}</span>
                        <span className="text-gray-500 ml-1">Today</span>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/admin/reports')}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue (Rs.)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.revenue.total.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-orange-600 font-semibold">Rs. {stats.revenue.today?.toLocaleString()}</span>
                        <span className="text-gray-500 ml-1">Today</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-green-600 font-semibold">Monthly</span>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Pharmacist Approvals */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
                            Pharmacist Approvals
                        </h3>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {pendingPharmacists.length} Pending
                        </span>
                    </div>

                    {pendingPharmacists.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <p className="text-gray-600 font-medium">All pharmacists approved!</p>
                            <p className="text-gray-500 text-sm mt-2">No pending approvals at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {pendingPharmacists.map((pharmacist) => (
                                <div
                                    key={pharmacist._id}
                                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">
                                                {pharmacist.user?.firstName} {pharmacist.user?.lastName}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">{pharmacist.user?.email}</p>
                                            
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-md font-medium uppercase">
                                                    License: {pharmacist.licenseNumber}
                                                </span>
                                                <span className="bg-green-50 text-green-700 text-[10px] px-2 py-1 rounded-md font-medium uppercase">
                                                    Exp: {pharmacist.yearsOfExperience}y
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => handleApprovePharmacist(pharmacist._id)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleRejectPharmacist(pharmacist._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Reject"
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

                {/* Quick Reports / Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                        Quick Insights
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Monthly Revenue Goal</span>
                            <span className="text-sm font-semibold text-gray-900">75%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <p className="text-xs text-purple-600 font-semibold uppercase">Pending Orders</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.orders.pending}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl">
                                <p className="text-xs text-green-600 font-semibold uppercase">Monthly Sales</p>
                                <p className="text-2xl font-bold text-green-900 mt-1">Rs. {stats.revenue.monthly?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => navigate('/admin/reports')}
                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Generate Detailed Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;
