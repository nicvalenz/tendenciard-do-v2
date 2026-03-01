
import React from 'react';
import { Ad } from './Ads';
import { TrendingUp, Award, Video } from 'lucide-react';
import { NewsItem } from '../types';
import { NewsImage } from './NewsImage';

const TRENDS = [
  "Precio del dólar hoy RD",
  "Pelota Invernal Dominicana",
  "Conciertos en Santo Domingo 2024",
  "Vacantes de empleo Gobierno RD",
  "Visa Americana citas 2024"
];

interface SidebarProps {
  news: NewsItem[];
  onNewsClick?: (news: NewsItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ news, onNewsClick }) => {
  const mostRead = news.slice(0, 3);

  return (
    <aside className="w-full lg:w-[350px] flex-shrink-0">
      {/* Fixed Sidebar Ad */}
      <Ad size="sidebar" />

      {/* Trending Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="flex items-center font-black text-panorama-navy uppercase text-sm mb-6 border-b-2 border-panorama-red pb-2">
          <TrendingUp className="text-panorama-red mr-2" size={20} /> Tendencias RD
        </h3>
        <ul className="space-y-4">
          {TRENDS.map((trend, i) => (
            <li key={i} className="flex items-start space-x-3 group cursor-pointer">
              <span className="text-2xl font-black text-gray-100 group-hover:text-panorama-red/20 transition-colors">0{i+1}</span>
              <span className="text-slate-800 font-bold text-sm leading-tight hover:text-panorama-red transition-colors">{trend}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Most Read Mini Section */}
      <div className="bg-panorama-navy text-white rounded-xl p-6 mb-6">
        <h3 className="flex items-center font-black uppercase text-sm mb-6 border-b-2 border-panorama-red pb-2">
          <Award className="text-panorama-red mr-2" size={20} /> Más Leídas
        </h3>
        <div className="space-y-6">
          {mostRead.map(item => (
            <div 
              key={item.id} 
              onClick={() => onNewsClick?.(item)}
              className="group cursor-pointer"
            >
              <span className="text-[10px] text-panorama-red font-bold uppercase block mb-1">{item.category}</span>
              <h4 className="text-sm font-bold leading-tight group-hover:text-panorama-red transition-colors">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Video Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="flex items-center font-black text-panorama-navy uppercase text-sm mb-6 border-b-2 border-panorama-red pb-2">
          <Video className="text-panorama-red mr-2" size={20} /> Videos Virales
        </h3>
        <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center relative group overflow-hidden cursor-pointer mb-4">
          <NewsImage src="https://picsum.photos/seed/vid/400/225" alt="Video placeholder" height="100%" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
            <div className="w-12 h-12 bg-panorama-red rounded-full flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform">
              <div className="ml-1 w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent"></div>
            </div>
          </div>
        </div>
        <p className="text-xs font-bold text-slate-700">Resumen de noticias de hoy en 60 segundos</p>
      </div>

      <Ad size="sponsored" />
    </aside>
  );
};
