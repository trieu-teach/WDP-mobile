import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Chapter } from '../types/manga';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/colors';

interface ChapterCardProps {
  chapter: Chapter;
  onPress: () => void;
  isRead?: boolean;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ 
  chapter, 
  onPress,
  isRead = false 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isRead && styles.readContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.numberContainer}>
        <Text style={[styles.number, isRead && styles.readText]}>
          {chapter.number}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, isRead && styles.readText]} numberOfLines={1}>
          {chapter.title}
        </Text>
        <Text style={styles.pages}>{chapter.pages.length} pages</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  readContainer: {
    opacity: 0.6,
    backgroundColor: Colors.dark.surface,
  },
  numberContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  readText: {
    color: Colors.dark.textMuted,
  },
  pages: {
    color: Colors.dark.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  arrow: {
    marginLeft: Spacing.sm,
  },
  arrowText: {
    color: Colors.dark.textMuted,
    fontSize: FontSize.xxl,
  },
});
