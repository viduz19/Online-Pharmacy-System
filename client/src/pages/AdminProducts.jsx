import { useState, useEffect } from 'react';
import { productService, adminService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import AddProductModal from '../components/admin/AddProductModal';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts({ search });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Package className="w-8 h-8 mr-3 text-blue-600" />
                        Inventory
                    </h1>
                    <p className="text-gray-600 mt-1">Manage product details and stock levels</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Product
                </button>
            </div>

            <AddProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProducts}
            />

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 flex items-center justify-between">
                <form onSubmit={handleSearch} className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by product name..."
                        className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (Rs.)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prescription</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No products found in the database.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{product.name}</div>
                                            <div className="text-[11px] text-gray-500">{product.brand}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.dosageForm}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                            {product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                product.stock < (product.lowStockThreshold || 10) ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                            }`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.prescriptionRequired ? (
                                                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 uppercase">Required</span>
                                            ) : (
                                                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase">Optional</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
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

export default AdminProducts;
