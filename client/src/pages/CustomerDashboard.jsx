import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, orderService, prescriptionService } from '../services/api.service';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { ShoppingCart, Upload, Package, User, LogOut, FileText, CreditCard, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

function CustomerDashboard() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const user = authService.getCurrentUser() || { firstName: 'Customer' };
    const [orders, setOrders] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, prescriptionsRes] = await Promise.all([
                orderService.getMyOrders(),
                prescriptionService.getMyPrescriptions()
            ]);

            if (ordersRes.success) setOrders(ordersRes.data || []);
            if (prescriptionsRes.success) setPrescriptions(prescriptionsRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800 border border-green-200',
            AWAITING_PAYMENT: 'bg-blue-100 text-blue-800 animate-pulse',
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

    const handleConfirmOrder = async (prescriptionId) => {
        try {
            const response = await prescriptionService.confirmPrescriptionOrder(prescriptionId);
            if (response.success) {
                toast.success('Order confirmed! Proceeding to checkout...');
                // fetchDashboardData(); // No need to fetch if we are navigating
                const orderId = response.data._id;
                navigate(`/checkout/${orderId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm order');
        }
    };

    const handleCartCheckout = async () => {
        if (cartItems.length === 0) return;
        setIsCheckingOut(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: getCartTotal(),
                deliveryAddress: user.address || {
                    street: '',
                    city: '',
                    province: '',
                    postalCode: '',
                    contactPhone: '',
                },
                paymentMethod: 'COD'
            };

            const response = await orderService.createOrder(orderData);
            if (response.success) {
                toast.success('Order placed successfully!');
                clearCart();
                fetchDashboardData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold text-blue-600">🏥 Viduz Pharmacy</Link>
                        <div className="flex items-center space-x-6">
                            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                Products
                            </Link>

                            {/* Cart Icon with Badge */}
                            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                                <ShoppingCart className="w-6 h-6" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                        {getCartCount()}
                                    </span>
                                )}
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

                {/* Current Cart Section */}
                {cartItems.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-600">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
                                Items in Your Cart
                            </h3>
                            <Link to="/cart" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                Edit Cart <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.price}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 rounded-lg p-6 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-4">Order Summary</h4>
                                    <div className="flex justify-between text-blue-800 mb-2">
                                        <span>Subtotal</span>
                                        <span>Rs. {getCartTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-blue-800 mb-4">
                                        <span>Delivery Fee</span>
                                        <span>Rs. 300</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-blue-900 border-t border-blue-200 pt-3">
                                        <span>Total</span>
                                        <span>Rs. {(getCartTotal() + 300).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCartCheckout}
                                    disabled={isCheckingOut}
                                    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-md disabled:bg-blue-400"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>{isCheckingOut ? 'Placing Order...' : 'Checkout Now'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                                Total: Rs. {order.total.toLocaleString()}
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
                                                {(prescription.files || []).length} file(s) uploaded
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
                                                        Total Amount: Rs. {prescription.order.total.toLocaleString()}
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
