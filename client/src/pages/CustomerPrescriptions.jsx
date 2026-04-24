import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { prescriptionService } from '../services/api.service';
import CustomerLayout from '../components/layout/CustomerLayout';
import { FileText, Plus, Search, Filter, Eye, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

function CustomerPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const response = await prescriptionService.getMyPrescriptions();
            if (response.success) {
                setPrescriptions(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            APPROVED: 'bg-green-100 text-green-800 border-green-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200',
            REUPLOAD_REQUIRED: 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const filteredPrescriptions = filter === 'ALL' 
        ? prescriptions 
        : prescriptions.filter(p => p.status === filter);

    return (
        <CustomerLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
                        <p className="text-gray-600 mt-1">Manage and track your medical prescription requests</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link 
                            to="/customer/upload-prescription"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all text-sm shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload New
                        </Link>
                        
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm appearance-none"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending Review</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="REUPLOAD_REQUIRED">Reupload Needed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredPrescriptions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No prescriptions found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            {filter === 'ALL' 
                                ? "You haven't uploaded any prescriptions yet. Upload one to get your medications." 
                                : `No prescriptions with status ${filter.replace(/_/g, ' ')} were found.`}
                        </p>
                        <Link 
                            to="/customer/upload-prescription" 
                            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Upload Prescription
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPrescriptions.map((prescription) => (
                            <div 
                                key={prescription._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(prescription.status)}`}>
                                            {prescription.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                        {prescription.requestedMedicines.length > 0 
                                            ? prescription.requestedMedicines.map(m => m.productName).join(', ')
                                            : 'Prescription Request'}
                                    </h3>
                                    
                                    <div className="flex items-center text-sm text-gray-500 mb-6">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        {new Date(prescription.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <p className="text-xs text-gray-400">
                                            {(prescription.files || []).length} file(s) attached
                                        </p>
                                        <Link 
                                            to={`/customer/prescriptions/${prescription._id}`}
                                            className="inline-flex items-center space-x-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-200"
                                        >
                                            <span>View Review</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {prescription.status === 'APPROVED' && (
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-green-700 uppercase">Ready for checkout</p>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
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

export default CustomerPrescriptions;
