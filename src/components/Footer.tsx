
import React from 'react';
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onCategorySelect: (category: string) => void;
  categories: string[];
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect, categories }) => {
  const handleCategoryClick = (e: React.MouseEvent, cat: string) => {
    e.preventDefault();
    onCategorySelect(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-panorama-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        {/* Brand */}
        <div>
          <h2 
            className="text-4xl font-news font-black mb-4 cursor-pointer"
            onClick={(e) => handleCategoryClick(e, 'Inicio')}
          >
            Tendencia<span className="text-panorama-red">RD</span>
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Liderando el periodismo digital en la República Dominicana. Información veraz, oportuna e impactante para nuestra audiencia global.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-panorama-red transition-colors"><Facebook size={18}/></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-panorama-red transition-colors"><Instagram size={18}/></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-panorama-red transition-colors"><Youtube size={18}/></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-6 border-l-4 border-panorama-red pl-4">Secciones</h4>
          <ul className="space-y-3 text-sm text-white/60">
            {categories.filter(c => c !== 'Inicio' && c !== 'Contacto').map(cat => (
              <li key={cat}>
                <a href="#" onClick={(e) => handleCategoryClick(e, cat)} className="hover:text-white transition-colors">
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-lg mb-6 border-l-4 border-panorama-red pl-4">Contacto</h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-center">
              <MapPin size={16} className="mr-3 text-panorama-red" /> 
              Av. Winston Churchill, Santo Domingo, RD
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-3 text-panorama-red" /> 
              <a href="tel:+18097507423" className="hover:text-white transition-colors">+1 (809) 750-7423</a>
            </li>
            <li className="flex items-center">
              <Mail size={16} className="mr-3 text-panorama-red" /> 
              <a href="mailto:info@tendenciard.com.do" className="hover:text-white transition-colors">info@tendenciard.com.do</a>
            </li>
            <li className="flex items-center">
              <MessageCircle size={16} className="mr-3 text-green-500" /> 
              <a href="https://wa.me/18097507423" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Directo</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-lg mb-6 border-l-4 border-panorama-red pl-4">Boletín Diario</h4>
          <p className="text-white/60 text-sm mb-4">Recibe las noticias más importantes directamente en tu correo.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-panorama-red text-white"
            />
            <button className="bg-panorama-red hover:bg-panorama-darkRed px-4 py-2 rounded-r-lg font-bold transition-colors">Unirse</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
        <p>© {new Date().getFullYear()} TendenciaRD. Todos los derechos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Políticas de Privacidad</a>
          <a href="#" className="hover:text-white">Términos de Uso</a>
          <a href="#" className="hover:text-white">Publicidad</a>
        </div>
      </div>
    </footer>
  );
};
