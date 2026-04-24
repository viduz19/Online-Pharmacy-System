import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';
import logo from "../assets/Online Pharmacy System.png";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            redirectBasedOnRole(user);
        }
    }, []);

    const redirectBasedOnRole = (user) => {
        switch (user?.role?.toUpperCase()) {
            case 'ADMIN':
                navigate('/admin/dashboard');
                break;
            case 'PHARMACIST':
                navigate('/pharmacist/dashboard');
                break;
            case 'CUSTOMER':
                navigate('/customer/dashboard');
                break;
            default:
                navigate('/');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);

            if (response.success) {
                toast.success('Login successful!');
                redirectBasedOnRole(response.data.user);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <img src={logo} alt="Viduz Pharmacy Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                            Viduz Pharmacy
                        </h1>
                        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Sign in to your account</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                                placeholder="admin@viduzpharmacy.lk"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-10 p-5 bg-blue-50 rounded-2xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3">Demo Credentials:</p>
                        <div className="space-y-2">
                            <p className="text-xs text-blue-700 font-medium">
                                <span className="opacity-60">Admin:</span> admin@viduzpharmacy.lk
                            </p>
                            <p className="text-xs text-blue-700 font-medium">
                                <span className="opacity-60">Customer:</span> kasun.perera@gmail.com
                            </p>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-black text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4 decoration-blue-100 hover:decoration-blue-200 transition-all">
                                Register here
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

export default Login;
