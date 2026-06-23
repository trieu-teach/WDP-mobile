import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Manga } from '../types/manga';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/colors';

interface MangaCardProps {
  manga: Manga;
  onPress: () => void;
  variant?: 'vertical' | 'horizontal';
}

export const MangaCard: React.FC<MangaCardProps> = ({ 
  manga, 
  onPress, 
  variant = 'vertical' 
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity 
        style={[styles.horizontalCard, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: manga.coverUrl }}
          style={styles.horizontalCover}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.horizontalContent}>
          <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]} numberOfLines={2}>
            {manga.title}
          </Text>
          <Text style={[styles.author, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            {manga.author}
          </Text>
          <View style={styles.genreContainer}>
            {manga.genres.slice(0, 2).map((genre, index) => (
              <View key={index} style={[styles.genreBadge, { backgroundColor: Colors.primary + '30' }]}>
                <Text style={[styles.genreText, { color: Colors.primary }]}>{genre}</Text>
              </View>
            ))}
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={[styles.rating, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              {manga.rating}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.verticalCard} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: manga.coverUrl }}
        style={styles.verticalCover}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <View style={[styles.statusBadge, { 
          backgroundColor: manga.status === 'ongoing' ? Colors.status.success : Colors.secondary 
        }]}>
          <Text style={styles.statusText}>
            {manga.status === 'ongoing' ? '更新中' : '完结'}
          </Text>
        </View>
      </View>
      <View style={styles.verticalInfo}>
        <Text style={styles.verticalTitle} numberOfLines={2}>{manga.title}</Text>
        <Text style={styles.verticalChapters}>{manga.chapters.length} Chapters</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verticalCard: {
    width: 150,
    marginRight: Spacing.md,
  },
  verticalCover: {
    width: 150,
    height: 220,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.card,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  verticalInfo: {
    marginTop: Spacing.sm,
  },
  verticalTitle: {
    color: Colors.dark.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  verticalChapters: {
    color: Colors.dark.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  horizontalCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  horizontalCover: {
    width: 100,
    height: 140,
    borderRadius: BorderRadius.md,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  author: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: 6,
  },
  genreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  genreText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ratingIcon: {
    fontSize: 14,
  },
  rating: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
});
