export interface EBSeries {
  id: string;
  title: string;
  authorName: string;
  genres: string[];
  formatLabel: string;
  coverUrl: string;
  previewPageUrl: string;
  chapterNum: number;
  pageLabel: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  ebAssessment?: EBAssessment;
}

export interface EBAssessment {
  seriesTitle: string;
  chapterNum: number | null;
  scoreType: 'color' | 'mono';
  councilAverage: number;
  memberAverage: number;
  activeMemberName: string | null;
  classification: 'KHONG_DAT' | 'DAT' | 'TOT' | 'XUAT_SAC';
  classificationNote: string;
  criteria: EBCriterion[];
  councilScoredCount: number;
  councilMemberCount: number;
  assessedAt: string;
  enteredBy: string;
}

export interface EBCriterion {
  key: string;
  label: string;
  hint: string;
  score: number;
  note: string;
}

export interface EBCouncilMember {
  id: string;
  name: string;
  title: string;
}

export interface Vote {
  id: string;
  mangaId: string;
  userId: string;
  score: number;
  createdAt: Date;
}

export const COMMON_CRITERIA = [
  { key: 'plotDialogue', label: 'Cốt truyện & Lời thoại', hint: 'Plot & Dialogue' },
  { key: 'artDesign', label: 'Nét vẽ & Tạo hình nhân vật', hint: 'Art Style & Character Design' },
  { key: 'panelingCamera', label: 'Phân khung & Góc máy', hint: 'Paneling & Camera Angles' },
  { key: 'pacingHook', label: 'Nhịp độ & Cao trào', hint: 'Pacing & Hook' },
];

export const TYPE_CRITERIA = {
  color: { key: 'coloring', label: 'Đổ màu & Phối màu', hint: 'Coloring' },
  mono: { key: 'toneShading', label: 'Sử dụng Tone/Đánh bóng', hint: 'Screentone & Shading' },
};

export const EB_COUNCIL_MEMBERS: EBCouncilMember[] = [
  { id: 'member1', name: 'Hội viên A', title: 'Chuyên gia Nội dung' },
  { id: 'member2', name: 'Hội viên B', title: 'Chuyên gia Hình ảnh' },
  { id: 'member3', name: 'Hội viên C', title: 'Chuyên gia Bố cục' },
  { id: 'member4', name: 'Hội viên D', title: 'Chuyên gia Nhịp độ' },
  { id: 'member5', name: 'Hội viên E', title: 'Chuyên gia Màu sắc' },
];

export const getClassification = (average: number) => {
  if (average < 2.5) {
    return {
      label: 'KHÔNG ĐẠT',
      note: 'Series chưa đạt chất lượng, cần chỉnh sửa lớn trước khi xét lại.',
      color: '#ef4444',
      bgColor: 'rgba(239,68,68,0.1)',
    };
  }
  if (average < 3.5) {
    return {
      label: 'ĐẠT',
      note: 'Series có thể thông qua, nhưng cần cải thiện theo ghi chú.',
      color: '#f59e0b',
      bgColor: 'rgba(245,158,11,0.1)',
    };
  }
  if (average < 4.25) {
    return {
      label: 'TỐT',
      note: 'Chất lượng series ổn định, phù hợp duyệt nhanh.',
      color: '#0ea5e9',
      bgColor: 'rgba(14,165,233,0.1)',
    };
  }
  return {
    label: 'XUẤT SẮC',
    note: 'Series chất lượng cao, phù hợp đẩy nổi bật/banner.',
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.1)',
  };
};

export type RootStackParamList = {
  MainTabs: undefined;
  MangaDetail: { mangaId: string };
  ChapterReader: { mangaId: string; chapterId: string };
  Vote: { mangaId: string };
  EB: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  Library: undefined;
  EB: undefined;
};
