import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api.service';
import CustomerLayout from '../components/layout/CustomerLayout';
import { Package, Search, Filter, Eye, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function CustomerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getMyOrders();
            if (response.success) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            APPROVED: 'bg-green-100 text-green-800 border-green-200',
            AWAITING_PAYMENT: 'bg-blue-100 text-blue-800 border-blue-200',
            PAID: 'bg-purple-100 text-purple-800 border-purple-200',
            PREPARING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            READY_FOR_DELIVERY: 'bg-teal-100 text-teal-800 border-teal-200',
            OUT_FOR_DELIVERY: 'bg-blue-100 text-blue-800 border-blue-200',
            DELIVERED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-red-100 text-red-800 border-red-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED': 
            case 'REJECTED': return <XCircle className="w-4 h-4" />;
            case 'AWAITING_PAYMENT': return <Clock className="w-4 h-4 animate-pulse" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const filteredOrders = filter === 'ALL' 
        ? orders 
        : orders.filter(order => order.status === filter);

    return (
        <CustomerLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-1">Track and manage your medical orders</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm appearance-none min-w-[150px]"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING_REVIEW">Pending Review</option>
                                <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                                <option value="PAID">Paid</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            {filter === 'ALL' 
                                ? "You haven't placed any orders yet. Start shopping for your health needs today!" 
                                : `No orders with status ${filter.replace(/_/g, ' ')} were found.`}
                        </p>
                        <Link 
                            to="/products" 
                            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div 
                                key={order._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end space-y-2">
                                            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span>{order.status.replace(/_/g, ' ')}</span>
                                            </span>
                                            <p className="text-lg font-bold text-gray-900">Rs. {order.total.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-50 pt-6">
                                        <div className="col-span-2">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                                            <div className="space-y-2">
                                                {order.items.slice(0, 2).map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-700 font-medium">{item.productName}</span>
                                                        <span className="text-gray-500">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <p className="text-sm text-blue-600 font-medium">+{order.items.length - 2} more items</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex md:justify-end items-center">
                                            <Link 
                                                to={`/customer/orders/${order._id}`}
                                                className="inline-flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-200"
                                            >
                                                <span>View Details</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    {order.status === 'AWAITING_PAYMENT' && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                                            <div className="flex items-center space-x-3 text-blue-800">
                                                <AlertCircle className="w-5 h-5" />
                                                <p className="text-sm font-medium">Payment is required to process this order.</p>
                                            </div>
                                            <Link 
                                                to={`/checkout/${order._id}`}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Pay Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}

export default CustomerOrders;
