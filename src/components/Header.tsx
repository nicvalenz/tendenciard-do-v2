
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Youtube, Search, Share2, MessageCircle, ExternalLink } from 'lucide-react';
import { CATEGORIES, BREAKING_NEWS } from '../constants';
import { Sponsor } from '../types';

interface HeaderProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: string[];
  sponsors: Sponsor[];
}

const SponsorItem: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => (
  <a 
    href={sponsor.link || '#'} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center hover:shadow-md transition-all group"
  >
    <img src={sponsor.imageUrl} alt="Sponsor" className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform" />
  </a>
);

export const Header: React.FC<HeaderProps> = ({ selectedCategory, onCategorySelect, categories, sponsors }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const activeSponsors = sponsors.filter(s => s.isActive);
  const leftSponsors = activeSponsors.slice(0, 3);
  const rightSponsors = activeSponsors.slice(3, 6);

  const getCategoryPath = (cat: string) => {
    if (cat === 'Inicio') return '/';
    if (cat === 'Política RD') return '/politica-rd';
    if (cat === 'Actividad Semanal') return '/actividad-semanal';
    return `/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`;
  };

  const handleCategoryClick = (cat: string) => {
    onCategorySelect(cat);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-10 z-50">
      {/* Top Bar: Social & Search */}
      <div className="bg-panorama-navy text-white py-2 px-4 md:px-8 flex justify-between items-center text-xs">
        <div className="flex space-x-4 items-center">
          <span className="hidden md:inline font-semibold">Síguenos en:</span>
          <a href="#" className="hover:text-panorama-red transition-colors"><Facebook size={16} /></a>
          <a href="#" className="hover:text-panorama-red transition-colors"><Instagram size={16} /></a>
          <a href="#" className="hover:text-panorama-red transition-colors"><Youtube size={16} /></a>
          <a href="#" className="hover:text-green-500 transition-colors"><MessageCircle size={16} /></a>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">{new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <button className="hover:text-panorama-red"><Search size={16} /></button>
        </div>
      </div>

      {/* Main Branding & Sponsors */}
      <div className="py-6 px-4 md:px-8 flex flex-col items-center border-b border-gray-100">
        <div className="w-full max-w-7xl flex items-center justify-between gap-4">
          {/* Left Sponsors */}
          <div className="hidden lg:flex items-center gap-3 w-1/4 justify-start">
            {leftSponsors.map(s => <SponsorItem key={s.id} sponsor={s} />)}
            {leftSponsors.length < 3 && Array(3 - leftSponsors.length).fill(0).map((_, i) => (
              <div key={`empty-l-${i}`} className="w-16 h-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <ExternalLink size={16} />
              </div>
            ))}
          </div>

          {/* Logo */}
          <Link 
            to="/"
            onClick={() => handleCategoryClick('Inicio')}
            className="flex flex-col items-center group cursor-pointer flex-grow"
          >
            <h1 className="text-4xl md:text-6xl font-news font-black text-panorama-navy tracking-tighter">
              Tendencia<span className="text-panorama-red">RD</span>
            </h1>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1 text-center">
              La noticia que conecta contigo
            </p>
          </Link>

          {/* Right Sponsors */}
          <div className="hidden lg:flex items-center gap-3 w-1/4 justify-end">
            {rightSponsors.map(s => <SponsorItem key={s.id} sponsor={s} />)}
            {rightSponsors.length < 3 && Array(3 - rightSponsors.length).fill(0).map((_, i) => (
              <div key={`empty-r-${i}`} className="w-16 h-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <ExternalLink size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sponsors (Horizontal Scroll) */}
      <div className="lg:hidden flex items-center gap-3 overflow-x-auto px-4 py-3 border-b border-slate-50 scrollbar-hide">
        {activeSponsors.map(s => <SponsorItem key={s.id} sponsor={s} />)}
      </div>

      {/* Breaking News Ticker */}
      <div className="bg-panorama-navy overflow-hidden py-2 relative flex items-center">
        <div className="bg-panorama-red text-white font-bold px-4 py-1 absolute left-0 z-10 shadow-lg text-xs md:text-sm uppercase">
          Última Hora
        </div>
        <div className="flex animate-ticker whitespace-nowrap pl-[120px]">
          {BREAKING_NEWS.map((news, i) => (
            <span key={i} className="text-white font-bold mx-8 text-sm md:text-base">
              {news} <span className="mx-4">•</span>
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {BREAKING_NEWS.map((news, i) => (
            <span key={i + 10} className="text-white font-bold mx-8 text-sm md:text-base">
              {news} <span className="mx-4">•</span>
            </span>
          ))}
        </div>
      </div>

      <nav className="hidden lg:flex justify-center bg-white border-b border-gray-100 py-3">
        <ul className="flex space-x-8">
          {categories.map((cat) => (
            <li key={cat}>
              <NavLink 
                to={getCategoryPath(cat)}
                onClick={() => handleCategoryClick(cat)}
                className={({ isActive }) => `
                  text-sm font-bold uppercase transition-all duration-300 relative group px-1 py-2
                  ${isActive ? 'text-panorama-red font-black' : 'text-[#1E3A8A] hover:text-panorama-red'}
                `}
              >
                {cat}
                <span className="absolute bottom-0 left-0 h-0.5 bg-panorama-red transition-all duration-300 w-0 group-hover:w-full"></span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-panorama-red transition-all duration-300 ${location.pathname === getCategoryPath(cat) ? 'w-full' : 'w-0'}`}></span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden p-4 flex justify-between items-center bg-white border-b border-gray-100">
        <span className="font-bold uppercase text-xs tracking-widest text-[#1E3A8A]">Secciones</span>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-[#1E3A8A]">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col p-4">
            {categories.map((cat) => (
              <li key={cat} className="border-b border-gray-50 last:border-0">
                <NavLink 
                  to={getCategoryPath(cat)}
                  className={({ isActive }) => `
                    block py-3 text-lg font-bold uppercase tracking-tight transition-all duration-300
                    ${isActive ? 'text-panorama-red font-black' : 'text-[#1E3A8A]'}
                  `}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
