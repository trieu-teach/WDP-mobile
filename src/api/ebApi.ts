import { EBSeries } from '../types/eb';

const MOCK_EB_SERIES: EBSeries[] = [
  {
    id: 'eb1',
    title: 'Học Viện Bóng Tối',
    authorName: 'Nguyễn Văn A',
    genres: ['Hành động', 'Học đường'],
    formatLabel: 'Truyện màu',
    coverUrl: 'https://picsum.photos/seed/eb1/300/450',
    previewPageUrl: 'https://picsum.photos/seed/eb1page/400/600',
    chapterNum: 1,
    pageLabel: 'Trang 1',
    submittedAt: new Date('2026-06-15'),
    status: 'pending',
  },
  {
    id: 'eb2',
    title: 'Cô Bé Không Gian',
    authorName: 'Trần Thị B',
    genres: ['Phiêu lưu', 'Khoa học'],
    formatLabel: 'Truyện không màu',
    coverUrl: 'https://picsum.photos/seed/eb2/300/450',
    previewPageUrl: 'https://picsum.photos/seed/eb2page/400/600',
    chapterNum: 1,
    pageLabel: 'Trang 1',
    submittedAt: new Date('2026-06-14'),
    status: 'pending',
  },
  {
    id: 'eb3',
    title: 'Đấu Trường Thần Thoại',
    authorName: 'Lê Văn C',
    genres: ['Fantasy', 'Martial Arts'],
    formatLabel: 'Truyện màu',
    coverUrl: 'https://picsum.photos/seed/eb3/300/450',
    previewPageUrl: 'https://picsum.photos/seed/eb3page/400/600',
    chapterNum: 1,
    pageLabel: 'Trang 3',
    submittedAt: new Date('2026-06-13'),
    status: 'pending',
  },
];

const MOCK_VOTES = [
  { id: 'v1', mangaId: '1', score: 5, createdAt: new Date() },
  { id: 'v2', mangaId: '2', score: 4, createdAt: new Date() },
];

export const ebApi = {
  getPendingSeries: async (): Promise<EBSeries[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_EB_SERIES.filter(s => s.status === 'pending');
  },

  getApprovedSeries: async (): Promise<EBSeries[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_EB_SERIES.filter(s => s.status === 'approved');
  },

  approveSeries: async (seriesId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const series = MOCK_EB_SERIES.find(s => s.id === seriesId);
    if (series) {
      series.status = 'approved';
    }
  },

  rejectSeries: async (seriesId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const series = MOCK_EB_SERIES.find(s => s.id === seriesId);
    if (series) {
      series.status = 'rejected';
    }
  },

  getVotesForManga: async (mangaId: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const votes = MOCK_VOTES.filter(v => v.mangaId === mangaId);
    if (votes.length === 0) return 0;
    return votes.reduce((sum, v) => sum + v.score, 0) / votes.length;
  },

  submitVote: async (mangaId: string, score: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_VOTES.push({
      id: `v${Date.now()}`,
      mangaId,
      score,
      createdAt: new Date(),
    });
  },
};
