// 5대 카테고리 스티커 정의 및 SVG 에셋 렌더러
export const STICKER_CATEGORIES = [
  { id: 'subject', label: '선택과목 📚' },
  { id: 'eval', label: '평가/목표 🎯' },
  { id: 'career', label: '세특/진로 🔬' },
  { id: 'wit', label: '말풍선/위트 💬' },
  { id: 'deco', label: '비주얼/데코 ✨' },
];

// SVG 배지/스티커 생성 헬퍼
function createSvgBadge({ text, subText, bgGradient, textColor = '#ffffff', borderColor = '#ffffff', icon, shape = 'pill', emoji }) {
  let innerContent = '';
  const width = shape === 'stamp' ? 140 : shape === 'bubble' ? 190 : 180;
  const height = shape === 'stamp' ? 140 : shape === 'bubble' ? 70 : 54;

  if (shape === 'stamp') {
    // 둥근 참 잘했어요 스탬프 형태
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 140 140">
      <defs>
        <radialGradient id="stampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#b91c1c" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="62" fill="none" stroke="%23ef4444" stroke-width="4" stroke-dasharray="6,3"/>
      <circle cx="70" cy="70" r="54" fill="url(%23stampGlow)"/>
      <circle cx="70" cy="70" r="50" fill="none" stroke="%23ffffff" stroke-width="2"/>
      <text x="70" y="55" fill="%23ffffff" font-family="'Pretendard', sans-serif" font-weight="900" font-size="20" text-anchor="middle" dominant-baseline="central">${encodeURIComponent(text)}</text>
      <text x="70" y="85" fill="%23fef08a" font-family="'Pretendard', sans-serif" font-weight="800" font-size="14" text-anchor="middle">${encodeURIComponent(subText || '💯 PASS')}</text>
    </svg>`;
  }

  if (shape === 'bubble') {
    // 위트 말풍선 형태
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 190 70">
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="%23000000" flood-opacity="0.25"/>
        </filter>
        <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          ${bgGradient}
        </linearGradient>
      </defs>
      <path d="M 15 8 H 175 A 12 12 0 0 1 187 20 V 42 A 12 12 0 0 1 175 54 H 45 L 30 65 L 32 54 H 15 A 12 12 0 0 1 3 42 V 20 A 12 12 0 0 1 15 8 Z" fill="url(%23bubbleGrad)" stroke="${encodeURIComponent(borderColor)}" stroke-width="2.5" filter="url(%23shadow)"/>
      <text x="95" y="34" fill="${encodeURIComponent(textColor)}" font-family="'Pretendard', sans-serif" font-weight="800" font-size="15" text-anchor="middle" dominant-baseline="central">${encodeURIComponent(text)}</text>
    </svg>`;
  }

  // 기본 세련된 뱃지/필 형태
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 180 54">
    <defs>
      <filter id="shadow" x="-5%" y="-5%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="%23000000" flood-opacity="0.2"/>
      </filter>
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        ${bgGradient}
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="172" height="46" rx="23" fill="url(%23badgeGrad)" stroke="${encodeURIComponent(borderColor)}" stroke-width="2.5" filter="url(%23shadow)"/>
    <text x="90" y="29" fill="${encodeURIComponent(textColor)}" font-family="'Pretendard', sans-serif" font-weight="800" font-size="14.5" text-anchor="middle" dominant-baseline="central">
      ${emoji ? emoji + ' ' : ''}${encodeURIComponent(text)}
    </text>
  </svg>`;
}

export const STICKER_DATA = [
  // 1. 선택과목
  {
    id: 'sub_common_eng1',
    category: 'subject',
    name: '#공통영어1',
    src: createSvgBadge({
      text: '#공통영어1',
      bgGradient: '<stop offset="0%" stop-color="%232563eb"/><stop offset="100%" stop-color="%2338bdf8"/>',
      borderColor: '#93c5fd',
      emoji: '📘',
    }),
    defaultWidth: 150,
  },
  {
    id: 'sub_common_eng2',
    category: 'subject',
    name: '#공통영어2',
    src: createSvgBadge({
      text: '#공통영어2',
      bgGradient: '<stop offset="0%" stop-color="%234f46e5"/><stop offset="100%" stop-color="%23818cf8"/>',
      borderColor: '#c7d2fe',
      emoji: '📗',
    }),
    defaultWidth: 150,
  },
  {
    id: 'sub_eng_1',
    category: 'subject',
    name: '#영어I (일반선택)',
    src: createSvgBadge({
      text: '#영어I (일반선택)',
      bgGradient: '<stop offset="0%" stop-color="%23059669"/><stop offset="100%" stop-color="%2334d399"/>',
      borderColor: '#a7f3d0',
      emoji: '🌿',
    }),
    defaultWidth: 165,
  },
  {
    id: 'sub_eng_read_write',
    category: 'subject',
    name: '#영어독해와작문',
    src: createSvgBadge({
      text: '#영어독해와작문',
      bgGradient: '<stop offset="0%" stop-color="%23d97706"/><stop offset="100%" stop-color="%23fbbf24"/>',
      borderColor: '#fde68a',
      emoji: '✍️',
    }),
    defaultWidth: 165,
  },
  {
    id: 'sub_rev_2022',
    category: 'subject',
    name: '#2022개정교육과정',
    src: createSvgBadge({
      text: '#2022개정완벽대비',
      bgGradient: '<stop offset="0%" stop-color="%23dc2626"/><stop offset="100%" stop-color="%23f87171"/>',
      borderColor: '#fecaca',
      emoji: '🎯',
    }),
    defaultWidth: 175,
  },

  // 2. 평가방식 및 목표
  {
    id: 'eval_rank1',
    category: 'eval',
    name: '5등급제 1등급 쟁취',
    src: createSvgBadge({
      text: '★ 5등급제 1등급 ★',
      bgGradient: '<stop offset="0%" stop-color="%23e11d48"/><stop offset="100%" stop-color="%23fb7185"/>',
      borderColor: '#fff1f2',
      emoji: '🏆',
    }),
    defaultWidth: 170,
  },
  {
    id: 'eval_grade_a',
    category: 'eval',
    name: '성취도 A 마스터',
    src: createSvgBadge({
      text: '성취도 [A] 확정!',
      bgGradient: '<stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%2338bdf8"/>',
      borderColor: '#e0f2fe',
      emoji: '💯',
    }),
    defaultWidth: 160,
  },
  {
    id: 'eval_rel_survivor',
    category: 'eval',
    name: '상대평가 생존자',
    src: createSvgBadge({
      text: '상대평가 생존자',
      bgGradient: '<stop offset="0%" stop-color="%237c3aed"/><stop offset="100%" stop-color="%23c084fc"/>',
      borderColor: '#f3e8ff',
      emoji: '⚡',
    }),
    defaultWidth: 155,
  },
  {
    id: 'eval_both_catch',
    category: 'eval',
    name: '내신+수능 둘다 잡기',
    src: createSvgBadge({
      text: '내신+수능 둘다 잡음',
      bgGradient: '<stop offset="0%" stop-color="%230d9488"/><stop offset="100%" stop-color="%232dd4bf"/>',
      borderColor: '#ccfbf1',
      emoji: '🔥',
    }),
    defaultWidth: 170,
  },

  // 3. 세특/진로 연계
  {
    id: 'career_genius',
    category: 'career',
    name: '세특 천재',
    src: createSvgBadge({
      text: '세특 천재(기록장인)',
      bgGradient: '<stop offset="0%" stop-color="%23ea580c"/><stop offset="100%" stop-color="%23fb923c"/>',
      borderColor: '#ffedd5',
      emoji: '👑',
    }),
    defaultWidth: 165,
  },
  {
    id: 'career_it_ai',
    category: 'career',
    name: 'IT/AI x English',
    src: createSvgBadge({
      text: 'IT·AI x English',
      bgGradient: '<stop offset="0%" stop-color="%230891b2"/><stop offset="100%" stop-color="%2322d3ee"/>',
      borderColor: '#cffafe',
      emoji: '💻',
    }),
    defaultWidth: 160,
  },
  {
    id: 'career_med',
    category: 'career',
    name: '의약학 x English',
    src: createSvgBadge({
      text: '의약·보건 x English',
      bgGradient: '<stop offset="0%" stop-color="%23059669"/><stop offset="100%" stop-color="%2310b981"/>',
      borderColor: '#d1fae5',
      emoji: '🩺',
    }),
    defaultWidth: 165,
  },
  {
    id: 'career_humanities',
    category: 'career',
    name: '인문사회 x English',
    src: createSvgBadge({
      text: '인문·사회 x English',
      bgGradient: '<stop offset="0%" stop-color="%239333ea"/><stop offset="100%" stop-color="%23c084fc"/>',
      borderColor: '#f3e8ff',
      emoji: '⚖️',
    }),
    defaultWidth: 165,
  },
  {
    id: 'career_report_pass',
    category: 'career',
    name: '탐구보고서 All Pass',
    src: createSvgBadge({
      text: '탐구보고서 All Pass',
      bgGradient: '<stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%23475569"/>',
      borderColor: '#f8fafc',
      emoji: '📜',
    }),
    defaultWidth: 170,
  },

  // 4. 위트 & 말풍선
  {
    id: 'wit_easy_eng',
    category: 'wit',
    name: '영어가 제일 쉬웠어요',
    src: createSvgBadge({
      text: '영어가 제일 쉬웠어요~',
      shape: 'bubble',
      bgGradient: '<stop offset="0%" stop-color="%23fef08a"/><stop offset="100%" stop-color="%23fde047"/>',
      textColor: '#713f12',
      borderColor: '#ca8a04',
    }),
    defaultWidth: 175,
  },
  {
    id: 'wit_vocab_king',
    category: 'wit',
    name: 'Vocab King',
    src: createSvgBadge({
      text: 'Vocab King 👑 단어왕',
      shape: 'bubble',
      bgGradient: '<stop offset="0%" stop-color="%23fbcfe8"/><stop offset="100%" stop-color="%23f472b6"/>',
      textColor: '#831843',
      borderColor: '#db2777',
    }),
    defaultWidth: 175,
  },
  {
    id: 'wit_keep_calm',
    category: 'wit',
    name: 'Keep Calm & Read On',
    src: createSvgBadge({
      text: 'Keep Calm & Read On',
      shape: 'bubble',
      bgGradient: '<stop offset="0%" stop-color="%23bae6fd"/><stop offset="100%" stop-color="%237dd3fc"/>',
      textColor: '#0c4a6e',
      borderColor: '#0284c7',
    }),
    defaultWidth: 175,
  },

  // 5. 비주얼 & 데코
  {
    id: 'deco_stamp_best',
    category: 'deco',
    name: '참 잘했어요 스탬프',
    src: createSvgBadge({
      text: '참잘했어요',
      subText: '100점 만점 💯',
      shape: 'stamp',
    }),
    defaultWidth: 110,
  },
  {
    id: 'deco_sparkles',
    category: 'deco',
    name: '반짝이 별빛',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <path d="M 50 5 Q 50 50 5 50 Q 50 50 50 95 Q 50 50 95 50 Q 50 50 50 5 Z" fill="%23fbbf24"/>
      <path d="M 80 15 Q 80 30 65 30 Q 80 30 80 45 Q 80 30 95 30 Q 80 30 80 15 Z" fill="%23fde047"/>
      <circle cx="25" cy="75" r="5" fill="%23fbbf24"/>
    </svg>`,
    defaultWidth: 90,
  },
  {
    id: 'deco_glasses',
    category: 'deco',
    name: '스마트 안경',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="60" viewBox="0 0 140 60">
      <circle cx="40" cy="30" r="22" fill="none" stroke="%231e293b" stroke-width="5"/>
      <circle cx="100" cy="30" r="22" fill="none" stroke="%231e293b" stroke-width="5"/>
      <line x1="62" y1="30" x2="78" y2="30" stroke="%231e293b" stroke-width="5"/>
      <path d="M 18 28 L 5 22" stroke="%231e293b" stroke-width="4" stroke-linecap="round"/>
      <path d="M 122 28 L 135 22" stroke="%231e293b" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    defaultWidth: 120,
  },
  {
    id: 'deco_heart_ribbon',
    category: 'deco',
    name: '핑크 하트 리본',
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90">
      <path d="M 60 45 C 50 20, 20 20, 20 45 C 20 65, 50 78, 60 88 C 70 78, 100 65, 100 45 C 100 20, 70 20, 60 45 Z" fill="%23f43f5e" stroke="%23ffe4e6" stroke-width="3"/>
      <circle cx="45" cy="38" r="4" fill="%23ffffff" opacity="0.8"/>
    </svg>`,
    defaultWidth: 85,
  },
];
