
export interface NewsItem {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  category: string;
  imageUrl: string;
  date: string;
  author: string;
  isViral?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  party?: string;
  photoUrl: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  closingDate: string;
  candidates: Candidate[];
  isActive: boolean;
}

export interface Sponsor {
  id: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

export interface AdItem {
  id: string;
  size: 'leaderboard' | 'sidebar' | 'sponsored';
  label: string;
  imageUrl?: string;
  link?: string;
}

export interface AdProps {
  size: 'leaderboard' | 'sidebar' | 'sponsored';
  label?: string;
  imageUrl?: string;
}

export interface PopupConfig {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText: string;
  isEnabled: boolean;
}

export interface LargePopupConfig extends PopupConfig {
  delay?: number;
  categoryAds?: Record<string, PopupConfig>;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  extraImages?: string[];
  date: string;
  location: string;
}

export type MultimediaType = 'video' | 'audio' | 'gallery';

export interface PollBannerConfig {
  imageUrl: string;
  link: string;
  isEnabled: boolean;
}

export interface MultimediaItem {
  id: string;
  title: string;
  type: MultimediaType;
  url: string;
  thumbnail: string;
  description: string;
  date: string;
  galleryImages?: string[];
}

export interface Flyer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

export interface FloatingBannerConfig {
  isEnabled: boolean;
  flyers: Flyer[];
}
