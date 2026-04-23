import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import UploadPrescription from '../pages/UploadPrescription';
import Help from '../pages/Help';
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
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';

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

            {/* Dashboards with Sidebar Layout */}
            <Route path="/customer/dashboard" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <DashboardLayout><CustomerDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/customer/upload-prescription" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <DashboardLayout><UploadPrescription /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/customer/help" element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <DashboardLayout><Help /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Pharmacist Routes */}
            <Route path="/pharmacist/dashboard" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <PharmacistDashboard />
                </ProtectedRoute>
            } />
            <Route path="/pharmacist/prescriptions/pending" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <PharmacistPrescriptions />
                </ProtectedRoute>
            } />
            <Route path="/pharmacist/prescriptions/approved" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <PharmacistPrescriptions />
                </ProtectedRoute>
            } />
            <Route path="/pharmacist/prescriptions/rejected" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <PharmacistPrescriptions />
                </ProtectedRoute>
            } />
            <Route path="/pharmacist/orders" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <PharmacistOrders />
                </ProtectedRoute>
            } />
            <Route path="/pharmacist/products" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <PharmacistProducts />
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                    <AdminProducts />
                </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminOrders />
                </ProtectedRoute>
            } />
            <Route path="/admin/prescriptions" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminPrescriptions />
                </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminReports />
                </ProtectedRoute>
            } />
            <Route path="/admin/revenue" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminReports />
                </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
