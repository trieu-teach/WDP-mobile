import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MangaCard } from '../components';
import { mangaApi } from '../api/mangaApi';
import { Manga, RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RECENT_SEARCHES = ['One Piece', 'Naruto', 'Attack on Titan', 'Demon Slayer'];
const POPULAR_TAGS = ['Action', 'Adventure', 'Comedy', 'Romance', 'Horror', 'Supernatural'];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Manga[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const searchResults = await mangaApi.searchManga(query);
      setResults(searchResults);
      setHasSearched(true);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, []);

  const handleMangaPress = (mangaId: string) => {
    navigation.navigate('MangaDetail', { mangaId });
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery(tag);
    handleSearch(tag);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Search
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: isDark ? Colors.dark.text : Colors.light.text }]}
            placeholder="Search manga, author..."
            placeholderTextColor={isDark ? Colors.dark.textMuted : Colors.light.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {!hasSearched ? (
        <View style={styles.suggestions}>
          {/* Recent Searches */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Recent Searches
            </Text>
            <View style={styles.tagContainer}>
              {RECENT_SEARCHES.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}
                  onPress={() => handleSearch(search)}
                >
                  <Text style={[styles.tagText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                    {search}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Popular Tags
            </Text>
            <View style={styles.tagContainer}>
              {POPULAR_TAGS.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, styles.popularTag, { backgroundColor: Colors.primary + '20' }]}
                  onPress={() => handleTagPress(tag)}
                >
                  <Text style={[styles.tagText, { color: Colors.primary }]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
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
                No results found
              </Text>
              <Text style={[styles.emptySubtext, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Try different keywords
              </Text>
            </View>
          }
        />
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.dark.textMuted,
    padding: 4,
  },
  suggestions: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  popularTag: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  tagText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  resultsList: {
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
    paddingTop: 100,
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
});
