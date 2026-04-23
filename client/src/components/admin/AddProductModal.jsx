import { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/api.service';
import toast from 'react-hot-toast';

function AddProductModal({ isOpen, onClose, onSuccess }) {
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
        }
    }, [isOpen]);

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
            const response = await adminService.createProduct(formData);
            if (response.success) {
                toast.success('Product added successfully');
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add New Medicine</h2>
                        <p className="text-sm text-gray-500 mt-1">Complete the details below to add a product to inventory</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)] p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Basic Information</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name *</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Panadol"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                                    <input
                                        required
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="e.g. GSK"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                    <select
                                        required
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Generic Name</label>
                                <input
                                    type="text"
                                    name="genericName"
                                    value={formData.genericName}
                                    onChange={handleChange}
                                    placeholder="e.g. Paracetamol"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Detailed description of the medicine..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Specs & Inventory */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Specifications & Inventory</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage Form *</label>
                                    <select
                                        name="dosageForm"
                                        value={formData.dosageForm}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Strength</label>
                                    <input
                                        type="text"
                                        name="strength"
                                        value={formData.strength}
                                        onChange={handleChange}
                                        placeholder="e.g. 500mg"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.) *</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock *</label>
                                    <input
                                        required
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center h-5">
                                    <input
                                        id="prescriptionRequired"
                                        name="prescriptionRequired"
                                        type="checkbox"
                                        checked={formData.prescriptionRequired}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="prescriptionRequired" className="font-bold text-blue-900">Prescription Required</label>
                                    <p className="text-blue-700 text-xs">Customer must upload a valid prescription to order this.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer</label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleChange}
                                    placeholder="e.g. GlaxoSmithKline"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-end space-x-4 border-t border-gray-100 pt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            ) : (
                                <Save className="w-5 h-5 mr-2" />
                            )}
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
