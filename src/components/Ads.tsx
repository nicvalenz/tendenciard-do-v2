
import React from 'react';
import { AdProps } from '../types';
import { NewsImage } from './NewsImage';

export const Ad: React.FC<AdProps> = ({ size, label, imageUrl }) => {
  const styles = {
    leaderboard: "w-full h-[90px] md:max-w-[728px] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center mx-auto mb-6 overflow-hidden",
    sidebar: "w-full h-[600px] bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center mx-auto mb-6",
    sponsored: "w-full h-[250px] bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4"
  };

  return (
    <div className={styles[size]}>
      {imageUrl ? (
        <NewsImage src={imageUrl} alt={label || 'Ad'} height="100%" />
      ) : (
        <div className="text-center">
          <span className="text-[10px] text-gray-500 block uppercase mb-2 tracking-widest">Publicidad</span>
          {size === 'sponsored' ? (
            <div className="flex flex-col items-center">
              <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
              <p className="text-sm font-bold text-gray-700 leading-tight">Artículos patrocinados que podrían interesarte</p>
            </div>
          ) : (
            <span className="text-gray-400 font-bold italic">{label || (size === 'leaderboard' ? '728 x 90 Ad Space' : '300 x 600 Ad Space')}</span>
          )}
        </div>
      )}
    </div>
  );
};
