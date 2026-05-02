import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pharmacistService, productService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    FileText, 
    Eye, 
    CheckCircle, 
    XCircle, 
    DollarSign, 
    Clock, 
    Search, 
    Package,
    RefreshCw,
    MessageSquare,
    AlertCircle,
    User,
    ChevronRight,
    MapPin,
    Phone,
    Save
} from 'lucide-react';
import PharmacistLayout from '../components/layout/PharmacistLayout';

function PharmacistPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const location = useLocation();
    
    // Determine status from URL
    const getStatusFromPath = () => {
        if (location.pathname.includes('approved')) return 'APPROVED';
        if (location.pathname.includes('rejected')) return 'REJECTED';
        return 'PENDING';
    };

    const currentStatus = getStatusFromPath();

    const [reviewData, setReviewData] = useState({
        status: 'APPROVED',
        reviewNotes: '',
        items: [],
        deliveryFee: 300,
        rejectionReason: '',
    });

    useEffect(() => {
        fetchPrescriptions();
    }, [location.pathname]);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            let response;
            if (currentStatus === 'PENDING') {
                response = await pharmacistService.getPendingPrescriptions();
            } else {
                response = await pharmacistService.getAllPrescriptions({ status: currentStatus });
            }
            
            if (response.success) {
                setPrescriptions(response.data);
            }
        } catch (error) {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPrescription = async (prescription) => {
        setSelectedPrescription(prescription);
        
        // Try to match requested medicines with real products from DB
        const itemsWithProducts = await Promise.all(
            prescription.requestedMedicines.map(async (med) => {
                try {
                    // Try to find product by name
                    const searchRes = await productService.getProducts({ search: med.productName, limit: 1 });
                    const match = searchRes.success && searchRes.data.length > 0 ? searchRes.data[0] : null;
                    
                    return {
                        product: match ? match._id : null,
                        productName: match ? match.name : med.productName,
                        quantity: med.quantity,
                        price: match ? match.price : 0,
                        stockStatus: match ? (match.stock >= med.quantity ? 'IN_STOCK' : 'LOW_STOCK') : 'NOT_FOUND'
                    };
                } catch (err) {
                    return { productName: med.productName, quantity: med.quantity, price: 0, stockStatus: 'NOT_FOUND' };
                }
            })
        );

        setReviewData({
            status: 'APPROVED',
            reviewNotes: '',
            items: itemsWithProducts,
            deliveryFee: 300,
            rejectionReason: '',
        });
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

    const handleWhatsAppContact = (prescription, type = 'approval') => {
        const phone = prescription.customer.phone.replace(/[^0-9]/g, '');
        const name = `${prescription.customer.firstName} ${prescription.customer.lastName}`;
        
        let message = '';
        if (type === 'approval') {
            const total = calculateTotal();
            message = `Hello ${name}, your prescription review from Viduz Pharmacy is complete. Your order total is Rs. ${total.toLocaleString()}. Please complete the payment to proceed with delivery.`;
        } else if (type === 'reupload') {
            message = `Hello ${name}, we encountered an issue with your prescription upload. Could you please re-upload a clearer photo of your prescription to our portal? Thank you, Viduz Pharmacy.`;
        } else {
            message = `Hello ${name}, this is Viduz Pharmacy regarding your recent prescription upload.`;
        }
        
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleSubmitReview = async () => {
        if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason) {
            toast.error('Please provide a rejection reason');
            return;
        }

        if (reviewData.status === 'APPROVED' && reviewData.items.some(item => !item.product)) {
            toast.error('One or more medicines are not matched with our inventory. Please select products.');
            return;
        }

        setReviewLoading(true);
        try {
            const payload = {
                status: reviewData.status,
                reviewNotes: reviewData.reviewNotes,
            };

            if (reviewData.status === 'APPROVED') {
                payload.items = reviewData.items.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price
                }));
                payload.deliveryFee = reviewData.deliveryFee;
            } else {
                payload.rejectionReason = reviewData.rejectionReason || reviewData.reviewNotes;
            }

            const response = await pharmacistService.reviewPrescription(selectedPrescription._id, payload);
            if (response.success) {
                toast.success(`Review submitted successfully!`);
                setSelectedPrescription(null);
                fetchPrescriptions();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review');
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <PharmacistLayout>
            <div className="space-y-6 font-poppins">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center tracking-tight">
                            {currentStatus === 'PENDING' ? (
                                <>
                                    <Clock className="w-8 h-8 mr-3 text-yellow-600" />
                                    Pending Reviews
                                </>
                            ) : currentStatus === 'APPROVED' ? (
                                <>
                                    <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
                                    Approved Prescriptions
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-8 h-8 mr-3 text-red-600" />
                                    Rejected Prescriptions
                                </>
                            )}
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium italic">
                            {currentStatus === 'PENDING' ? 'High priority prescriptions awaiting clinical validation' : 
                             currentStatus === 'APPROVED' ? 'Successfully reviewed and price-confirmed inventory list' :
                             'Invalid or rejected clinical requests'}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : prescriptions.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">All Caught Up!</h3>
                            <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto text-sm italic">You have processed all pending prescriptions in your queue.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins">Patient Details</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins">Request Summary</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins">Date Uploaded</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest font-poppins">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {prescriptions.map((prescription) => (
                                        <tr key={prescription._id} className="group hover:bg-green-50/30 transition-all cursor-pointer" onClick={() => handleSelectPrescription(prescription)}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold border-2 border-white shadow-sm ring-1 ring-green-50">
                                                        {prescription.customer.firstName.charAt(0)}{prescription.customer.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{prescription.customer.firstName} {prescription.customer.lastName}</div>
                                                        <div className="text-xs text-gray-500 font-medium">{prescription.customer.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {prescription.requestedMedicines.slice(0, 2).map((med, i) => (
                                                        <span key={i} className="text-[11px] font-bold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full shadow-sm uppercase tracking-tighter">
                                                            {med.productName} ({med.quantity})
                                                        </span>
                                                    ))}
                                                    {prescription.requestedMedicines.length > 2 && (
                                                        <span className="text-[11px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                                                            +{prescription.requestedMedicines.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center text-sm text-gray-500 font-medium">
                                                    <Clock className="w-4 h-4 mr-2 opacity-50" />
                                                    {new Date(prescription.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-lg active:scale-95 flex items-center">
                                                    Review & Price
                                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
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

            {/* Review Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row font-poppins">
                        
                        {/* Left Side: Prescription Files */}
                       <div className="md:w-1/3 bg-gray-900 p-6 md:p-8 flex flex-col border-r border-gray-800">
  <div className="flex items-center justify-between mb-6">
    <span className="text-green-500 font-bold tracking-widest text-xs uppercase">
      Prescription Analysis
    </span>

    <button
      onClick={() => setSelectedPrescription(null)}
      className="p-2 hover:bg-white/10 rounded-full transition-all md:hidden"
    >
      <XCircle className="w-6 h-6 text-gray-400" />
    </button>
  </div>

  <div className="flex-1 overflow-y-auto space-y-6 px-1 md:px-2 max-h-[65vh] scrollbar-hide">
    {selectedPrescription.files.map((file, idx) => (
      <div
        key={idx}
        className="group relative mx-auto w-full max-w-[360px] rounded-2xl overflow-hidden bg-white/10 border border-white/10 hover:border-white/30 transition-all shadow-lg"
      >
        <div className="w-full bg-white/5 flex items-center justify-center p-5">
          <img
            src={`http://localhost:5000/uploads/prescriptions/${file.filename}`}
            alt="Prescription"
            className="w-full max-h-[420px] object-contain rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>

       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
          <a
            href={`http://localhost:5000/uploads/prescriptions/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/20 flex items-center font-bold uppercase tracking-wider hover:bg-white/30 transition-all"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View Full Prescription
          </a>
        </div>
      </div>
    ))}

    {selectedPrescription.customerNotes && (
      <div className="mx-auto w-full max-w-[360px] bg-blue-900/40 p-5 rounded-2xl border border-blue-800 shadow-xl">
        <div className="flex items-center justify-center text-blue-400 mb-3">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Customer Note
          </span>
        </div>

        <p className="text-sm text-blue-100 italic opacity-90 leading-relaxed font-poppins tracking-tight text-center">
          "{selectedPrescription.customerNotes}"
        </p>
      </div>
    )}
  </div>

  <div className="mt-6 pt-6 border-t border-white/5">
    <div className="flex flex-col items-center text-center space-y-3 mb-6">
      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-gray-900 font-bold text-lg">
        {selectedPrescription.customer.firstName.charAt(0)}
      </div>

      <div>
        <p className="text-white font-bold text-sm tracking-tight">
          {selectedPrescription.customer.firstName}{" "}
          {selectedPrescription.customer.lastName}
        </p>
        <p className="text-gray-500 text-[11px] font-semibold break-all">
          {selectedPrescription.customer.email}
        </p>
      </div>
    </div>

    <button
      onClick={() => handleWhatsAppContact(selectedPrescription, "general")}
      className="mx-auto w-full max-w-[360px] bg-[#25D366] text-white py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
    >
      <MessageSquare className="w-4 h-4 fill-white" />
      <span>WhatsApp Direct</span>
    </button>
  </div>
</div>

                        {/* Right Side: Workflow & Fulfillment */}
                        <div className="flex-1 bg-white flex flex-col p-8 overflow-hidden relative">
                            <button onClick={() => setSelectedPrescription(null)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-all hidden md:block">
                                <XCircle className="w-7 h-7 text-gray-300" />
                            </button>

                            <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100">
                                <div className="mb-10">
                                    <h3 className="text-2xl font-bold text-gray-900 font-poppins">Clinical Validation</h3>
                                    <p className="text-sm text-gray-500 font-medium">Step 1: Set fulfillment status and pricing</p>
                                </div>

                                {/* Decision Toggles */}
                                <div className="grid grid-cols-3 gap-4 mb-10">
                                    {[
                                        { id: 'APPROVED', label: 'Approve & Price', icon: CheckCircle, color: 'bg-green-600', hover: 'hover:bg-green-700' },
                                        { id: 'REUPLOAD_REQUIRED', label: 'Re-Upload Required', icon: RefreshCw, color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
                                        { id: 'REJECTED', label: 'Reject / Invalid', icon: XCircle, color: 'bg-red-600', hover: 'hover:bg-red-700' },
                                    ].map((action) => (
                                        <button
                                            key={action.id}
                                            onClick={() => setReviewData({ ...reviewData, status: action.id })}
                                            className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 group shadow-sm ${
                                                reviewData.status === action.id 
                                                    ? `${action.color} border-transparent text-white ring-4 ring-${action.id === 'APPROVED' ? 'green' : action.id === 'REJECTED' ? 'red' : 'blue'}-50` 
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                            }`}
                                        >
                                            <action.icon className={`w-6 h-6 ${reviewData.status === action.id ? 'text-white' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{action.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {reviewData.status === 'APPROVED' ? (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div className="flex items-center text-blue-800 space-x-3">
                                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">Fulfillment Details</p>
                                                    <p className="text-[10px] uppercase font-bold opacity-60">Inventory Match Required</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm font-bold text-gray-400">
                                                <span>Items:</span>
                                                <span className="text-gray-900">{reviewData.items.length}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {reviewData.items.map((item, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-3xl border-2 border-gray-50 hover:border-blue-100 transition-all group shadow-sm bg-white">
                                                    <div className="md:col-span-2">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">Med {index+1}</span>
                                                            {item.stockStatus === 'IN_STOCK' ? (
                                                                <span className="text-[9px] font-bold text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Ready</span>
                                                            ) : (
                                                                <span className="text-[9px] font-bold text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Not Found</span>
                                                            )}
                                                        </div>
                                                        <p className="text-base font-bold text-gray-900 font-poppins">{item.productName}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">Customer requested quantity: {item.quantity}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Unit Price</label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                            <input
                                                                type="number"
                                                                value={item.price || ''}
                                                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-900"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Subtotal</label>
                                                        <p className="text-lg font-extrabold text-blue-700 tracking-tight">
                                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-gray-900 rounded-3xl p-8 text-white flex flex-col space-y-6 shadow-2xl">
                                            <div className="flex justify-between items-center pb-6 border-b border-white/10">
                                                <div className="flex items-center space-x-3 text-gray-400">
                                                    <MapPin className="w-5 h-5" />
                                                    <span className="text-sm font-bold uppercase tracking-widest">Delivery Service</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">Rs.</span>
                                                    <input
                                                        type="number"
                                                        value={reviewData.deliveryFee}
                                                        onChange={(e) => setReviewData({ ...reviewData, deliveryFee: parseFloat(e.target.value) || 0 })}
                                                        className="w-32 pl-10 pr-4 py-2.5 bg-white/10 border-none rounded-2xl focus:ring-2 focus:ring-green-500 text-sm font-bold text-white text-right"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-green-500 uppercase tracking-[0.2em] mb-1">Order Total Allocation</p>
                                                    <p className="text-sm text-white/50 font-medium italic">Includes VAT and insurance</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-4xl font-extrabold text-white tracking-tighter">
                                                        Rs. {calculateTotal().toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className={`p-3 rounded-2xl ${reviewData.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 font-poppins">{reviewData.status === 'REJECTED' ? 'Prescription Rejection' : 'Service Update'}</p>
                                                <p className="text-xs text-gray-500 font-medium">Please specify the reason for this action</p>
                                            </div>
                                        </div>
                                        <textarea
                                            value={reviewData.rejectionReason}
                                            onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                                            className="w-full bg-white border-2 border-gray-100 rounded-3xl p-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-200 outline-none transition-all text-sm font-medium leading-relaxed"
                                            placeholder={reviewData.status === 'REJECTED' ? "Identify missing information or invalid clinical signs..." : "Ask customer for a clearer photo or missing pages..."}
                                            rows="5"
                                        />
                                        <div className="mt-4 flex items-center space-x-2 text-gray-400 text-xs font-medium">
                                            <Phone className="w-3 h-3" />
                                            <span>WhatsApp notification will be triggered upon clicking submit.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center space-x-4 shrink-0">
                                <button
                                    onClick={() => setSelectedPrescription(null)}
                                    className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-3xl font-bold hover:bg-gray-200 transition-all active:scale-95 text-sm uppercase tracking-widest"
                                >
                                    Pause Review
                                </button>
                                <button
                                    disabled={reviewLoading}
                                    onClick={handleSubmitReview}
                                    className={`flex-[2] py-4 rounded-3xl font-extrabold text-white shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-sm uppercase tracking-widest disabled:opacity-50 ${
                                        reviewData.status === 'APPROVED' ? 'bg-green-600 shadow-green-200 hover:bg-green-700' : 
                                        reviewData.status === 'REJECTED' ? 'bg-red-600 shadow-red-200 hover:bg-red-700' :
                                        'bg-gray-900 shadow-gray-200 hover:bg-black'
                                    }`}
                                >
                                    {reviewLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>Finalize & Send Response</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PharmacistLayout>
    );
}


export default PharmacistPrescriptions;
