import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Users, Package, ShoppingCart, FileText, LogOut, UserCheck, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

function AdminDashboard() {
    const navigate = useNavigate();

    // Dummy Statistics Data
    const [stats] = useState({
        users: {
            total: 156,
            customers: 128,
            pharmacists: 25,
            pendingPharmacists: 3
        },
        products: {
            total: 216,
            lowStock: 12
        },
        orders: {
            total: 543,
            pending: 18,
            today: 24
        },
        revenue: {
            total: 2450000
        }
    });

    // Dummy Pending Pharmacists Data
    const [pendingPharmacists, setPendingPharmacists] = useState([
        {
            _id: '1',
            user: {
                firstName: 'Nimal',
                lastName: 'Silva',
                email: 'nimal.silva@pharmacy.lk',
                phone: '+94712345678'
            },
            licenseNumber: 'SLMC12345',
            nic: '199012345678',
            qualifications: 'B.Pharm, M.Pharm',
            yearsOfExperience: 5,
            pharmacyBranch: 'Kandy Main Branch',
            specialization: 'Clinical Pharmacy'
        },
        {
            _id: '2',
            user: {
                firstName: 'Saman',
                lastName: 'Fernando',
                email: 'saman.fernando@pharmacy.lk',
                phone: '+94773456789'
            },
            licenseNumber: 'SLMC67890',
            nic: '198567891234',
            qualifications: 'B.Pharm',
            yearsOfExperience: 8,
            pharmacyBranch: 'Negombo Branch',
            specialization: 'Community Pharmacy'
        },
        {
            _id: '3',
            user: {
                firstName: 'Kasun',
                lastName: 'Perera',
                email: 'kasun.perera@pharmacy.lk',
                phone: '+94771112233'
            },
            licenseNumber: 'SLMC11223',
            nic: '199234567890',
            qualifications: 'B.Pharm, Dip. Clinical Pharmacy',
            yearsOfExperience: 3,
            pharmacyBranch: 'Colombo Central',
            specialization: 'Hospital Pharmacy'
        }
    ]);

    const handleApprovePharmacist = (id) => {
        setPendingPharmacists(pendingPharmacists.filter(p => p._id !== id));
        toast.success('Pharmacist approved successfully!');
    };

    const handleRejectPharmacist = (id) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        setPendingPharmacists(pendingPharmacists.filter(p => p._id !== id));
        toast.success('Pharmacist rejected');
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-blue-600">🏥 Viduz Pharmacy - Admin</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
                    <p className="text-gray-600 mt-2">Manage your pharmacy system</p>
                </div>

                {/* Statistics Cards - All Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <button
                        onClick={() => toast.info('Viewing all users')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
                            </div>
                            <Users className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span className="text-green-600">↑ {stats.users.customers}</span> Customers
                        </div>
                    </button>

                    <button
                        onClick={() => toast.info('Viewing all products')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.products.total}</p>
                            </div>
                            <Package className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span className="text-red-600">⚠ {stats.products.lowStock}</span> Low Stock
                        </div>
                    </button>

                    <button
                        onClick={() => toast.info('Viewing all orders')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.orders.total}</p>
                            </div>
                            <ShoppingCart className="w-12 h-12 text-purple-600" />
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span className="text-blue-600">📦 {stats.orders.pending}</span> Pending
                        </div>
                    </button>

                    <button
                        onClick={() => toast.info('Viewing revenue reports')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    Rs. {stats.revenue.total.toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-orange-600" />
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span className="text-green-600">↑ This Month</span>
                        </div>
                    </button>
                </div>

                {/* Pending Pharmacist Approvals */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
                            Pending Pharmacist Approvals
                        </h3>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {pendingPharmacists.length} Pending
                        </span>
                    </div>

                    {pendingPharmacists.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">All pharmacists approved!</p>
                            <p className="text-gray-500 text-sm mt-2">No pending approvals at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingPharmacists.map((pharmacist) => (
                                <div
                                    key={pharmacist._id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-lg">
                                                {pharmacist.user.firstName} {pharmacist.user.lastName}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">{pharmacist.user.email}</p>
                                            <p className="text-sm text-gray-600">{pharmacist.user.phone}</p>

                                            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-blue-50 p-2 rounded">
                                                    <span className="text-gray-600">License:</span>{' '}
                                                    <span className="font-medium text-blue-900">{pharmacist.licenseNumber}</span>
                                                </div>
                                                <div className="bg-blue-50 p-2 rounded">
                                                    <span className="text-gray-600">NIC:</span>{' '}
                                                    <span className="font-medium text-blue-900">{pharmacist.nic}</span>
                                                </div>
                                                <div className="bg-green-50 p-2 rounded">
                                                    <span className="text-gray-600">Experience:</span>{' '}
                                                    <span className="font-medium text-green-900">{pharmacist.yearsOfExperience} years</span>
                                                </div>
                                                <div className="bg-green-50 p-2 rounded">
                                                    <span className="text-gray-600">Branch:</span>{' '}
                                                    <span className="font-medium text-green-900">{pharmacist.pharmacyBranch}</span>
                                                </div>
                                                <div className="col-span-2 bg-purple-50 p-2 rounded">
                                                    <span className="text-gray-600">Qualifications:</span>{' '}
                                                    <span className="font-medium text-purple-900">{pharmacist.qualifications}</span>
                                                </div>
                                                <div className="col-span-2 bg-indigo-50 p-2 rounded">
                                                    <span className="text-gray-600">Specialization:</span>{' '}
                                                    <span className="font-medium text-indigo-900">{pharmacist.specialization}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2 ml-4">
                                            <button
                                                onClick={() => handleApprovePharmacist(pharmacist._id)}
                                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                onClick={() => handleRejectPharmacist(pharmacist._id)}
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>Reject</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions - All Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => toast.info('Opening product management')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <Package className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
                        <p className="text-gray-600 text-sm">Add, edit, or remove products from inventory</p>
                        <div className="mt-4 text-blue-600 font-medium text-sm">Click to manage →</div>
                    </button>

                    <button
                        onClick={() => toast.info('Opening orders management')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <ShoppingCart className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">View Orders</h3>
                        <p className="text-gray-600 text-sm">Monitor and manage all customer orders</p>
                        <div className="mt-4 text-green-600 font-medium text-sm">Click to view →</div>
                    </button>

                    <button
                        onClick={() => toast.info('Opening reports section')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <FileText className="w-12 h-12 text-purple-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
                        <p className="text-gray-600 text-sm">Generate and download sales reports</p>
                        <div className="mt-4 text-purple-600 font-medium text-sm">Click to generate →</div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
