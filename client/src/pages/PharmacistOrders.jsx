import { useState, useEffect } from 'react';
import { pharmacistService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    ShoppingCart, 
    Search, 
    Filter, 
    MoreVertical, 
    Eye, 
    MessageSquare, 
    Truck, 
    Package, 
    CheckCircle, 
    Clock, 
    X,
    ChevronRight,
    ExternalLink,
    MapPin,
    Calendar,
    User,
    CreditCard
} from 'lucide-react';
import PharmacistLayout from '../components/layout/PharmacistLayout';

function PharmacistOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await pharmacistService.getOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdateLoading(true);
        try {
            const response = await pharmacistService.updateOrderStatus(orderId, { status: newStatus });
            if (response.success) {
                toast.success(`Order set to ${newStatus}`);
                fetchOrders();
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(response.data);
                }
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleWhatsAppContact = (order, type = 'status') => {
        const phone = order.customer.phone.replace(/[^0-9]/g, '');
        const name = `${order.customer.firstName} ${order.customer.lastName}`;
        const orderId = order.orderNumber;
        
        let message = `Hello ${name}, this is Viduz Pharmacy regarding your order #${orderId}. `;
        if (type === 'ready') {
            message += `Your order is now ready for delivery. Our rider will contact you shortly.`;
        } else if (type === 'preparing') {
            message += `We are currently preparing your medicines. We will notify you once it's out for delivery.`;
        }
        
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'bg-green-500 text-white shadow-green-100';
            case 'PREPARING': return 'bg-blue-500 text-white shadow-blue-100';
            case 'READY_FOR_DELIVERY': return 'bg-purple-500 text-white shadow-purple-100';
            case 'OUT_FOR_DELIVERY': return 'bg-orange-500 text-white shadow-orange-100';
            case 'DELIVERED': return 'bg-emerald-600 text-white shadow-emerald-100';
            case 'AWAITING_PAYMENT': return 'bg-yellow-500 text-white shadow-yellow-100';
            default: return 'bg-gray-400 text-white shadow-gray-100';
        }
    };

    return (
        <PharmacistLayout>
            <div className="space-y-8 font-poppins">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
                            Order Fulfillment
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium italic">Track, manage and dispatch customer medicine orders</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search order ID or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 pr-4 py-3 bg-transparent border-none rounded-xl focus:ring-0 text-sm font-medium w-64"
                                />
                            </div>
                            <div className="h-6 w-[1.5px] bg-gray-100 mx-2"></div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-gray-500 px-4 cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PAID">Paid</option>
                                <option value="PREPARING">Preparing</option>
                                <option value="READY_FOR_DELIVERY">Ready</option>
                                <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">No Orders Found</h3>
                        <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto text-sm italic">Change your filters or search criteria to find specific orders.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredOrders.map((order) => (
                            <div 
                                key={order._id}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 group cursor-pointer"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-5">
                                        <div className={`p-4 rounded-2xl ${getStatusColor(order.status)} flex items-center justify-center shadow-lg`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <span className="text-sm font-bold text-gray-900 uppercase">#{order.orderNumber}</span>
                                                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm font-medium text-gray-500">
                                                <p className="font-bold text-gray-800">{order.customer?.firstName} {order.customer?.lastName}</p>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                <p className="text-xs">{order.items.length} product(s)</p>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                <p className="text-blue-600 font-bold">Rs. {order.total.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden lg:flex items-center space-x-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                            <span className={`text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {order.paymentStatus === 'PAID' ? 'Confirmed' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                                            <p className="text-xs font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end space-x-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleWhatsAppContact(order); }}
                                            className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366] hover:text-white transition-all active:scale-90"
                                        >
                                            <MessageSquare className="w-5 h-5 fill-current" />
                                        </button>
                                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all active:scale-95">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Drawer / Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col font-poppins animate-in slide-in-from-right duration-500">
                        
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center space-x-4">
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white rounded-xl shadow-sm border border-gray-100 transition-all active:scale-95">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 font-poppins antialiased">Order #{selectedOrder.orderNumber}</h3>
                                    <p className="text-xs text-gray-500 font-medium">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status.replace(/_/g, ' ')}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-thumb-gray-100">
                            
                            {/* Customer & Shipping Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center">
                                        <User className="w-3.5 h-3.5 mr-2" /> Customer Information
                                    </h4>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <p className="font-bold text-gray-900 text-lg mb-1">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                                        <p className="text-sm text-gray-500 font-medium mb-4">{selectedOrder.customer?.email}</p>
                                        <div className="flex items-center text-gray-900 font-bold text-sm bg-white p-3 rounded-2xl shadow-sm inline-flex">
                                            <Phone className="w-4 h-4 mr-2 text-green-500" />
                                            {selectedOrder.customer?.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest flex items-center">
                                        <MapPin className="w-3.5 h-3.5 mr-2" /> Delivery Address
                                    </h4>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <p className="text-sm text-gray-800 font-medium leading-relaxed italic">
                                            {selectedOrder.deliveryAddress?.addressLine1}, {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                    <Package className="w-3.5 h-3.5 mr-2" /> Ordered Prescription / Medicines
                                </h4>
                                <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-5 bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-all last:border-b-0">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm tracking-tight">{item.product?.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-extrabold text-gray-900 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div className="bg-gray-900 p-6 flex items-center justify-between text-white">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount Paid</p>
                                        <p className="text-2xl font-extrabold tracking-tighter italic">Rs. {selectedOrder.total.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Workflow */}
                            <div className="space-y-6 pt-4">
                                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Workflow Management</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'PREPARING', label: 'Start Preparing', icon: Package, color: 'bg-blue-600', activeStatus: 'PREPARING' },
                                        { id: 'READY_FOR_DELIVERY', label: 'Pack & Ready', icon: CheckCircle, color: 'bg-purple-600', activeStatus: 'READY_FOR_DELIVERY' },
                                        { id: 'OUT_FOR_DELIVERY', label: 'Dispatch Order', icon: Truck, color: 'bg-orange-600', activeStatus: 'OUT_FOR_DELIVERY' },
                                        { id: 'DELIVERED', label: 'Confirm Delivery', icon: CheckCircle, color: 'bg-green-600', activeStatus: 'DELIVERED' },
                                    ].map((action) => (
                                        <button
                                            key={action.id}
                                            disabled={updateLoading || selectedOrder.status === action.id}
                                            onClick={() => handleUpdateStatus(selectedOrder._id, action.id)}
                                            className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                                                selectedOrder.status === action.id 
                                                    ? 'bg-gray-900 border-transparent text-white' 
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/30'
                                            } disabled:opacity-50`}
                                        >
                                            <action.icon className="w-5 h-5 shrink-0" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 border-t border-gray-100 flex space-x-3 bg-gray-50/30">
                            <button 
                                onClick={() => handleWhatsAppContact(selectedOrder, 'status')}
                                className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                            >
                                <MessageSquare className="w-4 h-4 fill-white" />
                                <span>WhatsApp Contact</span>
                            </button>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-8 bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 mt-0 transition-all text-xs uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PharmacistLayout>
    );
}

export default PharmacistOrders;
