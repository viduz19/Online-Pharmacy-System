import { useState, useEffect } from 'react';
import { adminService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Users, ArrowLeft, Search, UserCheck, UserMinus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd have adminService.getAllUsers()
        // For now we'll fetch stats and try to show the status numbers
        setLoading(true);
        // Dummy user list for visualization
        setUsers([
            { _id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@viduzpharmacy.lk', role: 'admin', status: 'active' },
            { _id: '2', firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com', role: 'customer', status: 'active' },
            { _id: '3', firstName: 'Nimal', lastName: 'Silva', email: 'nimal.silva@pharmacy.lk', role: 'pharmacist', status: 'pending' },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <Link to="/admin/dashboard" className="hover:text-blue-600 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Users className="w-8 h-8 mr-3 text-blue-600" />
                            Manage Users
                        </h1>
                        <p className="text-gray-600 mt-1">Review and manage all system users and roles</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">User</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Role</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 capitalize font-semibold text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded inline-flex items-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'pharmacist' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4">Edit</button>
                                            <button className="text-red-600 hover:text-red-800 font-medium text-sm">Suspend</button>
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
