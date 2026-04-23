import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { adminService } from '../services/api.service';
import toast from 'react-hot-toast';
import { 
    TrendingUp, 
    Calendar, 
    Download, 
    ArrowUpRight, 
    ArrowDownRight, 
    PlusCircle,
    FileText,
    Medal,
    DollarSign,
    PackageCheck
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

function AdminReports() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('daily');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchReports();
    }, [period, dateRange]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await adminService.getSalesReport({
                period,
                ...dateRange
            });
            if (response.success) {
                setReportData(response.data);
            }
        } catch (error) {
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const formatChartData = () => {
        if (!reportData?.sales) return [];
        return reportData.sales.map(item => {
            const dateStr = item._id.day 
                ? `${item._id.day}/${item._id.month}`
                : item._id.month 
                    ? `${item._id.month}/${item._id.year}`
                    : `Week ${item._id.week}`;
            return {
                name: dateStr,
                revenue: item.revenue,
                orders: item.orders
            };
        });
    };

    const totalRevenue = reportData?.sales?.reduce((sum, item) => sum + item.revenue, 0) || 0;
    const totalOrders = reportData?.sales?.reduce((sum, item) => sum + item.orders, 0) || 0;

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['daily', 'weekly', 'monthly'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                        period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input 
                                type="date" 
                                className="bg-transparent focus:outline-none"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                            />
                            <span>to</span>
                            <input 
                                type="date" 
                                className="bg-transparent focus:outline-none"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <button 
                        className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                        onClick={() => toast.success('Report export started...')}
                    >
                        <Download className="w-5 h-5" />
                        <span>Export Report</span>
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center justify-between opacity-80">
                            <p className="text-sm font-medium uppercase tracking-wider">Total Sales Revenue</p>
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="mt-4 flex items-baseline space-x-2">
                            <span className="text-3xl font-bold">Rs. {totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="mt-4 flex items-center text-blue-100 text-sm bg-white/10 w-fit px-3 py-1 rounded-full">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            <span>12.5% increment</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between text-gray-500">
                            <p className="text-sm font-medium uppercase tracking-wider">Total Orders</p>
                            <PackageCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="mt-4 flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-gray-900">{totalOrders}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            Across selected period
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between text-gray-500">
                            <p className="text-sm font-medium uppercase tracking-wider">Average Order Value</p>
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="mt-4 flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-gray-900">
                                Rs. {totalOrders > 0 ? (totalRevenue / totalOrders).toLocaleString() : '0'}
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            Per customer order
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-3 text-blue-600" />
                            Revenue Statistics
                        </h3>
                        <div className="h-80 w-full">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={formatChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#9ca3af', fontSize: 12}}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#9ca3af', fontSize: 12}}
                                            tickFormatter={(val) => `Rs.${val/1000}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '12px', border: 'none', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                            formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#2563eb" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                            <Medal className="w-5 h-5 mr-3 text-yellow-600" />
                            Top Selling Medicines
                        </h3>
                        <div className="space-y-6">
                            {loading ? (
                                <div className="h-full flex items-center justify-center pt-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : reportData?.topProducts?.length === 0 ? (
                                <p className="text-center text-gray-500 py-20">No sales records found</p>
                            ) : (
                                reportData?.topProducts?.map((product, index) => (
                                    <div key={product.id} className="flex items-center group">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{product.quantity} units</p>
                                            <p className="text-xs text-green-600">Rs. {product.revenue.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {!loading && reportData?.topProducts?.length > 0 && (
                            <button className="w-full mt-10 text-blue-600 font-semibold text-sm hover:underline">
                                View Full Inventory stats →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminReports;
