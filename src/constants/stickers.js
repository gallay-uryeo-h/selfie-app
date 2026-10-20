// 5대 카테고리 스티커 정의 및 SVG 누끼 에셋
export const STICKER_CATEGORIES = [
  { id: 'deco', label: '포토 소품/데코 🎀' },
  { id: 'subject', label: '선택과목 📚' },
  { id: 'eval', label: '평가/목표 🎯' },
  { id: 'career', label: '세특/진로 🔬' },
  { id: 'wit', label: '말풍선/위트 💬' },
];

// 누끼 다이컷(Die-Cut) 타이포 배지 생성 헬퍼
function createDieCutBadge({ text, emoji = '', gradientStart, gradientEnd, textColor = '#ffffff', width = 120, height = 40 }) {
  const encText = encodeURIComponent(text);
  const encEmoji = emoji ? `${emoji} ` : '';
  const gStart = encodeURIComponent(gradientStart);
  const gEnd = encodeURIComponent(gradientEnd);

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <filter id="nukkiShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="%23000000" flood-opacity="0.28"/>
      </filter>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${gStart}"/>
        <stop offset="100%" stop-color="${gEnd}"/>
      </linearGradient>
    </defs>
    <!-- 화이트 누끼 다이컷 외곽선 레이어 -->
    <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="${(height - 6) / 2}" fill="url(%23grad)" stroke="%23ffffff" stroke-width="3" filter="url(%23nukkiShadow)"/>
    <text x="${width / 2}" y="${height / 2 + 1}" fill="${encodeURIComponent(textColor)}" font-family="'Pretendard', sans-serif" font-weight="900" font-size="${height > 44 ? 14 : 12.5}" text-anchor="middle" dominant-baseline="central">
      ${encEmoji}${encText}
    </text>
  </svg>`;
}

// 누끼 말풍선 생성 헬퍼
function createDieCutBubble({ text, bgStart = '#fef08a', bgEnd = '#fde047', textColor = '#713f12', width = 135, height = 48 }) {
  const encText = encodeURIComponent(text);
  const bStart = encodeURIComponent(bgStart);
  const bEnd = encodeURIComponent(bgEnd);

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <filter id="bubbleShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
      </filter>
      <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bStart}"/>
        <stop offset="100%" stop-color="${bEnd}"/>
      </linearGradient>
    </defs>
    <path d="M 12 4 H ${width - 12} A 10 10 0 0 1 ${width - 2} 14 V ${height - 18} A 10 10 0 0 1 ${width - 12} ${height - 8} H 36 L 24 ${height - 2} L 27 ${height - 8} H 12 A 10 10 0 0 1 2 ${height - 18} V 14 A 10 10 0 0 1 12 4 Z" fill="url(%23bubbleGrad)" stroke="%23ffffff" stroke-width="2.5" filter="url(%23bubbleShadow)"/>
    <text x="${width / 2}" y="${(height - 8) / 2}" fill="${encodeURIComponent(textColor)}" font-family="'Pretendard', sans-serif" font-weight="800" font-size="12" text-anchor="middle" dominant-baseline="central">
      ${encText}
    </text>
  </svg>`;
}

