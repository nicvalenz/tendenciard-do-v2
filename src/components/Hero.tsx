
import React from 'react';
import { NewsItem } from '../types';
import { TrendingUp, MessageCircle, Share2, Zap } from 'lucide-react';
import { handleShare } from '../utils';
import { NewsImage } from './NewsImage';

interface HeroProps {
  news: NewsItem[];
  onNewsClick?: (news: NewsItem) => void;
}

export const Hero: React.FC<HeroProps> = ({ news, onNewsClick }) => {
  const mainNews = news[0];
  const sideNews = news.slice(1, 3);

  if (!mainNews) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      {/* Main Feature */}
      <div 
        onClick={() => onNewsClick?.(mainNews)}
        className="lg:col-span-3 relative group overflow-hidden rounded-xl h-[350px] md:h-[500px] cursor-pointer"
      >
        <NewsImage 
          src={mainNews.imageUrl} 
          alt={mainNews.title} 
          className="transition-transform duration-700 group-hover:scale-105"
          height="100%"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full text-left">
          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-panorama-red text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded uppercase flex items-center shadow-lg">
              <Zap size={14} className="mr-1" /> Viral
            </span>
            <span className="text-white/90 text-xs md:text-sm font-bold uppercase tracking-wider drop-shadow-md">{mainNews.category}</span>
          </div>
          <h2 className="text-white text-xl md:text-4xl lg:text-5xl font-news font-black leading-tight mb-4 group-hover:underline drop-shadow-xl max-w-4xl">
            {mainNews.title}
          </h2>
          <p className="text-white/90 text-sm md:text-lg hidden md:block mb-6 max-w-2xl line-clamp-2 drop-shadow-md">
            {mainNews.excerpt}
          </p>
          <div className="flex items-center space-x-6 text-white/80">
            <button className="flex items-center space-x-1 hover:text-white"><MessageCircle size={18}/> <span>124</span></button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleShare(mainNews.title, mainNews.excerpt, mainNews.slug);
              }}
              className="flex items-center space-x-1 hover:text-white"
            >
              <Share2 size={18}/> <span>Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side Featured */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        {sideNews.map((news) => (
          <div 
            key={news.id} 
            onClick={() => onNewsClick?.(news)}
            className="relative group overflow-hidden rounded-xl h-[170px] md:h-[242px] cursor-pointer"
          >
            <NewsImage 
              src={news.imageUrl} 
              alt={news.title} 
              className="transition-transform duration-500 group-hover:scale-110"
              height="100%"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-panorama-navy to-transparent"></div>
            <div className="absolute bottom-0 p-4">
              <span className="text-panorama-red text-[10px] font-bold uppercase mb-1 block">{news.category}</span>
              <h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-3 group-hover:text-panorama-red">
                {news.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
