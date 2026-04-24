import { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { adminService, productService } from '../../services/api.service';
import toast from 'react-hot-toast';

function AddProductModal({ isOpen, onClose, onSuccess, product = null }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
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
        lowStockThreshold: 10,
        prescriptionRequired: false,
        manufacturer: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (product) {
                setFormData({
                    name: product.name || '',
                    genericName: product.genericName || '',
                    brand: product.brand || '',
                    category: product.category?._id || product.category || '',
                    description: product.description || '',
                    dosageForm: product.dosageForm || 'Tablet',
                    strength: product.strength || '',
                    price: product.price || '',
                    stock: product.stock || '',
                    lowStockThreshold: product.lowStockThreshold || 10,
                    prescriptionRequired: product.prescriptionRequired || false,
                    manufacturer: product.manufacturer || '',
                });
            } else {
                setFormData({
                    name: '',
                    genericName: '',
                    brand: '',
                    category: '',
                    description: '',
                    dosageForm: 'Tablet',
                    strength: '',
                    price: '',
                    stock: '',
                    lowStockThreshold: 10,
                    prescriptionRequired: false,
                    manufacturer: '',
                });
            }
        }
    }, [isOpen, product]);

    const fetchCategories = async () => {
        try {
            const response = await adminService.getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (product) {
                response = await productService.updateProduct(product._id, formData);
            } else {
                response = await productService.createProduct(formData);
            }
            
            if (response.success) {
                toast.success(product ? 'Product updated successfully' : 'Product added successfully');
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${product ? 'update' : 'add'} product`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {product ? 'Edit Medicine' : 'Add New Medicine'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {product ? 'Update the details for this medication' : 'Complete the details below to add a product to inventory'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)] p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Basic Information</h3>
                            
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Medicine Name *</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Panadol"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Brand *</label>
                                    <input
                                        required
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="e.g. GSK"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category *</label>
                                    <select
                                        required
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white transition-all font-medium text-gray-900"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Generic Name</label>
                                <input
                                    type="text"
                                    name="genericName"
                                    value={formData.genericName}
                                    onChange={handleChange}
                                    placeholder="e.g. Paracetamol"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description *</label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Detailed description of the medicine..."
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900 resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Specs & Inventory */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Inventory & Pricing</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Dosage Form *</label>
                                    <select
                                        name="dosageForm"
                                        value={formData.dosageForm}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white transition-all font-medium text-gray-900"
                                    >
                                        <option>Tablet</option>
                                        <option>Capsule</option>
                                        <option>Syrup</option>
                                        <option>Injection</option>
                                        <option>Cream</option>
                                        <option>Ointment</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Strength</label>
                                    <input
                                        type="text"
                                        name="strength"
                                        value={formData.strength}
                                        onChange={handleChange}
                                        placeholder="e.g. 500mg"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (Rs.) *</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Stock *</label>
                                    <input
                                        required
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <div className="flex items-center h-6">
                                    <input
                                        id="prescriptionRequired"
                                        name="prescriptionRequired"
                                        type="checkbox"
                                        checked={formData.prescriptionRequired}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 transition-all cursor-pointer"
                                    />
                                </div>
                                <div className="ml-4 text-sm">
                                    <label htmlFor="prescriptionRequired" className="font-black text-blue-900 cursor-pointer uppercase text-[10px] tracking-widest">Prescription Required</label>
                                    <p className="text-blue-600/70 text-xs font-medium mt-0.5">Strictly enforced for this medication.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Manufacturer</label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleChange}
                                    placeholder="e.g. GlaxoSmithKline"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-end gap-4 border-t border-gray-100 pt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3.5 rounded-2xl text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-b-white"></div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {product ? 'Update Product' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
