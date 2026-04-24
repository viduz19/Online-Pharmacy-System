import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api.service';
import CustomerLayout from '../components/layout/CustomerLayout';
import { 
    ArrowLeft, 
    Package, 
    MapPin, 
    CreditCard, 
    Clock, 
    CheckCircle, 
    Truck, 
    AlertCircle,
    Download,
    MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await orderService.getOrder(orderId);
            if (response.success) {
                setOrder(response.data);
            } else {
                toast.error('Order not found');
                navigate('/customer/orders');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = [
            'PENDING_REVIEW',
            'APPROVED',
            'AWAITING_PAYMENT',
            'PAID',
            'PREPARING',
            'READY_FOR_DELIVERY',
            'OUT_FOR_DELIVERY',
            'DELIVERED'
        ];
        return steps.indexOf(status);
    };

    const handleWhatsAppInquiry = () => {
        const phoneNumber = '+94771234567'; // Placeholder
        const message = `Hello, I'm inquiring about my order #${order?.orderNumber}. Status: ${order?.status}.`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </CustomerLayout>
        );
    }

    if (!order) return null;

    const currentStep = getStatusStep(order.status);

    return (
        <CustomerLayout>
            <div className="max-w-4xl mx-auto">
                <Link 
                    to="/customer/orders" 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Orders
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-white to-gray-50">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                    order.status === 'CANCELLED' || order.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={handleWhatsAppInquiry}
                                className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl border border-green-100 hover:bg-green-100 transition-all text-sm"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Support
                            </button>
                            {order.status === 'AWAITING_PAYMENT' && (
                                <Link 
                                    to={`/checkout/${order._id}`}
                                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-all text-sm"
                                >
                                    Pay Now
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    {order.status !== 'CANCELLED' && order.status !== 'REJECTED' && (
                        <div className="p-8 bg-white border-b border-gray-50">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Order Status Timeline</h3>
                            <div className="relative flex justify-between">
                                {/* Track Line */}
                                <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 -z-0">
                                    <div 
                                        className="h-full bg-blue-500 transition-all duration-1000 ease-in-out" 
                                        style={{ width: `${(currentStep / 7) * 100}%` }}
                                    ></div>
                                </div>

                                {[
                                    { label: 'Confirmed', step: 0, icon: Package },
                                    { label: 'Payment', step: 3, icon: CreditCard },
                                    { label: 'Processing', step: 4, icon: Clock },
                                    { label: 'Shipping', step: 6, icon: Truck },
                                    { label: 'Delivered', step: 7, icon: CheckCircle }
                                ].map((milestone, idx) => {
                                    const isCompleted = currentStep >= milestone.step;
                                    const isCurrent = currentStep === milestone.step;
                                    
                                    return (
                                        <div key={idx} className="relative flex flex-col items-center group">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 ${
                                                isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                                            } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                                                <milestone.icon className="w-4 h-4" />
                                            </div>
                                            <span className={`mt-3 text-[10px] font-bold uppercase tracking-tighter ${
                                                isCompleted ? 'text-blue-600' : 'text-gray-400'
                                            }`}>
                                                {milestone.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Items Section */}
                        <div className="p-8 border-r border-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold border border-gray-100">
                                                {item.productName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{item.productName}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.price}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>Rs. {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Delivery Fee</span>
                                    <span>Rs. {order.deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-blue-600">Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-8 bg-gray-50/30">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Delivery Address
                                    </h3>
                                    <div className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <p className="font-bold">{order.customer?.firstName} {order.customer?.lastName}</p>
                                        <p>{order.deliveryAddress.street}</p>
                                        <p>{order.deliveryAddress.city}, {order.deliveryAddress.province}</p>
                                        <p>{order.deliveryAddress.postalCode}</p>
                                        <p className="mt-2 font-medium">📞 {order.deliveryAddress.contactPhone}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Payment Method
                                    </h3>
                                    <div className="flex items-center space-x-3 text-sm text-gray-700 font-semibold bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                        <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                                        <span className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                                            order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                {order.pharmacistNotes && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Notes from Pharmacist
                                        </h3>
                                        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-sm italic">
                                            "{order.pharmacistNotes}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

export default OrderDetails;
