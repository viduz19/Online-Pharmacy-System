import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api.service';
import toast from 'react-hot-toast';
import { Search, ShoppingCart } from 'lucide-react';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            🏥 Viduz Pharmacy
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">
                                Home
                            </Link>
                            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Products</h1>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for medicines..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                <div className="p-6">
                                    {/* Product Badge */}
                                    {product.prescriptionRequired && (
                                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-3">
                                            Prescription Required
                                        </span>
                                    )}
                                    {!product.prescriptionRequired && (
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
                                            OTC
                                        </span>
                                    )}

                                    {/* Product Info */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {product.genericName || product.brand}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {product.strength} - {product.dosageForm}
                                    </p>

                                    {/* Price & Stock */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-blue-600">
                                            Rs. {product.price}
                                        </span>
                                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        to="/login"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Login to Buy</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
