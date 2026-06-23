import { Manga, Genre } from '../types/manga';

const MOCK_MANGA: Manga[] = [
  {
    id: '1',
    title: 'One Piece',
    coverUrl: 'https://picsum.photos/seed/manga1/300/450',
    author: 'Eiichiro Oda',
    description: 'Monkey D. Luffy embarked on a journey to find the legendary treasure One Piece and become the King of Pirates. Along the way, he forms a crew and faces many powerful enemies.',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'ongoing',
    rating: 4.9,
    views: 1500000,
    lastUpdated: new Date('2026-06-15'),
    chapters: [
      { id: '1-1', number: 1, title: 'Romance Dawn', pages: ['https://picsum.photos/seed/ch1p1/400/600', 'https://picsum.photos/seed/ch1p2/400/600', 'https://picsum.photos/seed/ch1p3/400/600'] },
      { id: '1-2', number: 2, title: 'They Call Him Luffy', pages: ['https://picsum.photos/seed/ch2p1/400/600', 'https://picsum.photos/seed/ch2p2/400/600'] },
      { id: '1-3', number: 3, title: 'First Crew Member', pages: ['https://picsum.photos/seed/ch3p1/400/600', 'https://picsum.photos/seed/ch3p2/400/600', 'https://picsum.photos/seed/ch3p3/400/600', 'https://picsum.photos/seed/ch3p4/400/600'] },
    ],
  },
  {
    id: '2',
    title: 'Naruto',
    coverUrl: 'https://picsum.photos/seed/manga2/300/450',
    author: 'Masashi Kishimoto',
    description: 'Naruto Uzumaki, a young ninja with a demon fox sealed inside him, dreams of becoming the Hokage, the leader of his village.',
    genres: ['Action', 'Adventure', 'Martial Arts'],
    status: 'completed',
    rating: 4.8,
    views: 2000000,
    lastUpdated: new Date('2024-01-01'),
    chapters: [
      { id: '2-1', number: 1, title: 'Uzumaki Naruto', pages: ['https://picsum.photos/seed/nar1p1/400/600', 'https://picsum.photos/seed/nar1p2/400/600'] },
      { id: '2-2', number: 2, title: 'The Secret of the Circle', pages: ['https://picsum.photos/seed/nar2p1/400/600', 'https://picsum.photos/seed/nar2p2/400/600', 'https://picsum.photos/seed/nar2p3/400/600'] },
    ],
  },
  {
    id: '3',
    title: 'Attack on Titan',
    coverUrl: 'https://picsum.photos/seed/manga3/300/450',
    author: 'Hajime Isayama',
    description: 'In a world where humanity lives within cities surrounded by enormous walls due to the Titans, a young boy named Eren Yeager vows to destroy all Titans.',
    genres: ['Action', 'Drama', 'Horror'],
    status: 'completed',
    rating: 4.9,
    views: 1800000,
    lastUpdated: new Date('2021-04-09'),
    chapters: [
      { id: '3-1', number: 1, title: 'To You, 2000 Years Later', pages: ['https://picsum.photos/seed/aot1p1/400/600', 'https://picsum.photos/seed/aot1p2/400/600'] },
    ],
  },
  {
    id: '4',
    title: 'Demon Slayer',
    coverUrl: 'https://picsum.photos/seed/manga4/300/450',
    author: 'Koyoharu Gotouge',
    description: 'Tanjiro Kamado becomes a demon slayer after his family is slaughtered and his sister Nezuko is turned into a demon.',
    genres: ['Action', 'Supernatural', 'Historical'],
    status: 'completed',
    rating: 4.8,
    views: 1600000,
    lastUpdated: new Date('2020-05-18'),
    chapters: [
      { id: '4-1', number: 1, title: 'Cruelty', pages: ['https://picsum.photos/seed/ds1p1/400/600', 'https://picsum.photos/seed/ds1p2/400/600'] },
    ],
  },
  {
    id: '5',
    title: 'Jujutsu Kaisen',
    coverUrl: 'https://picsum.photos/seed/manga5/300/450',
    author: 'Gege Akutami',
    description: 'Yuji Itadori, a high school student with exceptional physical abilities, joins a secret organization of Jujutsu Sorcerers to kill a powerful curse named Sukuna.',
    genres: ['Action', 'Supernatural', 'School'],
    status: 'ongoing',
    rating: 4.7,
    views: 1200000,
    lastUpdated: new Date('2026-06-10'),
    chapters: [
      { id: '5-1', number: 1, title: 'Ryomen Sukuna', pages: ['https://picsum.photos/seed/jjk1p1/400/600', 'https://picsum.photos/seed/jjk1p2/400/600'] },
    ],
  },
  {
    id: '6',
    title: 'My Hero Academia',
    coverUrl: 'https://picsum.photos/seed/manga6/300/450',
    author: 'Kohei Horikoshi',
    description: 'In a world where most people have superpowers called Quirks, a Quirkless boy named Izuku Midoriya dreams of becoming a hero.',
    genres: ['Action', 'Comedy', 'School'],
    status: 'ongoing',
    rating: 4.6,
    views: 1100000,
    lastUpdated: new Date('2026-06-08'),
    chapters: [
      { id: '6-1', number: 1, title: 'The End of the Beginning', pages: ['https://picsum.photos/seed/mha1p1/400/600', 'https://picsum.photos/seed/mha1p2/400/600'] },
    ],
  },
  {
    id: '7',
    title: 'Chainsaw Man',
    coverUrl: 'https://picsum.photos/seed/manga7/300/450',
    author: 'Tatsuki Fujimoto',
    description: 'Denji is a young man trapped in poverty, working as a Devil Hunter to pay off his deceased father\'s debt. After being killed, he merges with his Devil dog Pochita.',
    genres: ['Action', 'Horror', 'Supernatural'],
    status: 'ongoing',
    rating: 4.7,
    views: 1400000,
    lastUpdated: new Date('2026-06-12'),
    chapters: [
      { id: '7-1', number: 1, title: 'Dog & Chainsaw', pages: ['https://picsum.photos/seed/csm1p1/400/600', 'https://picsum.photos/seed/csm1p2/400/600'] },
    ],
  },
  {
    id: '8',
    title: 'Spy x Family',
    coverUrl: 'https://picsum.photos/seed/manga8/300/450',
    author: 'Tatsuya Endo',
    description: 'A spy, an assassin, and a telepathic child form a fake family for their own purposes, but soon discover that they have grown to care for each other.',
    genres: ['Action', 'Comedy', 'Slice of Life'],
    status: 'ongoing',
    rating: 4.8,
    views: 1300000,
    lastUpdated: new Date('2026-06-05'),
    chapters: [
      { id: '8-1', number: 1, title: 'Adopt Me', pages: ['https://picsum.photos/seed/sf1p1/400/600', 'https://picsum.photos/seed/sf1p2/400/600'] },
    ],
  },
];

