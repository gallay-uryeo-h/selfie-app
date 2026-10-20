// 프레임 테마 및 배경 색상 프리셋
export const FRAME_THEMES = [
  {
    id: 'theme_spectrum',
    name: '시그니처 스펙트럼 🌈',
    description: 'Find Your English Spectrum 오리지널 레인보우 그라디언트 테마',
    headerText: 'Find Your English Spectrum!',
    footerText: '2022 개정 영어과 선택과목 & 세특 탐구 포토부스',
    borderColor: '#3b82f6',
    borderGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    textColor: '#ffffff',
    darkBg: true,
  },
  {
    id: 'theme_common_eng',
    name: '공통영어 아카데믹 🎓',
    description: '공통영어 1·2 기초역량 집중 아카데믹 블루 테마',
    headerText: 'COMMON ENGLISH 1 & 2',
    footerText: '수능과 내신의 흔들리지 않는 튼튼한 뿌리',
    borderColor: '#1e3a8a',
    borderGradient: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
    textColor: '#ffffff',
    darkBg: true,
  },
  {
    id: 'theme_reading_writing',
    name: '독해와 작문 에디션 ✍️',
    description: '심화 영어 독해 & 세특 탐구보고서 테마',
    headerText: 'READING & WRITING ESSENTIALS',
    footerText: '깊이 있는 비판적 사고와 지문 분석 마스터',
    borderColor: '#78350f',
    borderGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    textColor: '#ffffff',
    darkBg: false,
  },
  {
    id: 'theme_minimal_modern',
    name: '모던 스튜디오 🖤',
    description: '깔끔하고 감성적인 인스탁스 스타일 미니멀 테마',
    headerText: 'ENGLISH SPECTRUM PHOTO',
    footerText: 'MEMORIES & FUTURE DREAMS',
    borderColor: '#0f172a',
    borderGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    textColor: '#f8fafc',
    darkBg: true,
  },
];

export const FRAME_COLORS = [
  { id: 'white', name: '스노우 화이트', value: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
  { id: 'black', name: '미드나잇 블랙', value: '#0f172a', text: '#ffffff', border: '#334155' },
  { id: 'lavender', name: '파스텔 라벤더', value: '#f3e8ff', text: '#581c87', border: '#d8b4fe' },
  { id: 'mint', name: '세이지 민트', value: '#ecfdf5', text: '#064e3b', border: '#a7f3d0' },
  { id: 'cream', name: '소프트 웜베이지', value: '#fefce8', text: '#713f12', border: '#fef08a' },
];

export const FRAME_LAYOUTS = [
  { id: 'grid_2x2', name: '2x2 와이드 4컷', description: '태블릿 화면 및 엽서형 인화에 최적화된 2열 2행' },
  { id: 'strip_1x4', name: '1x4 클래식 스트립', description: '포토부스 감성의 세로 4컷 일렬 배치' },
];
