
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { NewsItem } from '../types';
import { X, Calendar, User, Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { NewsImage } from './NewsImage';
import { getNewsBySlug } from '../services/firebaseService';
import { Helmet } from 'react-helmet-async';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getNewsBySlug(slug).then(data => {
        setNews(data);
        setLoading(false);
      });
    }
  }, [slug]);

  const handleShare = (platform: string) => {
    if (!news) return;
    const publicUrl = `${window.location.origin}/noticia/${news.slug}`;
    const text = `${news.title} - TendenciaRD`;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${publicUrl}`)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(publicUrl);
      alert('Enlace público copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-panorama-red"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-2xl font-bold text-panorama-navy mb-4">Noticia no encontrada</h2>
        <Link to="/" className="text-panorama-red font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white overflow-y-auto"
    >
      <Helmet>
        <title>{news.title} | TendenciaRD</title>
        <meta name="description" content={news.excerpt} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt} />
        <meta property="og:image" content={news.imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.excerpt} />
        <meta name="twitter:image" content={news.imageUrl} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        {/* Back Button */}
        <Link 
          to="/"
          className="fixed top-6 left-6 z-50 bg-panorama-navy text-white p-3 rounded-full shadow-2xl hover:bg-panorama-red transition-all"
        >
          <ArrowLeft size={24} />
        </Link>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <span className="inline-block bg-panorama-red text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
            {news.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-news font-black text-panorama-navy leading-tight mb-8">
            {news.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest border-y border-slate-100 py-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-panorama-red" />
              <span>Por {news.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-panorama-red" />
              <span>{news.date}</span>
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

        {/* Featured Image */}
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <NewsImage 
            src={news.imageUrl} 
            alt={news.title} 
            aspectRatio="video"
          />
        </div>

        {/* Article Content */}
        <div className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-10 italic border-l-4 border-panorama-red pl-6 py-2">
            {news.excerpt}
          </p>
          
          <div className="text-slate-800 text-lg md:text-xl leading-relaxed space-y-8 whitespace-pre-line font-serif">
            {news.content || "Contenido completo no disponible."}
          </div>

          {/* Article Footer */}
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
              <Link 
                to="/"
                className="bg-panorama-navy hover:bg-panorama-red text-white font-black px-10 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Volver al inicio
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
};
