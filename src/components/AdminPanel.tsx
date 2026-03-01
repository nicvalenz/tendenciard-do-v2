
import React, { useState, useEffect } from 'react';
import { NewsItem, AdItem, PopupConfig, Activity, LargePopupConfig, MultimediaItem, MultimediaType, Poll, Sponsor, Candidate, PollBannerConfig, FloatingBannerConfig } from '../types';
import { auth, googleProvider } from '../firebase';
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  linkWithPopup, 
  unlink, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { Save, Plus, Trash2, Image as ImageIcon, X, LayoutDashboard, Newspaper, Megaphone, Bell, Calendar, ChevronRight, Video, Mic, Film, Vote, Users, ExternalLink, Check, Eye, MousePointer2, User, ShieldCheck, Key, LogOut, Chrome } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { NewsImage } from './NewsImage';
import { ImageUploaderWithCrop } from './ImageUploaderWithCrop';

import { 
  addNews, 
  updateNews, 
  deleteNews as firebaseDeleteNews, 
  updateAd, 
  updatePoll, 
  updateSponsor, 
  updatePollBanner,
  updatePoll as firebaseUpdatePoll,
  addNews as firebaseAddNews,
  updateConfig,
  uploadImage,
  uploadNewsImage,
  generateSlug
} from '../services/firebaseService';

