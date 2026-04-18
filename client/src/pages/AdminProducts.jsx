import { useState, useEffect } from 'react';
import { productService, api } from '../services/api.service';
import toast from 'react-hot-toast';
import { Package, Plus, Edit, Trash2, ArrowLeft, Search, X, Check, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        genericName: '',
        brand: '',
        category: '',
        description: '',
        dosageForm: 'Tablet',
        strength: '',
        price: '',
        stock: '',
        prescriptionRequired: false,
        imageUrl: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

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

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                genericName: product.genericName || '',
                brand: product.brand || '',
                category: product.category?._id || product.category || '',
                description: product.description,
                dosageForm: product.dosageForm,
                strength: product.strength || '',
                price: product.price,
                stock: product.stock,
                prescriptionRequired: product.prescriptionRequired,
                imageUrl: product.images?.[0]?.url || ''
            });
        } else {
            setCurrentProduct(null);
            setFormData({
                name: '',
                genericName: '',
                brand: '',
                category: categories[0]?._id || '',
                description: '',
                dosageForm: 'Tablet',
                strength: '',
                price: '',
                stock: '',
                prescriptionRequired: false,
                imageUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            images: formData.imageUrl ? [{ url: formData.imageUrl, alt: formData.name }] : []
        };

        try {
            let response;
            if (currentProduct) {
                // Update
                response = await api.put(`/products/${currentProduct._id}`, payload);
            } else {
                // Create
                response = await api.post('/products', payload);
            }

            if (response.data.success) {
                toast.success(`Medicine ${currentProduct ? 'updated' : 'added'} successfully!`);
                setIsModalOpen(false);
                fetchProducts();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save medicine');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this medicine?')) return;
        try {
            const response = await api.delete(`/products/${id}`);
            if (response.data.success) {
                toast.success('Medicine deleted');
                fetchProducts();
            }
        } catch (error) {
            toast.error('Failed to delete medicine');
        }
    };

    return (
        <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Package className="w-8 h-8 mr-3 text-blue-600" />
                            Medicine Inventory
                        </h1>
                        <p className="text-gray-600 mt-1">Manage medicines available for customers</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center shadow-md active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Medicine
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, brand or generic name..."
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Medicine</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Category</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Price</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Stock</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700">Type</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products?.map((product) => (
                                    <tr key={product._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded bg-gray-100 mr-3 flex items-center justify-center overflow-hidden">
                                                    {product.images?.[0]?.url ? (
                                                        <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.genericName} | {product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.category?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                            Rs. {product.price}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {product.stock} left
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.prescriptionRequired ? (
                                                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 uppercase flex items-center w-fit">
                                                    <FileText className="w-3 h-3 mr-1" /> Rx
                                                </span>
                                            ) : (
                                                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase w-fit block">OTC</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button 
                                                onClick={() => openModal(product)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors inline-block"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors inline-block"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {currentProduct ? 'Edit Medicine' : 'Add New Medicine'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                                <input
                                    type="text"
                                    value={formData.genericName}
                                    onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {categories?.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
                                <select
                                    value={formData.dosageForm}
                                    onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Sachet', 'Liquid', 'Patch', 'Other'].map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Strength (e.g. 500mg)</label>
                                <input
                                    type="text"
                                    value={formData.strength}
                                    onChange={(e) => setFormData({...formData, strength: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Required?</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, prescriptionRequired: !formData.prescriptionRequired})}
                                    className={`flex items-center px-4 py-2 rounded-lg border transition-all ${formData.prescriptionRequired ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}
                                >
                                    {formData.prescriptionRequired ? <X className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                    {formData.prescriptionRequired ? 'Yes (Rx)' : 'No (OTC)'}
                                </button>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (from /assets/)</label>
                                <input
                                    type="text"
                                    placeholder="/assets/filename.png"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 italic">Example: /assets/Panadol (Paracetamol 500mg).png</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="md:col-span-2 mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-blue-300"
                            >
                                {isSubmitting ? 'Saving...' : (currentProduct ? 'Update Medicine' : 'Add Medicine')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
