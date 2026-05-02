import { useState } from 'react';
import CustomerLayout from '../components/layout/CustomerLayout';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';

function CustomerProfile() {
    const user = authService.getCurrentUser() || {};
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
            street: user.address?.street || '',
            city: user.address?.city || '',
            province: user.address?.province || '',
            postalCode: user.address?.postalCode || '',
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.updateProfile(formData);
            if (response.success) {
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and delivery addresses</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-md">
                                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                                </div>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-sm text-gray-500 mb-6">{formData.email}</p>
                            <div className="pt-6 border-t border-gray-50 flex flex-col space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                    {formData.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                                    {formData.phone || 'No phone added'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-2xl shadow-lg p-8 text-white">
                            <h3 className="font-bold mb-2">Member Since</h3>
                            <p className="text-blue-100 text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <div className="mt-6 pt-6 border-t border-blue-500/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-200">Total Orders</span>
                                    <span className="font-bold">12</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-blue-600" />
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50">
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                        Default Delivery Address
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Street Address</label>
                                            <input 
                                                type="text" 
                                                name="address.street"
                                                value={formData.address.street}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
                                                <input 
                                                    type="text" 
                                                    name="address.city"
                                                    value={formData.address.city}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Province</label>
                                                <input 
                                                    type="text" 
                                                    name="address.province"
                                                    value={formData.address.province}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Postal Code</label>
                                                <input 
                                                    type="text" 
                                                    name="address.postalCode"
                                                    value={formData.address.postalCode}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all space-x-2 disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{loading ? 'Updating...' : 'Save Changes'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

export default CustomerProfile;
