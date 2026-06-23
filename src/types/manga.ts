export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
  readAt?: Date;
}

export interface Manga {
  id: string;
  title: string;
  coverUrl: string;
  author: string;
  description: string;
  genres: string[];
  status: 'ongoing' | 'completed';
  rating: number;
  chapters: Chapter[];
  lastUpdated: Date;
  views: number;
  totalViews?: number;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  MangaDetail: { mangaId: string };
  ChapterReader: { mangaId: string; chapterId: string };
  Vote: { mangaId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  Library: undefined;
  EB: undefined;
};