interface AdminPanelProps {
  onClose: () => void;
  news: NewsItem[];
  ads: AdItem[];
  popupConfig: PopupConfig;
  largePopupConfig: LargePopupConfig;
  activity: Activity;
  multimedia: MultimediaItem[];
  polls: Poll[];
  sponsors: Sponsor[];
  pollBanner: PollBannerConfig;
  floatingBanner: FloatingBannerConfig;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, news, ads, popupConfig, largePopupConfig, activity, multimedia, polls, sponsors, pollBanner, floatingBanner
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'ads' | 'popup' | 'activity' | 'multimedia' | 'polls' | 'sponsors' | 'floating' | 'profile'>('news');
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [editingMultimedia, setEditingMultimedia] = useState<MultimediaItem | null>(null);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [tempPopup, setTempPopup] = useState<PopupConfig>(popupConfig);
  const [tempLargePopup, setTempLargePopup] = useState<LargePopupConfig>(largePopupConfig);
  const [tempActivity, setTempActivity] = useState<Activity>(activity);
  const [tempPollBanner, setTempPollBanner] = useState<PollBannerConfig>(pollBanner);
  const [tempFloatingBanner, setTempFloatingBanner] = useState<FloatingBannerConfig>(floatingBanner);
  const [editingFlyerIndex, setEditingFlyerIndex] = useState<number>(0);
  const [selectedCategoryAd, setSelectedCategoryAd] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<'card' | 'detail' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Auto-save news
  useEffect(() => {
    if (!editingNews || !editingNews.id) return;
    
    const timer = setTimeout(async () => {
      const { id, ...data } = editingNews;
      if (news.find(n => n.id === id)) {
        await updateNews(id, data);
      } else {
        // For new news, we don't auto-save until they hit "Save" or we can auto-create
        // But the user likes "onChange" save, so let's handle it
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [editingNews, news]);

  useEffect(() => {
    setTempPopup(popupConfig);
  }, [popupConfig]);

  useEffect(() => {
    setTempLargePopup(largePopupConfig);
  }, [largePopupConfig]);

  useEffect(() => {
    setTempActivity(activity);
  }, [activity]);

  useEffect(() => {
    setTempPollBanner(pollBanner);
  }, [pollBanner]);

  useEffect(() => {
    setTempFloatingBanner(floatingBanner);
  }, [floatingBanner]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNews = async () => {
    if (!editingNews) return;
    const { id, ...data } = editingNews;
    if (news.find(n => n.id === id)) {
      await updateNews(id, data);
    } else {
      await addNews(data);
    }
    setEditingNews(null);
  };

  const deleteNews = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
      await firebaseDeleteNews(id);
    }
  };

  const saveAd = async () => {
    if (!editingAd) return;
    const { id, ...data } = editingAd;
    await updateAd(id, data);
    setEditingAd(null);
  };

  const saveMultimedia = () => {
    // Multimedia is still mock for now as per user request focus on news/polls/banners/sponsors
    if (!editingMultimedia) return;
    setEditingMultimedia(null);
  };

  const deleteMultimedia = (id: string) => {
    // Multimedia is still mock for now
  };

  const savePoll = async () => {
    if (!editingPoll) return;
    const { id, ...data } = editingPoll;
    await updatePoll(id, data);
    setEditingPoll(null);
  };

  const deletePoll = async (id: string) => {
    // Implement deletePoll in service if needed, for now just update
  };

  const saveSponsor = async () => {
    if (!editingSponsor) return;
    const { id, ...data } = editingSponsor;
    await updateSponsor(id, data);
    setEditingSponsor(null);
  };

  const savePollBanner = async () => {
    await updatePollBanner(tempPollBanner);
  };

  const deleteSponsor = (id: string) => {
    // Implement deleteSponsor in service if needed
  };

  return (
    <div className="fixed inset-0 z-[200] bg-panorama-darkNavy/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-panorama-red text-white p-2 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-panorama-navy uppercase tracking-tight">Panel de Control Interno</h1>
            <p className="text-xs text-slate-500 font-bold uppercase">TendenciaRD Admin System v1.0</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-panorama-navy"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'news' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Newspaper size={18} />
            Gestionar Noticias
          </button>
          <button 
            onClick={() => setActiveTab('polls')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'polls' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Vote size={18} />
            Encuestas
          </button>
          <button 
            onClick={() => setActiveTab('sponsors')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'sponsors' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Users size={18} />
            Patrocinadores
          </button>
          <button 
            onClick={() => setActiveTab('multimedia')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'multimedia' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Film size={18} />
            Multimedia
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'ads' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Megaphone size={18} />
            Gestionar Publicidad
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'activity' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Calendar size={18} />
            Actividad Semanal
          </button>
          <button 
            onClick={() => setActiveTab('popup')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'popup' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <Bell size={18} />
            Ventanas y Banners
          </button>
          <button 
            onClick={() => setActiveTab('floating')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'floating' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <MousePointer2 size={18} />
            Publicidad Flotante
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === 'profile' ? 'bg-panorama-red text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            <User size={18} />
            Configuración Perfil
          </button>
          <div className="mt-auto pt-4 border-t border-slate-700">
            <button 
              onClick={async () => {
                await signOut(auth);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-slate-50">
          {activeTab === 'news' ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-panorama-navy uppercase">Noticias Recientes</h2>
                <button 
                  onClick={() => setEditingNews({
                    id: Date.now().toString(),
                    title: '',
                    excerpt: '',
                    category: 'Nacionales',
                    imageUrl: 'https://picsum.photos/seed/new/800/500',
                    date: 'Ahora',
                    author: 'Admin'
                  })}
                  className="bg-panorama-navy text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                >
                  <Plus size={18} /> Nueva Noticia
                </button>
              </div>

              <div className="grid gap-4">
                {news.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <NewsImage src={item.imageUrl} alt="" height={64} className="w-24 rounded-lg" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-panorama-navy line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 uppercase font-bold">{item.category} • {item.author}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingNews(item)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <ImageIcon size={18} />
                      </button>
                      <button 
                        onClick={() => deleteNews(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-panorama-red"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'polls' ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-panorama-navy uppercase">Encuestas Políticas</h2>
                <button 
                  onClick={() => setEditingPoll({
                    id: Date.now().toString(),
                    title: '',
                    description: '',
                    closingDate: '',
                    candidates: [],
                    isActive: true
                  })}
                  className="bg-panorama-navy text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                >
                  <Plus size={18} /> Nueva Encuesta
                </button>
              </div>

              <div className="grid gap-4">
                {polls.map(poll => (
                  <div key={poll.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-panorama-navy">
                      <Vote size={32} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-panorama-navy">{poll.title}</h3>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${poll.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {poll.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        {poll.candidates.length} Candidatos • Cierra: {poll.closingDate}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingPoll(poll)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <ImageIcon size={18} />
                      </button>
                      <button 
                        onClick={() => deletePoll(poll.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-panorama-red"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-panorama-navy uppercase">Banner Publicitario en Encuestas</h3>
                    <p className="text-sm text-slate-500">Banner flotante no invasivo para la sección de encuestas</p>
                  </div>
                  <button 
                    onClick={() => setTempPollBanner({...tempPollBanner, isEnabled: !tempPollBanner.isEnabled})}
                    className={`w-14 h-8 rounded-full relative transition-colors ${tempPollBanner.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tempPollBanner.isEnabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enlace del Banner</label>
                    <input 
                      type="text" 
                      value={tempPollBanner.link}
                      onChange={e => setTempPollBanner({...tempPollBanner, link: e.target.value})}
                      className="w-full border-2 border-white rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen del Banner (1200x200)</label>
                    <ImageUploaderWithCrop 
                      onCropComplete={(url) => setTempPollBanner({ ...tempPollBanner, imageUrl: url })} 
                      aspectRatio={6/1}
                      label="Subir Banner"
                    />
                    {tempPollBanner.imageUrl && (
                      <div className="w-full h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        <img src={tempPollBanner.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={savePollBanner}
                    className="bg-panorama-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red shadow-lg"
                  >
                    <Save size={18} /> Guardar Banner
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'sponsors' ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-panorama-navy uppercase">Patrocinadores</h2>
                <button 
                  onClick={() => setEditingSponsor({
                    id: Date.now().toString(),
                    imageUrl: '',
                    link: '',
                    isActive: true
                  })}
                  className="bg-panorama-navy text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                >
                  <Plus size={18} /> Nuevo Patrocinador
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {sponsors.map(sponsor => (
                  <div key={sponsor.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 group relative">
                    <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                      {sponsor.imageUrl ? (
                        <img src={sponsor.imageUrl} className="w-full h-full object-contain p-4" alt="" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-200" />
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${sponsor.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {sponsor.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEditingSponsor(sponsor)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                        >
                          <ImageIcon size={14} />
                        </button>
                        <button 
                          onClick={() => deleteSponsor(sponsor.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-panorama-red"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'ads' ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-panorama-navy uppercase mb-8">Espacios Publicitarios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ads.map(ad => (
                  <div key={ad.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-panorama-navy uppercase text-sm">{ad.label}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ad.size}</p>
                      </div>
                      <button 
                        onClick={() => setEditingAd(ad)}
                        className="bg-panorama-navy text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-panorama-red transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                    <div className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                      {ad.imageUrl ? (
                        <NewsImage src={ad.imageUrl} alt="" height="100%" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'popup' ? (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-black text-panorama-navy uppercase mb-8">Configuración de Ventana Emergente (Pequeña)</h2>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-panorama-navy uppercase text-sm">Estado de la Ventana</h4>
                      <p className="text-xs text-slate-500">Activar o desactivar el banner de suscripción</p>
                    </div>
                    <button 
                      onClick={() => setTempPopup({...tempPopup, isEnabled: !tempPopup.isEnabled})}
                      className={`w-14 h-8 rounded-full relative transition-colors ${tempPopup.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tempPopup.isEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título</label>
                    <input 
                      type="text" 
                      value={tempPopup.title}
                      onChange={e => setTempPopup({...tempPopup, title: e.target.value})}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
                    <textarea 
                      value={tempPopup.description}
                      onChange={e => setTempPopup({...tempPopup, description: e.target.value})}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Texto del Botón</label>
                      <input 
                        type="text" 
                        value={tempPopup.buttonText}
                        onChange={e => setTempPopup({...tempPopup, buttonText: e.target.value})}
                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={async () => {
                      await updateConfig('popup', tempPopup);
                    }}
                    className="w-full bg-panorama-navy text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                  >
                    <Save size={18} /> Guardar Configuración
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-panorama-navy uppercase mb-8">Banner Horizontal por Sección</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-2">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-4">Selecciona una sección para personalizar su publicidad:</p>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setSelectedCategoryAd(null)}
                        className={`w-full px-6 py-4 text-left font-bold uppercase text-xs tracking-widest flex items-center justify-between transition-colors ${selectedCategoryAd === null ? 'bg-panorama-navy text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                        General (Default)
                        <ChevronRight size={16} />
                      </button>
                      {CATEGORIES.filter(c => c !== 'Inicio' && c !== 'Contacto').map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setSelectedCategoryAd(cat)}
                          className={`w-full px-6 py-4 text-left font-bold uppercase text-xs tracking-widest flex items-center justify-between transition-colors border-t border-slate-100 ${selectedCategoryAd === cat ? 'bg-panorama-navy text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          {cat}
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                      <h3 className="font-black text-panorama-navy uppercase text-sm border-b border-slate-100 pb-4">
                        Editando Publicidad: <span className="text-panorama-red">{selectedCategoryAd || 'General'}</span>
                      </h3>
                      
                      {(() => {
                        const currentAd = selectedCategoryAd 
                          ? (tempLargePopup.categoryAds?.[selectedCategoryAd] || { ...tempLargePopup, categoryAds: undefined })
                          : tempLargePopup;
                        
                        const updateCurrentAd = (updates: Partial<PopupConfig>) => {
                          if (selectedCategoryAd) {
                            const newCategoryAds = { ...(tempLargePopup.categoryAds || {}) };
                            newCategoryAds[selectedCategoryAd] = { ...currentAd, ...updates };
                            setTempLargePopup({ ...tempLargePopup, categoryAds: newCategoryAds });
                          } else {
                            setTempLargePopup({ ...tempLargePopup, ...updates });
                          }
                        };

                        return (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título del Banner</label>
                              <input 
                                type="text" 
                                value={currentAd.title}
                                onChange={e => updateCurrentAd({ title: e.target.value })}
                                className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
                              <textarea 
                                value={currentAd.description}
                                onChange={e => updateCurrentAd({ description: e.target.value })}
                                className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-20"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Texto del Botón</label>
                                <input 
                                  type="text" 
                                  value={currentAd.buttonText}
                                  onChange={e => updateCurrentAd({ buttonText: e.target.value })}
                                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen del Banner</label>
                              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 relative group">
                                {currentAd.imageUrl ? (
                                  <img src={currentAd.imageUrl} className="w-full h-full object-cover" alt="" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={48} />
                                  </div>
                                )}
                                <label className="absolute inset-0 bg-panorama-navy/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                  <div className="text-center text-white">
                                    <ImageIcon size={32} className="mx-auto mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Cambiar Imagen</span>
                                  </div>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={e => handleImageUpload(e, (base64) => updateCurrentAd({ imageUrl: base64 }))}
                                  />
                                </label>
                              </div>
                            </div>

                            <button 
                              onClick={async () => {
                                await updateConfig('largePopup', tempLargePopup);
                              }}
                              className="w-full bg-panorama-red text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-darkRed transition-colors shadow-lg"
                            >
                              <Save size={18} /> Guardar Todo el Sistema de Banners
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'floating' ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-panorama-navy uppercase mb-8">Publicidad Flotante Lateral (Rotativa)</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Flyers List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-black text-panorama-navy uppercase text-xs tracking-widest">Flyers (Máx 6)</h4>
                      <button 
                        onClick={() => setTempFloatingBanner({...tempFloatingBanner, isEnabled: !tempFloatingBanner.isEnabled})}
                        className={`w-10 h-6 rounded-full relative transition-colors ${tempFloatingBanner.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tempFloatingBanner.isEnabled ? 'left-5' : 'left-1'}`}></div>
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {tempFloatingBanner.flyers.map((flyer, index) => (
                        <button
                          key={flyer.id}
                          onClick={() => setEditingFlyerIndex(index)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${editingFlyerIndex === index ? 'border-panorama-red bg-panorama-red/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            {flyer.imageUrl ? (
                              <img src={flyer.imageUrl} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon size={14} />
                              </div>
                            )}
                          </div>
                          <div className="text-left flex-grow">
                            <p className={`text-[10px] font-black uppercase truncate ${editingFlyerIndex === index ? 'text-panorama-red' : 'text-panorama-navy'}`}>
                              {flyer.title || `Flyer ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${flyer.isActive ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                              <span className="text-[8px] font-bold text-slate-400 uppercase">{flyer.isActive ? 'Activo' : 'Inactivo'}</span>
                            </div>
                          </div>
                          {editingFlyerIndex === index && <ChevronRight size={14} className="text-panorama-red" />}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={async () => {
                        await updateConfig('floatingBanner', tempFloatingBanner);
                        alert('Sistema de publicidad flotante actualizado');
                      }}
                      className="w-full mt-6 bg-panorama-navy text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                    >
                      <Save size={18} /> Guardar Todo
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <div className="lg:col-span-2">
                  {(() => {
                    const flyer = tempFloatingBanner.flyers[editingFlyerIndex];
                    if (!flyer) return null;

                    const updateFlyer = (updates: Partial<typeof flyer>) => {
                      const newFlyers = [...tempFloatingBanner.flyers];
                      newFlyers[editingFlyerIndex] = { ...flyer, ...updates };
                      setTempFloatingBanner({ ...tempFloatingBanner, flyers: newFlyers });
                    };

                    return (
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <h4 className="font-bold text-panorama-navy uppercase text-sm">Estado de este Flyer</h4>
                            <p className="text-xs text-slate-500">Mostrar este flyer en la rotación</p>
                          </div>
                          <button 
                            onClick={() => updateFlyer({ isActive: !flyer.isActive })}
                            className={`w-14 h-8 rounded-full relative transition-colors ${flyer.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${flyer.isActive ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título</label>
                            <input 
                              type="text" 
                              value={flyer.title}
                              onChange={e => updateFlyer({ title: e.target.value })}
                              className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enlace (Link)</label>
                            <input 
                              type="text" 
                              value={flyer.link}
                              onChange={e => updateFlyer({ link: e.target.value })}
                              className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
                          <textarea 
                            value={flyer.description}
                            onChange={e => updateFlyer({ description: e.target.value })}
                            className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-24"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen del Flyer (Vertical 4:5)</label>
                          <ImageUploaderWithCrop 
                            onCropComplete={(url) => updateFlyer({ imageUrl: url })} 
                            aspectRatio={4/5}
                            label="Subir Arte Vertical"
                          />
                          {flyer.imageUrl && (
                            <div className="w-40 aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white shadow-xl mx-auto">
                              <img src={flyer.imageUrl} className="w-full h-full object-cover" alt="" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : activeTab === 'activity' ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-panorama-navy uppercase mb-8">Actividad de la Semana</h2>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título de la Actividad</label>
                  <input 
                    type="text" 
                    value={tempActivity.title}
                    onChange={e => setTempActivity({...tempActivity, title: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
                  <textarea 
                    value={tempActivity.description}
                    onChange={e => setTempActivity({...tempActivity, description: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha</label>
                    <input 
                      type="text" 
                      value={tempActivity.date}
                      onChange={e => setTempActivity({...tempActivity, date: e.target.value})}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ubicación</label>
                    <input 
                      type="text" 
                      value={tempActivity.location}
                      onChange={e => setTempActivity({...tempActivity, location: e.target.value})}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imágenes de la Actividad (Hasta 3)</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((index) => {
                      const currentImg = index === 0 ? tempActivity.imageUrl : (tempActivity.extraImages?.[index - 1] || '');
                      return (
                        <div key={index} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 relative group">
                          {currentImg ? (
                            <img src={currentImg} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <div className="text-center text-white">
                              <ImageIcon size={20} className="mx-auto mb-1" />
                              <span className="text-[8px] font-black uppercase tracking-widest">Subir</span>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={e => handleImageUpload(e, (base64) => {
                                if (index === 0) {
                                  setTempActivity({...tempActivity, imageUrl: base64});
                                } else {
                                  const newExtras = [...(tempActivity.extraImages || ['', ''])];
                                  newExtras[index - 1] = base64;
                                  setTempActivity({...tempActivity, extraImages: newExtras});
                                }
                              })}
                            />
                          </label>
                          {currentImg && (
                            <button 
                              onClick={() => {
                                if (index === 0) {
                                  setTempActivity({...tempActivity, imageUrl: ''});
                                } else {
                                  const newExtras = [...(tempActivity.extraImages || [])];
                                  newExtras[index - 1] = '';
                                  setTempActivity({...tempActivity, extraImages: newExtras});
                                }
                              }}
                              className="absolute top-1 right-1 bg-panorama-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    await updateConfig('activity', tempActivity);
                  }}
                  className="w-full bg-panorama-navy text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                >
                  <Save size={18} /> Guardar Actividad
                </button>
              </div>
            </div>
          ) : activeTab === 'multimedia' ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-panorama-navy uppercase">Contenido Multimedia</h2>
                <button 
                  onClick={() => setEditingMultimedia({
                    id: Date.now().toString(),
                    title: '',
                    type: 'video',
                    url: '',
                    thumbnail: 'https://picsum.photos/seed/multimedia/800/450',
                    description: '',
                    date: 'Ahora'
                  })}
                  className="bg-panorama-navy text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                >
                  <Plus size={18} /> Nuevo Multimedia
                </button>
              </div>

              <div className="grid gap-4">
                {multimedia.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group">
                    <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden relative">
                      <NewsImage src={item.thumbnail} alt="" height="100%" />
                      <div className="absolute inset-0 flex items-center justify-center bg-panorama-navy/20 text-white">
                        {item.type === 'video' ? <Video size={14} /> : item.type === 'audio' ? <Mic size={14} /> : <ImageIcon size={14} />}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-panorama-navy line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 uppercase font-bold">{item.type} • {item.date}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingMultimedia(item)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <ImageIcon size={18} />
                      </button>
                      <button 
                        onClick={() => deleteMultimedia(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-panorama-red"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'profile' ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-panorama-navy uppercase mb-8">Configuración de Perfil</h2>
              
              <div className="space-y-8">
                {/* User Info */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                  <div className="w-20 h-20 bg-panorama-navy rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <User size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-panorama-navy uppercase">{auth.currentUser?.displayName || 'Administrador'}</h3>
                    <p className="text-slate-500 font-bold">{auth.currentUser?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <ShieldCheck size={14} className="text-green-500" />
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Acceso Verificado</span>
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Key size={20} className="text-panorama-red" />
                    <h3 className="text-lg font-black text-panorama-navy uppercase">Cambiar Contraseña</h3>
                  </div>

                  {profileError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                      {profileError}
                    </div>
                  )}

                  {profileSuccess && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm font-medium">
                      {profileSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nueva Contraseña</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confirmar Contraseña</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={async () => {
                      setProfileError(null);
                      setProfileSuccess(null);
                      if (newPassword !== confirmPassword) {
                        setProfileError('Las contraseñas no coinciden');
                        return;
                      }
                      if (newPassword.length < 6) {
                        setProfileError('La contraseña debe tener al menos 6 caracteres');
                        return;
                      }
                      try {
                        if (auth.currentUser) {
                          await updatePassword(auth.currentUser, newPassword);
                          setProfileSuccess('Contraseña actualizada correctamente');
                          setNewPassword('');
                          setConfirmPassword('');
                        }
                      } catch (err: any) {
                        setProfileError('Error al actualizar contraseña. Es posible que debas re-autenticarte.');
                      }
                    }}
                    className="w-full bg-panorama-navy text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-panorama-red transition-colors shadow-lg"
                  >
                    <Save size={18} /> Actualizar Contraseña
                  </button>
                </div>

                {/* Google Linking */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Chrome size={20} className="text-panorama-red" />
                    <h3 className="text-lg font-black text-panorama-navy uppercase">Vinculación de Google</h3>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    Vincula tu cuenta de Google para iniciar sesión rápidamente sin necesidad de contraseña.
                  </p>

                  {auth.currentUser?.providerData.some(p => p.providerId === 'google.com') ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                      <div className="flex items-center gap-3">
                        <Check size={20} className="text-green-500" />
                        <span className="text-sm font-bold text-green-700">Cuenta de Google Vinculada</span>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            if (auth.currentUser) {
                              await unlink(auth.currentUser, 'google.com');
                              setProfileSuccess('Cuenta de Google desvinculada');
                            }
                          } catch (err) {
                            setProfileError('Error al desvincular cuenta');
                          }
                        }}
                        className="text-[10px] font-black uppercase text-red-500 hover:underline"
                      >
                        Desvincular
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={async () => {
                        try {
                          if (auth.currentUser) {
                            await linkWithPopup(auth.currentUser, googleProvider);
                            setProfileSuccess('Cuenta de Google vinculada con éxito');
                          }
                        } catch (err) {
                          setProfileError('Error al vincular cuenta de Google');
                        }
                      }}
                      className="w-full bg-white border-2 border-slate-100 text-panorama-navy py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <Chrome size={18} className="text-panorama-red" />
                      Vincular Cuenta de Google
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modals */}
      {editingNews && (
        <div className="fixed inset-0 z-[300] bg-panorama-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-panorama-navy uppercase">Editar Noticia</h3>
              <button onClick={() => setEditingNews(null)}><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título</label>
                  <input 
                    type="text" 
                    value={editingNews.title}
                    onChange={e => setEditingNews({...editingNews, title: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoría</label>
                  <select 
                    value={editingNews.category}
                    onChange={e => setEditingNews({...editingNews, category: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  >
                    <option>Nacionales</option>
                    <option>Política RD</option>
                    <option>Deportes</option>
                    <option>Economía</option>
                    <option>Entretenimiento</option>
                    <option>Tecnología</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Autor</label>
                  <input 
                    type="text" 
                    value={editingNews.author}
                    onChange={e => setEditingNews({...editingNews, author: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha de Publicación</label>
                  <input 
                    type="text" 
                    value={editingNews.date}
                    onChange={e => setEditingNews({...editingNews, date: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                    placeholder="Ej: 28 de Febrero, 2024"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="isViral"
                  checked={editingNews.isViral || false}
                  onChange={e => setEditingNews({...editingNews, isViral: e.target.checked})}
                  className="w-5 h-5 accent-panorama-red cursor-pointer"
                />
                <label htmlFor="isViral" className="text-xs font-black text-panorama-navy uppercase tracking-widest cursor-pointer">Marcar como Noticia Viral</label>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Resumen (Excerpt)</label>
                <textarea 
                  value={editingNews.excerpt}
                  onChange={e => setEditingNews({...editingNews, excerpt: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contenido Completo</label>
                <textarea 
                  value={editingNews.content || ''}
                  onChange={e => setEditingNews({...editingNews, content: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-64"
                  placeholder="Escribe el cuerpo de la noticia aquí..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen de Portada (16:9)</label>
                <div className="relative">
                  <ImageUploaderWithCrop 
                    onCropComplete={async (blob) => {
                      setIsUploading(true);
                      try {
                        const url = await uploadNewsImage(blob, "news_image.jpg");
                        setEditingNews({ ...editingNews, imageUrl: url });
                      } catch (error) {
                        console.error("Error uploading image:", error);
                        alert("Error al subir la imagen");
                      } finally {
                        setIsUploading(false);
                      }
                    }} 
                    aspectRatio={16/9}
                    label="Cambiar Imagen"
                    returnBlob={true}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-panorama-red"></div>
                    </div>
                  )}
                </div>
                {editingNews.imageUrl && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vista en Card</p>
                      <NewsImage src={editingNews.imageUrl} alt="Preview" aspectRatio="video" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vista Detalle</p>
                      <NewsImage src={editingNews.imageUrl} alt="Preview" aspectRatio="auto" height={100} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingNews(null)}
                className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-panorama-navy"
              >
                Cancelar
              </button>
              <button 
                onClick={saveNews}
                className="bg-panorama-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red shadow-lg"
              >
                <Save size={18} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {editingAd && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-panorama-navy uppercase">Editar Publicidad</h3>
              <button onClick={() => setEditingAd(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Etiqueta / Nombre</label>
                <input 
                  type="text" 
                  value={editingAd.label}
                  onChange={e => setEditingAd({...editingAd, label: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen Publicitaria (Ajustable)</label>
                <ImageUploaderWithCrop 
                  onCropComplete={(url) => setEditingAd({ ...editingAd, imageUrl: url })} 
                  aspectRatio={editingAd.size === 'leaderboard' ? 728/90 : 300/600}
                  label="Subir Arte Publicitario"
                />
                {editingAd.imageUrl && (
                  <div className="w-full h-40 rounded-2xl overflow-hidden border-2 border-slate-200">
                    <NewsImage src={editingAd.imageUrl} alt="Preview" aspectRatio="auto" height="100%" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingAd(null)}
                className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-panorama-navy"
              >
                Cancelar
              </button>
              <button 
                onClick={saveAd}
                className="bg-panorama-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red shadow-lg"
              >
                <Save size={18} /> Actualizar Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {editingMultimedia && (
        <div className="fixed inset-0 z-[300] bg-panorama-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-panorama-navy uppercase">Editar Multimedia</h3>
              <button onClick={() => setEditingMultimedia(null)}><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título</label>
                  <input 
                    type="text" 
                    value={editingMultimedia.title}
                    onChange={e => setEditingMultimedia({...editingMultimedia, title: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo</label>
                  <select 
                    value={editingMultimedia.type}
                    onChange={e => setEditingMultimedia({...editingMultimedia, type: e.target.value as MultimediaType})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  >
                    <option value="video">Video (YouTube/Vimeo)</option>
                    <option value="audio">Audio / Podcast (MP3 URL)</option>
                    <option value="gallery">Galería de Imágenes</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL del Contenido</label>
                <input 
                  type="text" 
                  value={editingMultimedia.url}
                  onChange={e => setEditingMultimedia({...editingMultimedia, url: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium"
                  placeholder={editingMultimedia.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://example.com/audio.mp3'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
                <textarea 
                  value={editingMultimedia.description}
                  onChange={e => setEditingMultimedia({...editingMultimedia, description: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-medium h-24"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Miniatura (16:9)</label>
                <ImageUploaderWithCrop 
                  onCropComplete={(url) => setEditingMultimedia({ ...editingMultimedia, thumbnail: url })} 
                  aspectRatio={16/9}
                  label="Subir Miniatura"
                />
                {editingMultimedia.thumbnail && (
                  <div className="w-32 h-20 rounded-xl overflow-hidden border-2 border-slate-200">
                    <NewsImage src={editingMultimedia.thumbnail} alt="" height="100%" />
                  </div>
                )}
              </div>

              {editingMultimedia.type === 'gallery' && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imágenes de la Galería</label>
                  <div className="grid grid-cols-4 gap-4">
                    {(editingMultimedia.galleryImages || []).map((img, idx) => (
                      <div key={idx} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button 
                          onClick={() => {
                            const newImgs = [...(editingMultimedia.galleryImages || [])];
                            newImgs.splice(idx, 1);
                            setEditingMultimedia({...editingMultimedia, galleryImages: newImgs});
                          }}
                          className="absolute top-1 right-1 bg-panorama-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <ImageUploaderWithCrop 
                      onCropComplete={(url) => {
                        const newImgs = [...(editingMultimedia.galleryImages || []), url];
                        setEditingMultimedia({...editingMultimedia, galleryImages: newImgs});
                      }} 
                      aspectRatio={16/9}
                      label="+"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingMultimedia(null)}
                className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-panorama-navy"
              >
                Cancelar
              </button>
              <button 
                onClick={saveMultimedia}
                className="bg-panorama-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red shadow-lg"
              >
                <Save size={18} /> Guardar Multimedia
              </button>
            </div>
          </div>
        </div>
      )}
      {editingPoll && (
        <div className="fixed inset-0 z-[300] bg-panorama-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-panorama-navy uppercase">Gestionar Encuesta</h3>
              <button onClick={() => setEditingPoll(null)}><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-panorama-navy uppercase text-sm">Estado de la Encuesta</h4>
                  <p className="text-xs text-slate-500">Activar para mostrar en el portal</p>
                </div>
                <button 
                  onClick={() => setEditingPoll({...editingPoll, isActive: !editingPoll.isActive})}
                  className={`w-14 h-8 rounded-full relative transition-colors ${editingPoll.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${editingPoll.isActive ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título de la Encuesta</label>
                <input 
                  type="text" 
                  value={editingPoll.title}
                  onChange={e => setEditingPoll({...editingPoll, title: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha de Cierre</label>
                  <input 
                    type="text" 
                    value={editingPoll.closingDate}
                    onChange={e => setEditingPoll({...editingPoll, closingDate: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                    placeholder="Ej: 30 de Junio, 2024"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Candidatos</label>
                  <button 
                    onClick={() => {
                      const newCandidates = [...editingPoll.candidates, { id: Date.now().toString(), name: '', party: '', photoUrl: '', votes: 0 }];
                      setEditingPoll({...editingPoll, candidates: newCandidates});
                    }}
                    className="text-panorama-red font-black uppercase text-[10px] tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Agregar Candidato
                  </button>
                </div>
                
                <div className="space-y-4">
                  {editingPoll.candidates.map((candidate, idx) => (
                    <div key={candidate.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Candidato #{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const newCandidates = [...editingPoll.candidates];
                            newCandidates.splice(idx, 1);
                            setEditingPoll({...editingPoll, candidates: newCandidates});
                          }}
                          className="text-panorama-red hover:text-panorama-darkRed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          value={candidate.name}
                          onChange={e => {
                            const newCandidates = [...editingPoll.candidates];
                            newCandidates[idx].name = e.target.value;
                            setEditingPoll({...editingPoll, candidates: newCandidates});
                          }}
                          placeholder="Nombre del Candidato"
                          className="w-full border-2 border-white rounded-xl px-4 py-2 focus:border-panorama-red outline-none font-bold text-sm"
                        />
                        <input 
                          type="text" 
                          value={candidate.party || ''}
                          onChange={e => {
                            const newCandidates = [...editingPoll.candidates];
                            newCandidates[idx].party = e.target.value;
                            setEditingPoll({...editingPoll, candidates: newCandidates});
                          }}
                          placeholder="Partido (Opcional)"
                          className="w-full border-2 border-white rounded-xl px-4 py-2 focus:border-panorama-red outline-none font-bold text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                          <NewsImage src={candidate.photoUrl} alt="" aspectRatio="square" height="100%" />
                        </div>
                        <div className="flex-grow">
                          <ImageUploaderWithCrop 
                            onCropComplete={async (blob) => {
                              setIsUploading(true);
                              try {
                                const url = await uploadImage(blob, "encuestas");
                                const newCandidates = [...editingPoll.candidates];
                                newCandidates[idx].photoUrl = url;
                                setEditingPoll({...editingPoll, candidates: newCandidates});
                              } catch (error) {
                                alert("Error al subir imagen");
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                            aspectRatio={1}
                            label="Subir Foto (1:1)"
                            returnBlob={true}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingPoll(null)}
                className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-panorama-navy"
              >
                Cancelar
              </button>
              <button 
                onClick={savePoll}
                className="bg-panorama-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red shadow-lg"
              >
                <Save size={18} /> Guardar Encuesta
              </button>
            </div>
          </div>
        </div>
      )}

      {editingSponsor && (
        <div className="fixed inset-0 z-[300] bg-panorama-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-panorama-navy uppercase">Gestionar Patrocinador</h3>
              <button onClick={() => setEditingSponsor(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-panorama-navy uppercase text-sm">Estado</h4>
                  <p className="text-xs text-slate-500">Activar para mostrar en el header</p>
                </div>
                <button 
                  onClick={() => setEditingSponsor({...editingSponsor, isActive: !editingSponsor.isActive})}
                  className={`w-14 h-8 rounded-full relative transition-colors ${editingSponsor.isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${editingSponsor.isActive ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enlace (URL)</label>
                <input 
                  type="text" 
                  value={editingSponsor.link || ''}
                  onChange={e => setEditingSponsor({...editingSponsor, link: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-panorama-red outline-none font-bold"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logo del Patrocinador (1:1)</label>
                <ImageUploaderWithCrop 
                  onCropComplete={async (blob) => {
                    setIsUploading(true);
                    try {
                      const url = await uploadImage(blob, "patrocinadores");
                      setEditingSponsor({ ...editingSponsor, imageUrl: url });
                    } catch (error) {
                      alert("Error al subir imagen");
                    } finally {
                      setIsUploading(false);
                    }
                  }} 
                  aspectRatio={1}
                  label="Subir Logo"
                  returnBlob={true}
                />
                {editingSponsor.imageUrl && (
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
                    <img src={editingSponsor.imageUrl} className="w-full h-full object-contain p-4" alt="" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setEditingSponsor(null)}
                className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-panorama-navy"
              >
                Cancelar
              </button>
              <button 
                onClick={saveSponsor}
                className="bg-panorama-navy text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-panorama-red shadow-lg"
              >
                <Save size={18} /> Guardar Patrocinador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
