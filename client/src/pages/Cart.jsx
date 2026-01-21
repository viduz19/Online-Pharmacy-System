import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService, orderService } from '../services/api.service';
import toast from 'react-hot-toast';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const user = authService.getCurrentUser();

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            toast.error('Please login to checkout');
            return;
        }

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: getCartTotal(),
                shippingAddress: user.address,
                paymentMethod: 'CASH_ON_DELIVERY' // Default for now
            };

            const response = await orderService.createOrder(orderData);
            if (response.success) {
                toast.success('Order placed successfully!');
                clearCart();
                navigate('/customer/dashboard');
            }
        } catch (error) {
            toast.error('Failed to place order');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-8 text-center max-w-md">Looks like you haven't added any medicines to your cart yet.</p>
                <Link
                    to="/products"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/products')}
                        className="mr-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.dosageForm} - {item.strength}</p>
                                    <p className="text-blue-600 font-bold mt-1">Rs. {item.price}</p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-200 transition-colors text-gray-600"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {getCartTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>Rs. 300.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-blue-600 pt-4 border-t">
                                    <span>Total</span>
                                    <span>Rs. {(getCartTotal() + 300).toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center space-x-2 shadow-md"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Proceed to Checkout</span>
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                By proceeding, you agree to our terms of service and delivery policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
