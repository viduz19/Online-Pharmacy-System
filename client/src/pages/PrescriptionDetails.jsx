import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { prescriptionService } from '../services/api.service';
import CustomerLayout from '../components/layout/CustomerLayout';
import { 
    ArrowLeft, 
    FileText, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Download,
    Eye,
    CreditCard,
    MessageCircle,
    User,
    Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

function PrescriptionDetails() {
    const { id } = useParams();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptionDetails();
    }, [id]);

    const fetchPrescriptionDetails = async () => {
        try {
            const response = await prescriptionService.getPrescription(id);
            if (response.success) {
                setPrescription(response.data);
            } else {
                toast.error('Prescription not found');
                navigate('/customer/prescriptions');
            }
        } catch (error) {
            console.error('Error fetching prescription details:', error);
            toast.error('Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        setIsConfirming(true);
        try {
            const response = await prescriptionService.confirmPrescriptionOrder(id);
            if (response.success) {
                toast.success('Order confirmed! Redirecting to payment...');
                const orderId = response.data._id;
                navigate(`/checkout/${orderId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm order');
        } finally {
            setIsConfirming(false);
        }
    };

    const handleWhatsAppSupport = () => {
        const phoneNumber = '+94771234567'; // Placeholder
        const message = `Hello, I'm inquiring about my prescription request ID: ${id}. Current status is ${prescription?.status}.`;
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

    if (!prescription) return null;

    return (
        <CustomerLayout>
            <div className="max-w-4xl mx-auto">
                <Link 
                    to="/customer/prescriptions" 
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Prescriptions
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-2xl font-bold text-gray-900">Prescription Review</h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        prescription.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        prescription.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        prescription.status === 'REUPLOAD_REQUIRED' ? 'bg-orange-100 text-orange-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {prescription.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        {new Date(prescription.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        {new Date(prescription.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Requested Medicines */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Requested Medications
                                    </h3>
                                    <div className="space-y-3">
                                        {prescription.requestedMedicines.map((med, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="font-semibold text-gray-900">{med.productName}</span>
                                                <span className="text-gray-500 text-sm">Qty: {med.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pharmacist Review */}
                                {prescription.reviewedBy && (
                                    <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-4 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Pharmacist's Feedback
                                        </h3>
                                        <div className="space-y-4">
                                            {prescription.reviewNotes && (
                                                <div>
                                                    <p className="text-xs font-bold text-blue-400 uppercase mb-1">Review Notes</p>
                                                    <p className="text-blue-800 italic">"{prescription.reviewNotes}"</p>
                                                </div>
                                            )}
                                            {prescription.rejectionReason && (
                                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                                    <p className="text-xs font-bold text-red-400 uppercase mb-1">Rejection Reason</p>
                                                    <p className="text-red-700 font-medium">{prescription.rejectionReason}</p>
                                                </div>
                                            )}
                                            <div className="flex items-center text-xs text-blue-500 font-medium pt-2">
                                                Reviewed by {prescription.reviewedBy.firstName} on {new Date(prescription.reviewedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Files Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                <Download className="w-4 h-4 mr-2" />
                                Uploaded Documents
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(prescription.files || []).map((file, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden aspect-[3/4] border border-gray-200 shadow-sm">
                                        <img 
                                            src={`http://localhost:5000/${file.path.replace(/\\/g, '/')}`} 
                                            alt={file.originalName}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150?text=Prescription';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                            <a 
                                                href={`http://localhost:5000/${file.path.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-white rounded-full text-gray-900 hover:bg-blue-600 hover:text-white transition-colors shadow-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Actions */}
                    <div className="space-y-6">
                        {prescription.status === 'APPROVED' && prescription.order && (
                            <div className="bg-white rounded-2xl shadow-xl border-t-4 border-green-500 p-8 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Prescription Approved!</h3>
                                <p className="text-sm text-gray-500 mb-8 font-medium">The pharmacist has verified your request and set the pricing.</p>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Order Subtotal</span>
                                        <span className="font-bold text-gray-900">Rs. {prescription.order.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Delivery Fee</span>
                                        <span className="font-bold text-gray-900">Rs. {prescription.order.deliveryFee?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">
                                        <span>Grand Total</span>
                                        <span className="text-green-600 text-xl font-black">Rs. {prescription.order.total?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleConfirmOrder}
                                    disabled={isConfirming}
                                    className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center justify-center space-x-2 disabled:bg-green-300"
                                >
                                    {isConfirming ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            <span>Confirm & Pay</span>
                                        </>
                                    )}
                                </button>
                                
                                <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">Secure Checkout</p>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                            <p className="text-sm text-gray-500 mb-6">Contact our pharmacist for any clarification regarding this prescription.</p>
                            <button 
                                onClick={handleWhatsAppSupport}
                                className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl border border-green-100 hover:bg-green-100 transition-all flex items-center justify-center space-x-2 text-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Chat with Pharmacist</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

export default PrescriptionDetails;
