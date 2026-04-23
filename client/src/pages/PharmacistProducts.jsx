import { useState, useEffect } from 'react';
import { productService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    Package, 
    Search, 
    AlertCircle, 
    TrendingDown, 
    TrendingUp, 
    RefreshCw,
    Filter,
    ChevronDown,
    Activity,
    Thermometer,
    Droplets
} from 'lucide-react';
import PharmacistLayout from '../components/layout/PharmacistLayout';

function PharmacistProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts({ limit: 100 });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || product.category?.name === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

    return (
        <PharmacistLayout>
            <div className="space-y-8 font-poppins antialiased">
                {/* Header & Stats Bundle */}
                <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            <Package className="w-8 h-8 mr-3 text-teal-600" />
                            Inventory Management
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium italic opacity-80">Monitoring medical stock levels and prescription requirements</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-red-50 px-6 py-4 rounded-3xl border border-red-100 flex items-center space-x-4 shadow-sm shadow-red-50">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-red-600 leading-none">{lowStockCount}</p>
                                <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mt-1">Low Stock Alerts</p>
                            </div>
                        </div>
                        
                        <div className="bg-teal-50 px-6 py-4 rounded-3xl border border-teal-100 flex items-center space-x-4 shadow-sm shadow-teal-50">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-teal-600 leading-none">{products.length}</p>
                                <p className="text-[10px] font-bold text-teal-800 uppercase tracking-widest mt-1">Total SKU Count</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find medicine by brand or generic name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent border-none rounded-3xl focus:ring-4 focus:ring-teal-50 text-base font-medium placeholder:text-gray-400 transition-all font-poppins"
                        />
                    </div>
                    <div className="h-10 w-[1.5px] bg-gray-100 hidden md:block mx-2"></div>
                    <div className="flex items-center pr-2">
                        <button className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 rounded-3xl transition-all group">
                            <Filter className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">Filter By Category</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                            onClick={fetchProducts}
                            className="p-4 hover:bg-teal-50 text-gray-400 hover:text-teal-600 rounded-2xl transition-all active:rotate-180 duration-500"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/20 border border-gray-50 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-40">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em] font-poppins">Product Identity</th>
                                        <th className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em] font-poppins">Technical Spec</th>
                                        <th className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em] font-poppins">Stock Status</th>
                                        <th className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em] font-poppins text-right">Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="group hover:bg-teal-50/30 transition-all duration-300">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform border border-gray-100 flex items-center justify-center">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-8 h-8 text-gray-200" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <p className="text-base font-extrabold text-gray-900 group-hover:text-teal-700 transition-colors">{product.name}</p>
                                                            {product.prescriptionRequired && (
                                                                <span className="bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded uppercase flex items-center shadow-sm">
                                                                    Rx Only
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Brand: {product.brand || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-1.5 font-poppins">
                                                    <div className="flex items-center text-xs font-bold text-gray-600">
                                                        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2"></span>
                                                        {product.dosageForm || 'Unknown'}
                                                    </div>
                                                    <div className="flex items-center text-xs font-bold text-gray-400 opacity-80">
                                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                                                        {product.strength || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center">
                                                        <span className={`text-sm font-black mr-3 ${product.stock <= product.lowStockThreshold ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
                                                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-1000 ${product.stock <= product.lowStockThreshold ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-teal-500'}`}
                                                                style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    {product.stock <= product.lowStockThreshold && (
                                                        <span className="text-[10px] font-extrabold text-red-600 uppercase flex items-center animate-pulse tracking-tight">
                                                            <AlertCircle className="w-3 h-3 mr-1" /> Critical Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="space-y-0.5">
                                                    <p className="text-xl font-black text-gray-900 tracking-tighter">Rs. {product.price.toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">Per Pack / Unit</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </PharmacistLayout>
    );
}

export default PharmacistProducts;
