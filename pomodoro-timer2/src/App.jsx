import React, { useState, useEffect, useRef } from 'react';

// 1. 모드별 시간 및 설정 (초 단위)
const MODES = {
  pomodoro: {
    key: 'pomodoro',
    label: '집중 (25분)',
    badge: '집중 시간',
    duration: 25 * 60, // 25분
  },
  shortBreak: {
    key: 'shortBreak',
    label: '짧은 휴식 (5분)',
    badge: '짧은 휴식',
    duration: 5 * 60, // 5분
  },
  longBreak: {
    key: 'longBreak',
    label: '긴 휴식 (15분)',
    badge: '긴 휴식',
    duration: 15 * 60, // 15분
  },
};

// 4회 완료 시 긴 휴식 적용
const LONG_BREAK_INTERVAL = 4;

// 2. Web Audio API를 활용한 내장 알림음 (외부 mp3 파일 불필요)
function playAlarmSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // 맑은 4화음 아르페지오 (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + index * 0.12;
      const duration = 0.35;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (error) {
    console.warn('오디오 재생 실패:', error);
  }
}

// 3. 초 단위를 MM:SS 문자열로 변환하는 함수
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function App() {
  // 상태 관리
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [session, setSession] = useState(1);

  // SVG 원형 게이지 계산용 상수 (반지름 135)
  const RADIUS = 135;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const currentTotal = MODES[currentMode].duration;
  const strokeDashoffset = CIRCUMFERENCE * (1 - timeLeft / currentTotal);

  // 모드 변경 처리 함수
  const switchMode = (modeKey, autoStart = false) => {
    setIsRunning(false);
    setCurrentMode(modeKey);
    setTimeLeft(MODES[modeKey].duration);
    if (autoStart) {
      setIsRunning(true);
    }
  };

  // 타이머 시작 / 일시정지 토글
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // 타이머 초기화 (현재 모드의 시간으로 리셋)
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[currentMode].duration);
  };

  // 다음 세션으로 건너뛰기
  const skipSession = () => {
    if (window.confirm('현재 세션을 건너뛰시겠습니까?')) {
      if (currentMode === 'pomodoro') {
        switchMode('shortBreak');
      } else {
        switchMode('pomodoro');
      }
    }
  };

  // Effect 1: 타이머 작동 중일 때 1초마다 시간 감소
  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning]);

  // Effect 2: 시간이 0이 되었을 때의 완료 처리
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return;

    setIsRunning(false);
    playAlarmSound();

    if (currentMode === 'pomodoro') {
      const nextCount = completedPomodoros + 1;
      setCompletedPomodoros(nextCount);
      setSession((s) => s + 1);

      // 4회 주기마다 긴 휴식 또는 짧은 휴식으로 자동 전환
      const isLongBreak = nextCount % LONG_BREAK_INTERVAL === 0;
      const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
      switchMode(nextMode);
    } else {
      // 휴식이 끝나면 다시 집중 모드로 전환
      switchMode('pomodoro');
    }
  }, [timeLeft]);

  // Effect 2: 브라우저 탭 타이틀 실시간 업데이트
  useEffect(() => {
    const formatted = formatTime(timeLeft);
    const modeLabel = MODES[currentMode].badge;
    document.title = `${formatted} - ${modeLabel} | React 뽀모도로`;
  }, [timeLeft, currentMode]);

  // Effect 3: 키보드 단축키 지원 (Space: 시작/일시정지, Esc: 초기화)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'Escape') {
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, currentMode]);

  // 사이클 진행도 (4단계 중 완료 개수)
  const currentCycleCount = completedPomodoros % LONG_BREAK_INTERVAL;

  return (
    <div className="page-wrapper" data-mode={currentMode}>
      {/* 상단 메인 포털로 돌아가기 링크 */}
      <a href="../../" className="nav-home-btn" title="메인 포털로 돌아가기">
        ← 목록으로
      </a>

      <main className="app-container">
        {/* 헤더 */}
        <header className="app-header">
          <h1 className="app-title">Pomodoro Timer</h1>
          <p className="app-subtitle">React와 Vite로 제작된 뽀모도로 타이머</p>
        </header>

        {/* 모드 선택 탭 (Pill 형태) */}
        <nav className="mode-tabs" aria-label="타이머 모드">
          {Object.values(MODES).map((mode) => (
            <button
              key={mode.key}
              type="button"
              className={`tab-btn ${currentMode === mode.key ? 'active' : ''}`}
              onClick={() => switchMode(mode.key)}
            >
              {mode.label}
            </button>
          ))}
        </nav>

        {/* 원형 프로그레스 및 시간 표시 */}
        <section className="timer-section">
          <div className="progress-ring-wrapper">
            <svg className="progress-ring" viewBox="0 0 320 320">
              <circle
                className="progress-ring__bg"
                cx="160"
                cy="160"
                r={RADIUS}
              />
              <circle
                className="progress-ring__bar"
                cx="160"
                cy="160"
                r={RADIUS}
                style={{
                  strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
                  strokeDashoffset,
                }}
              />
            </svg>

            <div className="timer-content">
              <span className="status-badge">{MODES[currentMode].badge}</span>
              <div className="time-display">{formatTime(timeLeft)}</div>
              <span className="session-info">#{session} 세션</span>
            </div>
          </div>
        </section>

        {/* 제어 버튼 그룹 */}
        <section className="controls-section">
          <button
            type="button"
            className="btn btn-primary"
            onClick={toggleTimer}
          >
            {isRunning ? '일시정지' : '시작'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetTimer}
          >
            초기화
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={skipSession}
            title="다음 세션으로 넘어가기"
          >
            건너뛰기
          </button>
        </section>

        {/* 통계 및 사이클 인디케이터 */}
        <footer className="stats-section">
          <div className="stat-card">
            <span className="stat-label">완료한 뽀모도로</span>
            <span className="stat-value">{completedPomodoros}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">사이클 진행도</span>
            <div className="cycle-dots" aria-label="사이클 진행도">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`dot ${index < currentCycleCount ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
