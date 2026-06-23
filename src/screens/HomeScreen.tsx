import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  RefreshControl,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MangaCard } from '../components';
import { mangaApi } from '../api/mangaApi';
import { Manga, RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [trending, setTrending] = useState<Manga[]>([]);
  const [latest, setLatest] = useState<Manga[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [trendingData, latestData] = await Promise.all([
        mangaApi.getTrendingManga(),
        mangaApi.getLatestManga(),
      ]);
      setTrending(trendingData);
      setLatest(latestData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleMangaPress = (mangaId: string) => {
    navigation.navigate('MangaDetail', { mangaId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              Welcome back 👋
            </Text>
            <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              MangaVerse
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Banner */}
        <View style={styles.featuredContainer}>
          <Image
            source={{ uri: trending[0]?.coverUrl }}
            style={styles.featuredImage}
            contentFit="cover"
          />
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>🔥 Hot</Text>
            </View>
            <Text style={styles.featuredTitle}>{trending[0]?.title}</Text>
            <Text style={styles.featuredAuthor}>{trending[0]?.author}</Text>
            <TouchableOpacity 
              style={styles.readNowBtn}
              onPress={() => handleMangaPress(trending[0]?.id || '')}
            >
              <Text style={styles.readNowText}>Read Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              🔥 Trending Now
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trending}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MangaCard manga={item} onPress={() => handleMangaPress(item.id)} />
            )}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Latest Updates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              ✨ Latest Updates
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.latestGrid}>
            {latest.map((item) => (
              <MangaCard 
                key={item.id} 
                manga={item} 
                onPress={() => handleMangaPress(item.id)}
              />
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Manga</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Chapters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Genres</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  greeting: {
    fontSize: FontSize.sm,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 20,
  },
  featuredContainer: {
    marginHorizontal: Spacing.lg,
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.lg,
    justifyContent: 'flex-end',
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredAuthor: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  readNowBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  readNowText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
  },
  latestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.primary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
  },
});
