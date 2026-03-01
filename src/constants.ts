
import { NewsItem, AdItem, PopupConfig, Activity, LargePopupConfig, MultimediaItem, Poll, Sponsor } from './types';

export const COLORS = {
  primary: '#1E3A8A', // Azul Institucional
  secondary: '#D32F2F', // Rojo Institucional
  white: '#FFFFFF'
};

export const MOCK_POLLS: Poll[] = [
  {
    id: 'poll-1',
    title: '¿Quién cree usted que ganaría las elecciones presidenciales si fueran hoy?',
    description: 'Encuesta de opinión pública sobre la intención de voto para el próximo periodo electoral.',
    closingDate: '15 de Mayo, 2024',
    isActive: true,
    candidates: [
      { id: 'c-1', name: 'Luis Abinader', party: 'PRM', photoUrl: 'https://picsum.photos/seed/abinader/400/400', votes: 450 },
      { id: 'c-2', name: 'Leonel Fernández', party: 'FP', photoUrl: 'https://picsum.photos/seed/leonel/400/400', votes: 320 },
      { id: 'c-3', name: 'Abel Martínez', party: 'PLD', photoUrl: 'https://picsum.photos/seed/abel/400/400', votes: 180 }
    ]
  }
];

export const MOCK_SPONSORS: Sponsor[] = [
  { id: 's-1', imageUrl: 'https://picsum.photos/seed/s1/200/200', link: 'https://google.com', isActive: true },
  { id: 's-2', imageUrl: 'https://picsum.photos/seed/s2/200/200', link: 'https://google.com', isActive: true },
  { id: 's-3', imageUrl: 'https://picsum.photos/seed/s3/200/200', link: 'https://google.com', isActive: true },
  { id: 's-4', imageUrl: 'https://picsum.photos/seed/s4/200/200', link: 'https://google.com', isActive: true },
  { id: 's-5', imageUrl: 'https://picsum.photos/seed/s5/200/200', link: 'https://google.com', isActive: true },
  { id: 's-6', imageUrl: 'https://picsum.photos/seed/s6/200/200', link: 'https://google.com', isActive: true }
];

export const BREAKING_NEWS = [
  "ÚLTIMA HORA: Banco Central de RD mantiene tasa de política monetaria en 7.00% anual",
  "DEPORTES: Vladimir Guerrero Jr. conecta cuadrangular decisivo en victoria de los Azulejos",
  "NACIONALES: COE coloca 15 provincias en alerta por vaguada en el territorio dominicano",
  "ECONOMÍA: Inversión extranjera en RD supera los US$4,000 millones en el último año"
];

export const CATEGORIES = [
  "Inicio", "Nacionales", "Encuestas", "Política RD", "Actividad Semanal", "Internacional", "Deportes", 
  "Entretenimiento", "Economía", "Tecnología", "Opinión", "Contacto"
];

export const DEFAULT_POLL_BANNER = {
  imageUrl: 'https://picsum.photos/seed/poll-banner/1200/200',
  link: 'https://google.com',
  isEnabled: true
};

export const DEFAULT_FLOATING_BANNER = {
  isEnabled: true,
  flyers: [
    { id: 'f-1', title: 'Publicidad Local 1', description: 'Anuncia tu negocio aquí', imageUrl: 'https://picsum.photos/seed/local-ad-1/400/500', link: 'https://wa.me/18097507423', isActive: true },
    { id: 'f-2', title: 'Publicidad Local 2', description: 'Llega a más clientes', imageUrl: 'https://picsum.photos/seed/local-ad-2/400/500', link: 'https://wa.me/18097507423', isActive: true },
    { id: 'f-3', title: 'Publicidad Local 3', description: 'Tu marca en TendenciaRD', imageUrl: 'https://picsum.photos/seed/local-ad-3/400/500', link: 'https://wa.me/18097507423', isActive: true },
    { id: 'f-4', title: 'Publicidad Local 4', description: 'Espacios premium', imageUrl: 'https://picsum.photos/seed/local-ad-4/400/500', link: 'https://wa.me/18097507423', isActive: true },
    { id: 'f-5', title: 'Publicidad Local 5', description: 'Conecta con tu audiencia', imageUrl: 'https://picsum.photos/seed/local-ad-5/400/500', link: 'https://wa.me/18097507423', isActive: true },
    { id: 'f-6', title: 'Publicidad Local 6', description: 'Resultados garantizados', imageUrl: 'https://picsum.photos/seed/local-ad-6/400/500', link: 'https://wa.me/18097507423', isActive: true },
  ]
};

