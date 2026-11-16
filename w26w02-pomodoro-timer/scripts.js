// 뽀모도로 타이머 상태 및 설정
const CONFIG = {
  modes: {
    pomodoro: {
      name: 'pomodoro',
      label: '집중 시간',
      duration: 25 * 60, // 25분
    },
    shortBreak: {
      name: 'shortBreak',
      label: '짧은 휴식',
      duration: 5 * 60, // 5분
    },
    longBreak: {
      name: 'longBreak',
      label: '긴 휴식',
      duration: 15 * 60, // 15분
    },
  },
  longBreakInterval: 4, // 4회 완료 시 긴 휴식
};

// 애플리케이션 상태 관리
const state = {
  currentMode: 'pomodoro',
  timeLeft: CONFIG.modes.pomodoro.duration,
  totalTime: CONFIG.modes.pomodoro.duration,
  isRunning: false,
  timerId: null,
  completedPomodoros: 0,
  currentSession: 1,
};

// DOM 요소 참조
const elements = {
  body: document.body,
  tabButtons: document.querySelectorAll('.tab-btn'),
  timeDisplay: document.getElementById('time-display'),
  statusBadge: document.getElementById('status-badge'),
  sessionInfo: document.getElementById('session-info'),
  btnStart: document.getElementById('btn-start'),
  btnReset: document.getElementById('btn-reset'),
  btnSkip: document.getElementById('btn-skip'),
  completedCount: document.getElementById('completed-count'),
  cycleDots: document.querySelectorAll('#cycle-dots .dot'),
  circleBar: document.querySelector('.progress-ring__bar'),
};

// SVG 프로그레스 원주 계산
const circleRadius = elements.circleBar.r.baseVal.value;
const circumference = 2 * Math.PI * circleRadius;
elements.circleBar.style.strokeDasharray = `${circumference} ${circumference}`;
elements.circleBar.style.strokeDashoffset = '0';

// Web Audio API를 활용한 알림음 생성기 (외부 파일 불필요)
function playAlarmSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // 3개 음의 화음 (도 - 미 - 솔 - 높은도 아르페지오 느낌)
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
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

// 브라우저 데스크톱 알림
function sendBrowserNotification(title, body) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '' });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
}

// 시간 문자열 포맷팅 (초 -> MM:SS)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 프로그레스 바 갱신
function updateProgressBar() {
  const progressRatio = state.timeLeft / state.totalTime;
  const offset = circumference * (1 - progressRatio);
  elements.circleBar.style.strokeDashoffset = offset;
}

// 화면 및 타이틀 갱신
function render() {
  const formatted = formatTime(state.timeLeft);
  elements.timeDisplay.textContent = formatted;

  const modeConfig = CONFIG.modes[state.currentMode];
  document.title = `${formatted} - ${modeConfig.label} | Pomodoro`;

  elements.statusBadge.textContent = modeConfig.label;
  elements.sessionInfo.textContent = `#${state.currentSession} 세션`;
  elements.completedCount.textContent = state.completedPomodoros;

  // 사이클 인디케이터 갱신 (4단계)
  const currentCycleProgress = state.completedPomodoros % CONFIG.longBreakInterval;
  elements.cycleDots.forEach((dot, index) => {
    if (index < currentCycleProgress) {
      dot.classList.add('completed');
    } else {
      dot.classList.remove('completed');
    }
  });

  // 버튼 텍스트 갱신
  elements.btnStart.textContent = state.isRunning ? '일시정지' : '시작';

  // 프로그레스 바 갱신
  updateProgressBar();
}

// 모드 전환
function switchMode(mode, autoStart = false) {
  if (!CONFIG.modes[mode]) return;

  pauseTimer();

  state.currentMode = mode;
  state.totalTime = CONFIG.modes[mode].duration;
  state.timeLeft = state.totalTime;

  // 바디 속성 변경 (CSS 테마 반응)
  elements.body.setAttribute('data-mode', mode);

  // 활성 탭 스타일 업데이트
  elements.tabButtons.forEach((btn) => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  render();

  if (autoStart) {
    startTimer();
  }
}

// 타이머 시작
function startTimer() {
  if (state.isRunning) return;

  // 알림 권한 미리 요청
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  state.isRunning = true;
  elements.btnStart.textContent = '일시정지';

  state.timerId = setInterval(() => {
    if (state.timeLeft > 0) {
      state.timeLeft -= 1;
      render();
    } else {
      handleTimerComplete();
    }
  }, 1000);
}

// 타이머 일시정지
function pauseTimer() {
  if (!state.isRunning) return;

  clearInterval(state.timerId);
  state.timerId = null;
  state.isRunning = false;
  elements.btnStart.textContent = '시작';
}

// 타이머 초기화
function resetTimer() {
  pauseTimer();
  state.timeLeft = state.totalTime;
  render();
}

// 타이머 완료 처리
function handleTimerComplete() {
  pauseTimer();
  playAlarmSound();

  if (state.currentMode === 'pomodoro') {
    state.completedPomodoros += 1;
    state.currentSession += 1;

    // 4회 주기로 긴 휴식 또는 짧은 휴식 전환
    const isLongBreak = state.completedPomodoros % CONFIG.longBreakInterval === 0;
    const nextMode = isLongBreak ? 'longBreak' : 'shortBreak';
    const breakLabel = isLongBreak ? '긴 휴식(15분)' : '짧은 휴식(5분)';

    sendBrowserNotification('집중 완료!', `수고하셨습니다. 이제 ${breakLabel}을 취하세요.`);
    switchMode(nextMode);
  } else {
    // 휴식 모드가 끝난 경우 다시 집중 모드로 전환
    sendBrowserNotification('휴식 완료!', '다시 집중할 시간입니다!');
    switchMode('pomodoro');
  }
}

// 건너뛰기 처리
function skipSession() {
  const confirmSkip = confirm('현재 세션을 건너뛰시겠습니까?');
  if (!confirmSkip) return;

  if (state.currentMode === 'pomodoro') {
    switchMode('shortBreak');
  } else {
    switchMode('pomodoro');
  }
}

// 이벤트 리스너 등록
function initEventListeners() {
  // 모드 탭 클릭
  elements.tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode !== state.currentMode) {
        switchMode(mode);
      }
    });
  });

  // 시작 / 일시정지 토글
  elements.btnStart.addEventListener('click', () => {
    if (state.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  // 초기화 버튼
  elements.btnReset.addEventListener('click', resetTimer);

  // 건너뛰기 버튼
  elements.btnSkip.addEventListener('click', skipSession);

  // 단축키 지원 (스페이스바: 시작/정지, Esc: 초기화)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      elements.btnStart.click();
    } else if (e.code === 'Escape') {
      resetTimer();
    }
  });
}

// 초기화 실행
function init() {
  initEventListeners();
  render();
}

// 앱 실행
document.addEventListener('DOMContentLoaded', init);
