import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MangaCard, Loading } from '../components';
import { mangaApi } from '../api/mangaApi';
import { storageService } from '../services/storage';
import { Manga, RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [favorites, setFavorites] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  const loadFavorites = useCallback(async () => {
    try {
      const favoriteIds = await storageService.getFavorites();
      const allManga = await mangaApi.getAllManga();
      const favoriteManga = allManga.filter(m => favoriteIds.includes(m.id));
      setFavorites(favoriteManga);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleMangaPress = (mangaId: string) => {
    navigation.navigate('MangaDetail', { mangaId });
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            for (const manga of favorites) {
              await storageService.removeFavorite(manga.id);
            }
            setFavorites([]);
          }
        },
      ]
    );
  };

  if (loading) {
    return <Loading fullScreen message="Loading favorites..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Library
        </Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={handleClearFavorites}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            ❤️ Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            📖 History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'favorites' ? (
        favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <MangaCard 
                manga={item} 
                onPress={() => handleMangaPress(item.id)}
                variant="vertical"
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={[styles.emptyTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              Start adding manga to your favorites{'\n'}to see them here
            </Text>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.browseBtnText}>Browse Manga</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={styles.historyContainer}>
          <Text style={styles.historyIcon}>📚</Text>
          <Text style={[styles.historyTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            Reading History
          </Text>
          <Text style={[styles.historyText, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            Your reading history will appear here{'\n'}after you read some chapters
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
  },
  clearText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  historyIcon: {
    fontSize: 60,
    marginBottom: Spacing.lg,
  },
  historyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  historyText: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
  },
});
