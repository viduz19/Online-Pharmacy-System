import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';
import { FileText, CheckCircle, XCircle, DollarSign, LogOut, Package, Eye } from 'lucide-react';

function PharmacistDashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser() || { firstName: 'Pharmacist' };

    // Dummy Pending Prescriptions Data
    const [pendingPrescriptions, setPendingPrescriptions] = useState([
        {
            _id: '1',
            customer: {
                firstName: 'Kasun',
                lastName: 'Perera',
                email: 'kasun.perera@gmail.com',
                phone: '+94771234567'
            },
            requestedMedicines: [
                { productName: 'Amoxicillin 500mg', quantity: 10, notes: 'Take after meals' },
                { productName: 'Azithromycin 500mg', quantity: 6, notes: '3-day course' }
            ],
            prescriptionFiles: ['prescription1.pdf', 'prescription2.jpg'],
            customerNotes: 'Need urgently. Please deliver in the evening after 5 PM.',
            createdAt: '2026-01-21T09:00:00Z'
        },
        {
            _id: '2',
            customer: {
                firstName: 'Nimal',
                lastName: 'Silva',
                email: 'nimal.silva@gmail.com',
                phone: '+94712345678'
            },
            requestedMedicines: [
                { productName: 'Metformin 500mg', quantity: 30, notes: 'For diabetes' }
            ],
            prescriptionFiles: ['prescription3.pdf'],
            customerNotes: '',
            createdAt: '2026-01-21T10:30:00Z'
        },
        {
            _id: '3',
            customer: {
                firstName: 'Saman',
                lastName: 'Fernando',
                email: 'saman.fernando@gmail.com',
                phone: '+94773456789'
            },
            requestedMedicines: [
                { productName: 'Amlodipine 5mg', quantity: 20, notes: 'Blood pressure medication' },
                { productName: 'Atorvastatin 10mg', quantity: 30, notes: 'Cholesterol' }
            ],
            prescriptionFiles: ['prescription4.jpg'],
            customerNotes: 'Regular customer',
            createdAt: '2026-01-20T14:20:00Z'
        }
    ]);

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
        setReviewData({ ...reviewData, items, status: 'APPROVED' });
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

    const handleSubmitReview = () => {
        if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason) {
            toast.error('Please provide a rejection reason');
            return;
        }

        if (reviewData.status === 'APPROVED' && reviewData.items.some(item => !item.price)) {
            toast.error('Please set prices for all items');
            return;
        }

        setPendingPrescriptions(pendingPrescriptions.filter(p => p._id !== selectedPrescription._id));
        toast.success(`Prescription ${reviewData.status.toLowerCase()} successfully!`);
        setSelectedPrescription(null);
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
                                <p className="text-3xl font-bold text-gray-900">5</p>
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
                                <p className="text-sm text-gray-600">Completed Today</p>
                                <p className="text-3xl font-bold text-gray-900">12</p>
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
                                                    {prescription.customer.firstName} {prescription.customer.lastName}
                                                </p>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                    New
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{prescription.customer.email}</p>
                                            <p className="text-sm text-gray-600">{prescription.customer.phone}</p>

                                            <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                                <p className="text-sm font-medium text-gray-900 mb-2">Requested Medicines:</p>
                                                {prescription.requestedMedicines.map((med, idx) => (
                                                    <div key={idx} className="text-sm text-gray-700 mb-1">
                                                        <span className="font-medium">• {med.productName}</span> - Qty: {med.quantity}
                                                        {med.notes && <span className="text-gray-500 italic"> ({med.notes})</span>}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="flex items-center">
                                                    <FileText className="w-4 h-4 mr-1" />
                                                    {prescription.prescriptionFiles.length} file(s)
                                                </span>
                                                <span>
                                                    {new Date(prescription.createdAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
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
                                            <button
                                                onClick={() => toast.info('Viewing prescription files')}
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View Files</span>
                                            </button>
                                            <button
                                                onClick={() => handleReviewPrescription(prescription)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                </div>
            </div>

            {/* Review Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Review Prescription</h3>

                            {/* Customer Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                                <p className="text-sm text-gray-700">
                                    {selectedPrescription.customer.firstName} {selectedPrescription.customer.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{selectedPrescription.customer.email}</p>
                                <p className="text-sm text-gray-600">{selectedPrescription.customer.phone}</p>
                            </div>

                            {/* Review Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setReviewData({ ...reviewData, status: 'APPROVED' })}
                                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${reviewData.status === 'APPROVED'
                                                ? 'bg-green-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <CheckCircle className="w-5 h-5 inline mr-2" />
                                        Approve & Set Price
                                    </button>
                                    <button
                                        onClick={() => setReviewData({ ...reviewData, status: 'REJECTED' })}
                                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${reviewData.status === 'REJECTED'
                                                ? 'bg-red-600 text-white shadow-lg'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <XCircle className="w-5 h-5 inline mr-2" />
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
