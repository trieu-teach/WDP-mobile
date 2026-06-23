import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { mangaApi } from '../api/mangaApi';
import { ebApi } from '../api/ebApi';
import { RootStackParamList } from '../types/manga';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

type VoteRouteProp = RouteProp<RootStackParamList, 'Vote'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STAR_SIZE = 40;
const SCORE_MAX = 5;

interface StarButtonProps {
  filled: boolean;
  halfFilled: boolean;
  onPress: () => void;
}

const StarButton: React.FC<StarButtonProps> = ({ filled, halfFilled, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.starButton}>
    <Text style={[styles.starIcon, filled && styles.starFilled, halfFilled && styles.starHalf]}>
      ★
    </Text>
  </TouchableOpacity>
);

export const VoteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VoteRouteProp>();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const { mangaId } = route.params;
  const [manga, setManga] = useState<any>(null);
  const [selectedScore, setSelectedScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    loadManga();
  }, [mangaId]);

  const loadManga = async () => {
    try {
      const data = await mangaApi.getMangaById(mangaId);
      setManga(data);
      
      const avgVote = await ebApi.getVotesForManga(mangaId);
      if (avgVote > 0) {
        setSelectedScore(Math.round(avgVote));
        setVoted(true);
      }
    } catch (error) {
      console.error('Error loading manga:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedScore === 0) return;
    
    try {
      await ebApi.submitVote(mangaId, selectedScore);
      setVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const displayScore = hoverScore || selectedScore;

  if (loading || !manga) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.dark.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Vote
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Manga Info */}
      <View style={styles.mangaInfo}>
        <Image
          source={{ uri: manga.coverUrl }}
          style={styles.coverImage}
          contentFit="cover"
        />
        <View style={styles.mangaDetails}>
          <Text style={[styles.mangaTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]} numberOfLines={2}>
            {manga.title}
          </Text>
          <Text style={[styles.mangaAuthor, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            by {manga.author}
          </Text>
          <View style={styles.genreContainer}>
            {manga.genres.slice(0, 3).map((genre: string, index: number) => (
              <View key={index} style={[styles.genreBadge, { backgroundColor: Colors.primary + '20' }]}>
                <Text style={[styles.genreText, { color: Colors.primary }]}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Vote Section */}
      <View style={[styles.voteSection, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
        <Text style={[styles.voteTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          {voted ? 'Cảm ơn bạn đã vote!' : 'Bạn nghĩ sao về bộ truyện này?'}
        </Text>
        
        <View style={styles.starsContainer}>
          {Array.from({ length: SCORE_MAX }, (_, index) => {
            const score = index + 1;
            const filled = displayScore >= score;
            const halfFilled = !filled && displayScore >= score - 0.5;
            
            return (
              <StarButton
                key={score}
                filled={filled}
                halfFilled={halfFilled}
                onPress={() => setSelectedScore(score)}
              />
            );
          })}
        </View>

        <Text style={[styles.scoreText, { color: Colors.primary }]}>
          {displayScore > 0 ? `${displayScore.toFixed(1)} / ${SCORE_MAX}` : 'Chọn điểm'}
        </Text>

        {/* Score Labels */}
        <View style={styles.scoreLabels}>
          <Text style={[styles.scoreLabel, { color: Colors.status.error }]}>Dở</Text>
          <Text style={[styles.scoreLabel, { color: Colors.status.warning }]}>Tạm</Text>
          <Text style={[styles.scoreLabel, { color: '#0ea5e9' }]}>OK</Text>
          <Text style={[styles.scoreLabel, { color: Colors.status.success }]}>Hay</Text>
          <Text style={[styles.scoreLabel, { color: Colors.primary }]}>Tuyệt</Text>
        </View>

        {/* Vote Button */}
        <TouchableOpacity
          style={[styles.voteButton, selectedScore === 0 && styles.voteButtonDisabled]}
          onPress={handleVote}
          disabled={selectedScore === 0 || voted}
        >
          <Text style={styles.voteButtonText}>
            {voted ? '✓ Đã Vote' : 'Gửi Vote'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rating Description */}
      <View style={styles.descriptionSection}>
        <Text style={[styles.descriptionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Thang điểm đánh giá
        </Text>
        <View style={styles.ratingGrid}>
          <RatingItem score={1} label="Dở" color={Colors.status.error} />
          <RatingItem score={2} label="Tạm được" color={Colors.status.warning} />
          <RatingItem score={3} label="OK" color="#0ea5e9" />
          <RatingItem score={4} label="Hay" color={Colors.status.success} />
          <RatingItem score={5} label="Tuyệt vời" color={Colors.primary} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const RatingItem = ({ score, label, color }: { score: number; label: string; color: string }) => (
  <View style={styles.ratingItem}>
    <View style={[styles.ratingBadge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.ratingScore, { color }]}>{score}</Text>
    </View>
    <Text style={styles.ratingLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: FontSize.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  mangaInfo: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: BorderRadius.md,
  },
  mangaDetails: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  mangaTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  mangaAuthor: {
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  genreText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  voteSection: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  voteTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    fontSize: STAR_SIZE,
    color: Colors.dark.border,
  },
  starFilled: {
    color: '#fbbf24',
  },
  starHalf: {
    color: '#fbbf24',
  },
  scoreText: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  scoreLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  voteButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    minWidth: 180,
    alignItems: 'center',
  },
  voteButtonDisabled: {
    backgroundColor: Colors.dark.border,
  },
  voteButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  descriptionSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  descriptionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  ratingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingItem: {
    alignItems: 'center',
  },
  ratingBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingScore: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  ratingLabel: {
    fontSize: FontSize.xs,
    color: Colors.dark.textMuted,
  },
});
