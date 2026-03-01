import React, { useState } from 'react';

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  objectFit?: 'cover' | 'contain';
  height?: string | number;
  onClick?: () => void;
}

export const NewsImage: React.FC<NewsImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'video',
  objectFit = 'cover',
  height,
  onClick
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackImage = 'https://picsum.photos/seed/fallback/800/450?blur=2';

  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    auto: 'aspect-auto'
  }[aspectRatio];

  const fitClass = {
    cover: 'object-cover',
    contain: 'object-contain'
  }[objectFit];

  return (
    <div 
      className={`relative overflow-hidden bg-slate-100 ${aspectClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={height ? { height } : {}}
      onClick={onClick}
    >
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
          <div className="w-10 h-10 border-4 border-panorama-navy/10 border-t-panorama-red rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={error ? fallbackImage : src}
        alt={alt}
        className={`w-full h-full transition-all duration-700 ${fitClass} ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
