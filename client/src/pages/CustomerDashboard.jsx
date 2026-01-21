import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';
import { ShoppingCart, Upload, Package, User, LogOut, FileText, CreditCard } from 'lucide-react';

function CustomerDashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser() || { firstName: 'Customer' };

    // Dummy Orders Data
    const [orders] = useState([
        {
            _id: '1',
            orderNumber: 'ORD-2026-001',
            items: [
                { productName: 'Panadol 500mg', quantity: 2 },
                { productName: 'Vitamin C', quantity: 1 }
            ],
            totalAmount: 940,
            status: 'DELIVERED',
            createdAt: '2026-01-15T10:30:00Z'
        },
        {
            _id: '2',
            orderNumber: 'ORD-2026-002',
            items: [
                { productName: 'Samahan', quantity: 5 }
            ],
            totalAmount: 425,
            status: 'PREPARING',
            createdAt: '2026-01-18T14:20:00Z'
        },
        {
            _id: '3',
            orderNumber: 'ORD-2026-003',
            items: [
                { productName: 'Piriton 4mg', quantity: 1 },
                { productName: 'ORS Sachets', quantity: 3 }
            ],
            totalAmount: 380,
            status: 'PENDING',
            createdAt: '2026-01-20T09:15:00Z'
        }
    ]);

    // Dummy Prescriptions Data
    const [prescriptions] = useState([
        {
            _id: '1',
            requestedMedicines: [
                { productName: 'Amoxicillin 500mg', quantity: 10 },
                { productName: 'Azithromycin 500mg', quantity: 6 }
            ],
            prescriptionFiles: ['prescription1.pdf', 'prescription2.jpg'],
            status: 'APPROVED',
            createdAt: '2026-01-19T11:00:00Z',
            order: {
                totalAmount: 1200
            }
        },
        {
            _id: '2',
            requestedMedicines: [
                { productName: 'Metformin 500mg', quantity: 30 }
            ],
            prescriptionFiles: ['prescription3.pdf'],
            status: 'PENDING_REVIEW',
            createdAt: '2026-01-21T08:30:00Z'
        }
    ]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            AWAITING_PAYMENT: 'bg-blue-100 text-blue-800',
            PAID: 'bg-purple-100 text-purple-800',
            PREPARING: 'bg-indigo-100 text-indigo-800',
            READY_FOR_DELIVERY: 'bg-teal-100 text-teal-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            REJECTED: 'bg-red-100 text-red-800',
            PENDING: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleConfirmOrder = (prescriptionId) => {
        toast.success('Order confirmed! Proceeding to payment...');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-blue-600">🏥 Viduz Pharmacy</h1>
                        <div className="flex items-center space-x-4">
                            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
                                Products
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Welcome back, {user.firstName}! 👋
                    </h2>
                    <p className="text-blue-100">Manage your orders and prescriptions</p>
                </div>

                {/* Quick Actions - All Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Link
                        to="/products"
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-center"
                    >
                        <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900">Browse Products</h3>
                        <p className="text-sm text-gray-600 mt-1">Shop OTC medicines</p>
                        <div className="mt-3 text-blue-600 font-medium text-sm">Click to browse →</div>
                    </Link>

                    <Link
                        to="/customer/upload-prescription"
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-center"
                    >
                        <Upload className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900">Upload Prescription</h3>
                        <p className="text-sm text-gray-600 mt-1">Get prescription meds</p>
                        <div className="mt-3 text-green-600 font-medium text-sm">Click to upload →</div>
                    </Link>

                    <button
                        onClick={() => toast.info('Viewing all orders')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-center"
                    >
                        <Package className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900">My Orders</h3>
                        <p className="text-sm text-gray-600 mt-1">Track your orders</p>
                        <div className="mt-3 text-purple-600 font-medium text-sm">Click to view →</div>
                    </button>

                    <button
                        onClick={() => toast.info('Opening profile settings')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-center"
                    >
                        <User className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                        <p className="text-sm text-gray-600 mt-1">Update your info</p>
                        <div className="mt-3 text-orange-600 font-medium text-sm">Click to edit →</div>
                    </button>
                </div>

                {/* Recent Orders - Clickable */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                        <button
                            onClick={() => toast.info('Viewing all orders')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All →
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No orders yet</p>
                            <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                                Start shopping →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <button
                                    key={order._id}
                                    onClick={() => toast.info(`Viewing order ${order.orderNumber}`)}
                                    className="w-full border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                                            <div className="mt-2 space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <p key={idx} className="text-sm text-gray-600">
                                                        • {item.productName} x{item.quantity}
                                                    </p>
                                                ))}
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mt-2">
                                                Total: Rs. {order.totalAmount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Prescription Requests - Clickable */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Prescription Requests</h3>
                        <button
                            onClick={() => toast.info('Viewing all prescriptions')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All →
                        </button>
                    </div>

                    {prescriptions.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No prescription requests</p>
                            <Link to="/customer/upload-prescription" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                                Upload prescription →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {prescriptions.map((prescription) => (
                                <div key={prescription._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {prescription.requestedMedicines.length} medicine(s) requested
                                            </p>
                                            <div className="mt-2 space-y-1">
                                                {prescription.requestedMedicines.map((med, idx) => (
                                                    <p key={idx} className="text-sm text-gray-600">
                                                        • {med.productName} - Qty: {med.quantity}
                                                    </p>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {prescription.prescriptionFiles.length} file(s) uploaded
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                                            {prescription.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    {prescription.status === 'APPROVED' && prescription.order && (
                                        <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-green-900">
                                                        ✓ Prescription Approved!
                                                    </p>
                                                    <p className="text-sm text-green-800 mt-1">
                                                        Total Amount: Rs. {prescription.order.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleConfirmOrder(prescription._id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>Confirm Order</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerDashboard;