export const STICKER_DATA = [
  // ──────────────────────────────────────────────────────────
  // 1. 포토 소품/데코 (투명 누끼 스티커 - 얼굴/머리에 자연스럽게 붙이기)
  // ──────────────────────────────────────────────────────────
  {
    id: 'deco_cat_ears',
    category: 'deco',
    name: '고양이 귀 머리띠',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 머리띠 아치 -->
        <path d="M 15 52 Q 60 22 105 52" fill="none" stroke="%231e293b" stroke-width="4" stroke-linecap="round"/>
        <!-- 왼쪽 귀 -->
        <polygon points="20,44 10,8 48,26" fill="%23ec4899" stroke="%23ffffff" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="22,38 16,14 42,26" fill="%23fbcfe8"/>
        <!-- 오른쪽 귀 -->
        <polygon points="100,44 110,8 72,26" fill="%23ec4899" stroke="%23ffffff" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="98,38 104,14 78,26" fill="%23fbcfe8"/>
      </g>
    </svg>`,
    defaultWidth: 95,
  },
  {
    id: 'deco_bunny_ears',
    category: 'deco',
    name: '토끼 귀 머리띠',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 머리띠 아치 -->
        <path d="M 15 72 Q 50 48 85 72" fill="none" stroke="%23cbd5e1" stroke-width="3.5" stroke-linecap="round"/>
        <!-- 왼쪽 귀 -->
        <path d="M 32 60 C 15 45 10 10 30 6 C 45 10 40 45 35 60 Z" fill="%23ffffff" stroke="%23f472b6" stroke-width="2.5"/>
        <path d="M 31 52 C 22 40 18 16 30 14 C 38 16 35 40 33 52 Z" fill="%23fbcfe8"/>
        <!-- 오른쪽 귀 -->
        <path d="M 68 60 C 60 45 55 10 70 6 C 90 10 85 45 68 60 Z" fill="%23ffffff" stroke="%23f472b6" stroke-width="2.5"/>
        <path d="M 67 52 C 65 40 62 16 70 14 C 82 16 78 40 67 52 Z" fill="%23fbcfe8"/>
      </g>
    </svg>`,
    defaultWidth: 80,
  },
  {
    id: 'deco_crown',
    category: 'deco',
    name: '골드 반짝이 왕관',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="60" viewBox="0 0 90 60">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23fbbf24"/>
          <stop offset="100%" stop-color="%23f59e0b"/>
        </linearGradient>
      </defs>
      <g filter="url(%23nukki)">
        <polygon points="8,48 18,18 36,36 45,10 54,36 72,18 82,48" fill="url(%23crownGrad)" stroke="%23ffffff" stroke-width="3" stroke-linejoin="round"/>
        <!-- 보석 -->
        <circle cx="18" cy="18" r="4" fill="%23ef4444" stroke="%23ffffff" stroke-width="1.5"/>
        <circle cx="45" cy="10" r="5" fill="%233b82f6" stroke="%23ffffff" stroke-width="1.5"/>
        <circle cx="72" cy="18" r="4" fill="%2310b981" stroke="%23ffffff" stroke-width="1.5"/>
        <!-- 베이스 밴드 -->
        <rect x="8" y="44" width="74" height="8" rx="4" fill="%23d97706" stroke="%23ffffff" stroke-width="1.5"/>
      </g>
    </svg>`,
    defaultWidth: 80,
  },
  {
    id: 'deco_party_hat',
    category: 'deco',
    name: '파티 고깔모자',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="90" viewBox="0 0 70 90">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
        <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23ec4899"/>
          <stop offset="50%" stop-color="%238b5cf6"/>
          <stop offset="100%" stop-color="%233b82f6"/>
        </linearGradient>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 고깔 콘 -->
        <polygon points="35,16 8,80 62,80" fill="url(%23hatGrad)" stroke="%23ffffff" stroke-width="3" stroke-linejoin="round"/>
        <!-- 폼폼 방울 -->
        <circle cx="35" cy="12" r="8" fill="%23fbbf24" stroke="%23ffffff" stroke-width="2"/>
        <!-- 줄무늬 패턴 -->
        <line x1="16" y1="62" x2="54" y2="62" stroke="%23ffffff" stroke-width="3" stroke-dasharray="4,4"/>
        <line x1="24" y1="44" x2="46" y2="44" stroke="%23ffffff" stroke-width="2.5" stroke-dasharray="3,3"/>
      </g>
    </svg>`,
    defaultWidth: 65,
  },
  {
    id: 'deco_smart_glasses',
    category: 'deco',
    name: '긱시크 스마트 안경',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="50" viewBox="0 0 130 50">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="%23000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 안경테 누끼 (안쪽 투명) -->
        <rect x="16" y="8" width="40" height="34" rx="8" fill="none" stroke="%23ffffff" stroke-width="6"/>
        <rect x="16" y="8" width="40" height="34" rx="8" fill="none" stroke="%231e293b" stroke-width="3.5"/>
        
        <rect x="74" y="8" width="40" height="34" rx="8" fill="none" stroke="%23ffffff" stroke-width="6"/>
        <rect x="74" y="8" width="40" height="34" rx="8" fill="none" stroke="%231e293b" stroke-width="3.5"/>

        <!-- 브릿지 & 다리 -->
        <path d="M 56 22 Q 65 18 74 22" fill="none" stroke="%23ffffff" stroke-width="6" stroke-linecap="round"/>
        <path d="M 56 22 Q 65 18 74 22" fill="none" stroke="%231e293b" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="16" y1="18" x2="4" y2="15" stroke="%231e293b" stroke-width="3" stroke-linecap="round"/>
        <line x1="114" y1="18" x2="126" y2="15" stroke="%231e293b" stroke-width="3" stroke-linecap="round"/>
        <!-- 렌즈 빛 반사 -->
        <line x1="24" y1="14" x2="32" y2="22" stroke="%2338bdf8" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <line x1="82" y1="14" x2="90" y2="22" stroke="%2338bdf8" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      </g>
    </svg>`,
    defaultWidth: 95,
  },
  {
    id: 'deco_heart_glasses',
    category: 'deco',
    name: '레드 하트 선글라스',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="55" viewBox="0 0 130 55">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 왼쪽 하트 림 -->
        <path d="M 38 16 C 30 4, 12 6, 12 24 C 12 36, 30 46, 38 50 C 46 46, 64 36, 64 24 C 64 6, 46 4, 38 16 Z" fill="%23e11d48" stroke="%23ffffff" stroke-width="3" opacity="0.88"/>
        <!-- 오른쪽 하트 림 -->
        <path d="M 92 16 C 84 4, 66 6, 66 24 C 66 36, 84 46, 92 50 C 100 46, 118 36, 118 24 C 118 6, 100 4, 92 16 Z" fill="%23e11d48" stroke="%23ffffff" stroke-width="3" opacity="0.88"/>
        <!-- 브릿지 -->
        <path d="M 60 24 Q 65 20 70 24" fill="none" stroke="%23ffffff" stroke-width="3.5" stroke-linecap="round"/>
        <!-- 하이라이트 -->
        <circle cx="28" cy="20" r="3" fill="%23ffffff" opacity="0.9"/>
        <circle cx="82" cy="20" r="3" fill="%23ffffff" opacity="0.9"/>
      </g>
    </svg>`,
    defaultWidth: 95,
  },
  {
    id: 'deco_blush',
    category: 'deco',
    name: '핑크 볼터치 (양볼)',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="35" viewBox="0 0 130 35">
      <defs>
        <filter id="blurL">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
      </defs>
      <!-- 왼쪽 볼터치 -->
      <g>
        <ellipse cx="25" cy="18" rx="18" ry="11" fill="%23fb7185" opacity="0.75" filter="url(%23blurL)"/>
        <line x1="16" y1="18" x2="21" y2="18" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <line x1="26" y1="16" x2="33" y2="16" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      </g>
      <!-- 오른쪽 볼터치 -->
      <g>
        <ellipse cx="105" cy="18" rx="18" ry="11" fill="%23fb7185" opacity="0.75" filter="url(%23blurL)"/>
        <line x1="97" y1="18" x2="102" y2="18" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <line x1="107" y1="16" x2="114" y2="16" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      </g>
    </svg>`,
    defaultWidth: 85,
  },
  {
    id: 'deco_sparkles',
    category: 'deco',
    name: '반짝이 별빛',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 메인 큰 별 -->
        <path d="M 35 4 Q 35 35 4 35 Q 35 35 35 66 Q 35 35 66 35 Q 35 35 35 4 Z" fill="%23fbbf24" stroke="%23ffffff" stroke-width="2"/>
        <circle cx="35" cy="35" r="4" fill="%23ffffff"/>
        <!-- 서브 작은 별 -->
        <path d="M 56 12 Q 56 22 46 22 Q 56 22 56 32 Q 56 22 66 22 Q 56 22 56 12 Z" fill="%23fde047" stroke="%23ffffff" stroke-width="1.5"/>
        <circle cx="15" cy="55" r="3.5" fill="%23fbbf24" stroke="%23ffffff" stroke-width="1"/>
      </g>
    </svg>`,
    defaultWidth: 60,
  },
  {
    id: 'deco_ribbon',
    category: 'deco',
    name: '러블리 핑크 리본',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60" viewBox="0 0 80 60">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 리본 꼬리 -->
        <path d="M 35 35 L 20 54 L 30 46 L 40 54 Z" fill="%23f43f5e" stroke="%23ffffff" stroke-width="2"/>
        <path d="M 45 35 L 60 54 L 50 46 L 40 54 Z" fill="%23e11d48" stroke="%23ffffff" stroke-width="2"/>
        <!-- 왼쪽 날개 -->
        <path d="M 40 25 C 20 10 10 20 15 32 C 20 40 35 32 40 28 Z" fill="%23f43f5e" stroke="%23ffffff" stroke-width="2.5"/>
        <!-- 오른쪽 날개 -->
        <path d="M 40 25 C 60 10 70 20 65 32 C 60 40 45 32 40 28 Z" fill="%23f43f5e" stroke="%23ffffff" stroke-width="2.5"/>
        <!-- 중앙 매듭 -->
        <ellipse cx="40" cy="27" rx="7" ry="6" fill="%23ffe4e6" stroke="%23e11d48" stroke-width="2"/>
      </g>
    </svg>`,
    defaultWidth: 65,
  },
  {
    id: 'deco_stamp_best',
    category: 'deco',
    name: '참 잘했어요 100점 도장',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <!-- 둥근 스탬프 테두리 누끼 -->
        <circle cx="45" cy="45" r="41" fill="%23dc2626" stroke="%23ffffff" stroke-width="3"/>
        <circle cx="45" cy="45" r="36" fill="none" stroke="%23ffffff" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="45" y="38" fill="%23ffffff" font-family="'Pretendard', sans-serif" font-weight="900" font-size="14" text-anchor="middle" dominant-baseline="central">참잘했어요</text>
        <text x="45" y="58" fill="%23fef08a" font-family="'Pretendard', sans-serif" font-weight="900" font-size="11" text-anchor="middle" dominant-baseline="central">100점 💯</text>
      </g>
    </svg>`,
    defaultWidth: 70,
  },

  // ──────────────────────────────────────────────────────────
  // 2. 선택과목 누끼 타이포 스티커
  // ──────────────────────────────────────────────────────────
  {
    id: 'sub_common_eng1',
    category: 'subject',
    name: '#공통영어1',
    src: createDieCutBadge({
      text: '#공통영어1',
      emoji: '📘',
      gradientStart: '#2563eb',
      gradientEnd: '#38bdf8',
      width: 115,
      height: 36,
    }),
    defaultWidth: 95,
  },
  {
    id: 'sub_common_eng2',
    category: 'subject',
    name: '#공통영어2',
    src: createDieCutBadge({
      text: '#공통영어2',
      emoji: '📗',
      gradientStart: '#4f46e5',
      gradientEnd: '#818cf8',
      width: 115,
      height: 36,
    }),
    defaultWidth: 95,
  },
  {
    id: 'sub_eng_1',
    category: 'subject',
    name: '#영어I (일반선택)',
    src: createDieCutBadge({
      text: '#영어I 일반선택',
      emoji: '🌿',
      gradientStart: '#059669',
      gradientEnd: '#34d399',
      width: 125,
      height: 36,
    }),
    defaultWidth: 100,
  },
  {
    id: 'sub_eng_read_write',
    category: 'subject',
    name: '#영어독해와작문',
    src: createDieCutBadge({
      text: '#영어독해와작문',
      emoji: '✍️',
      gradientStart: '#d97706',
      gradientEnd: '#fbbf24',
      width: 125,
      height: 36,
    }),
    defaultWidth: 100,
  },
  {
    id: 'sub_rev_2022',
    category: 'subject',
    name: '#2022개정완벽대비',
    src: createDieCutBadge({
      text: '#2022개정대비',
      emoji: '🎯',
      gradientStart: '#e11d48',
      gradientEnd: '#fb7185',
      width: 120,
      height: 36,
    }),
    defaultWidth: 95,
  },
  {
    id: 'sub_csat_rank1',
    category: 'subject',
    name: '#수능영어1등급',
    src: createDieCutBadge({
      text: '#수능영어1등급',
      emoji: '⚡',
      gradientStart: '#7c3aed',
      gradientEnd: '#c084fc',
      width: 120,
      height: 36,
    }),
    defaultWidth: 95,
  },

  // ──────────────────────────────────────────────────────────
  // 3. 평가/목표 누끼 스티커
  // ──────────────────────────────────────────────────────────
  {
    id: 'eval_rank1',
    category: 'eval',
    name: '5등급제 1등급 쟁취',
    src: createDieCutBadge({
      text: '★ 1등급 쟁취 ★',
      emoji: '🏆',
      gradientStart: '#dc2626',
      gradientEnd: '#f87171',
      width: 125,
      height: 38,
    }),
    defaultWidth: 100,
  },
  {
    id: 'eval_grade_a',
    category: 'eval',
    name: '성취도 A 마스터',
    src: createDieCutBadge({
      text: '성취도 [A] 확정!',
      emoji: '💯',
      gradientStart: '#0284c7',
      gradientEnd: '#38bdf8',
      width: 120,
      height: 38,
    }),
    defaultWidth: 95,
  },
  {
    id: 'eval_rel_survivor',
    category: 'eval',
    name: '상대평가 생존자',
    src: createDieCutBadge({
      text: '상대평가 생존자',
      emoji: '⚡',
      gradientStart: '#6d28d9',
      gradientEnd: '#a78bfa',
      width: 120,
      height: 38,
    }),
    defaultWidth: 95,
  },
  {
    id: 'eval_both_catch',
    category: 'eval',
    name: '내신+수능 ALL PASS',
    src: createDieCutBadge({
      text: '내신+수능 PASS',
      emoji: '🔥',
      gradientStart: '#ea580c',
      gradientEnd: '#fb923c',
      width: 120,
      height: 38,
    }),
    defaultWidth: 95,
  },
  {
    id: 'eval_perfect_shot',
    category: 'eval',
    name: 'PERFECT 100',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="45" viewBox="0 0 90 45">
      <defs>
        <filter id="nukki" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(%23nukki)">
        <polygon points="5,22 15,5 75,5 85,22 75,40 15,40" fill="%23f59e0b" stroke="%23ffffff" stroke-width="2.5" stroke-linejoin="round"/>
        <text x="45" y="24" fill="%23ffffff" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" text-anchor="middle" dominant-baseline="central">PERFECT</text>
      </g>
    </svg>`,
    defaultWidth: 80,
  },

  // ──────────────────────────────────────────────────────────
  // 4. 세특/진로 연계 누끼 스티커
  // ──────────────────────────────────────────────────────────
  {
    id: 'career_genius',
    category: 'career',
    name: '세특 천재(기록장인)',
    src: createDieCutBadge({
      text: '세특 천재',
      emoji: '👑',
      gradientStart: '#ea580c',
      gradientEnd: '#f97316',
      width: 105,
      height: 36,
    }),
    defaultWidth: 88,
  },
  {
    id: 'career_it_ai',
    category: 'career',
    name: 'IT·AI x English',
    src: createDieCutBadge({
      text: 'IT·AI x 영어',
      emoji: '💻',
      gradientStart: '#0891b2',
      gradientEnd: '#06b6d4',
      width: 115,
      height: 36,
    }),
    defaultWidth: 92,
  },
  {
    id: 'career_med',
    category: 'career',
    name: '의약·보건 x English',
    src: createDieCutBadge({
      text: '의약보건 x 영어',
      emoji: '🩺',
      gradientStart: '#059669',
      gradientEnd: '#10b981',
      width: 120,
      height: 36,
    }),
    defaultWidth: 95,
  },
  {
    id: 'career_humanities',
    category: 'career',
    name: '인문사회 x English',
    src: createDieCutBadge({
      text: '인문사회 x 영어',
      emoji: '⚖️',
      gradientStart: '#9333ea',
      gradientEnd: '#a855f7',
      width: 120,
      height: 36,
    }),
    defaultWidth: 95,
  },
  {
    id: 'career_report_pass',
    category: 'career',
    name: '탐구보고서 All Pass',
    src: createDieCutBadge({
      text: '탐구보고서 Pass',
      emoji: '📜',
      gradientStart: '#1e293b',
      gradientEnd: '#475569',
      width: 125,
      height: 36,
    }),
    defaultWidth: 98,
  },

  // ──────────────────────────────────────────────────────────
  // 5. 말풍선 & 위트 누끼 스티커
  // ──────────────────────────────────────────────────────────
  {
    id: 'wit_easy_eng',
    category: 'wit',
    name: '영어가 제일 쉬웠어요~',
    src: createDieCutBubble({
      text: '영어가 젤 쉬웠어요~',
      bgStart: '#fef08a',
      bgEnd: '#fde047',
      textColor: '#713f12',
      width: 130,
      height: 44,
    }),
    defaultWidth: 105,
  },
  {
    id: 'wit_vocab_king',
    category: 'wit',
    name: 'Vocab King 단어왕',
    src: createDieCutBadge({
      text: 'Vocab King 👑',
      emoji: '',
      gradientStart: '#ec4899',
      gradientEnd: '#f43f5e',
      width: 120,
      height: 36,
    }),
    defaultWidth: 95,
  },
  {
    id: 'wit_so_easy',
    category: 'wit',
    name: 'So Easy! 껌이지 🍬',
    src: createDieCutBubble({
      text: 'So Easy! 껌이지 🍬',
      bgStart: '#bae6fd',
      bgEnd: '#7dd3fc',
      textColor: '#0369a1',
      width: 125,
      height: 44,
    }),
    defaultWidth: 100,
  },
  {
    id: 'wit_keep_calm',
    category: 'wit',
    name: 'Keep Calm & Read',
    src: createDieCutBadge({
      text: 'Keep Calm & Read',
      emoji: '📖',
      gradientStart: '#0284c7',
      gradientEnd: '#38bdf8',
      width: 135,
      height: 36,
    }),
    defaultWidth: 105,
  },
  {
    id: 'wit_photo_star',
    category: 'wit',
    name: '인생샷 건짐 📸',
    src: createDieCutBadge({
      text: '인생샷 건짐 📸',
      emoji: '',
      gradientStart: '#8b5cf6',
      gradientEnd: '#d946ef',
      width: 115,
      height: 36,
    }),
    defaultWidth: 92,
  },
];
