import CustomerLayout from '../components/layout/CustomerLayout';
import { Settings, Bell, Shield, Moon, Globe, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function CustomerSettings() {
    const sections = [
        {
            title: 'Notifications',
            icon: Bell,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            items: ['Email Notifications', 'Order Status Updates', 'Promotions & Offers']
        },
        {
            title: 'Security',
            icon: Shield,
            color: 'text-green-600',
            bg: 'bg-green-50',
            items: ['Change Password', 'Two-Factor Authentication', 'Login History']
        },
        {
            title: 'Preferences',
            icon: Moon,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            items: ['Dark Mode', 'Language', 'Currency']
        }
    ];

    return (
        <CustomerLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your account preferences and security</p>
                </div>

                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center space-x-4">
                                <div className={`w-10 h-10 ${section.bg} ${section.color} rounded-xl flex items-center justify-center`}>
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {section.items.map((item, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => toast.info(`${item} settings coming soon!`)}
                                        className="w-full px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <span className="text-sm font-medium text-gray-700">{item}</span>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-gray-900 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold">Need more help?</h3>
                                <p className="text-gray-400 text-sm">Check our help center or contact support.</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                            Help Center
                        </button>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

export default CustomerSettings;
