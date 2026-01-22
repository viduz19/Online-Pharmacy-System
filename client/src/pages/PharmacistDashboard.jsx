import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, prescriptionService, orderService } from '../services/api.service';
import toast from 'react-hot-toast';
import { FileText, CheckCircle, XCircle, DollarSign, LogOut, Package, Eye, RefreshCw } from 'lucide-react';

function PharmacistDashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser() || { firstName: 'Pharmacist' };
    const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [prescRes, orderRes] = await Promise.all([
                prescriptionService.getPendingPrescriptions(),
                orderService.getAllOrders()
            ]);
            if (prescRes.success) setPendingPrescriptions(prescRes.data || []);
            if (orderRes.success) setOrders(orderRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [reviewData, setReviewData] = useState({
        status: 'APPROVED',
        reviewNotes: '',
        items: [],
        deliveryFee: 300,
        rejectionReason: '',
    });

    const handleReviewPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        const items = prescription.requestedMedicines.map(med => ({
            productName: med.productName,
            quantity: med.quantity,
            price: 0,
        }));
        setReviewData({ ...reviewData, items, status: 'APPROVED', reviewNotes: '', rejectionReason: '' });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...reviewData.items];
        updatedItems[index][field] = field === 'price' || field === 'quantity' ? parseFloat(value) || 0 : value;
        setReviewData({ ...reviewData, items: updatedItems });
    };

    const calculateTotal = () => {
        const itemsTotal = reviewData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return itemsTotal + reviewData.deliveryFee;
    };

    const handleSubmitReview = async () => {
        if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason) {
            toast.error('Please provide a rejection reason');
            return;
        }

        if (reviewData.status === 'RE_UPLOAD_REQUESTED' && !reviewData.reviewNotes) {
            toast.error('Please explain why a re-upload is needed in notes');
            return;
        }

        if (reviewData.status === 'APPROVED' && reviewData.items.some(item => !item.price)) {
            toast.error('Please set prices for all items');
            return;
        }

        try {
            const payload = {
                status: reviewData.status,
                reviewNotes: reviewData.reviewNotes,
            };

            if (reviewData.status === 'APPROVED') {
                payload.items = reviewData.items;
                payload.deliveryFee = reviewData.deliveryFee;
                payload.totalAmount = calculateTotal();
            } else if (reviewData.status === 'REJECTED') {
                payload.rejectionReason = reviewData.rejectionReason;
            }

            const response = await prescriptionService.reviewPrescription(selectedPrescription._id, payload);

            if (response.success) {
                toast.success(`Prescription ${reviewData.status.toLowerCase().replace(/_/g, ' ')} successfully!`);
                setSelectedPrescription(null);
                fetchAllData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
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
                        <h1 className="text-2xl font-bold text-blue-600">🏥 Viduz Pharmacy - Pharmacist</h1>
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
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg p-8 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Welcome, Dr. {user.firstName}! 💊
                    </h2>
                    <p className="text-green-100">Review prescriptions and manage orders</p>
                </div>

                {/* Statistics - Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <button
                        onClick={() => toast.info('Showing pending reviews')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Reviews</p>
                                <p className="text-3xl font-bold text-gray-900">{pendingPrescriptions.length}</p>
                            </div>
                            <FileText className="w-12 h-12 text-yellow-600" />
                        </div>
                        <div className="mt-3 text-yellow-600 font-medium text-sm">Click to view →</div>
                    </button>

                    <button
                        onClick={() => toast.info('Showing orders to prepare')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Orders to Prepare</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {orders.filter(o => ['PAID', 'PREPARING'].includes(o.status)).length}
                                </p>
                            </div>
                            <Package className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="mt-3 text-blue-600 font-medium text-sm">Click to view →</div>
                    </button>

                    <button
                        onClick={() => toast.info('Showing completed orders')}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed Recently</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {orders.filter(o => o.status === 'DELIVERED').length}
                                </p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="mt-3 text-green-600 font-medium text-sm">Click to view →</div>
                    </button>
                </div>

                {/* Pending Prescriptions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Pending Prescription Reviews</h3>

                    {pendingPrescriptions.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">All prescriptions reviewed!</p>
                            <p className="text-gray-500 text-sm mt-2">No pending prescriptions at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingPrescriptions.map((prescription) => (
                                <div key={prescription._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <p className="font-semibold text-gray-900 text-lg">
                                                    {prescription.customer?.firstName} {prescription.customer?.lastName}
                                                </p>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                    New
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{prescription.customer?.email}</p>
                                            <p className="text-sm text-gray-600">{prescription.customer?.phone}</p>

                                            <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                                <p className="text-sm font-medium text-gray-900 mb-2">Requested Medicines:</p>
                                                {(prescription.requestedMedicines || []).map((med, idx) => (
                                                    <div key={idx} className="text-sm text-gray-700 mb-1">
                                                        <span className="font-medium">• {med.productName}</span> - Qty: {med.quantity}
                                                        {med.notes && <span className="text-gray-500 italic"> ({med.notes})</span>}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="flex items-center">
                                                    <FileText className="w-4 h-4 mr-1" />
                                                    {(prescription.files || []).length} file(s)
                                                </span>
                                                <span>
                                                    {prescription.createdAt ? new Date(prescription.createdAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                                </span>
                                            </div>

                                            {prescription.customerNotes && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm font-medium text-blue-900">Customer Note:</p>
                                                    <p className="text-sm text-blue-800 italic">{prescription.customerNotes}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4 flex flex-col space-y-2">
                                            {(prescription.files || []).map((file, fIdx) => (
                                                <a
                                                    key={fIdx}
                                                    href={`http://localhost:5000/uploads/prescriptions/${file.filename}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View {(file.originalName || 'File').length > 15 ? (file.originalName || 'File').substring(0, 12) + '...' : (file.originalName || 'File')}</span>
                                                </a>
                                            ))}
                                            <button
                                                onClick={() => handleReviewPrescription(prescription)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                                            >
                                                <DollarSign className="w-4 h-4" />
                                                <span>Review & Price</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Recent Orders Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Recent Customer Orders</h3>
                            <button
                                onClick={() => toast.info('Viewing all orders')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                View All Orders →
                            </button>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No orders found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Info</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.slice(0, 10).map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                                                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{order.customer?.firstName} {order.customer?.lastName}</div>
                                                    <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Rs. {order.total.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => toast.info(`Viewing details for ${order.orderNumber}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Review Prescription</h3>

                            {/* Customer Info & Prescriptions */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2 font-poppins">Customer Information</h4>
                                    <p className="text-sm text-gray-700">
                                        {selectedPrescription.customer.firstName} {selectedPrescription.customer.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600 font-poppins">{selectedPrescription.customer.email}</p>
                                    <p className="text-sm text-gray-600 font-poppins">{selectedPrescription.customer.phone}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2 font-poppins">Prescription Files</h4>
                                    <div className="space-y-2">
                                        {selectedPrescription.files && selectedPrescription.files.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={`http://localhost:5000/uploads/prescriptions/${file.filename}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline flex items-center"
                                            >
                                                <FileText className="w-4 h-4 mr-2" />
                                                {file.originalName}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Review Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setReviewData({ ...reviewData, status: 'APPROVED' })}
                                        className={`py-3 rounded-lg font-medium transition-all flex items-center justify-center ${reviewData.status === 'APPROVED'
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setReviewData({ ...reviewData, status: 'RE_UPLOAD_REQUESTED' })}
                                        className={`py-3 rounded-lg font-medium transition-all flex items-center justify-center ${reviewData.status === 'RE_UPLOAD_REQUESTED'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <RefreshCw className="w-5 h-5 mr-2" />
                                        Request Re-upload
                                    </button>
                                    <button
                                        onClick={() => setReviewData({ ...reviewData, status: 'REJECTED' })}
                                        className={`py-3 rounded-lg font-medium transition-all flex items-center justify-center ${reviewData.status === 'REJECTED'
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            {/* Approval Section */}
                            {reviewData.status === 'APPROVED' && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                                        Set Prices for Each Medicine
                                    </h4>
                                    <div className="space-y-3">
                                        {reviewData.items.map((item, index) => (
                                            <div key={index} className="grid grid-cols-3 gap-4 items-center bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-600 mb-1 block">Price per unit (Rs.)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={item.price || ''}
                                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-600 mb-1">Subtotal</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-medium text-gray-700">Delivery Fee:</span>
                                            <input
                                                type="number"
                                                value={reviewData.deliveryFee}
                                                onChange={(e) => setReviewData({ ...reviewData, deliveryFee: parseFloat(e.target.value) || 0 })}
                                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-bold pt-3 border-t">
                                            <span className="text-gray-900">Total Amount:</span>
                                            <span className="text-green-600">Rs. {calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rejection Section */}
                            {reviewData.status === 'REJECTED' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason *
                                    </label>
                                    <textarea
                                        value={reviewData.rejectionReason}
                                        onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                        placeholder="Explain why the prescription is being rejected..."
                                    />
                                </div>
                            )}

                            {/* Review Notes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={reviewData.reviewNotes}
                                    onChange={(e) => setReviewData({ ...reviewData, reviewNotes: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Any additional information for the customer..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleSubmitReview}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Submit Review & Send to Customer
                                </button>
                                <button
                                    onClick={() => setSelectedPrescription(null)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PharmacistDashboard;
