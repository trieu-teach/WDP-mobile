import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Dimensions,
  useColorScheme,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Loading } from '../components';
import { mangaApi } from '../api/mangaApi';
import { storageService } from '../services/storage';
import { Manga, Chapter, RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ReaderRouteProp = RouteProp<RootStackParamList, 'ChapterReader'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ChapterReaderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReaderRouteProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [manga, setManga] = useState<Manga | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChapter();
  }, [route.params.mangaId, route.params.chapterId]);

  const loadChapter = async () => {
    try {
      const mangaData = await mangaApi.getMangaById(route.params.mangaId);
      if (mangaData) {
        setManga(mangaData);
        const chapter = mangaData.chapters.find(c => c.id === route.params.chapterId);
        setCurrentChapter(chapter || null);
        
        if (chapter) {
          await storageService.addToHistory(mangaData.id, chapter.id, 0);
        }
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (pageIndex: number) => {
    setCurrentPage(pageIndex);
    if (currentChapter) {
      await storageService.addToHistory(route.params.mangaId, currentChapter.id, pageIndex);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const goToNextChapter = () => {
    if (!manga || !currentChapter) return;
    const currentIndex = manga.chapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex < manga.chapters.length - 1) {
      const nextChapter = manga.chapters[currentIndex + 1];
      navigation.replace('ChapterReader', { 
        mangaId: manga.id, 
        chapterId: nextChapter.id 
      });
    }
  };

  const goToPrevChapter = () => {
    if (!manga || !currentChapter) return;
    const currentIndex = manga.chapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex > 0) {
      const prevChapter = manga.chapters[currentIndex - 1];
      navigation.replace('ChapterReader', { 
        mangaId: manga.id, 
        chapterId: prevChapter.id 
      });
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading chapter..." />;
  }

  if (!manga || !currentChapter) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Chapter not found</Text>
      </View>
    );
  }

  const isFirstChapter = manga.chapters.findIndex(c => c.id === currentChapter.id) === 0;
  const isLastChapter = manga.chapters.findIndex(c => c.id === currentChapter.id) === manga.chapters.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar hidden={!showControls} />
      
      {/* Page Content */}
      <FlatList
        ref={flatListRef}
        data={currentChapter.pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.pageContainer}
            activeOpacity={1}
            onPress={toggleControls}
          >
            <Image
              source={{ uri: item }}
              style={styles.pageImage}
              contentFit="contain"
              transition={200}
            />
          </TouchableOpacity>
        )}
        onMomentumScrollEnd={(e) => {
          const pageIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          handlePageChange(pageIndex);
        }}
      />

      {/* Top Controls */}
      {showControls && (
        <SafeAreaView style={styles.topControls} edges={['top']}>
          <View style={styles.topBar}>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.mangaTitle} numberOfLines={1}>
                {manga.title}
              </Text>
              <Text style={styles.chapterTitle} numberOfLines={1}>
                Chapter {currentChapter.number}: {currentChapter.title}
              </Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn}>
              <Text style={styles.settingsBtnText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* Bottom Controls */}
      {showControls && (
        <View style={styles.bottomControls}>
          {/* Page Indicator */}
          <View style={styles.pageIndicator}>
            <TouchableOpacity 
              style={[styles.navBtn, isFirstChapter && styles.navBtnDisabled]}
              onPress={goToPrevChapter}
              disabled={isFirstChapter}
            >
              <Text style={[styles.navBtnText, isFirstChapter && styles.navBtnTextDisabled]}>
                ‹ Prev
              </Text>
            </TouchableOpacity>
            
            <View style={styles.pageCounter}>
              <Text style={styles.pageCounterText}>
                {currentPage + 1} / {currentChapter.pages.length}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.navBtn, isLastChapter && styles.navBtnDisabled]}
              onPress={goToNextChapter}
              disabled={isLastChapter}
            >
              <Text style={[styles.navBtnText, isLastChapter && styles.navBtnTextDisabled]}>
                Next ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chapter List Button */}
          <TouchableOpacity 
            style={styles.chapterListBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.chapterListBtnText}>📑 Chapter List</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  mangaTitle: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  chapterTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsBtnText: {
    fontSize: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  navBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  navBtnTextDisabled: {
    color: Colors.dark.textMuted,
  },
  pageCounter: {
    backgroundColor: Colors.dark.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  pageCounterText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  chapterListBtn: {
    backgroundColor: Colors.dark.card,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  chapterListBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: FontSize.lg,
  },
});
