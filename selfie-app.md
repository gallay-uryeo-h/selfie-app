# 🎯 [앱 개발 계획서] Find Your English Spectrum! 네컷사진 & 세특 스티커 포토부스 앱

## 1. 프로젝트 개요 (Project Overview)

* **프로젝트명**: English Spectrum Photo Booth App (PWA)
* **목적**:
  * 2022 개정 영어과 선택과목 및 세특(세부능력 및 특기사항) 개념을 부스 체험자가 직관적이고 재미있게 학습하도록 유도
  * 디지털 네컷사진 촬영 및 맞춤형 스티커 꾸미기를 통해 차별화된 참여 경험 및 기념품(인쇄물 + 디지털 이미지) 제공
* **타겟 사용자**: 예비 고등학생 (중학생) 및 학부모
* **운영 환경**:
  * **디바이스**: 태블릿 PC (iPad / Galaxy Tab 10인치 이상) 또는 터치 모니터 연결 PC
  * **입력 장치**: 태블릿 내장 카메라 또는 전면/외장 웹캠 (HD급 이상), 터치스크린
  * **출력 장치**: 포토 프린터 (무선 AirPrint/Bluetooth 또는 USB Direct Print) - Canon SELPHY CP1500 등
  * **기술 형태**: 웹 기반 프로그레시브 앱 (PWA, Progressive Web App) - 브라우저 풀스크린/Kiosk 모드 지원

---

## 2. 주요 기능 요구사항 (Functional Requirements)

```
[ Step 1. 프레임 선택 ] ➔ [ Step 2. 4컷 촬영 및 선택 ] ➔ [ Step 3. 디지털 스티커 꾸미기 ] ➔ [ Step 4. 인쇄 및 QR 저장 ]
```

### [Step 1] 프레임 선택 (Frame Selection)
* **프레임 테마 선택**:
  * 기본 시그니처 프레임 (English Spectrum 컬러 템플릿)
  * 과목 몰입형 프레임 (공통영어 / 영어I / 영어독해와작문 테마)
* **배경 색상 지정**: 파스텔톤, Y2K 그래디언트, 다크모드 등 4~5종 선택 가능

### [Step 2] 카메라 촬영 및 사진 픽 (Camera & Shot Selection)
* **카메라 라이브 뷰 실시간 출력** (`getUserMedia` API 활용)
* **카운트다운 타이머**: 컷당 3~5초 카운트다운 가이드 출력
* **총 6~8회 촬영 후 Best 4컷 선택 기능**:
  * 연속 촬영 후 화면에서 마음에 드는 4장 레이아웃에 드래그/클릭으로 배치
* **재촬영 기능**: 전체 재촬영 버튼 제공

### [Step 3] 디지털 스티커 데코 (Sticker Editor Engine - 핵심)
* **캔버스 인터페이스 (Canvas/Fabric.js 엔진)**:
  * 사진 캔버스 위에 스티커 레이어 중첩 배치
* **스티커 조작 액션**:
  * **터치 & 드래그**: 위치 이동
  * **핀치 투 줌 / 핸들 드래그**: 크기 확대/축소 및 회전 (360도)
  * **삭제 버튼 (X)** 및 **최상단/최하단 레이어 변경**
* **카테고리별 탭 메뉴 (5대 카테고리)**:
  1. **선택과목**: `#공통영어1`, `#공통영어2`, `#영어1`, `#영어독해와작문`, `#2022개정`
  2. **평가방식/목표**: `[5등급제]`, `[성취도 A]`, `상대평가 생존자`, `내신+수능 둘다 잡기`
  3. **세특/진로**: `세특천재`, `IT/AI x 영어`, `의약학 x 영어`, `인문사회 x 영어`, `관심지문 찾음`
  4. **위트/말풍선**: `"영어가 제일 쉬웠어요"`, `Vocab King`, `Keep Calm & Read On`
  5. **비주얼/데코**: `[참 잘했어요]` 도장, 픽셀 교과서, 형광펜 하이라이트, Y2K 스티커

---

## 3. 디지털 스티커 개발 & 구현 상세 (Sticker Development Pipeline)

스티커 기능은 그래픽 리소스 제작부터 캔버스 라이브러리 엔진 연동까지 4단계 프로세스로 개발합니다.

### 3.1. 그래픽 에셋 디자인 및 제작 (Design & Asset Creation)
* **제작 도구**: Figma, Adobe Illustrator / Photoshop, 또는 AI 그래픽 생성 도구
* **포맷 및 규격**:
  * **정적 스티커**: PNG (투명 배경 필수), 최소 500x500 px, 300 DPI (인쇄 시 깨짐 방지)
  * **벡터 스티커**: SVG (크기 조절 시 화질 손실 없음, 색상 dynamic 변경 가능)
