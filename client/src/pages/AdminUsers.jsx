import { useState, useEffect } from 'react';
import { adminService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Users, ArrowLeft, Search, UserCheck, UserMinus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [customers, setCustomers] = useState([]);
    const [pharmacists, setPharmacists] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [custRes, pharmRes] = await Promise.all([
                adminService.getAllCustomers(),
                adminService.getAllPharmacists()
            ]);
            if (custRes.success) setCustomers(custRes.data);
            if (pharmRes.success) setPharmacists(pharmRes.data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Users className="w-8 h-8 mr-3 text-blue-600" />
                            Manage Users
                        </h1>
                        <p className="text-gray-600 mt-1">Review and manage all system users and roles</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customers Table */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-900 text-lg">Customers</h2>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{customers.length}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {!customers || customers.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400">No customers found</td></tr>
                                    ) : customers?.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-blue-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{customer.firstName} {customer.lastName}</div>
                                                <div className="text-xs text-gray-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pharmacists Table */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-900 text-lg">Pharmacists</h2>
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">{pharmacists.length}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pharmacist</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Branch / License</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {!pharmacists || pharmacists.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400">No pharmacists found</td></tr>
                                    ) : pharmacists?.map((pharm) => (
                                        <tr key={pharm._id} className="hover:bg-green-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{pharm.user?.firstName} {pharm.user?.lastName}</div>
                                                <div className="text-xs text-gray-500">{pharm.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 font-medium">{pharm.pharmacyBranch}</div>
                                                <div className="text-xs text-gray-500">{pharm.licenseNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-green-600 hover:text-green-800 font-medium text-sm">Review</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default AdminUsers;
