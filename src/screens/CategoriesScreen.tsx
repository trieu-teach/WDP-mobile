import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MangaCard } from '../components';
import { mangaApi, GENRES } from '../api/mangaApi';
import { Manga, Genre, RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMangaByGenre();
  }, [selectedGenre]);

  const loadMangaByGenre = async () => {
    if (!selectedGenre) {
      setMangaList([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await mangaApi.getMangaByGenre(selectedGenre.name);
      setMangaList(data);
    } catch (error) {
      console.error('Error loading manga:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMangaPress = (mangaId: string) => {
    navigation.navigate('MangaDetail', { mangaId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Categories
        </Text>
      </View>

      {/* Genre Grid */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreScroll}
      >
        <TouchableOpacity
          style={[
            styles.genreCard,
            !selectedGenre && styles.genreCardActive,
            { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }
          ]}
          onPress={() => setSelectedGenre(null)}
        >
          <Text style={styles.genreIcon}>📚</Text>
          <Text style={[
            styles.genreName,
            !selectedGenre && { color: '#fff' }
          ]}>All</Text>
        </TouchableOpacity>
        
        {GENRES.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreCard,
              selectedGenre?.id === genre.id && styles.genreCardActive,
              { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }
            ]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text style={styles.genreIcon}>{genre.icon}</Text>
            <Text style={[
              styles.genreName,
              selectedGenre?.id === genre.id && { color: '#fff' }
            ]}>
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selected Genre Header */}
      <View style={styles.selectedHeader}>
        <Text style={[styles.selectedTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          {selectedGenre ? `${selectedGenre.icon} ${selectedGenre.name}` : '📚 All Manga'}
        </Text>
        <Text style={styles.count}>
          {mangaList.length} results
        </Text>
      </View>

      {/* Manga Grid */}
      {selectedGenre || true ? (
        <FlatList
          data={mangaList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mangaList}
          renderItem={({ item }) => (
            <MangaCard 
              manga={item} 
              onPress={() => handleMangaPress(item.id)}
              variant="vertical"
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                No manga found
              </Text>
              <Text style={[styles.emptySubtext, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Select a different category
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.promptContainer}>
          <Text style={styles.promptIcon}>👆</Text>
          <Text style={[styles.promptText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            Select a category to browse
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
  },
  genreScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  genreCard: {
    width: 80,
    height: 90,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  genreCardActive: {
    backgroundColor: Colors.primary,
  },
  genreIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  genreName: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  selectedTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  count: {
    fontSize: FontSize.sm,
    color: Colors.dark.textMuted,
  },
  mangaList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.md,
  },
  promptContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  promptText: {
    fontSize: FontSize.md,
  },
});
