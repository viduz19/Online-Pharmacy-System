import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';
import logo from "../assets/Online Pharmacy System.png";

function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState('CUSTOMER');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: {
            street: '',
            city: '',
            province: '',
            postalCode: '',
        },
        // Pharmacist specific fields
        pharmacistData: {
            licenseNumber: '',
            nic: '',
            qualifications: '',
            pharmacyBranch: '',
            yearsOfExperience: '',
            specialization: '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [field]: value,
                },
            });
        } else if (name.startsWith('pharmacist.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                pharmacistData: {
                    ...formData.pharmacistData,
                    [field]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (role === 'PHARMACIST' && !formData.pharmacistData.licenseNumber) {
            toast.error('License number is required for pharmacists');
            return;
        }

        if (role === 'PHARMACIST' && !formData.pharmacistData.nic) {
            toast.error('NIC is required for pharmacists');
            return;
        }

        setLoading(true);

        try {
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: role,
                address: formData.address,
            };

            if (role === 'PHARMACIST') {
                userData.pharmacistData = formData.pharmacistData;
            }

            const response = await authService.register(userData);

            if (response.success) {
                if (role === 'PHARMACIST') {
                    // Clear the session since they are pending approval
                    authService.logout();
                    toast.success('Registration successful! Your account is pending admin approval.');
                    navigate('/login');
                } else {
                    toast.success('Registration successful! Welcome to Viduz Pharmacy!');
                    navigate('/products');
                    // Force a reload to update nav bars if needed, or rely on state
                    window.location.reload();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <img src={logo} alt="Viduz Pharmacy Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Join Viduz Pharmacy today</p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-10">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
                            I am registering as:
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('CUSTOMER')}
                                className={`p-5 border-2 rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${role === 'CUSTOMER'
                                    ? 'border-green-600 bg-green-50 text-green-700 shadow-md shadow-green-100'
                                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <span className="text-2xl">👤</span>
                                <span>Customer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('PHARMACIST')}
                                className={`p-5 border-2 rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${role === 'PHARMACIST'
                                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-md shadow-yellow-100'
                                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <span className="text-2xl">💊</span>
                                <span>Pharmacist</span>
                            </button>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Personal Information */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">1</div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Personal Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+94771234567"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">2</div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Delivery Address</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        required
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        required
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Province *
                                    </label>
                                    <select
                                        name="address.province"
                                        required
                                        value={formData.address.province}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
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
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.postalCode"
                                        required
                                        value={formData.address.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pharmacist Specific Fields */}
                        {role === 'PHARMACIST' && (
                            <div className="border-t border-gray-50 pt-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600 font-black text-xs">3</div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Professional Verification</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                            SLMC License Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.licenseNumber"
                                            required={role === 'PHARMACIST'}
                                            value={formData.pharmacistData.licenseNumber}
                                            onChange={handleChange}
                                            placeholder="SLMC12345"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                            NIC Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.nic"
                                            required={role === 'PHARMACIST'}
                                            value={formData.pharmacistData.nic}
                                            onChange={handleChange}
                                            placeholder="123456789V"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                            Qualifications
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.qualifications"
                                            value={formData.pharmacistData.qualifications}
                                            onChange={handleChange}
                                            placeholder="B.Pharm, M.Pharm"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            name="pharmacist.yearsOfExperience"
                                            value={formData.pharmacistData.yearsOfExperience}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                                        ⚠️ <strong>Verification Required:</strong> Your account will be manually reviewed by our medical board before you can access the pharmacist dashboard.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div className="border-t border-gray-50 pt-10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">{role === 'PHARMACIST' ? '4' : '3'}</div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Security</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength="6"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        minLength="6"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    role === 'PHARMACIST' 
                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-yellow-100' 
                                    : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
                                }`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-10 text-center border-t border-gray-50 pt-8">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="font-black text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4 decoration-blue-100 hover:decoration-blue-200 transition-all">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-xs text-gray-400 font-bold hover:text-gray-600 uppercase tracking-widest transition-all">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
