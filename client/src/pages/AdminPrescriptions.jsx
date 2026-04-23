import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { prescriptionService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    Search, 
    Eye, 
    FileText,
    User,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';

const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'REVIEWED': 'bg-blue-100 text-blue-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'ORDER_CREATED': 'bg-purple-100 text-purple-800',
};

function AdminPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Since we don't have a direct prescriptionService.getAllPrescriptions in api.service yet, 
        // I will add it there or use the pending one as fallback
        fetchPrescriptions();
    }, [page]);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            // Note: In a real project we'd use a dedicated admin endpoint
            // Assuming prescriptionService has a method or we add it
            const response = await prescriptionService.getPendingPrescriptions({ page, limit: 10 });
            if (response.success) {
                setPrescriptions(response.data);
                setTotalPages(response.pagination.pages);
            }
        } catch (error) {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <FileText className="w-8 h-8 mr-3 text-blue-600" />
                        Prescriptions
                    </h1>
                    <p className="text-gray-600 mt-1">Review and manage customer prescriptions</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Prescription</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Uploaded</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : prescriptions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No prescriptions found
                                    </td>
                                </tr>
                            ) : (
                                prescriptions.map((px) => (
                                    <tr key={px._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <span className="font-bold text-gray-900 capitalize">Px-{px._id.slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-900">{px.customer?.firstName} {px.customer?.lastName}</div>
                                            <div className="text-xs text-gray-500 uppercase tracking-tighter">ID: {px.customer?._id?.slice(-8)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(px.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[px.status]}`}>
                                                {px.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                onClick={() => toast.info('View functionality not implemented yet')}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminPrescriptions;
