import { MessageCircle } from 'lucide-react';

function WhatsAppButton({ phone, message, label = 'Message on WhatsApp' }) {
    if (!phone) return null;

    // Remove any special characters from phone number
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Add Sri Lanka country code if not present (assuming default)
    const finalPhone = cleanPhone.startsWith('94') ? cleanPhone : `94${cleanPhone.startsWith('0') ? cleanPhone.substring(1) : cleanPhone}`;

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
        >
            <MessageCircle className="w-5 h-5" />
            <span>{label}</span>
        </a>
    );
}

export default WhatsAppButton;
