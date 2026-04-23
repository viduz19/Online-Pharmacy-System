import AdminLayout from '../components/layout/AdminLayout';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers({ page, limit: 15, search });
            if (response.success) {
                setUsers(response.data);
                setTotalPages(response.pagination.pages);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await adminService.updateUserStatus(id, newStatus);
            if (response.success) {
                toast.success(`User ${newStatus.toLowerCase()} successfully`);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Users className="w-8 h-8 mr-3 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-1">Review and manage all system users and roles</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 border border-blue-100">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-[11px] text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 font-medium">{user.email}</div>
                                            <div className="text-xs text-gray-500">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight ${
                                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'PHARMACIST' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight ${
                                                user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'ADMIN' && (
                                                <div className="flex items-center justify-end space-x-2">
                                                    {user.status === 'ACTIVE' ? (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(user._id, 'BLOCKED')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Block User"
                                                        >
                                                            <UserMinus className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(user._id, 'ACTIVE')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Activate User"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Total {users.length} users in current view
                    </p>
                    <div className="flex space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminUsers;
