import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  setDoc,
  getDoc,
  where,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { NewsItem, Poll, Sponsor, PollBannerConfig, AdItem } from "../types";

// Utils
export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
    .replace(/^-+|-+$/g, "");
};

// --- Storage ---
export const uploadImage = async (file: File | Blob, path: string) => {
  const storageRef = ref(storage, `${path}/${Date.now()}_image.jpg`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadNewsImage = async (file: File | Blob, fileName: string) => {
  return await uploadImage(file, "noticias");
};

// Collections
const NEWS_COLLECTION = "noticias";
const POLLS_COLLECTION = "encuestas";
const SPONSORS_COLLECTION = "patrocinadores";
const BANNERS_COLLECTION = "banners";
const CONFIG_COLLECTION = "configuracion";

// --- News ---
export const subscribeToNews = (callback: (news: NewsItem[]) => void) => {
  const q = query(collection(db, NEWS_COLLECTION), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
    callback(news);
  });
};

export const getNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  const q = query(collection(db, NEWS_COLLECTION), where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as NewsItem;
  }
  return null;
};

export const addNews = async (news: Omit<NewsItem, "id">) => {
  const slug = generateSlug(news.title);
  return await addDoc(collection(db, NEWS_COLLECTION), { ...news, slug });
};

export const updateNews = async (id: string, news: Partial<NewsItem>) => {
  const newsRef = doc(db, NEWS_COLLECTION, id);
  const data = { ...news };
  if (news.title) {
    data.slug = generateSlug(news.title);
  }
  return await updateDoc(newsRef, data);
};

export const deleteNews = async (id: string) => {
  const newsRef = doc(db, NEWS_COLLECTION, id);
  return await deleteDoc(newsRef);
};

// --- Polls ---
export const subscribeToPolls = (callback: (polls: Poll[]) => void) => {
  return onSnapshot(collection(db, POLLS_COLLECTION), (snapshot) => {
    const polls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
    callback(polls);
  });
};

export const voteInPoll = async (pollId: string, candidateId: string) => {
  const pollRef = doc(db, POLLS_COLLECTION, pollId);
  const pollSnap = await getDoc(pollRef);
  
  if (pollSnap.exists()) {
    const pollData = pollSnap.data() as Poll;
    const updatedCandidates = pollData.candidates.map(c => 
      c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
    );
    return await updateDoc(pollRef, { candidates: updatedCandidates });
  }
};

export const updatePoll = async (id: string, poll: Partial<Poll>) => {
  const pollRef = doc(db, POLLS_COLLECTION, id);
  return await updateDoc(pollRef, poll);
};

// --- Sponsors ---
export const subscribeToSponsors = (callback: (sponsors: Sponsor[]) => void) => {
  return onSnapshot(collection(db, SPONSORS_COLLECTION), (snapshot) => {
    const sponsors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor));
    callback(sponsors);
  });
};

export const updateSponsor = async (id: string, sponsor: Partial<Sponsor>) => {
  const sponsorRef = doc(db, SPONSORS_COLLECTION, id);
  return await updateDoc(sponsorRef, sponsor);
};

// --- Banners / Ads ---
export const subscribeToAds = (callback: (ads: AdItem[]) => void) => {
  return onSnapshot(collection(db, BANNERS_COLLECTION), (snapshot) => {
    const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdItem));
    callback(ads);
  });
};

export const updateAd = async (id: string, ad: Partial<AdItem>) => {
  const adRef = doc(db, BANNERS_COLLECTION, id);
  return await updateDoc(adRef, ad);
};

// --- Poll Banner Config ---
export const subscribeToPollBanner = (callback: (config: PollBannerConfig) => void) => {
  const docRef = doc(db, CONFIG_COLLECTION, "pollBanner");
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as PollBannerConfig);
    }
  });
};

export const updatePollBanner = async (config: Partial<PollBannerConfig>) => {
  const docRef = doc(db, CONFIG_COLLECTION, "pollBanner");
  return await setDoc(docRef, config, { merge: true });
};

// --- Subscribers ---
const SUBSCRIBERS_COLLECTION = "suscriptores";

export const checkEmailSubscription = async (email: string) => {
  const q = query(collection(db, SUBSCRIBERS_COLLECTION), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const addSubscriber = async (email: string) => {
  return await addDoc(collection(db, SUBSCRIBERS_COLLECTION), {
    email,
    fecha: new Date()
  });
};

export const updateConfig = async (id: string, config: any) => {
  const docRef = doc(db, CONFIG_COLLECTION, id);
  return await setDoc(docRef, config, { merge: true });
};

export const subscribeToConfig = (id: string, callback: (config: any) => void) => {
  const docRef = doc(db, CONFIG_COLLECTION, id);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};
