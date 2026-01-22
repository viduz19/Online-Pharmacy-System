import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api.service';
import toast from 'react-hot-toast';
import { CreditCard, Package, MapPin, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

function Checkout() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            // If No Order ID, we might be coming from the Cart
            // But for now, let's focus on the Prescription Checkout as requested
            navigate('/cart');
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await orderService.getOrder(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        setProcessing(true);
        try {
            // Simulate payment or just update status to PAID if COD
            const payload = {
                status: paymentMethod === 'COD' ? 'PAID' : 'PAID', // Simplified for now
                note: `Order confirmed via checkout with ${paymentMethod}`
            };

            const response = await orderService.updateOrderStatus(orderId, payload);

            if (response.success) {
                toast.success('Order placed successfully!');
                navigate('/customer/dashboard');
            }
        } catch (error) {
            toast.error('Payment processing failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-600 mb-4">Order not found</p>
                <button
                    onClick={() => navigate('/customer/dashboard')}
                    className="text-blue-600 font-medium"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/customer/dashboard')}
                        className="mr-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Summary & Delivery */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                Order Items
                            </h3>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="py-4 flex justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product?.name || 'Medicine'}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} x Rs. {item.price}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">Rs. {item.subtotal.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Delivery Address
                            </h3>
                            <div className="text-gray-700 space-y-1">
                                <p>{order.deliveryAddress.street}</p>
                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.province}</p>
                                <p>{order.deliveryAddress.postalCode}</p>
                                <p className="flex items-center mt-2 text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {order.deliveryAddress.contactPhone}
                                </p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                                Payment Method
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center transition-all ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-blue-500' : 'border-gray-300'}`}>
                                            {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Pay when you receive</p>
                                        </div>
                                    </div>
                                </label>
                                <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center transition-all ${paymentMethod === 'ONLINE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 opacity-50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ONLINE"
                                        disabled
                                        checked={paymentMethod === 'ONLINE'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-blue-500' : 'border-gray-300'}`}>
                                            {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Online Payment</p>
                                            <p className="text-xs text-gray-500">Coming soon</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Billing */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Bill Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>Rs. {order.deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-blue-600 pt-4 border-t">
                                    <span>Total</span>
                                    <span>Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmPayment}
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
                            >
                                {processing ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Confirm Order & Pay</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                This is a prescription-based order reviewed by our pharmacist.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
