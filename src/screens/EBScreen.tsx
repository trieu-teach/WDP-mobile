import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  useColorScheme,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ebApi } from '../api/ebApi';
import {
  EBSeries,
  EB_COUNCIL_MEMBERS,
  COMMON_CRITERIA,
  TYPE_CRITERIA,
  getClassification,
} from '../types/eb';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

const SCORE_MAX = 5;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ScoreInput = ({
  label,
  hint,
  value,
  onChange,
  error,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const numValue = parseFloat(value) || 0;

  return (
    <View style={styles.scoreInputContainer}>
      <View style={styles.scoreInputHeader}>
        <Text style={[styles.scoreLabel, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          {label}
        </Text>
        <Text style={[styles.scoreHint, { color: isDark ? Colors.dark.textMuted : Colors.light.textMuted }]}>
          {hint}
        </Text>
      </View>
      <View style={styles.scoreInputRow}>
        <TextInput
          style={[styles.scoreInput, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface, color: isDark ? Colors.dark.text : Colors.light.text }]}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={Colors.dark.textMuted}
        />
        <View style={styles.scoreStars}>
          {Array.from({ length: SCORE_MAX }, (_, i) => {
            const filled = numValue >= i + 1;
            const halfFilled = !filled && numValue >= i + 0.5;
            return (
              <Text key={i} style={[styles.starMini, filled && styles.starMiniFilled, halfFilled && styles.starMiniHalf]}>
                ★
              </Text>
            );
          })}
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const SeriesReviewModal = ({
  series,
  visible,
  onClose,
  onApprove,
  onSaveScore,
}: {
  series: EBSeries | null;
  visible: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onSaveScore: (id: string, scores: Record<string, number>, notes: Record<string, string>) => void;
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const [scoreType, setScoreType] = useState<'color' | 'mono'>('color');
  const [activeMember, setActiveMember] = useState(EB_COUNCIL_MEMBERS[0]);
  const [scores, setScores] = useState<Record<string, string>>({
    plotDialogue: '0',
    artDesign: '0',
    panelingCamera: '0',
    pacingHook: '0',
    coloring: '0',
    toneShading: '0',
  });
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (series) {
      setScores({
        plotDialogue: '0',
        artDesign: '0',
        panelingCamera: '0',
        pacingHook: '0',
        coloring: '0',
        toneShading: '0',
      });
      setNotes({});
    }
  }, [series]);

  if (!series) return null;

  const typeField = TYPE_CRITERIA[scoreType];
  const scoreFields = [...COMMON_CRITERIA, typeField];

  const calculateAverage = () => {
    let total = 0;
    let count = 0;
    scoreFields.forEach((field) => {
      const val = parseFloat(scores[field.key]) || 0;
      if (val > 0) {
        total += val;
        count++;
      }
    });
    return count > 0 ? total / count : 0;
  };

  const handleSaveScore = () => {
    onSaveScore(series.id, 
      Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, parseFloat(v) || 0])),
      notes
    );
    onClose();
  };

  const average = calculateAverage();
  const classification = getClassification(average);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            Đánh giá Series
          </Text>
          <TouchableOpacity onPress={handleSaveScore}>
            <Text style={styles.saveBtn}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Series Preview */}
          <View style={styles.seriesPreview}>
            <Image
              source={{ uri: series.previewPageUrl }}
              style={styles.previewImage}
              contentFit="contain"
            />
            <View style={styles.previewInfo}>
              <Text style={[styles.seriesTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                {series.title}
              </Text>
              <Text style={[styles.seriesMeta, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {series.authorName} · Ch. {series.chapterNum}
              </Text>
              <View style={styles.formatBadge}>
                <Text style={styles.formatText}>{series.formatLabel}</Text>
              </View>
            </View>
          </View>

          {/* Type Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Loại truyện
            </Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, scoreType === 'color' && styles.typeBtnActive]}
                onPress={() => setScoreType('color')}
              >
                <Text style={[styles.typeBtnText, scoreType === 'color' && styles.typeBtnTextActive]}>
                  Truyện màu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, scoreType === 'mono' && styles.typeBtnActive]}
                onPress={() => setScoreType('mono')}
              >
                <Text style={[styles.typeBtnText, scoreType === 'mono' && styles.typeBtnTextActive]}>
                  Truyện không màu
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Member Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Thành viên Hội đồng
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.memberList}>
                {EB_COUNCIL_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={[styles.memberChip, activeMember.id === member.id && styles.memberChipActive]}
                    onPress={() => setActiveMember(member)}
                  >
                    <Text style={[styles.memberName, activeMember.id === member.id && styles.memberNameActive]}>
                      {member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Score Inputs */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Điểm các tiêu chí
            </Text>
            {scoreFields.map((field) => (
              <ScoreInput
                key={field.key}
                label={field.label}
                hint={field.hint}
                value={scores[field.key]}
                onChange={(v) => setScores((prev) => ({ ...prev, [field.key]: v }))}
              />
            ))}
          </View>

          {/* Average */}
          <View style={[styles.averageCard, { backgroundColor: classification.bgColor }]}>
            <Text style={styles.averageLabel}>Điểm trung bình</Text>
            <Text style={[styles.averageValue, { color: classification.color }]}>
              {average.toFixed(1)}
            </Text>
            <View style={[styles.classificationBadge, { backgroundColor: classification.color + '20' }]}>
              <Text style={[styles.classificationText, { color: classification.color }]}>
                {classification.label}
              </Text>
            </View>
            <Text style={[styles.classificationNote, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              {classification.note}
            </Text>
          </View>

          {/* Approve Button */}
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => {
              onApprove(series.id);
              onClose();
            }}
          >
            <Text style={styles.approveBtnText}>✓ Chấp nhận Series</Text>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export const EBScreen: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const [pending, setPending] = useState<EBSeries[]>([]);
  const [approved, setApproved] = useState<EBSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [selectedSeries, setSelectedSeries] = useState<EBSeries | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadData = async () => {
    try {
      const [pendingData, approvedData] = await Promise.all([
        ebApi.getPendingSeries(),
        ebApi.getApprovedSeries(),
      ]);
      setPending(pendingData);
      setApproved(approvedData);
    } catch (error) {
      console.error('Error loading EB data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (seriesId: string) => {
    await ebApi.approveSeries(seriesId);
    Alert.alert('Thành công', 'Đã chấp nhận series!');
    loadData();
  };

  const handleSaveScore = (seriesId: string, scores: Record<string, number>, notes: Record<string, string>) => {
    console.log('Saving scores:', scores, notes);
    Alert.alert('Đã lưu', 'Điểm đã được lưu thành công!');
  };

  const renderPendingItem = ({ item }: { item: EBSeries }) => (
    <TouchableOpacity
      style={[styles.seriesCard, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}
      onPress={() => {
        setSelectedSeries(item);
        setModalVisible(true);
      }}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.seriesCover} contentFit="cover" />
      <View style={styles.seriesInfo}>
        <Text style={[styles.seriesTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.seriesMeta, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
          {item.authorName}
        </Text>
        <View style={styles.seriesTags}>
          {item.genres.slice(0, 2).map((g, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: Colors.primary + '20' }]}>
              <Text style={[styles.tagText, { color: Colors.primary }]}>{g}</Text>
            </View>
          ))}
        </View>
        <View style={styles.seriesFooter}>
          <View style={[styles.formatBadge, { backgroundColor: Colors.secondary + '20' }]}>
            <Text style={[styles.formatText, { color: Colors.secondary }]}>{item.formatLabel}</Text>
          </View>
          <Text style={[styles.chapterText, { color: isDark ? Colors.dark.textMuted : Colors.light.textMuted }]}>
            Ch. {item.chapterNum}
          </Text>
        </View>
      </View>
      <View style={styles.reviewBtn}>
        <Text style={styles.reviewBtnText}>Review</Text>
      </View>
    </TouchableOpacity>
  );

  const renderApprovedItem = ({ item }: { item: EBSeries }) => (
    <View style={[styles.approvedCard, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
      <Image source={{ uri: item.coverUrl }} style={styles.approvedCover} contentFit="cover" />
      <View style={styles.approvedInfo}>
        <Text style={[styles.seriesTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.seriesMeta, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
          {item.authorName}
        </Text>
      </View>
      <View style={[styles.approvedBadge, { backgroundColor: Colors.status.success + '20' }]}>
        <Text style={[styles.approvedBadgeText, { color: Colors.status.success }]}>✓ Đã duyệt</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Editor Board
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
          Hội đồng biên tập
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            ⏳ Chờ duyệt ({pending.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
            ✓ Đã duyệt ({approved.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'pending' ? (
        pending.length > 0 ? (
          <FlatList
            data={pending}
            keyExtractor={(item) => item.id}
            renderItem={renderPendingItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Không có series chờ duyệt
            </Text>
          </View>
        )
      ) : (
        approved.length > 0 ? (
          <FlatList
            data={approved}
            keyExtractor={(item) => item.id}
            renderItem={renderApprovedItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={[styles.emptyText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Chưa có series nào được duyệt
            </Text>
          </View>
        )
      )}

      {/* Review Modal */}
      <SeriesReviewModal
        series={selectedSeries}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApprove={handleApprove}
        onSaveScore={handleSaveScore}
      />
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
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 4,
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
  seriesCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  seriesCover: {
    width: 80,
    height: 120,
    borderRadius: BorderRadius.md,
  },
  seriesInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  seriesTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  seriesMeta: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  seriesTags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  seriesFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  formatText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  chapterText: {
    fontSize: FontSize.xs,
  },
  reviewBtn: {
    justifyContent: 'center',
    paddingLeft: Spacing.md,
  },
  reviewBtnText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  approvedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  approvedCover: {
    width: 50,
    height: 70,
    borderRadius: BorderRadius.sm,
  },
  approvedInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  approvedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  approvedBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  closeBtn: {
    fontSize: 24,
    color: Colors.dark.textMuted,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  saveBtn: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  seriesPreview: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  previewImage: {
    width: 120,
    height: 180,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.card,
  },
  previewInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.card,
  },
  typeBtnActive: {
    backgroundColor: Colors.primary,
  },
  typeBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  memberList: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  memberChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.card,
  },
  memberChipActive: {
    backgroundColor: Colors.primary,
  },
  memberName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  memberNameActive: {
    color: '#fff',
  },
  scoreInputContainer: {
    marginBottom: Spacing.md,
  },
  scoreInputHeader: {
    marginBottom: Spacing.xs,
  },
  scoreLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  scoreHint: {
    fontSize: FontSize.xs,
  },
  scoreInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scoreInput: {
    width: 80,
    height: 44,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreStars: {
    flexDirection: 'row',
    gap: 2,
  },
  starMini: {
    fontSize: 18,
    color: Colors.dark.border,
  },
  starMiniFilled: {
    color: '#fbbf24',
  },
  starMiniHalf: {
    color: '#fbbf24',
  },
  errorText: {
    color: Colors.status.error,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  averageCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  averageLabel: {
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
  },
  averageValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  classificationBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  classificationText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  classificationNote: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  approveBtn: {
    backgroundColor: Colors.status.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  approveBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
