import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { adminService } from '../services/api.service';
import toast from 'react-hot-toast';
import { UserCheck, Search, Shield, Clock, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';

function AdminPharmacists() {
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED

    useEffect(() => {
        fetchPharmacists();
    }, []);

    const fetchPharmacists = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllPharmacists();
            if (response.success) {
                setPharmacists(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch pharmacists');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, status, reason = '') => {
        try {
            const response = await adminService.updatePharmacistApproval(id, { 
                approvalStatus: status,
                rejectionReason: reason 
            });
            if (response.success) {
                toast.success(`Pharmacist ${status.toLowerCase()} successfully`);
                fetchPharmacists();
            }
        } catch (error) {
            toast.error('Failed to update pharmacist status');
        }
    };

    const filteredPharmacists = pharmacists.filter(p => {
        if (filter === 'ALL') return true;
        return p.approvalStatus === filter;
    });

    return (
        <AdminLayout>
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
                            <UserCheck className="w-10 h-10 mr-4 text-blue-600" />
                            Pharmacist Verification
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Review credentials and approve pharmaceutical professionals</p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === status 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="bg-white rounded-[2.5rem] p-20 flex flex-col items-center justify-center shadow-sm border border-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-b-blue-600 mb-4"></div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Credentials...</p>
                    </div>
                ) : filteredPharmacists.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 flex flex-col items-center justify-center shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Shield className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Pharmacists Found</h3>
                        <p className="text-gray-500 max-w-xs font-medium">There are no pharmacists matching the selected filter.</p>
                    </div>
                ) : (
                    filteredPharmacists.map((pharmacist) => (
                        <div key={pharmacist._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative">
                            {/* Status Ribbon */}
                            <div className={`absolute top-0 right-0 px-8 py-2 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-[0.2em] ${
                                pharmacist.approvalStatus === 'APPROVED' ? 'bg-green-500 text-white' :
                                pharmacist.approvalStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                                {pharmacist.approvalStatus}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Profile Info */}
                                <div className="lg:w-1/3">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 font-black text-2xl border-4 border-white shadow-lg">
                                            {pharmacist.user.firstName.charAt(0)}{pharmacist.user.lastName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{pharmacist.user.firstName} {pharmacist.user.lastName}</h3>
                                            <p className="text-blue-600 font-bold text-sm">{pharmacist.user.email}</p>
                                            <p className="text-gray-400 text-[11px] font-bold mt-1">Member since {new Date(pharmacist.user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Phone</p>
                                            <p className="text-sm font-bold text-gray-700">{pharmacist.user.phone}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">NIC Number</p>
                                            <p className="text-sm font-bold text-gray-700">{pharmacist.nic}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Credentials */}
                                <div className="lg:w-1/3 border-x border-gray-50 px-10">
                                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Professional Credentials
                                    </h4>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">License Number</p>
                                            <p className="text-lg font-black text-gray-900">{pharmacist.licenseNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qualifications</p>
                                            <p className="text-sm font-bold text-gray-700">{pharmacist.qualifications || 'Not specified'}</p>
                                        </div>
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                                                <p className="text-sm font-black text-gray-900">{pharmacist.yearsOfExperience} Years</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Specialization</p>
                                                <p className="text-sm font-black text-gray-900">{pharmacist.specialization || 'General'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions / Status */}
                                <div className="lg:w-1/3 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            Verification Status
                                        </h4>
                                        
                                        {pharmacist.approvalStatus === 'PENDING' ? (
                                            <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
                                                <p className="text-xs text-amber-800 font-bold leading-relaxed">
                                                    This professional is awaiting clinical verification. Please review the SLMC credentials before approving.
                                                </p>
                                            </div>
                                        ) : pharmacist.approvalStatus === 'APPROVED' ? (
                                            <div className="p-5 bg-green-50 rounded-3xl border border-green-100 flex items-start gap-4">
                                                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm font-black text-green-800 tracking-tight">Verified Professional</p>
                                                    <p className="text-xs text-green-600 font-medium mt-1">This user has full pharmacist privileges.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-5 bg-red-50 rounded-3xl border border-red-100">
                                                <p className="text-sm font-black text-red-800 tracking-tight">Access Denied</p>
                                                <p className="text-xs text-red-600 font-medium mt-1">Reason: {pharmacist.rejectionReason || 'Incomplete credentials'}</p>
                                            </div>
                                        )}
                                    </div>

                                    {pharmacist.approvalStatus === 'PENDING' && (
                                        <div className="flex gap-4 mt-10">
                                            <button 
                                                onClick={() => handleApproval(pharmacist._id, 'APPROVED')}
                                                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const reason = prompt('Enter rejection reason:');
                                                    if (reason) handleApproval(pharmacist._id, 'REJECTED', reason);
                                                }}
                                                className="flex-1 bg-white text-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 border-2 border-red-100 transition-all active:scale-95"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminPharmacists;
