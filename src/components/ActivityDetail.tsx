
import React from 'react';
import { Activity, PopupConfig } from '../types';
import { X, Calendar, MapPin, Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsImage } from './NewsImage';

interface ActivityDetailProps {
  activity: Activity | null;
  onClose: () => void;
  adConfig?: PopupConfig;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onClose, adConfig }) => {
  if (!activity) return null;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${activity.title} - TendenciaRD`;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-white overflow-y-auto"
      >
        {/* Floating Banner - Only covers the top "blue" part (header) */}
        {adConfig && (
          <div className="fixed top-0 left-0 right-0 z-[300] animate-in slide-in-from-top duration-500">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-panorama-navy text-white shadow-2xl rounded-b-3xl border-x border-b border-white/10 overflow-hidden relative h-20 flex items-center">
                <div className="container mx-auto px-6 flex items-center gap-4">
                  {adConfig.imageUrl && (
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-white/20">
                      <img src={adConfig.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-[10px] md:text-sm font-news font-black text-white leading-tight uppercase tracking-wider">
                      {adConfig.title}
                    </h3>
                    <p className="text-[9px] md:text-xs text-white/70 leading-tight line-clamp-1">
                      {adConfig.description}
                    </p>
                  </div>
                  <button className="flex-shrink-0 bg-panorama-red hover:bg-panorama-darkRed text-white font-black py-1.5 px-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[9px] md:text-[10px]">
                    {adConfig.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`max-w-4xl mx-auto px-4 py-12 relative ${adConfig ? 'pt-32' : ''}`}>
          {/* Close Button */}
          <button 
            onClick={onClose}
            className={`fixed ${adConfig ? 'top-24 md:top-28' : 'top-6'} right-6 z-50 bg-panorama-navy text-white p-3 rounded-full shadow-2xl hover:bg-panorama-red transition-all hover:rotate-90`}
          >
            <X size={24} />
          </button>

          {/* Header */}
          <header className="mb-10 text-center">
            <span className="inline-block bg-panorama-navy text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
              Actividad de la Semana
            </span>
            <h1 className="text-4xl md:text-6xl font-news font-black text-panorama-navy leading-tight mb-8">
              {activity.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest border-y border-slate-100 py-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-panorama-red" />
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-panorama-red" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <button onClick={() => handleShare('facebook')} className="hover:text-blue-600 transition-colors">
                  <Facebook size={18} />
                </button>
                <button onClick={() => handleShare('twitter')} className="hover:text-sky-400 transition-colors">
                  <Twitter size={18} />
                </button>
                <button onClick={() => handleShare('whatsapp')} className="hover:text-green-500 transition-colors">
                  <MessageCircle size={18} />
                </button>
                <button onClick={() => handleShare('copy')} className="hover:text-panorama-red transition-colors">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* Main Image */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <NewsImage 
              src={activity.imageUrl} 
              alt={activity.title} 
              height={450}
              aspectRatio="video"
            />
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            <div className="text-slate-800 text-lg md:text-xl leading-relaxed space-y-8 whitespace-pre-line font-serif mb-16">
              {activity.description}
            </div>

            {/* Gallery */}
            {activity.extraImages && activity.extraImages.length > 0 && (
              <div className="space-y-6 mb-16">
                <h3 className="text-2xl font-news font-black text-panorama-navy uppercase border-b-4 border-panorama-red inline-block pb-1">
                  Galería de Fotos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activity.extraImages.map((img, idx) => (
                    <div key={idx} className={`rounded-2xl overflow-hidden shadow-lg ${idx === 0 && activity.extraImages?.length === 3 ? 'md:col-span-2' : ''}`}>
                      <NewsImage 
                        src={img} 
                        alt="" 
                        className="hover:scale-105 transition-transform duration-500" 
                        height={300}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-20 pt-12 border-t-4 border-panorama-navy flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-panorama-navy rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl rotate-3">
                  T
                </div>
                <div>
                  <p className="font-black text-panorama-navy uppercase text-xl tracking-tight">TendenciaRD</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Periodismo de Verdad</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-panorama-navy font-black px-6 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  <Share2 size={18} /> Compartir
                </button>
                <button 
                  onClick={onClose}
                  className="bg-panorama-navy hover:bg-panorama-red text-white font-black px-10 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
                >
                  Cerrar Actividad
                </button>
              </div>
            </footer>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
