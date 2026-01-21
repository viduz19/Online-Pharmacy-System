import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService, authService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getProducts({ search });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleAddToCart = (product) => {
        if (!user) {
            navigate('/login');
            toast.error('Please login to buy products');
            return;
        }

        if (user.role !== 'customer') {
            toast.error('Only customers can buy products');
            return;
        }

        if (product.prescriptionRequired) {
            navigate('/customer/upload-prescription', { state: { product } });
            toast.info('This medicine requires a prescription. Please upload it.');
            return;
        }

        toast.success(`${product.name} added to cart!`);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'pharmacist') return '/pharmacist/dashboard';
        return '/customer/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
                            🏥 <span className="ml-2">Viduz Pharmacy</span>
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                Home
                            </Link>
                            {user ? (
                                <>
                                    <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-red-600 font-medium flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-1" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Our Medicines</h1>
                    <p className="text-gray-600 mb-6">Browse our wide range of quality pharmaceutical products</p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto md:mx-0">
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for medicines (e.g. Panadol, Samahan)..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Finding best medicines for you...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or contact support.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="p-6">
                                    {/* Product Badge */}
                                    <div className="flex justify-between items-start mb-4">
                                        {product.prescriptionRequired ? (
                                            <span className="inline-flex items-center bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md border border-red-100 uppercase tracking-wider">
                                                <FileText className="w-3 h-3 mr-1" />
                                                Prescription
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md border border-green-100 uppercase tracking-wider">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                OTC
                                            </span>
                                        )}
                                        <span className="text-blue-600 font-bold text-xl">
                                            Rs. {product.price}
                                        </span>
                                    </div>

                                    {/* Product Info */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mb-1">
                                        {product.genericName || product.brand}
                                    </p>
                                    <p className="text-xs text-gray-400 mb-4 bg-gray-50 inline-block px-2 py-1 rounded">
                                        {product.strength} - {product.dosageForm}
                                    </p>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0}
                                        className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${product.stock <= 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
                                            }`}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>
                                            {!user ? 'Login to Buy' : product.prescriptionRequired ? 'Order Prescription' : 'Add to Cart'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Add missing icons from lucide-react
import { FileText, CheckCircle } from 'lucide-react';

export default Products;
