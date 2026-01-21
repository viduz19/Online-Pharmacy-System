import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { prescriptionService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Upload, X, FileText } from 'lucide-react';

function UploadPrescription() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        requestedMedicines: [{ productName: '', quantity: 1, notes: '' }],
        customerNotes: '',
        deliveryAddress: {
            street: '',
            city: '',
            province: '',
            postalCode: '',
            contactPhone: '',
        },
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            toast.error('Only JPEG, PNG, and PDF files are allowed');
            return;
        }

        // Validate file size (5MB max)
        const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('File size must be less than 5MB');
            return;
        }

        // Limit to 5 files
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

            // Append files
            files.forEach((file) => {
                formDataToSend.append('prescriptions', file);
            });

            // Append other data
            formDataToSend.append('requestedMedicines', JSON.stringify(formData.requestedMedicines));
            formDataToSend.append('customerNotes', formData.customerNotes);
            formDataToSend.append('deliveryAddress', JSON.stringify(formData.deliveryAddress));

            const response = await prescriptionService.uploadPrescription(formDataToSend);

            if (response.success) {
                toast.success('Prescription uploaded successfully! A pharmacist will review it shortly.');
                navigate('/customer/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Navigation */}
            <nav className="bg-white shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/customer/dashboard" className="text-2xl font-bold text-blue-600">
                            🏥 Viduz Pharmacy
                        </Link>
                        <Link to="/customer/dashboard" className="text-gray-700 hover:text-blue-600">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Upload Prescription
                        </h1>
                        <p className="text-gray-600">
                            Upload your doctor's prescription to order prescription-required medicines
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* File Upload */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                Prescription Files *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    id="prescription-upload"
                                    multiple
                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="prescription-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-gray-700 font-medium mb-2">
                                        Click to upload prescription files
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        JPEG, PNG, or PDF (Max 5MB, up to 5 files)
                                    </p>
                                </label>
                            </div>

                            {/* Uploaded Files */}
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Requested Medicines */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                Requested Medicines
                            </label>
                            {formData.requestedMedicines.map((medicine, index) => (
                                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Medicine Name
                                            </label>
                                            <input
                                                type="text"
                                                value={medicine.productName}
                                                onChange={(e) => handleMedicineChange(index, 'productName', e.target.value)}
                                                placeholder="e.g., Amoxicillin 500mg"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={medicine.quantity}
                                                onChange={(e) => handleMedicineChange(index, 'quantity', parseInt(e.target.value))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            {formData.requestedMedicines.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedicine(index)}
                                                    className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={medicine.notes}
                                            onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                                            placeholder="Any specific instructions"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMedicine}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                + Add Another Medicine
                            </button>
                        </div>

                        {/* Delivery Address */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                Delivery Address *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.deliveryAddress.street}
                                        onChange={(e) => handleAddressChange('street', e.target.value)}
                                        placeholder="Street Address"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.deliveryAddress.city}
                                        onChange={(e) => handleAddressChange('city', e.target.value)}
                                        placeholder="City"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <select
                                        required
                                        value={formData.deliveryAddress.province}
                                        onChange={(e) => handleAddressChange('province', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select Province</option>
                                        <option value="Western">Western</option>
                                        <option value="Central">Central</option>
                                        <option value="Southern">Southern</option>
                                        <option value="Northern">Northern</option>
                                        <option value="Eastern">Eastern</option>
                                        <option value="North Western">North Western</option>
                                        <option value="North Central">North Central</option>
                                        <option value="Uva">Uva</option>
                                        <option value="Sabaragamuwa">Sabaragamuwa</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.deliveryAddress.postalCode}
                                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                                        placeholder="Postal Code"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.deliveryAddress.contactPhone}
                                        onChange={(e) => handleAddressChange('contactPhone', e.target.value)}
                                        placeholder="Contact Phone"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Customer Notes */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                value={formData.customerNotes}
                                onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                                rows="4"
                                placeholder="Any special instructions or requests..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>✓ A licensed pharmacist will review your prescription</li>
                                <li>✓ You'll receive a price confirmation message</li>
                                <li>✓ Once you confirm, we'll prepare your order</li>
                                <li>✓ Your medicines will be ready for delivery</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Uploading...' : 'Submit Prescription'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadPrescription;
