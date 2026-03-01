
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { NewsCard } from './components/NewsCard';
import { Sidebar } from './components/Sidebar';
import { Ad } from './components/Ads';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { ActivitySection } from './components/ActivitySection';
import { MultimediaSection } from './components/MultimediaSection';
import { NewsDetail } from './components/NewsDetail';
import { ActivityDetail } from './components/ActivityDetail';
import { PollSection } from './components/PollSection';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MOCK_NEWS, MOCK_ADS, DEFAULT_POPUP_CONFIG, DEFAULT_ACTIVITY, DEFAULT_LARGE_POPUP_CONFIG, MOCK_MULTIMEDIA, CATEGORIES, MOCK_POLLS, MOCK_SPONSORS, DEFAULT_POLL_BANNER, DEFAULT_FLOATING_BANNER } from './constants';
import { NewsItem, AdItem, PopupConfig, Activity, LargePopupConfig, MultimediaItem, Poll, Sponsor, PollBannerConfig, FloatingBannerConfig } from './types';
import { X, Bell, MessageCircle, Settings, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { subscribeToNews, subscribeToPolls, subscribeToSponsors, subscribeToAds, subscribeToPollBanner, voteInPoll, subscribeToConfig, checkEmailSubscription, addSubscriber, generateSlug } from './services/firebaseService';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLargePopup, setShowLargePopup] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Inicio');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [popupPosition, setPopupPosition] = useState(0); 
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ads, setAds] = useState<AdItem[]>([]);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>(DEFAULT_POPUP_CONFIG);
  const [activity, setActivity] = useState<Activity>(DEFAULT_ACTIVITY);
  const [largePopupConfig, setLargePopupConfig] = useState<LargePopupConfig>(DEFAULT_LARGE_POPUP_CONFIG);
  const [multimedia, setMultimedia] = useState<MultimediaItem[]>(MOCK_MULTIMEDIA);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [pollBanner, setPollBanner] = useState<PollBannerConfig>(DEFAULT_POLL_BANNER);
  const [floatingBanner, setFloatingBanner] = useState<FloatingBannerConfig>(DEFAULT_FLOATING_BANNER);
  const [currentFlyerIndex, setCurrentFlyerIndex] = useState(0);

  // Firebase Subscriptions
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setShowAdmin(false);
      }
    });

    const unsubNews = subscribeToNews(setNews);
    const unsubPolls = subscribeToPolls(setPolls);
    const unsubSponsors = subscribeToSponsors(setSponsors);
    const unsubAds = subscribeToAds(setAds);
    const unsubPollBanner = subscribeToPollBanner(setPollBanner);
    const unsubPopup = subscribeToConfig('popup', setPopupConfig);
    const unsubLargePopup = subscribeToConfig('largePopup', setLargePopupConfig);
    const unsubActivity = subscribeToConfig('activity', setActivity);
    const unsubFloatingBanner = subscribeToConfig('floatingBanner', setFloatingBanner);

    return () => {
      unsubNews();
      unsubPolls();
      unsubSponsors();
      unsubAds();
      unsubPollBanner();
      unsubPopup();
      unsubLargePopup();
      unsubActivity();
      unsubFloatingBanner();
    };
  }, []);

  // Sync category with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setSelectedCategory('Inicio');
    } else {
      const catName = CATEGORIES.find(cat => {
        const catPath = cat === 'Política RD' ? '/politica-rd' : `/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`;
        return catPath === path;
      });
      if (catName) {
        setSelectedCategory(catName);
      }
    }
  }, [location.pathname, location]);

  const handleAdminAccess = () => {
    if (user) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
    setShowLargePopup(true);
  };

  const activeAdContent = (selectedNews && largePopupConfig.categoryAds?.[selectedNews.category]) || largePopupConfig;

  const getPopupPositionClass = () => {
    return 'bottom-24 right-6'; // Positioned above the WhatsApp button if it exists, or just in that side
  };

  const getAd = (id: string) => ads.find(a => a.id === id);

  const activeCategories = CATEGORIES.filter(cat => 
    ['Inicio', 'Nacionales', 'Contacto', 'Encuestas', 'Actividad Semanal', 'Internacional', 'Deportes'].includes(cat) || 
    news.some(n => n.category === cat)
  );

  const filteredNews = selectedCategory === 'Inicio' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  const handleVote = (pollId: string, candidateId: string) => {
    voteInPoll(pollId, candidateId);
  };

  const activeFlyers = floatingBanner.flyers?.filter(f => f.isActive) || [];
  const currentFlyer = activeFlyers[currentFlyerIndex] || activeFlyers[0];

  useEffect(() => {
    if (activeFlyers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFlyerIndex(prev => (prev + 1) % activeFlyers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeFlyers.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 left-0 w-full h-10 bg-[#D32F2F] text-white flex items-center justify-center z-[100] font-black uppercase tracking-widest text-[10px] md:text-xs shadow-md">
        <div className="container mx-auto px-4 flex justify-center items-center gap-4">
          <span>ANÚNCIATE AQUÍ</span>
          <button className="bg-white text-[#D32F2F] px-3 py-1 rounded-full font-bold text-[9px] md:text-[10px] hover:bg-opacity-90 transition-colors">
            Más info
          </button>
        </div>
      </div>
      <Routes>
        <Route path="/noticia/:slug" element={<NewsDetail />} />
        <Route path="*" element={
          <>
            <Helmet>
              <title>TendenciaRD | La noticia que conecta contigo</title>
              <meta name="description" content="Portal de noticias líder en República Dominicana. Política, Deportes, Economía y más." />
              <meta property="og:title" content="TendenciaRD | Noticias de RD" />
              <meta property="og:description" content="La noticia que conecta contigo" />
              <meta property="og:type" content="website" />
            </Helmet>
            
            <Header 
              selectedCategory={selectedCategory} 
              onCategorySelect={setSelectedCategory} 
              categories={activeCategories}
              sponsors={sponsors}
            />

      <main className="flex-grow container mx-auto px-4 md:px-8 py-6">
        {selectedCategory === 'Inicio' && (
          <Hero 
            news={news} 
            onNewsClick={(item) => navigate(`/noticia/${item.slug || generateSlug(item.title)}`)} 
          />
        )}

        {selectedCategory === 'Encuestas' && (
          <PollSection polls={polls} onVote={handleVote} banner={pollBanner} />
        )}

        {selectedCategory === 'Inicio' && (
          <PollSection polls={polls} onVote={handleVote} />
        )}

        {selectedCategory !== 'Encuestas' && (
          <div className="flex flex-col lg:flex-row gap-8 mt-12">
            {/* Main Feed */}
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-8 border-b-4 border-panorama-navy pb-2 mt-8">
                <h2 className="text-3xl font-news font-black uppercase text-panorama-navy flex items-center">
                  <span className="w-8 h-8 bg-panorama-red text-white flex items-center justify-center rounded-full mr-3 text-sm">
                    {selectedCategory === 'Inicio' ? 'U' : selectedCategory.charAt(0)}
                  </span>
                  {selectedCategory === 'Inicio' ? 'Últimas Noticias' : selectedCategory}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => (
                    <NewsCard key={item.id} news={item} onClick={(item) => navigate(`/noticia/${item.slug || generateSlug(item.title)}`)} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No hay noticias disponibles en esta sección</p>
                  </div>
                )}
              </div>

              {(selectedCategory === 'Inicio' || selectedCategory === 'Actividad Semanal') && (
                <ActivitySection 
                  activity={activity} 
                  onActivityClick={() => {
                    setSelectedActivity(activity);
                    setShowLargePopup(true);
                  }}
                />
              )}

              {selectedCategory === 'Inicio' && (
                <MultimediaSection items={multimedia} />
              )}

              {selectedCategory === 'Inicio' && (
                <div className="mb-12">
                  <Ad 
                    size="leaderboard" 
                    label={getAd('ad-activity')?.label} 
                    imageUrl={getAd('ad-activity')?.imageUrl} 
                  />
                </div>
              )}
              
              <div className="flex justify-center mb-12">
                <button className="bg-panorama-navy hover:bg-panorama-red text-white font-black px-12 py-4 rounded-full transition-all transform hover:scale-105 uppercase tracking-widest text-sm shadow-xl">
                  Cargar más noticias
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar news={news} onNewsClick={handleNewsClick} />
          </div>
        )}
      </main>

      <Footer onCategorySelect={setSelectedCategory} categories={activeCategories} />

      {/* Admin Toggle Button */}
      <button 
        onClick={handleAdminAccess}
        className="fixed bottom-6 left-6 z-50 bg-panorama-navy text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:bg-panorama-red transition-all opacity-20 hover:opacity-100"
        title="Panel de Control"
      >
        <Settings size={20} />
      </button>

      {/* Admin Panel */}
      {showAdmin && user && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          news={news}
          ads={ads}
          popupConfig={popupConfig}
          largePopupConfig={largePopupConfig}
          activity={activity}
          multimedia={multimedia}
          polls={polls}
          sponsors={sponsors}
          pollBanner={pollBanner}
          floatingBanner={floatingBanner}
        />
      )}

    {/* Login Modal */}
    <AnimatePresence>
      {showLogin && !user && (
        <AdminLogin 
          onClose={() => setShowLogin(false)} 
          onSuccess={() => {
            setShowLogin(false);
            setShowAdmin(true);
          }} 
        />
      )}
    </AnimatePresence>

    {/* Activity Detail Expansion */}
    <ActivityDetail 
      activity={selectedActivity}
      onClose={() => {
        setSelectedActivity(null);
        setShowLargePopup(false);
      }}
      adConfig={showLargePopup ? activeAdContent : undefined}
    />

    {/* Large Modal Popup (Horizontal Banner) */}
    <AnimatePresence>
      {showLargePopup && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[300]"
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-panorama-navy text-white shadow-2xl rounded-b-3xl border-x border-b border-white/10 overflow-hidden relative h-20 md:h-24 flex items-center">
              <button 
                onClick={() => setShowLargePopup(false)}
                className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-white/10 hover:bg-panorama-red text-white p-1.5 rounded-full transition-all shadow-md"
              >
                <X size={18} />
              </button>
              
              <div className="container mx-auto px-4 flex items-center gap-4 md:gap-8">
                {activeAdContent.imageUrl && (
                  <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-lg overflow-hidden border border-white/20">
                    <img src={activeAdContent.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-grow flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
                  <h3 className="text-xs md:text-lg font-news font-black text-white leading-tight">
                    {activeAdContent.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-white/70 leading-tight line-clamp-1 max-w-xl">
                    {activeAdContent.description}
                  </p>
                </div>
                <button className="flex-shrink-0 bg-panorama-red hover:bg-panorama-darkRed text-white font-black py-2 px-4 md:px-8 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[10px] md:text-xs mr-8">
                  {activeAdContent.buttonText}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Floating Local Banner in Sections Area */}
    <AnimatePresence mode="wait">
      {floatingBanner.isEnabled && currentFlyer && (
        <motion.div 
          key={currentFlyer.id}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:block w-48"
        >
          <div className="relative group">
            <button 
              onClick={() => setFloatingBanner({...floatingBanner, isEnabled: false})}
              className="absolute -top-2 -right-2 z-20 bg-white text-panorama-navy p-1 rounded-full shadow-lg border border-slate-100 hover:bg-panorama-red hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
            <a 
              href={currentFlyer.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="relative aspect-[4/5]">
                <img src={currentFlyer.imageUrl} alt={currentFlyer.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-panorama-navy/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="bg-panorama-red text-white text-[8px] font-black px-2 py-0.5 rounded uppercase mb-1 inline-block">Local</span>
                  <h4 className="text-white text-xs font-black uppercase leading-tight group-hover:text-panorama-red transition-colors">{currentFlyer.title}</h4>
                  <p className="text-white/70 text-[9px] line-clamp-2 mt-1">{currentFlyer.description}</p>
                </div>
              </div>
            </a>
            {activeFlyers.length > 1 && (
              <div className="flex justify-center gap-1 mt-2">
                {activeFlyers.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all ${i === currentFlyerIndex ? 'w-4 bg-panorama-red' : 'w-1 bg-slate-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Floating WhatsApp Action */}
    <a 
      href="https://wa.me/18097507423" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-95 animate-bounce"
    >
      <MessageCircle size={32} />
    </a>
          </>
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;
