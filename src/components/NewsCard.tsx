
import React from 'react';
import { NewsItem } from '../types';
import { Share2, Clock, Zap } from 'lucide-react';
import { handleShare } from '../utils';
import { NewsImage } from './NewsImage';

interface Props {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
}

export const NewsCard: React.FC<Props> = ({ news, onClick }) => {
  return (
    <div 
      onClick={() => onClick?.(news)}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <NewsImage 
          src={news.imageUrl} 
          alt={news.title} 
          className="transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="bg-panorama-navy text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            {news.category}
          </span>
          {news.isViral && (
            <span className="bg-panorama-red text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center">
              <Zap size={10} className="mr-0.5" /> Viral
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-news font-bold text-xl text-panorama-navy leading-tight mb-2 group-hover:text-panorama-red transition-colors">
          {news.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
          {news.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-slate-400 text-[10px] font-semibold uppercase space-x-2">
            <span className="flex items-center"><Clock size={12} className="mr-1"/> {news.date}</span>
            <span>•</span>
            <span>Por {news.author}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleShare(news.title, news.excerpt, news.slug);
            }}
            className="text-slate-400 hover:text-green-600 transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