* **디자인 가이드라인**:
  * 외곽선(Stroke)을 2~4px 흰색/검은색으로 처리하여 사진 배경 위에서도 명확히 식별되도록 제작
  * 스티커 사방에 최소 10px의 투명 여백(Padding)을 두어 터치 핸들 조작 시 아이콘과 겹치지 않게 방지

### 3.2. 스티커 데이터 구조 설계 (JSON Metadata Spec)
앱 내 스티커 목록과 카테고리를 효율적으로 관리하기 위해 JSON 메타데이터로 구조화합니다.

```json
{
  "stickers": [
    {
      "id": "stk_subject_01",
      "category": "subject",
      "name": "공통영어1 해시태그",
      "type": "image",
      "src": "/assets/stickers/subject/common_eng1.png",
      "thumbnail": "/assets/stickers/thumb/common_eng1_thumb.png",
      "defaultScale": 0.3,
      "aspectRatio": 1.5
    },
    {
      "id": "stk_dynamic_text_01",
      "category": "career",
      "name": "직접 입력 세특 말풍선",
      "type": "dynamic-text",
      "bgSrc": "/assets/stickers/bubble_bg.svg",
      "defaultText": "내 진로 분야 입력",
      "fontFamily": "Pretendard-Bold",
      "fillColor": "#1E293B"
    }
  ]
}
```

### 3.3. 프론트엔드 캔버스 개발 (Fabric.js / Konva.js 엔진 연동)
웹 브라우저 및 태블릿 터치 환경에서 스티커를 자유롭게 조작할 수 있도록 캔버스 객체화 기능을 개발합니다.

* **이미지 스티커 캔버스 추가 로직 (Fabric.js 예시)**:
  ```javascript
  // 스티커 터치/클릭 시 캔버스에 추가하는 핸들러
  function addStickerToCanvas(stickerData) {
    fabric.Image.fromURL(stickerData.src, (img) => {
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        cornerColor: '#3B82F6',   // 터치 조작 핸들 색상
        cornerSize: 24,           // 태블릿 손가락 터치용 큰 핸들 크기
        transparentCorners: false,
        hasRotatingPoint: true,
      });

      // 스티커 우측 상단에 삭제(X) custom control 버튼 추가
      addDeleteControl(img);

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  }
  ```

* **동적 텍스트 입력 스티커 (Custom Text Sticker)**:
  * 학생이 본인 이름이나 목표 과목/진로를 직접 입력하는 스티커 구현
  * `fabric.Group` 또는 `fabric.IText` 클래스를 사용하여 말풍선 배경 SVG 위에 사용자 입력 텍스트가 실시간 합성되도록 개발

### 3.4. PWA 최적화 및 에셋 파이프라인 (Asset Pipeline & Caching)
* **이미지 압축 최적화**: WebP / PNGquant를 활용하여 스티커 용량을 개당 100KB 이하로 최적화
* **PWA 오프라인 캐싱 (Service Worker)**:
  * 앱 초기 로딩 시 `manifest.json` 및 스티커 이미지 전체를 Cache Storage / IndexedDB에 사전 다운로드(Pre-fetching)
  * 현장 인터넷 연결이 순간 끊겨도 스티커 팔레트가 지연 없이 즉시 렌더링되도록 구현

---

## 4. [Step 4] 출력 및 디지털 저장 (Print & QR Export)

* **이미지 렌더링**: 최종 캔버스를 고해상도 PNG (300DPI 인쇄용)로 합성 렌더링
* **자동 프린트 전송**: 웹 브라우저 인쇄 API (`window.print()`) 연동으로 포토 프린터 출력 명령 전달
* **QR 코드 자동 생성**:
  * 클라우드 Storage (S3 / Firebase)에 고해상도 이미지 업로드
  * 생성된 단축 URL을 QR 코드로 변환하여 인쇄물 좌측/우측 하단 영역에 자동 삽입
  * 학생이 개인 스마트폰 카메라로 QR 인식 시 이미지 파일 직접 다운로드 가능

---

## 5. 시스템 아키텍처 및 PWA 기술 스택

### 5.1 Front-End & PWA Ecosystem
* **프레임워크**: React.js / Vite (빠른 빌드 및 PWA 모듈 연동)
* **캔버스 엔진**: **Fabric.js** (드래그, 핀치 줌, 회전, 텍스트 스티커 합성에 최적화)
* **PWA 모듈**: `vite-plugin-pwa` / Workbox (Service Worker 기반 캐싱, manifest.json 자동 생성)
* **카메라 제어**: WebRTC (`navigator.mediaDevices.getUserMedia`)
* **스타일링**: Tailwind CSS (터치 친화적 Kiosk UI 반응형 디자인)

### 5.2 Back-End & Cloud Services (QR 저장용)
* **서버/인프라**: Firebase (Cloud Storage + Firestore) 또는 Supabase
* **기능**: 이미지 업로드 API, QR 생성 라이브러리 (`qrcode.react`), 다운로드 전용 모바일 웹페이지