export const MOCK_NEWS: NewsItem[] = [];

export const MOCK_ADS: AdItem[] = [
  {
    id: 'ad-1',
    size: 'leaderboard',
    label: 'Publicidad Premium - 728x90',
    imageUrl: ''
  },
  {
    id: 'ad-2',
    size: 'sidebar',
    label: '300 x 600 Ad Space',
    imageUrl: ''
  },
  {
    id: 'ad-activity',
    size: 'leaderboard',
    label: 'Publicidad Actividad Semanal',
    imageUrl: ''
  }
];

export const DEFAULT_POPUP_CONFIG: PopupConfig = {
  title: 'Suscríbete a nuestro boletín',
  description: 'Recibe las noticias más calientes de RD directamente en tu bandeja de entrada cada mañana.',
  imageUrl: '',
  buttonText: 'Suscribirme ahora',
  isEnabled: true
};

export const DEFAULT_LARGE_POPUP_CONFIG: LargePopupConfig = {
  title: '¡Anúnciate con nosotros!',
  description: 'Llega a miles de lectores dominicanos cada día. Tenemos los mejores espacios para tu marca.',
  imageUrl: 'https://picsum.photos/seed/ads-square/400/400',
  buttonText: 'Contactar Ventas',
  isEnabled: true,
  delay: 10000,
  categoryAds: {
    'Deportes': {
      title: '¡Pasión por el Deporte!',
      description: 'Anuncia tu marca deportiva aquí y llega a los fanáticos más fieles de RD.',
      imageUrl: 'https://picsum.photos/seed/sports-ad/400/400',
      buttonText: 'Publicar Oferta',
      isEnabled: true
    },
    'Economía': {
      title: 'Inversiones Inteligentes',
      description: 'Tu servicio financiero merece estar frente a los tomadores de decisiones.',
      imageUrl: 'https://picsum.photos/seed/finance-ad/400/400',
      buttonText: 'Más Información',
      isEnabled: true
    },
    'Tecnología': {
      title: 'El Futuro es Hoy',
      description: 'Lanza tu gadget o software en la sección más innovadora de TendenciaRD.',
      imageUrl: 'https://picsum.photos/seed/tech-ad/400/400',
      buttonText: 'Ver Tarifas',
      isEnabled: true
    }
  }
};

export const DEFAULT_ACTIVITY: Activity = {
  id: 'activity-1',
  title: 'Gran Carnaval de Santo Domingo 2024',
  description: 'Ven a disfrutar del desfile más colorido de la República Dominicana con comparsas de todo el país. El Malecón se llena de música, color y tradición con los mejores diablos cojuelos y personajes folclóricos.',
  imageUrl: 'https://picsum.photos/seed/carnaval/1200/600',
  extraImages: [
    'https://picsum.photos/seed/carnaval1/800/600',
    'https://picsum.photos/seed/carnaval2/800/600',
    'https://picsum.photos/seed/carnaval3/800/600'
  ],
  date: '25 de Febrero, 2024',
  location: 'Av. George Washington (Malecón)'
};

export const MOCK_MULTIMEDIA: MultimediaItem[] = [
  {
    id: 'm-1',
    title: 'Resumen Semanal: El futuro de la IA en RD',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/m-video/800/450',
    description: 'Analizamos cómo las empresas dominicanas están adoptando la inteligencia artificial para optimizar sus procesos.',
    date: 'Hace 2 días'
  },
  {
    id: 'm-2',
    title: 'Podcast: Emprendimiento en el Caribe',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail: 'https://picsum.photos/seed/m-audio/800/800',
    description: 'Entrevista exclusiva con los fundadores de las startups más exitosas de la región.',
    date: 'Ayer'
  },
  {
    id: 'm-3',
    title: 'Galería: Bellezas Ocultas de Samaná',
    type: 'gallery',
    url: 'https://picsum.photos/seed/m-gallery/800/450',
    thumbnail: 'https://picsum.photos/seed/m-gallery/800/450',
    description: 'Un recorrido visual por las playas menos conocidas pero más hermosas de la península de Samaná.',
    date: 'Hace 3 días',
    galleryImages: [
      'https://picsum.photos/seed/samana1/1200/800',
      'https://picsum.photos/seed/samana2/1200/800',
      'https://picsum.photos/seed/samana3/1200/800'
    ]
  }
];
