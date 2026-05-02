import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
    return (
        <Router>
            <CartProvider>
                <NotificationProvider>
                    <div className="min-h-screen bg-gray-50">
                        <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </div>
                </NotificationProvider>
            </CartProvider>
        </Router>
    );
}

export default App;
