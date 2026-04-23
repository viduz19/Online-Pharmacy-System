import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import UploadPrescription from '../pages/UploadPrescription';
import CustomerDashboard from '../pages/CustomerDashboard';
import PharmacistDashboard from '../pages/PharmacistDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminProducts from '../pages/AdminProducts';
import AdminUsers from '../pages/AdminUsers';
import AdminOrders from '../pages/AdminOrders';
import AdminReports from '../pages/AdminReports';
import AdminPrescriptions from '../pages/AdminPrescriptions';
import PharmacistPrescriptions from '../pages/PharmacistPrescriptions';
import PharmacistOrders from '../pages/PharmacistOrders';
import PharmacistProducts from '../pages/PharmacistProducts';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-4">Page not found</p>
            <a href="/" className="text-blue-600 hover:text-blue-700">Go back home</a>
        </div>
    </div>
);

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:orderId" element={<Checkout />} />

            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/upload-prescription" element={<UploadPrescription />} />

            {/* Pharmacist Routes */}
            <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
            <Route path="/pharmacist/prescriptions/pending" element={<PharmacistPrescriptions />} />
            <Route path="/pharmacist/prescriptions/approved" element={<PharmacistPrescriptions />} />
            <Route path="/pharmacist/prescriptions/rejected" element={<PharmacistPrescriptions />} />
            <Route path="/pharmacist/orders" element={<PharmacistOrders />} />
            <Route path="/pharmacist/products" element={<PharmacistProducts />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
            <Route path="/admin/revenue" element={<AdminReports />} />
            <Route path="/admin/reports" element={<AdminReports />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
