
import React, { useState } from 'react';
import { Activity } from '../types';
import { Calendar, MapPin, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { handleShare } from '../utils';
import { NewsImage } from './NewsImage';

interface ActivitySectionProps {
  activity: Activity;
  onActivityClick?: () => void;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({ activity, onActivityClick }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleOpenDetails = () => {
    setShowDetails(true);
    if (onActivityClick) onActivityClick();
  };
  
  const allImages = [activity.imageUrl, ...(activity.extraImages || [])].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="my-16">
      <div className="flex items-center justify-between mb-8 border-b-4 border-panorama-navy pb-2">
        <h2 
          className="text-3xl font-news font-black uppercase text-panorama-navy flex items-center cursor-pointer hover:text-panorama-red transition-colors"
          onClick={handleOpenDetails}
        >
          <span className="w-8 h-8 bg-panorama-red text-white flex items-center justify-center rounded-full mr-3 text-sm">A</span>
          Actividad de la Semana
        </h2>
      </div>
      
      <div className="relative group overflow-hidden rounded-3xl shadow-2xl h-[400px] md:h-[500px]">
        <NewsImage 
          src={activity.imageUrl} 
          alt={activity.title} 
          className="transition-transform duration-700 group-hover:scale-105 cursor-pointer"
          height="100%"
          onClick={handleOpenDetails}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-panorama-darkNavy via-panorama-darkNavy/40 to-transparent pointer-events-none"></div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center bg-panorama-red text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} className="mr-2" />
              {activity.date}
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <MapPin size={14} className="mr-2" />
              {activity.location}
            </div>
          </div>
          
          <h3 
            className="text-white text-3xl md:text-5xl font-news font-black mb-4 leading-tight cursor-pointer hover:text-panorama-red transition-colors"
            onClick={handleOpenDetails}
          >
            {activity.title}
          </h3>
          
          <p className="text-white/80 text-sm md:text-lg max-w-3xl mb-8 line-clamp-2">
            {activity.description}
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={handleOpenDetails}
              className="bg-panorama-red text-white hover:bg-panorama-darkRed px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl transform active:scale-95"
            >
              Ver Detalles
            </button>
            <button 
              onClick={() => handleShare(activity.title, `${activity.description}\n📍 ${activity.location}\n📅 ${activity.date}`)}
              className="bg-white text-panorama-navy hover:bg-slate-100 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl transform active:scale-95"
            >
              <Share2 size={18} />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-panorama-navy/90 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">
            <button 
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-white bg-panorama-navy/50 p-2 rounded-full hover:bg-panorama-red transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* Image Gallery */}
            <div className="w-full md:w-2/3 bg-panorama-navy relative flex items-center justify-center overflow-hidden h-64 md:h-[600px]">
              <NewsImage 
                src={allImages[currentImageIndex]} 
                alt={`Imagen ${currentImageIndex + 1}`}
                height="100%"
                objectFit="contain"
              />
              
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-panorama-red w-6' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <div className="w-full md:w-1/3 p-8 overflow-y-auto bg-white">
              <div className="mb-6">
                <span className="text-panorama-red font-black uppercase text-[10px] tracking-widest block mb-2">Actividad Destacada</span>
                <h2 className="text-3xl font-news font-black text-panorama-navy leading-tight mb-4">{activity.title}</h2>
                <div className="flex flex-col gap-2 text-slate-500 text-sm font-bold mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-panorama-red" />
                    {activity.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-panorama-red" />
                    {activity.location}
                  </div>
                </div>
                <div className="h-1 w-12 bg-panorama-red mb-6"></div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {activity.description}
                </p>
              </div>
              
              <button 
                onClick={() => handleShare(activity.title, `${activity.description}\n📍 ${activity.location}\n📅 ${activity.date}`)}
                className="w-full bg-panorama-navy text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
              >
                <Share2 size={18} /> Compartir Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
