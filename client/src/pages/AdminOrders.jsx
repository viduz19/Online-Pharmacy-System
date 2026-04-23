import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { orderService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    Search, 
    Filter, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Truck, 
    PackageCheck,
    CreditCard
} from 'lucide-react';

const statusColors = {
    'PENDING_REVIEW': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-blue-100 text-blue-800',
    'AWAITING_PAYMENT': 'bg-purple-100 text-purple-800',
    'PAID': 'bg-green-100 text-green-800',
    'PREPARING': 'bg-indigo-100 text-indigo-800',
    'READY_FOR_DELIVERY': 'bg-cyan-100 text-cyan-800',
    'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800',
    'DELIVERED': 'bg-emerald-100 text-emerald-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'REJECTED': 'bg-rose-100 text-rose-800',
};

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                status: statusFilter === 'all' ? '' : statusFilter,
                search: searchTerm
            };
            const response = await orderService.getAllOrders(params);
            if (response.success) {
                setOrders(response.data);
                setTotalPages(response.pagination.pages);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await orderService.updateOrderStatus(orderId, { status: newStatus });
            if (response.success) {
                toast.success(`Order updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Orders Management</h2>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search by Order ID..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </form>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="PENDING_REVIEW">Pending Review</option>
                            <option value="PAID">Paid</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[11px] tracking-wider">Order Detail</th>
                                <th className="px-6 py-4 font-semibold text-[11px] tracking-wider">Customer</th>
                                <th className="px-6 py-4 font-semibold text-[11px] tracking-wider">Total</th>
                                <th className="px-6 py-4 font-semibold text-[11px] tracking-wider">Payment</th>
                                <th className="px-6 py-4 font-semibold text-[11px] tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-[11px] tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        No orders found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{order.orderNumber}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.customer?.firstName} {order.customer?.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">Rs. {order.total.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                                    order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {order.paymentStatus}
                                                </span>
                                                <span className="text-[10px] text-gray-500 ml-1">{order.paymentMethod}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors" title="View Details">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                
                                                {order.status === 'PAID' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order._id, 'PREPARING')}
                                                        className="text-indigo-600 hover:text-indigo-800"
                                                        title="Start Preparing"
                                                    >
                                                        <Clock className="w-5 h-5" />
                                                    </button>
                                                )}
                                                
                                                {order.status === 'PREPARING' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order._id, 'OUT_FOR_DELIVERY')}
                                                        className="text-orange-600 hover:text-orange-800"
                                                        title="Out for Delivery"
                                                    >
                                                        <Truck className="w-5 h-5" />
                                                    </button>
                                                )}

                                                {order.status === 'OUT_FOR_DELIVERY' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order._id, 'DELIVERED')}
                                                        className="text-emerald-600 hover:text-emerald-800"
                                                        title="Mark Delivered"
                                                    >
                                                        <PackageCheck className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold">{(page-1)*10 + 1}</span> to <span className="font-semibold">{Math.min(page*10, orders.length)}</span> orders
                    </p>
                    <div className="flex space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminOrders;
