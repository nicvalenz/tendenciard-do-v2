import React, { useState } from 'react';
import { Poll, Candidate, PollBannerConfig } from '../types';
import { NewsImage } from './NewsImage';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Vote, TrendingUp, Calendar, X, ExternalLink, Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon } from 'lucide-react';

interface Props {
  polls: Poll[];
  onVote: (pollId: string, candidateId: string) => void;
  banner?: PollBannerConfig;
}

export const PollSection: React.FC<Props> = ({ polls, onVote, banner }) => {
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('dm_media_voted_polls');
    return saved ? JSON.parse(saved) : {};
  });
  const [showBanner, setShowBanner] = useState(true);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem('dm_media_voted_polls', JSON.stringify(votedPolls));
  }, [votedPolls]);

  const activePolls = polls.filter(p => p.isActive);

  if (activePolls.length === 0) return null;

  const handleVote = (pollId: string, candidateId: string) => {
    if (votedPolls[pollId]) return;
    setVotedPolls(prev => ({ ...prev, [pollId]: candidateId }));
    onVote(pollId, candidateId);
  };

  return (
    <div className="my-16 space-y-12">
      <div className="flex items-center justify-between border-b-4 border-panorama-navy pb-2">
        <h2 className="text-3xl font-news font-black uppercase text-panorama-navy flex items-center">
          <span className="w-8 h-8 bg-panorama-red text-white flex items-center justify-center rounded-full mr-3 text-sm">E</span>
          Encuesta Política
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activePolls.map((poll) => {
          const totalVotes = poll.candidates.reduce((acc, c) => acc + c.votes, 0);
          const hasVoted = !!votedPolls[poll.id];
          
          // Find the winner (candidate with max votes)
          const maxVotes = Math.max(...poll.candidates.map(c => c.votes));
          const winnerIds = poll.candidates.filter(c => c.votes === maxVotes && maxVotes > 0).map(c => c.id);

          return (
            <div key={poll.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col relative">
              <div className="p-8 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-panorama-navy text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Encuesta Activa
                  </span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowShareModal(poll.id)}
                      className="text-slate-400 hover:text-panorama-red transition-colors"
                      title="Compartir Encuesta"
                    >
                      <Share2 size={16} />
                    </button>
                    <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={14} className="mr-1 text-panorama-red" />
                      Cierra: {poll.closingDate}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-news font-black text-panorama-navy leading-tight mb-2">
                  {poll.title}
                </h3>
                {poll.description && (
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {poll.description}
                  </p>
                )}
              </div>

              <div className="p-8 space-y-6 flex-grow">
                {poll.candidates.map((candidate) => {
                  const percentage = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
                  const isSelected = votedPolls[poll.id] === candidate.id;
                  const isWinner = winnerIds.includes(candidate.id);

                  return (
                    <div key={candidate.id} className="relative">
                      <div 
                        onClick={() => handleVote(poll.id, candidate.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                          hasVoted 
                            ? isSelected 
                              ? 'border-panorama-red bg-panorama-red/5 ring-2 ring-panorama-red/20' 
                              : isWinner && totalVotes > 0
                                ? 'border-panorama-navy/30 bg-slate-50'
                                : 'border-slate-100 opacity-80'
                            : 'border-slate-100 hover:border-panorama-navy hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md relative">
                          <NewsImage src={candidate.photoUrl} alt={candidate.name} aspectRatio="square" height="100%" />
                          {hasVoted && isWinner && totalVotes > 0 && (
                            <div className="absolute top-0 right-0 bg-panorama-red text-white p-1 rounded-bl-lg">
                              <TrendingUp size={10} />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-panorama-navy leading-tight group-hover:text-panorama-red transition-colors">
                            {candidate.name}
                          </h4>
                          {candidate.party && (
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {candidate.party}
                            </p>
                          )}
                        </div>
                        {!hasVoted && (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-panorama-red group-hover:text-white transition-all">
                            <Vote size={20} />
                          </div>
                        )}
                        {hasVoted && isSelected && (
                          <div className="w-10 h-10 rounded-full bg-panorama-red flex items-center justify-center text-white">
                            <Check size={20} />
                          </div>
                        )}
                        {hasVoted && (
                          <div className="text-right ml-4 flex flex-col items-end">
                            <span className="text-xl font-news font-black text-panorama-navy">{percentage}%</span>
                            {isWinner && totalVotes > 0 && (
                              <span className="text-[8px] font-black text-panorama-red uppercase tracking-tighter">Líder</span>
                            )}
                          </div>
                        )}
                      </div>

                      {hasVoted && (
                        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isSelected ? 'bg-panorama-red' : 'bg-panorama-navy/30'}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasVoted && (
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <TrendingUp size={14} className="text-panorama-red" />
                  Total de votos: {totalVotes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Poll Banner */}
      <AnimatePresence>
        {banner?.isEnabled && showBanner && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-2xl"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative p-2 flex items-center gap-4">
              <button 
                onClick={() => setShowBanner(false)}
                className="absolute -top-2 -right-2 bg-panorama-red text-white p-1 rounded-full shadow-lg hover:bg-panorama-darkRed transition-colors z-10"
              >
                <X size={14} />
              </button>
              <a 
                href={banner.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-grow flex items-center gap-4"
              >
                <div className="h-12 w-24 md:h-16 md:w-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] md:text-xs font-black text-panorama-navy uppercase tracking-widest">Publicidad</p>
                  <p className="text-[9px] md:text-sm text-slate-500 line-clamp-1">¡Anúnciate en nuestra sección de encuestas!</p>
                </div>
                <div className="mr-4 text-panorama-red">
                  <ExternalLink size={20} />
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[500] bg-panorama-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-panorama-navy uppercase">Compartir</h3>
                <button onClick={() => setShowShareModal(null)} className="text-slate-400 hover:text-panorama-red"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/encuestas/${showShareModal}`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Facebook size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">Facebook</span>
                </button>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/encuestas/${showShareModal}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(`Participa en nuestra encuesta: ${url}`)}`, '_blank');
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">WhatsApp</span>
                </button>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/encuestas/${showShareModal}`;
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Participa en nuestra encuesta')}`, '_blank');
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-panorama-navy text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Twitter size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">X (Twitter)</span>
                </button>
              </div>
              <div className="mt-8 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate mr-2">{window.location.origin}/encuestas/{showShareModal}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/encuestas/${showShareModal}`);
                    alert('Enlace copiado al portapapeles');
                  }}
                  className="text-panorama-red hover:text-panorama-darkRed"
                >
                  <LinkIcon size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
