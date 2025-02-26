import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
  Book,
  Code,
  FileText,
  Clock,
  Tag,
  Bookmark,
  Pencil,
  Star,
} from 'lucide-react';

export const labels = [
  {
    value: 'documentation',
    label: '기술 문서',
    icon: FileText,
  },
  {
    value: 'tutorial',
    label: '튜토리얼',
    icon: Book,
  },
  {
    value: 'review',
    label: '리뷰',
    icon: Code,
  },
];

export const statuses = [
  {
    value: 'backlog',
    label: '연재 예정',
    icon: HelpCircle,
  },
  {
    value: 'todo',
    label: '작성 예정',
    icon: Circle,
  },
  {
    value: 'in progress',
    label: '작성 중',
    icon: Timer,
  },
  {
    value: 'done',
    label: '발행됨',
    icon: CheckCircle,
  },
  {
    value: 'canceled',
    label: '비공개',
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: '낮음',
    value: 'low',
    icon: ArrowDown,
  },
  {
    label: '중간',
    value: 'medium',
    icon: ArrowRight,
  },
  {
    label: '높음',
    value: 'high',
    icon: ArrowUp,
  },
];

// 블로그 카테고리
export const categories = [
  {
    value: 'tech',
    label: '기술',
    icon: Code,
  },
  {
    value: 'life',
    label: '일상',
    icon: Pencil,
  },
  {
    value: 'review',
    label: '리뷰',
    icon: Star,
  },
];

// 이 데이터는 실제 post에서 동적으로 가져와야 하지만 예시로 몇 가지 태그를 정의
export const postTags = [
  {
    value: '프로그래밍',
    label: '프로그래밍',
    icon: Tag,
  },
  {
    value: '블로그',
    label: '블로그',
    icon: Tag,
  },
  {
    value: '개발',
    label: '개발',
    icon: Tag,
  },
  {
    value: '책리뷰',
    label: '책리뷰',
    icon: Book,
  },
  {
    value: '일상',
    label: '일상',
    icon: Tag,
  },
];

// 이 데이터는 실제 post에서 동적으로 가져와야 하지만 예시로 몇 가지 시리즈를 정의
export const postSeries = [
  {
    value: '개발자를 위한 가이드',
    label: '개발자를 위한 가이드',
    icon: Bookmark,
  },
  {
    value: '좋은 책 리뷰',
    label: '좋은 책 리뷰',
    icon: Book,
  },
];

// 읽기 시간 범위
export const readingTimes = [
  {
    value: 'short',
    label: '5분 이하',
    icon: Clock,
  },
  {
    value: 'medium',
    label: '5-10분',
    icon: Clock,
  },
  {
    value: 'long',
    label: '10분 이상',
    icon: Clock,
  },
];
