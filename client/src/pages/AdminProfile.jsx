import { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { User, Mail, Phone, MapPin, Save, Camera, Shield } from 'lucide-react';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';

function AdminProfile() {
    const user = authService.getCurrentUser() || {};
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Profile</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your administrator account details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-black border-4 border-white shadow-xl">
                                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                                </div>
                                <button className="absolute bottom-1 right-1 p-3 bg-blue-600 text-white rounded-2xl border-4 border-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-blue-600 font-bold text-sm tracking-tight uppercase tracking-widest text-[10px] mt-2">System Administrator</p>
                            
                            <div className="pt-8 mt-8 border-t border-gray-50 flex flex-col space-y-4">
                                <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Mail className="w-5 h-5 mr-4 text-blue-500" />
                                    <span className="truncate">{formData.email}</span>
                                </div>
                                <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Phone className="w-5 h-5 mr-4 text-blue-500" />
                                    <span>{formData.phone || 'No phone added'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
                            <Shield className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/5 rotate-12" />
                            <h3 className="font-black uppercase tracking-widest text-xs text-blue-400 mb-4">Security Level</h3>
                            <p className="text-2xl font-black mb-2 tracking-tight">Full Access</p>
                            <p className="text-gray-400 text-xs font-medium leading-relaxed">
                                You have administrative privileges to manage products, users, and clinical operations.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-black text-gray-900 flex items-center text-xl tracking-tight">
                                    <User className="w-6 h-6 mr-3 text-blue-600" />
                                    Administrator Information
                                </h3>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-gray-700" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-gray-700" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Read Only)</label>
                                    <div className="relative">
                                        <Mail className="w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300" />
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled
                                            className="w-full pl-14 pr-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-bold cursor-not-allowed" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500" />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all font-bold text-gray-700" 
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all space-x-3 active:scale-95 uppercase text-xs tracking-widest disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminProfile;
