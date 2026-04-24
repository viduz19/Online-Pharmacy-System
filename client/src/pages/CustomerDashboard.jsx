import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, orderService, prescriptionService } from '../services/api.service';
import { useCart } from '../context/CartContext';
import CustomerLayout from '../components/layout/CustomerLayout';
import toast from 'react-hot-toast';
import { 
    ShoppingCart, 
    Upload, 
    Package, 
    User, 
    FileText, 
    CreditCard, 
    Trash2, 
    Plus, 
    Minus, 
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle,
    ChevronRight,
    MessageCircle
} from 'lucide-react';

function CustomerDashboard() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, getCartCount, removeFromCart, updateQuantity, clearCart } = useCart();
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

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Orders', value: orders.filter(o => !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.status)).length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Prescriptions', value: prescriptions.length, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Approved', value: prescriptions.filter(p => p.status === 'APPROVED').length, icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <CustomerLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-teal-700 rounded-[2rem] shadow-2xl p-10 text-white">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-3">
                            Hello, {user.firstName}! 👋
                        </h2>
                        <p className="text-blue-100 text-lg font-medium max-w-md">
                            Your health is our priority. Track your medical supplies and prescriptions here.
                        </p>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h4>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Recent Orders & Prescriptions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Package className="w-6 h-6 mr-3 text-green-600" />
                                    Recent Orders
                                </h3>
                                <Link to="/customer/orders" className="text-green-600 hover:text-blue-700 text-sm font-black flex items-center group">
                                    View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="p-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-10">
                                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">No orders yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.slice(0, 3).map((order) => (
                                            <div 
                                                key={order._id}
                                                onClick={() => navigate(`/customer/orders/${order._id}`)}
                                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-green-600 font-bold border border-blue-100">
                                                        #{order.orderNumber.slice(-3)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">Order #{order.orderNumber}</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-900 text-sm">Rs. {order.total.toLocaleString()}</p>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${getStatusColor(order.status)}`}>
                                                        {order.status.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Prescriptions */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <FileText className="w-6 h-6 mr-3 text-green-600" />
                                    Prescription Status
                                </h3>
                                <Link to="/customer/prescriptions" className="text-green-600 hover:text-green-700 text-sm font-black flex items-center group">
                                    View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="p-4">
                                {prescriptions.length === 0 ? (
                                    <div className="text-center py-10">
                                        <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">No prescriptions found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {prescriptions.slice(0, 3).map((pres) => (
                                            <div 
                                                key={pres._id}
                                                onClick={() => navigate(`/customer/prescriptions/${pres._id}`)}
                                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {pres.requestedMedicines.length > 0 ? pres.requestedMedicines[0].productName : 'Prescription Request'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{new Date(pres.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(pres.status)}`}>
                                                        {pres.status}
                                                    </span>
                                                    {pres.status === 'APPROVED' && (
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Cart Quick View & Support */}
                    <div className="space-y-8">
                        {/* Cart Summary */}
                        {cartItems.length > 0 && (
                            <div className="bg-white rounded-[2rem] shadow-xl border-t-4 border-blue-600 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <ShoppingCart className="w-6 h-6 mr-2 text-green-600" />
                                    Shopping Cart
                                </h3>
                                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center text-sm">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-black text-gray-900 ml-4">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-6 space-y-3">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-bold">Rs. {getCartTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                                        <span>Total</span>
                                        <span className="text-green-600 font-black">Rs. {(getCartTotal() + 300).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCartCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full mt-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center space-x-2 disabled:bg-blue-300"
                                >
                                    {isCheckingOut ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            <span>Checkout Now</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Quick Help */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl">
                            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Chat with our registered pharmacists regarding medicine availability or dosage.
                            </p>
                            <button 
                                onClick={() => {
                                    const phoneNumber = '+94771234567';
                                    const message = 'Hello, I need assistance with my medical order.';
                                    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                                }}
                                className="w-full py-4 bg-[#25D366] text-white font-black rounded-2xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-green-900/20"
                            >
                                <MessageCircle className="w-6 h-6" />
                                <span>WhatsApp Us</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

export default CustomerDashboard;
