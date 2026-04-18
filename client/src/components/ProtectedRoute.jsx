import { Navigate } from 'react-router-dom';
import { authService } from '../services/api.service';

function ProtectedRoute({ children, allowedRoles = [] }) {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const userRole = user?.role?.toUpperCase();
        const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());
        
        if (!normalizedAllowedRoles.includes(userRole)) {
            // Redirect to their own dashboard if role doesn't match
            const dashboardMap = {
                'ADMIN': '/admin/dashboard',
                'PHARMACIST': '/pharmacist/dashboard',
                'CUSTOMER': '/customer/dashboard'
            };
            return <Navigate to={dashboardMap[userRole] || '/'} replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
