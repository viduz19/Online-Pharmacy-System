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
import AdminReports from '../pages/AdminReports';
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

            <Route path="/pharmacist/dashboard" element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                    <DashboardLayout><PharmacistDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardLayout><AdminDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                    <DashboardLayout><AdminProducts /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardLayout><AdminUsers /></DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardLayout><AdminReports /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
