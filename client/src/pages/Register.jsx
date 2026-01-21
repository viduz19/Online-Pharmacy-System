import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            🏥 Create Account
                        </h1>
                        <p className="text-gray-600">Join Viduz Pharmacy today</p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            I am registering as:
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('CUSTOMER')}
                                className={`p-4 border-2 rounded-lg font-medium transition-all ${role === 'CUSTOMER'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                👤 Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('PHARMACIST')}
                                className={`p-4 border-2 rounded-lg font-medium transition-all ${role === 'PHARMACIST'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                💊 Pharmacist
                            </button>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+94771234567"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        required
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        required
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Province *
                                    </label>
                                    <select
                                        name="address.province"
                                        required
                                        value={formData.address.province}
                                        onChange={handleChange}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="address.postalCode"
                                        required
                                        value={formData.address.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pharmacist Specific Fields */}
                        {role === 'PHARMACIST' && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Professional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SLMC License Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.licenseNumber"
                                            required={role === 'PHARMACIST'}
                                            value={formData.pharmacistData.licenseNumber}
                                            onChange={handleChange}
                                            placeholder="SLMC12345"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIC Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.nic"
                                            required={role === 'PHARMACIST'}
                                            value={formData.pharmacistData.nic}
                                            onChange={handleChange}
                                            placeholder="123456789V"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Qualifications
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.qualifications"
                                            value={formData.pharmacistData.qualifications}
                                            onChange={handleChange}
                                            placeholder="B.Pharm, M.Pharm"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            name="pharmacist.yearsOfExperience"
                                            value={formData.pharmacistData.yearsOfExperience}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pharmacy Branch
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.pharmacyBranch"
                                            value={formData.pharmacistData.pharmacyBranch}
                                            onChange={handleChange}
                                            placeholder="Colombo Branch"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            name="pharmacist.specialization"
                                            value={formData.pharmacistData.specialization}
                                            onChange={handleChange}
                                            placeholder="Clinical Pharmacy"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ <strong>Note:</strong> Your pharmacist account will be pending admin approval after registration.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength="6"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        minLength="6"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
