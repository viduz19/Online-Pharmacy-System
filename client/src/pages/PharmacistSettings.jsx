import { useState } from 'react';
import PharmacistLayout from '../components/layout/PharmacistLayout';
import { Settings, Bell, Shield, Moon, Globe, HelpCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import ChangePasswordModal from '../components/ChangePasswordModal';

function PharmacistSettings() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleItemClick = (item) => {
        if (item === 'Change Clinical Password' || item === 'Change Password') {
            setIsPasswordModalOpen(true);
        } else {
            toast.info(`${item} settings coming soon!`);
        }
    };

    const sections = [
        {
            title: 'Work Alerts',
            icon: Bell,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            items: ['New Prescription Alerts', 'Urgent Order Notifications', 'Low Stock Warnings']
        },
        {
            title: 'Clinical Security',
            icon: Shield,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            items: ['Two-Factor Authentication', 'Change Clinical Password', 'Login Activity']
        },
        {
            title: 'Communication',
            icon: MessageSquare,
            color: 'text-green-600',
            bg: 'bg-green-50',
            items: ['WhatsApp Integration', 'Auto-Reply Settings', 'Customer Message Templates']
        }
    ];

    return (
        <PharmacistLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pharmacist Settings</h1>
                    <p className="text-gray-500 font-medium mt-1">Configure your clinical workspace and notification preferences</p>
                </div>

                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                            <div className="p-8 border-b border-gray-50 flex items-center space-x-6 bg-gray-50/30">
                                <div className={`w-14 h-14 ${section.bg} ${section.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                    <section.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Clinical Configuration</p>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {section.items.map((item, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleItemClick(item)}
                                        className="w-full px-10 py-5 flex items-center justify-between hover:bg-gray-50/80 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">{item}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl">
                        <HelpCircle className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white/5" />
                        <div className="flex items-center space-x-6 relative z-10">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/10">
                                <HelpCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Need Clinical Assistance?</h3>
                                <p className="text-emerald-300/60 text-sm font-medium mt-1">Access the pharmacist handbook or contact system support.</p>
                            </div>
                        </div>
                        <button className="px-10 py-4 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition-all active:scale-95 text-xs uppercase tracking-widest relative z-10">
                            Handbook
                        </button>
                    </div>
                </div>
            </div>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </PharmacistLayout>
    );
}

export default PharmacistSettings;
