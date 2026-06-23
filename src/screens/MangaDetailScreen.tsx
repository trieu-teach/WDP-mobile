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
import { Image } from 'expo-image';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChapterCard, Loading } from '../components';
import { mangaApi } from '../api/mangaApi';
import { storageService } from '../services/storage';
import { Manga, Chapter, RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, 'MangaDetail'>;

export const MangaDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [manga, setManga] = useState<Manga | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManga();
  }, [route.params.mangaId]);

  const loadManga = async () => {
    try {
      const data = await mangaApi.getMangaById(route.params.mangaId);
      setManga(data || null);
      
      const favorite = await storageService.isFavorite(route.params.mangaId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error loading manga:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!manga) return;
    
    if (isFavorite) {
      await storageService.removeFavorite(manga.id);
    } else {
      await storageService.addFavorite(manga.id);
    }
    setIsFavorite(!isFavorite);
  };

  const handleReadChapter = (chapter: Chapter) => {
    if (!manga) return;
    navigation.navigate('ChapterReader', { 
      mangaId: manga.id, 
      chapterId: chapter.id 
    });
  };

  if (loading) {
    return <Loading fullScreen message="Loading manga..." />;
  }

  if (!manga) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
        <Text style={styles.errorText}>Manga not found</Text>
      </SafeAreaView>
    );
  }

  const sortedChapters = [...manga.chapters].sort((a, b) => b.number - a.number);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: manga.coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <View style={styles.coverOverlay} />
          
          {/* Back Button */}
          <SafeAreaView style={styles.headerButtons} edges={['top']}>
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.favoriteBtn}
              onPress={handleToggleFavorite}
            >
              <Text style={styles.favoriteBtnText}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              {manga.title}
            </Text>
            <Text style={[styles.author, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              by {manga.author}
            </Text>
            
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={[styles.statValue, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                  {manga.rating}
                </Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: manga.status === 'ongoing' ? Colors.status.success + '20' : Colors.secondary + '20' }]}>
                <Text style={[styles.statValue, { color: manga.status === 'ongoing' ? Colors.status.success : Colors.secondary }]}>
                  {manga.status === 'ongoing' ? '更新中' : '完结'}
                </Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statIcon}>📖</Text>
                <Text style={[styles.statValue, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                  {manga.chapters.length} ch
                </Text>
              </View>
            </View>

            {/* Genres */}
            <View style={styles.genreContainer}>
              {manga.genres.map((genre, index) => (
                <View key={index} style={[styles.genreTag, { backgroundColor: Colors.primary + '20' }]}>
                  <Text style={[styles.genreText, { color: Colors.primary }]}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.readBtn]}
              onPress={() => sortedChapters[0] && handleReadChapter(sortedChapters[0])}
            >
              <Text style={styles.readBtnText}>📖 Read First Chapter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.voteBtn]}
              onPress={() => navigation.navigate('Vote', { mangaId: manga.id })}
            >
              <Text style={styles.voteBtnText}>⭐ Vote</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Synopsis
            </Text>
            <Text style={[styles.description, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              {manga.description}
            </Text>
          </View>

          {/* Chapters */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Chapters ({manga.chapters.length})
            </Text>
            {sortedChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                onPress={() => handleReadChapter(chapter)}
              />
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    height: 350,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
  favoriteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBtnText: {
    fontSize: 20,
  },
  content: {
    marginTop: -40,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    marginBottom: 4,
  },
  author: {
    fontSize: FontSize.md,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.card,
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  genreText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  readBtn: {
    backgroundColor: Colors.primary,
  },
  readBtnText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  voteBtn: {
    backgroundColor: '#fbbf24',
  },
  voteBtnText: {
    color: '#000',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    lineHeight: 24,
  },
  errorText: {
    color: Colors.dark.text,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginTop: 100,
  },
});
