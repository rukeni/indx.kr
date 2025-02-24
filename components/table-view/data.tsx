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
