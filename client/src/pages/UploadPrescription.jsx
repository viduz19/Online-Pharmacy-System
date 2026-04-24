import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { prescriptionService, authService } from '../services/api.service';
import CustomerLayout from '../components/layout/CustomerLayout';
import toast from 'react-hot-toast';
import { Upload, X, FileText, Plus, MapPin, ClipboardList, Info } from 'lucide-react';

function UploadPrescription() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser() || {};
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    
    // Pre-fill medicine if coming from Products page
    const initialProduct = location.state?.product;
    
    const [formData, setFormData] = useState({
        requestedMedicines: initialProduct 
            ? [{ productName: initialProduct.name, quantity: 1, notes: '' }] 
            : [{ productName: '', quantity: 1, notes: '' }],
        customerNotes: '',
        deliveryAddress: {
            street: user.address?.street || '',
            city: user.address?.city || '',
            province: user.address?.province || '',
            postalCode: user.address?.postalCode || '',
            contactPhone: user.phone || '',
        },
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'image/pjpeg'];
        const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            toast.error('Only JPEG, PNG, and PDF files are allowed');
            return;
        }

        const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('File size must be less than 5MB');
            return;
        }

        if (files.length + selectedFiles.length > 5) {
            toast.error('Maximum 5 files allowed');
            return;
        }

        setFiles([...files, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const addMedicine = () => {
        setFormData({
            ...formData,
            requestedMedicines: [
                ...formData.requestedMedicines,
                { productName: '', quantity: 1, notes: '' },
            ],
        });
    };

    const removeMedicine = (index) => {
        setFormData({
            ...formData,
            requestedMedicines: formData.requestedMedicines.filter((_, i) => i !== index),
        });
    };

    const handleMedicineChange = (index, field, value) => {
        const updated = [...formData.requestedMedicines];
        updated[index][field] = value;
        setFormData({ ...formData, requestedMedicines: updated });
    };

    const handleAddressChange = (field, value) => {
        setFormData({
            ...formData,
            deliveryAddress: {
                ...formData.deliveryAddress,
                [field]: value,
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            toast.error('Please upload at least one prescription file');
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            files.forEach((file) => {
                formDataToSend.append('prescriptions', file);
            });
            formDataToSend.append('requestedMedicines', JSON.stringify(formData.requestedMedicines));
            formDataToSend.append('customerNotes', formData.customerNotes);
            formDataToSend.append('deliveryAddress', JSON.stringify(formData.deliveryAddress));

            const response = await prescriptionService.uploadPrescription(formDataToSend);

            if (response.success) {
                toast.success('Prescription uploaded successfully! A pharmacist will review it shortly.');
                navigate('/customer/prescriptions');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Upload Prescription</h1>
                    <p className="text-gray-600 mt-1">Get your prescription medications verified and delivered</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* File Upload Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                <Upload className="w-4 h-4 mr-2" />
                                1. Prescription Files
                            </h3>
                            
                            <div className="group relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300">
                                <input
                                    type="file"
                                    id="prescription-upload"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="prescription-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-900 font-bold mb-1">Click to browse or drag & drop</p>
                                    <p className="text-sm text-gray-500">Supports JPEG, PNG, or PDF (Max 5MB)</p>
                                </label>
                            </div>

                            {/* File List */}
                            {files.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-gray-100">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Medicine List Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                2. Requested Medicines
                            </h3>
                            
                            <div className="space-y-4">
                                {formData.requestedMedicines.map((medicine, index) => (
                                    <div key={index} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative group animate-in zoom-in-95 duration-200">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Medicine Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={medicine.productName}
                                                    onChange={(e) => handleMedicineChange(index, 'productName', e.target.value)}
                                                    placeholder="e.g. Panadol 500mg"
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={medicine.quantity}
                                                    onChange={(e) => handleMedicineChange(index, 'quantity', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                {formData.requestedMedicines.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedicine(index)}
                                                        className="w-full py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addMedicine}
                                    className="inline-flex items-center text-blue-600 font-black text-sm hover:text-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Another
                                </button>
                            </div>
                        </div>

                        {/* Delivery Address Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                3. Delivery Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.deliveryAddress.street}
                                        onChange={(e) => handleAddressChange('street', e.target.value)}
                                        placeholder="Street Address"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.deliveryAddress.city}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    placeholder="City"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <select
                                    required
                                    value={formData.deliveryAddress.province}
                                    onChange={(e) => handleAddressChange('province', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Province</option>
                                    <option value="Western">Western</option>
                                    <option value="Central">Central</option>
                                    <option value="Southern">Southern</option>
                                </select>
                                <input
                                    type="text"
                                    required
                                    value={formData.deliveryAddress.postalCode}
                                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                                    placeholder="Postal Code"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <input
                                    type="tel"
                                    required
                                    value={formData.deliveryAddress.contactPhone}
                                    onChange={(e) => handleAddressChange('contactPhone', e.target.value)}
                                    placeholder="Contact Phone"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Info & Submit */}
                    <div className="space-y-6">
                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 sticky top-24">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <Info className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-4">How it works</h3>
                            <ul className="space-y-4 text-sm font-medium text-blue-100">
                                <li className="flex items-start">
                                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] mr-3 mt-0.5 shrink-0">1</span>
                                    Pharmacist reviews your prescription details.
                                </li>
                                <li className="flex items-start">
                                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] mr-3 mt-0.5 shrink-0">2</span>
                                    You'll get a price quotation based on availability.
                                </li>
                                <li className="flex items-start">
                                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] mr-3 mt-0.5 shrink-0">3</span>
                                    Once you confirm, we deliver it to your door!
                                </li>
                            </ul>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-10 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                        
                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Need Help?</p>
                            <Link to="/contact" className="text-blue-600 text-sm font-black hover:underline">Chat with Support</Link>
                        </div>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}

export default UploadPrescription;
