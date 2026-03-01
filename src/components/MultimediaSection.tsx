
import React, { useState } from 'react';
import { MultimediaItem, MultimediaType } from '../types';
import { Play, Mic, Image as ImageIcon, X, ChevronLeft, ChevronRight, Share2, Calendar, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleShare } from '../utils';
import { NewsImage } from './NewsImage';

interface MultimediaSectionProps {
  items: MultimediaItem[];
}

export const MultimediaSection: React.FC<MultimediaSectionProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<MultimediaItem | null>(null);
  const [filter, setFilter] = useState<MultimediaType | 'all'>('all');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter);

  const openItem = (item: MultimediaItem) => {
    setSelectedItem(item);
    setCurrentGalleryIndex(0);
  };

  const closeItem = () => {
    setSelectedItem(null);
  };

  const nextGalleryImage = () => {
    if (selectedItem?.galleryImages) {
      setCurrentGalleryIndex((prev) => (prev + 1) % selectedItem.galleryImages!.length);
    }
  };

  const prevGalleryImage = () => {
    if (selectedItem?.galleryImages) {
      setCurrentGalleryIndex((prev) => (prev - 1 + selectedItem.galleryImages!.length) % selectedItem.galleryImages!.length);
    }
  };

  const getTypeIcon = (type: MultimediaType) => {
    switch (type) {
      case 'video': return <Play size={20} />;
      case 'audio': return <Mic size={20} />;
      case 'gallery': return <ImageIcon size={20} />;
    }
  };

  return (
    <div className="my-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b-4 border-panorama-navy pb-2 gap-4">
        <h2 className="text-3xl font-news font-black uppercase text-panorama-navy flex items-center">
          <span className="w-8 h-8 bg-panorama-red text-white flex items-center justify-center rounded-full mr-3 text-sm">M</span>
          Multimedia Interactiva
        </h2>
        
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          {(['all', 'video', 'audio', 'gallery'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === t ? 'bg-white text-panorama-red shadow-sm' : 'text-slate-500 hover:text-panorama-navy'
              }`}
            >
              {t === 'all' ? 'Todos' : t === 'video' ? 'Videos' : t === 'audio' ? 'Podcasts' : 'Galerías'}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => openItem(item)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all border border-slate-100"
            >
              <div className="aspect-video relative overflow-hidden">
                <NewsImage 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="transition-transform duration-500 group-hover:scale-110"
                  height="100%"
                />
                <div className="absolute inset-0 bg-panorama-navy/20 group-hover:bg-panorama-navy/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform group-hover:scale-110 transition-transform">
                    {getTypeIcon(item.type)}
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-panorama-navy/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  {item.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-news font-black text-panorama-navy text-lg leading-tight mb-2 group-hover:text-panorama-red transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                  <span className="text-panorama-red">Ver más →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest">No hay contenido multimedia disponible</p>
        </div>
      )}

      {/* Multimedia Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-panorama-darkNavy/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Player / Gallery Area */}
              <div className="w-full md:w-2/3 bg-panorama-darkNavy relative flex items-center justify-center min-h-[300px] md:min-h-0">
                <button 
                  onClick={closeItem}
                  className="absolute top-4 left-4 z-50 bg-white/10 hover:bg-panorama-red text-white p-2 rounded-full backdrop-blur-md transition-all md:hidden"
                >
                  <X size={20} />
                </button>

                {selectedItem.type === 'video' && (
                  <div className="w-full h-full aspect-video">
                    {selectedItem.url.includes('youtube.com') || selectedItem.url.includes('youtu.be') ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${selectedItem.url.split('v=')[1] || selectedItem.url.split('/').pop()}`}
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video src={selectedItem.url} controls className="w-full h-full object-contain" poster={selectedItem.thumbnail}></video>
                    )}
                  </div>
                )}

                {selectedItem.type === 'audio' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-panorama-navy to-panorama-darkNavy">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl mb-8 animate-pulse-slow">
                      <NewsImage src={selectedItem.thumbnail} alt="" height="100%" />
                    </div>
                    <audio src={selectedItem.url} controls className="w-full max-w-md custom-audio-player"></audio>
                    <div className="mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Podcast TendenciaRD</div>
                  </div>
                )}

                {selectedItem.type === 'gallery' && selectedItem.galleryImages && (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <NewsImage 
                      src={selectedItem.galleryImages[currentGalleryIndex]} 
                      alt="" 
                      height="100%"
                      objectFit="contain"
                    />
                    {selectedItem.galleryImages.length > 1 && (
                      <>
                        <button onClick={prevGalleryImage} className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all">
                          <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextGalleryImage} className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all">
                          <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedItem.galleryImages.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentGalleryIndex ? 'bg-panorama-red w-6' : 'bg-white/30'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="w-full md:w-1/3 p-6 md:p-10 overflow-y-auto bg-white relative">
                <button 
                  onClick={closeItem}
                  className="absolute top-6 right-6 text-slate-400 hover:text-panorama-red transition-colors hidden md:block"
                >
                  <X size={28} />
                </button>

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-panorama-navy text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">
                      {selectedItem.type}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{selectedItem.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-news font-black text-panorama-navy leading-tight mb-4">
                    {selectedItem.title}
                  </h2>
                  <div className="h-1 w-12 bg-panorama-red mb-6"></div>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleShare(selectedItem.title, selectedItem.description)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-panorama-navy py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 size={16} /> Compartir Multimedia
                  </button>
                  {selectedItem.type === 'video' && (
                    <a 
                      href={selectedItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-panorama-navy text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-all shadow-lg"
                    >
                      <ExternalLink size={16} /> Ver en Fuente Original
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
