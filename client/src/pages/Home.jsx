import { Link } from 'react-router-dom';
import { ShoppingBag, Pill, Users, Shield } from 'lucide-react';

function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-600">🏥 Viduz Pharmacy</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/products"
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Products
                            </Link>
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Your Trusted Online Pharmacy
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Buy OTC medicines directly or upload prescriptions for verified medications.
                        Fast, secure, and reliable service across Sri Lanka.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/products"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                        <Link
                            to="/register"
                            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Easy Shopping
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Browse and buy OTC medicines with just a few clicks
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Prescription Service
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Upload prescriptions for verified medication delivery
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Expert Pharmacists
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Licensed pharmacists review all prescription orders
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Secure & Safe
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Your health data is protected with industry-standard security
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-20 bg-white rounded-2xl shadow-xl p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
                            <div className="text-gray-600">Products Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                            <div className="text-gray-600">Customer Support</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                            <div className="text-gray-600">Verified Medicines</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">🏥 Viduz Pharmacy</h2>
                        <p className="text-gray-400 mb-4">
                            Your trusted online pharmacy in Sri Lanka
                        </p>
                        <p className="text-gray-500 text-sm">
                            © 2026 Viduz Pharmacy. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
