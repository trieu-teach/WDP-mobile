import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@mangaverse_favorites';
const HISTORY_KEY = '@mangaverse_history';
const SETTINGS_KEY = '@mangaverse_settings';

export interface ReadingHistory {
  mangaId: string;
  chapterId: string;
  readAt: Date;
  progress: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  readingDirection: 'vertical' | 'horizontal';
  showNSFW: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  readingDirection: 'vertical',
  showNSFW: false,
};

export const storageService = {
  // Favorites
  getFavorites: async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addFavorite: async (mangaId: string): Promise<void> => {
    try {
      const favorites = await storageService.getFavorites();
      if (!favorites.includes(mangaId)) {
        favorites.push(mangaId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  removeFavorite: async (mangaId: string): Promise<void> => {
    try {
      const favorites = await storageService.getFavorites();
      const filtered = favorites.filter(id => id !== mangaId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  isFavorite: async (mangaId: string): Promise<boolean> => {
    const favorites = await storageService.getFavorites();
    return favorites.includes(mangaId);
  },

  // Reading History
  getHistory: async (): Promise<ReadingHistory[]> => {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map((item: any) => ({
          ...item,
          readAt: new Date(item.readAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },

  addToHistory: async (mangaId: string, chapterId: string, progress: number): Promise<void> => {
    try {
      const history = await storageService.getHistory();
      const existingIndex = history.findIndex(h => h.mangaId === mangaId);
      
      const newEntry: ReadingHistory = {
        mangaId,
        chapterId,
        readAt: new Date(),
        progress,
      };

      if (existingIndex >= 0) {
        history[existingIndex] = newEntry;
      } else {
        history.unshift(newEntry);
      }

      const trimmedHistory = history.slice(0, 50);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  },

  clearHistory: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  // Settings
  getSettings: async (): Promise<AppSettings> => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: async (settings: Partial<AppSettings>): Promise<void> => {
    try {
      const current = await storageService.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  },
};
