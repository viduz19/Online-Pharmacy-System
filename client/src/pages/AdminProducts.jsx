import { useState, useEffect } from 'react';
import { adminService, productService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Package, Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <Link to="/admin/dashboard" className="hover:text-blue-600 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Package className="w-8 h-8 mr-3 text-blue-600" />
                            Manage Products
                        </h1>
                        <p className="text-gray-600 mt-1">Inventory management and product listing</p>
                    </div>
                    <button
                        onClick={() => toast.success('Add product modal would open here')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center shadow-md active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Product
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products by name..."
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
                    </form>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Product Name</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Category</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Price (Rs.)</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Stock</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.genericName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.dosageForm}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                            {product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={product.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.prescriptionRequired ? (
                                                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 uppercase">Rx</span>
                                            ) : (
                                                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase">OTC</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors inline-block">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors inline-block">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {products.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No products found in the database.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminProducts;
