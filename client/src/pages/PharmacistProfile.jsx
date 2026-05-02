import { useState } from 'react';
import PharmacistLayout from '../components/layout/PharmacistLayout';
import { User, Mail, Phone, MapPin, Save, Camera, Award, ShieldCheck, FileText } from 'lucide-react';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';

function PharmacistProfile() {
    const user = authService.getCurrentUser() || {};
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        licenseNumber: user.licenseNumber || 'SLMC-PH-82731', // Placeholder
        specialization: user.specialization || 'Clinical Pharmacy',
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
        <PharmacistLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Professional Profile</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your clinical credentials and account details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center text-emerald-600 text-4xl font-black border-4 border-white shadow-xl">
                                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                                </div>
                                <button className="absolute bottom-1 right-1 p-3 bg-emerald-600 text-white rounded-2xl border-4 border-white shadow-lg hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-emerald-600 font-bold text-sm tracking-tight uppercase tracking-widest text-[10px] mt-2 flex items-center justify-center">
                                <Award className="w-3 h-3 mr-1.5" /> Registered Pharmacist
                            </p>
                            
                            <div className="pt-8 mt-8 border-t border-gray-50 flex flex-col space-y-4">
                                <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Mail className="w-5 h-5 mr-4 text-emerald-500" />
                                    <span className="truncate">{formData.email}</span>
                                </div>
                                <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Phone className="w-5 h-5 mr-4 text-emerald-500" />
                                    <span>{formData.phone || 'No phone added'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
                            <ShieldCheck className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/5 rotate-12" />
                            <h3 className="font-black uppercase tracking-widest text-xs text-emerald-400 mb-4">Credentials</h3>
                            <p className="text-xl font-black mb-1 tracking-tight">{formData.licenseNumber}</p>
                            <p className="text-emerald-300/60 text-[10px] font-black uppercase tracking-widest">SLMC Registered</p>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-xs font-medium text-emerald-100 leading-relaxed">
                                    Your license is active and verified. You have permission to review prescriptions and dispense medication.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-black text-gray-900 flex items-center text-xl tracking-tight">
                                    <FileText className="w-6 h-6 mr-3 text-emerald-600" />
                                    Professional Information
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
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold text-gray-700" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold text-gray-700" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">License Number</label>
                                        <input 
                                            type="text" 
                                            value={formData.licenseNumber}
                                            disabled
                                            className="w-full px-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-bold cursor-not-allowed" 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                                        <input 
                                            type="text" 
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all font-bold text-gray-700" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
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

                                <div className="pt-10 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-12 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all space-x-3 active:scale-95 uppercase text-xs tracking-widest disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{loading ? 'Updating...' : 'Update Professional Profile'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PharmacistLayout>
    );
}

export default PharmacistProfile;