### 5.3 Hardware Integration & Kiosk Configuration
* **PWA Kiosk Mode**: 태블릿 홈 화면 추가 후 `display: "fullscreen"` 모드로 주소창 완전히 은닉
* **프린터 연동**: 무선 AirPrint 또는 USB 연결 Direct Print, 4x6 인치 규격 CSS `@page` 레이아웃 맞춤

---

## 6. UI/UX 화면 설계 및 레이아웃 구조

### 6.1 화면 레이아웃 (10인치 태블릿 가로모드 기준)

```
+-----------------------------------------------------------------------+
|  [Header] Find Your English Spectrum! 포토부스       [처음으로 🔄]     |
+------------------------------------+----------------------------------+
|                                    |  [스티커 카테고리 탭]             |
|                                    |  [과목] [평가] [세특] [위트] [데코]|
|                                    |+--------------------------------+|
|             [ 메인 캔버스 ]         || [스티커 팔레트 (스크롤 가능)]  ||
|         (4컷 사진 + 스티커)        || [과목1] [과목2] [A등급]        ||
|                                    || [세특왕] [ITx영어] [말풍선]    ||
|                                    |+--------------------------------+|
|                                    |  [선택 스티커 제어 버튼]         |
|                                    |  [맨위로] [맨아래로] [삭제 🗑️]   |
+------------------------------------+----------------------------------+
|  [ 📸 촬영 재시도 ]                    [ 🖨️ 완성 및 사진 출력하기 ➡️ ]  |
+-----------------------------------------------------------------------+
```

---

## 7. 개발 일정 및 WBS (Work Breakdown Structure)

총 개발 기간: **2주 (14일)**

| 단계 | 기간 | 주요 과업 | 담당 |
| :--- | :--- | :--- | :--- |
| **1. 기획 & 디자인** | Day 1 ~ 3 | - UI/UX 와이어프레임 확정<br>- 스티커 PNG/SVG 자산 30종 제작 및 압축 최적화<br>- 네컷 사진 프레임 템플릿 디자인 | 기획/디자인 |
| **2. 캔버스 & 스티커 엔진 개발** | Day 4 ~ 7 | - WebRTC 카메라 연동 및 타이머 구현<br>- Fabric.js 기반 스티커 드래그/드롭/회전 캔버스 구현<br>- 동적 텍스트 입력 스티커 및 삭제 컨트롤 개발 | 프론트엔드 |
| **3. PWA & 클라우드 연동** | Day 8 ~ 10 | - Service Worker 설정 (오프라인 스티커 캐싱)<br>- Firebase Storage 이미지 업로드 & QR 연동<br>- 프린터 출력 전용 CSS/Kiosk 설정 | 백엔드/클라이언트 |
| **4. 통합 테스트 & 시연** | Day 11 ~ 12 | - 태블릿 터치 반응성 및 멀티터치 제스처 교정<br>- 포토 프린터 출력 색감 및 비율 교정<br>- 네트워크 단절(오프라인 모드) 대응 테스트 | 전체 |
| **5. 현장 배치 및 리허설** | Day 13 ~ 14 | - 박람회 현장 태블릿 설치 및 테스트 출력<br>- 부스 도우미용 운영 가이드북 전달 | 전체 |

---

## 8. 현장 운영 리스크 대응 방안 (Contingency Plan)

1. **현장 Wi-Fi 불통/신호 약화 문제**:
   * **대처**: Service Worker에 스티커 에셋이 캐싱되어 오프라인에서도 스티커 조작 및 로컬 인쇄는 100% 작동. 네트워크 연결 복구 시 QR 이미지 백그라운드 업로드.
2. **부스 대기열 지연 (병목 현상)**:
   * **대처**: 스티커 꾸미기 단계에 **'90초 제한시간 타이머'** 적용. 제한시간 종료 시 현재까지 꾸민 상태로 자동 인쇄 단계 전환.
   * **스티커 개수 제한**: 사진당 최대 10~12개로 스티커 추가 제한을 두어 캔버스 과부하 및 지연 방지.
3. **개인정보 보호 이슈**:
   * **대처**: 클라우드에 업로드된 사진 및 QR 링크는 **행사 종료 7일 후 자동 일괄 삭제** 스케줄러 적용.

---

## 9. 부스 준비 기기 최종 확인표 (Hardware Checklist)

* [ ] 태블릿 PC 1~2대 (10인치 이상, iPad OS 또는 Android 최신)
* [ ] 태블릿 거치대 및 충전 케이블 (장시간 운영용)
* [ ] 포토 프린터 (예: Canon SELPHY CP1500 / DNP 염료승화 프린터)
* [ ] dedicated 4x6 인화지 및 카트리지 여분 (최소 200~300장 분량)
* [ ] 인터넷 공유기 (LTE 에그 또는 부스 전용 Wi-Fi)