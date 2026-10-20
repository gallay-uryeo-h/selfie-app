# 📸 English Spectrum Photo Booth (`selfie-app`)

초등학생 및 어린이 대상 영어 캠프/체험 활동용 반응형 웹 포토부스 PWA(Progressive Web App)입니다.
웹 브라우저에서 웹캠 촬영, 샘플 사진 체험, 잉글리시 스펙트럼 테마 4컷 프레임 합성, 스티커 꾸미기, QR 코드 공유 및 다운로드를 제공합니다.

---

## ✨ 주요 기능

- 🎨 **Step 1: 프레임 선택 (4종)**
  - Rainbow Festival (비비드 무지개 테마)
  - Pastel Dream (부드러운 파스텔 테마)
  - Neon Night (다크 & 네온 테마)
  - Minimal Gray (깔끔한 모노톤 모던 테마)

- 📷 **Step 2: 카메라 촬영 & 샘플 체험**
  - 브라우저 웹캠 실시간 스트리밍 지원 (카메라 전환 지원)
  - 카메라가 없거나 권한이 없는 환경을 위한 **샘플 사진 모드** 탑재
  - 3초 카운트다운 타이머 및 효과음 (Web Audio API)
  - 4연속 컷 촬영 및 다시 찍기 기능

- 🎀 **Step 3: 스티커 & 텍스트 꾸미기**
  - 드래그 앤 드롭, 회전/크기 조절 가능한 스티커
  - 텍스트 입력 및 위치 배치
  - 실행 취소(Undo) 지원

- 🖨️ **Step 4: 인쇄, 다운로드 & 공유**
  - 고해상도 4컷 포토스트립 이미지 합성 및 PNG 다운로드
  - A4 용지 2장 분할 최적화 인쇄 레이아웃
  - 모바일 전송을 위한 QR 코드 생성
  - 완성 축하 색종이(Confetti) 애니메이션

- 📱 **PWA & 오프라인 지원**
  - 홈 화면 바로가기 추가(설치형 웹앱)
  - 오프라인 캐싱 및 빠른 로딩 지원

---

## 🛠️ 기술 스택

- **Frontend**: React 19, Vite 8, Vanilla CSS
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa, Workbox
- **Effects & Utilities**: canvas-confetti, qrcode, Web Audio API

---

## 🚀 시작하기

### 설치
```bash
npm install
```

### 로컬 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

---

## 📄 라이선스
MIT License