export const GENRES: Genre[] = [
  { id: '1', name: 'Action', icon: '⚔️' },
  { id: '2', name: 'Adventure', icon: '🗺️' },
  { id: '3', name: 'Comedy', icon: '😂' },
  { id: '4', name: 'Drama', icon: '🎭' },
  { id: '5', name: 'Horror', icon: '👻' },
  { id: '6', name: 'Romance', icon: '💕' },
  { id: '7', name: 'School', icon: '📚' },
  { id: '8', name: 'Supernatural', icon: '🔮' },
  { id: '9', name: 'Martial Arts', icon: '🥋' },
  { id: '10', name: 'Historical', icon: '🏯' },
];

export const mangaApi = {
  getAllManga: async (): Promise<Manga[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_MANGA;
  },

  getMangaById: async (id: string): Promise<Manga | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MANGA.find(m => m.id === id);
  },

  searchManga: async (query: string): Promise<Manga[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return MOCK_MANGA.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) ||
      m.author.toLowerCase().includes(lowerQuery) ||
      m.genres.some(g => g.toLowerCase().includes(lowerQuery))
    );
  },

  getMangaByGenre: async (genre: string): Promise<Manga[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MANGA.filter(m => 
      m.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  },

  getTrendingManga: async (): Promise<Manga[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...MOCK_MANGA].sort((a, b) => b.views - a.views).slice(0, 5);
  },

  getLatestManga: async (): Promise<Manga[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...MOCK_MANGA].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  },

  getCompletedManga: async (): Promise<Manga[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MANGA.filter(m => m.status === 'completed');
  },
};
