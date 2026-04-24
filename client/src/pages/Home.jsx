import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Pill, Users, Shield, User, LogOut, ShoppingCart, ArrowRight, Play } from 'lucide-react';
import { authService } from '../services/api.service';
import toast from 'react-hot-toast';
import heroImage from '../assets/Hero image.png';
import logo from '../assets/Online Pharmacy System.png';

function Home() {
    const user = authService.getCurrentUser();
    const { getCartCount } = useCart();

    const handleLogout = () => {
        authService.logout();
        window.location.reload();
        toast.success('Logged out successfully');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        const role = user.role?.toUpperCase();
        if (role === 'ADMIN') return '/admin/dashboard';
        if (role === 'PHARMACIST') return '/pharmacist/dashboard';
        return '/customer/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                            <span className="text-xl font-black text-gray-900 tracking-tight">Viduz Pharmacy System</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-10">
                            <Link to="/products" className="text-gray-900 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-all">Products</Link>
                            <Link to="/about" className="text-gray-900 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-all">About</Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            {/* Cart Icon */}
                            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-110">
                                <ShoppingCart className="w-6 h-6" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg border-2 border-white">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-6">
                                    <Link
                                        to={getDashboardLink()}
                                        className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-blue-100 transition-all"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 font-black text-xs uppercase tracking-widest flex items-center hover:text-red-600 transition-all"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-900 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-all"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side: Image */}
                        <div className="relative order-2 lg:order-1 group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative bg-white rounded-[3rem] p-4 shadow-2xl shadow-blue-100/50 overflow-hidden">
                                <img
                                    src={heroImage}
                                    alt="Medical Care"
                                    className="w-full h-auto rounded-[2.5rem] transform transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 animate-bounce-slow">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Safe & Secure</p>
                                        <p className="text-sm font-bold text-gray-900">Verified Medications</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                Now Serving All Districts
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                Your Trusted <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Online Pharmacy
                                </span>
                            </h1>

                            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                                Buy OTC medicines directly or upload prescriptions for verified medications.
                                Licensed pharmacists review every order for your safety.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    to="/products"
                                    className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl shadow-gray-200 flex items-center gap-3 group active:scale-95"
                                >
                                    Browse Products
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    How it Works
                                </button>
                            </div>

                            <div className="flex items-center gap-8 pt-8 border-t border-gray-50">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                        +5k
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 tracking-tight">5,000+ Happy Customers</p>
                                    <p className="text-xs font-medium text-gray-400">Across Sri Lanka</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Our Services</h2>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight">Why Choose Viduz Pharmacy?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                <ShoppingBag className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Easy Shopping</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                Browse and buy OTC medicines with just a few clicks through our intuitive interface.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                                <Pill className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Prescription Service</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                Securely upload prescriptions for verified medication delivery directly to your doorstep.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Expert Review</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                Licensed pharmacists carefully review all prescription orders before final approval.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Secure & Safe</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                Your health data and transactions are protected with military-grade encryption.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="Logo" className="w-12 h-12 object-contain brightness-0 invert" />
                                <span className="text-2xl font-black tracking-tight">Viduz Pharmacy</span>
                            </div>
                            <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
                                Providing accessible, safe, and reliable pharmaceutical services across Sri Lanka.
                                Your health is our priority.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-500">Quick Links</h4>
                            <ul className="space-y-4 font-bold text-sm text-gray-300">
                                <li><Link to="/products" className="hover:text-blue-400 transition-colors">All Products</Link></li>
                                <li><Link to="/customer/upload-prescription" className="hover:text-blue-400 transition-colors">Upload Rx</Link></li>
                                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Support</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-500">Contact</h4>
                            <ul className="space-y-4 font-bold text-sm text-gray-300">
                                <li className="flex items-center gap-2">support@viduzpharmacy.lk</li>
                                <li className="flex items-center gap-2">+94 11 234 5678</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            © 2026 Viduz Pharmacy. All rights reserved.
                        </p>
                        <div className="flex gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
