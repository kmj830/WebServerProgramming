# 뽀모도로 타이머 (React + Vite)

React 18과 Vite로 제작된 뽀모도로 타이머 애플리케이션입니다.  
Airbnb 디자인 시스템([DESIGN.md](../DESIGN.md))을 준수하여 따뜻하고 정갈한 화이트 캔버스 미학으로 구현되었습니다.

---

## 🚀 실행 방법

### 1. 개발 서버 실행
```bash
cd pomodoro-timer2
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속하여 확인합니다.

### 2. 프로덕션 빌드
```bash
npm run build
```
빌드된 결과물은 `dist/` 디렉토리에 생성됩니다.

---

## 📁 프로젝트 구조

```text
pomodoro-timer2/
├── index.html          # HTML 진입점 및 폰트 설정
├── package.json        # 의존성 및 스크립트 설정
├── vite.config.js      # Vite 설정 (상대 경로 base: './')
└── src/
    ├── main.jsx        # React DOM 렌더링 엔트리포인트
    ├── App.jsx         # 뽀모도로 타이머 메인 컴포넌트 & 로직
    └── index.css       # Airbnb 디자인 토큰 스타일링
```

---

## ✨ 핵심 기능

1. **3가지 모드 지원 & 동적 테마**
   - **집중(Pomodoro)**: 25분 (Airbnb Rausch `#ff385c`)
   - **짧은 휴식(Short Break)**: 5분 (Airbnb Teal `#008489`)
   - **긴 휴식(Long Break)**: 15분 (Luxe Purple `#460479`)
2. **원형 SVG 프로그레스 링**
   - 남은 시간에 맞춰 부드럽게 감소하는 원형 게이지
3. **Web Audio API 내장 사운드**
   - 세션 완료 시 맑은 4화음 아르페지오 차임벨 사운드 재생 (외부 mp3 파일 불필요)
4. **세션 및 4회 사이클 트래킹**
   - 4회 집중 완료 시 자동으로 긴 휴식 모드로 전환
5. **키보드 단축키 지원**
   - `Space`: 타이머 시작 / 일시정지
   - `Esc`: 현재 모드 시간 초기화
