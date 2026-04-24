import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Shield, 
    Truck, 
    FileText, 
    MessageSquare, 
    Clock, 
    ArrowRight,
    CheckCircle2,
    Target,
    Zap,
    Package
} from 'lucide-react';
import logo from '../assets/Online Pharmacy System.png';

function About() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src={logo} alt="Viduz Pharmacy" className="h-12 w-auto group-hover:scale-105 transition-transform" />
                            <span className="text-xl font-black text-gray-900 tracking-tighter">Viduz<span className="text-blue-600">Pharmacy</span></span>
                        </Link>
                        <Link to="/" className="text-sm font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Established 2024
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-8">
                            Modernizing Healthcare in <span className="text-blue-600">Sri Lanka</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            Viduz Pharmacy is a modern online pharmacy system designed to make healthcare more accessible, convenient, and reliable for customers across the island.
                        </p>
                    </div>
                </div>
            </div>

            {/* Introduction & Mission */}
            <div className="py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Shield className="w-6 h-6" />
                                    </span>
                                    Introduction
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    The platform connects customers, pharmacists, and administrators in one system to provide a smooth and secure way to purchase medicines online. Our goal is to simplify the process of buying medicines while ensuring safety, accuracy, and proper medical verification for prescription-based drugs.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Target className="w-6 h-6" />
                                    </span>
                                    Our Mission
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    Our mission is to provide a safe, efficient, and user-friendly online pharmacy service that allows customers to easily access medicines while maintaining high standards of healthcare and trust.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 mt-12">
                                <p className="text-4xl font-black text-blue-600 tracking-tight mb-2">100%</p>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-tight">Verified Staff</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                                <p className="text-4xl font-black text-blue-600 tracking-tight mb-2">24/7</p>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-tight">System Access</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 mt-12">
                                <p className="text-4xl font-black text-blue-600 tracking-tight mb-2">Secure</p>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-tight">Data Encryption</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                                <p className="text-4xl font-black text-blue-600 tracking-tight mb-2">Fast</p>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-tight">Order Processing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What We Offer */}
            <div className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">What We Offer</h2>
                        <p className="text-gray-500 font-medium">A complete digital solution for pharmacy services</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Package, title: "OTC Medicines", desc: "Online browsing and purchasing of over-the-counter products." },
                            { icon: FileText, title: "Rx Verification", desc: "Secure prescription upload and pharmacist review process." },
                            { icon: MessageSquare, title: "Direct Chat", desc: "Communication between pharmacist and customer via WhatsApp." },
                            { icon: Zap, title: "Fast Processing", desc: "Automated workflows for fast and reliable order fulfillment." },
                            { icon: Truck, title: "Order Tracking", desc: "Real-time updates on your medicine delivery status." },
                            { icon: Shield, title: "Healthcare Standards", desc: "High standards of healthcare verification and trust." }
                        ].map((item, idx) => (
                            <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4">{item.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-32 bg-gray-900 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black tracking-tight mb-4 text-white">How the System Works</h2>
                        <p className="text-gray-400 font-medium">Simple 5-step process for your medication</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {[
                            { num: "01", title: "Search", desc: "Find OTC products directly" },
                            { num: "02", title: "Upload", desc: "Submit your prescription" },
                            { num: "03", title: "Review", desc: "Pharmacist verifies & prices" },
                            { num: "04", title: "Confirm", desc: "Review and make payment" },
                            { num: "05", title: "Deliver", desc: "Efficient medicine delivery" }
                        ].map((step, idx) => (
                            <div key={idx} className="relative">
                                <span className="text-6xl font-black text-white/5 absolute -top-8 -left-4 leading-none">{step.num}</span>
                                <h4 className="text-xl font-black mb-4 relative z-10">{step.title}</h4>
                                <p className="text-gray-400 text-sm font-medium relative z-10">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Future Vision */}
            <div className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-600 rounded-[3rem] p-12 lg:p-20 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-12 text-white">Future Vision</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    {[
                                        "Dedicated delivery rider system",
                                        "Integrated online payment gateways",
                                        "Native mobile application support"
                                    ].map((text, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/item:bg-white group-hover/item:text-blue-600 transition-colors">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <span className="text-lg font-bold text-blue-50">{text}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-6">
                                    {[
                                        "Advanced health services & reminders",
                                        "Digital health record integration",
                                        "Expanded pharmaceutical network"
                                    ].map((text, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/item:bg-white group-hover/item:text-blue-600 transition-colors">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <span className="text-lg font-bold text-blue-50">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                    </div>
                </div>
            </div>

            {/* Footer / CTA */}
            <footer className="py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Need Support?</h3>
                    <p className="text-gray-500 font-medium mb-10 max-w-xl mx-auto">
                        If you have any questions or need support, feel free to contact us through our platform. We are committed to protecting your privacy.
                    </p>
                    <Link 
                        to="/login"
                        className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
                    >
                        Contact Us Today
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2024 Viduz Pharmacy. All Rights Reserved.</span>
                        <div className="flex gap-8 text-xs font-black text-gray-400 uppercase tracking-widest">
                            <Link to="/" className="hover:text-blue-600">Home</Link>
                            <Link to="/products" className="hover:text-blue-600">Products</Link>
                            <Link to="/login" className="hover:text-blue-600">Login</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default About;
