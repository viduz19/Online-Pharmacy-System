import { MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';

function Help() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How can we help you?</h1>
                <p className="text-lg text-gray-600">Our pharmacists are ready to assist you with your medical needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {/* WhatsApp Support Box */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100 flex flex-col items-center text-center transform transition-all hover:scale-105">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <MessageCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">WhatsApp Support</h3>
                    <p className="text-gray-600 mb-8">Chat directly with our lead pharmacist for consultations, medicine availability, or order help.</p>
                    <WhatsAppButton 
                        phone="94774708984" // Pharmacy number
                        message="Hello Viduz Pharmacy, I need some assistance with my medical order."
                        label="Start Chat Now"
                    />
                </div>

                {/* Other Contact Info */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 flex flex-col space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Other Contact Methods</h3>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Call Us</p>
                            <p className="text-lg font-bold text-gray-900">+94 11 234 5678</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email Us</p>
                            <p className="text-lg font-bold text-gray-900">support@viduzpharmacy.lk</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-2xl">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Operating Hours</p>
                            <p className="text-sm font-bold text-gray-900">Mon - Sat: 8:00 AM - 10:00 PM</p>
                            <p className="text-sm font-bold text-gray-900">Sun: 9:00 AM - 5:00 PM</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-inner">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Physical Pharmacy</p>
                            <p className="text-sm font-bold text-gray-900">No 143, High level road,</p>
                            <p className="text-sm font-bold text-gray-900">Nugegoda, Sri Lanka</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Help;
