import { useState, useEffect } from 'react';
import { productService, adminService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Package, Plus, Edit, Trash2, Search, Shield } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import AddProductModal from '../components/admin/AddProductModal';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await productService.deleteProduct(id);
            if (response.success) {
                toast.success('Product deleted successfully');
                fetchProducts();
            }
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
                        <Package className="w-10 h-10 mr-4 text-blue-600" />
                        Inventory
                    </h1>
                    <p className="text-gray-500 font-medium">Manage medicine stock, pricing, and details</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center shadow-xl shadow-blue-100 active:scale-95 group"
                >
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Add New Medicine
                </button>
            </div>

            <AddProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchProducts}
                product={selectedProduct}
            />

            {/* Search and Filters */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search medicines by name, brand, or generic name..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900 group-hover:bg-white"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </form>
                
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Items</p>
                        <p className="text-xl font-black text-gray-900">{products.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100 mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Information</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Specifications</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600/20 border-b-blue-600"></div>
                                            <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Updating Inventory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-12 h-12 text-blue-300" />
                                        </div>
                                        <p className="text-xl font-black text-gray-900">No Medications Found</p>
                                        <p className="text-gray-400 font-medium mt-2">Try adjusting your search criteria or add a new medicine.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-gray-900 tracking-tight">{product.name}</div>
                                            <div className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wider">{product.brand}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-gray-700">{product.dosageForm}</div>
                                            <div className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-widest">{product.strength || 'N/A'}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-gray-900">Rs. {product.price.toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                product.stock < (product.lowStockThreshold || 10) 
                                                    ? 'bg-red-50 text-red-600 border border-red-100' 
                                                    : 'bg-green-50 text-green-600 border border-green-100'
                                            }`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {product.prescriptionRequired ? (
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <Shield className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Prescription Req</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OTC Medicine</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end space-x-3 transition-opacity">
                                                <button 
                                                    onClick={() => handleEdit(product)}
                                                    className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-90"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-3 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg active:scale-90"
                                                    title="Delete Product"
                                                >
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
