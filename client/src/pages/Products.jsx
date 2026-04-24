import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService, authService } from '../services/api.service';
import { useCart } from '../context/CartContext';
import CustomerLayout from '../components/layout/CustomerLayout';
import toast from 'react-hot-toast';
import { Search, ShoppingCart, User, LogOut, FileText, CheckCircle, Package, Info } from 'lucide-react';

import logo from "../assets/Online Pharmacy System.png";

function Products() {
    const navigate = useNavigate();
    const { addToCart, getCartCount } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const user = authService.getCurrentUser();
    const isCustomer = user?.role?.toUpperCase() === 'CUSTOMER';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
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

        if (!isCustomer) {
            toast.error('Only customers can buy products');
            return;
        }

        if (product.prescriptionRequired) {
            navigate('/customer/upload-prescription', { state: { product } });
            toast.info('This medicine requires a prescription. Please upload it.');
            return;
        }

        addToCart(product);
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

    const ProductContent = (
        <div className={isCustomer ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
            {/* Header & Search */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Our Pharmacy</h1>
                    <p className="text-gray-500 font-medium">Browse our wide range of quality pharmaceutical products</p>
                </div>

                <form onSubmit={handleSearch} className="w-full md:w-96">
                    <div className="relative group">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search medicines..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm group-hover:shadow-md transition-all"
                        />
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                </form>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Pharmacy...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            {/* Product Header */}
                            <div className="p-6 pb-0 flex justify-between items-start">
                                <div className={`p-2 rounded-xl ${product.prescriptionRequired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {product.prescriptionRequired ? <FileText className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                    <p className="text-xl font-black text-blue-600">Rs. {product.price}</p>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-3">
                                    {product.genericName || product.brand}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                                        {product.strength}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                                        {product.dosageForm}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className={`flex items-center space-x-1.5 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            {product.stock > 0 ? `${product.stock} Stock` : 'Out of Stock'}
                                        </span>
                                    </div>
                                    {product.prescriptionRequired && (
                                        <div className="group/info relative">
                                            <Info className="w-4 h-4 text-gray-300 cursor-help" />
                                            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none shadow-xl z-10 font-medium leading-relaxed">
                                                This medicine requires a valid prescription to be uploaded.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock <= 0}
                                    className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 ${product.stock <= 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl shadow-blue-100 active:scale-95'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>
                                        {!user ? 'Login to Buy' : product.prescriptionRequired ? 'Order Presc.' : 'Add to Cart'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (isCustomer) {
        return <CustomerLayout>{ProductContent}</CustomerLayout>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Public Navigation */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={logo} alt="Viduz Pharmacy Logo" className="w-10 h-10 object-contain" />
                            <h1 className="text-xl font-bold text-blue-600">Viduz Pharmacy</h1>
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-bold text-sm uppercase tracking-wider">Home</Link>
                            
                            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                                <ShoppingCart className="w-6 h-6" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <Link to={getDashboardLink()} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-100">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-100">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {ProductContent}
        </div>
    );
}

export default Products;
