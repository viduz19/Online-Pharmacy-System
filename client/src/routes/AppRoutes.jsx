import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import UploadPrescription from '../pages/UploadPrescription';
import CustomerDashboard from '../pages/CustomerDashboard';
import PharmacistDashboard from '../pages/PharmacistDashboard';
import AdminDashboard from '../pages/AdminDashboard';

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

            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/upload-prescription" element={<UploadPrescription />} />

            {/* Pharmacist Routes */}
            <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
