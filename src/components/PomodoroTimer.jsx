import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, icon: Timer },
  shortBreak: { label: 'Short Break', duration: 5 * 60, icon: Coffee },
  longBreak: { label: 'Long Break', duration: 15 * 60, icon: Coffee },
};

function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  function handleTimerComplete() {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === 'focus') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      // Every 4 sessions, suggest a long break
      if (newSessions % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
      // Play notification sound (if supported)
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Pomodoro Complete!', { body: 'Time for a break.' });
        }
      } catch (e) { /* ignore */ }
    } else {
      switchMode('focus');
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  }

  function toggleTimer() {
    setIsRunning((prev) => !prev);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  const progress = 1 - timeLeft / MODES[mode].duration;
  const ModeIcon = MODES[mode].icon;

  return (
    <div className="pomodoro-timer">
      <h3 className="pomodoro-title">
        <Timer size={18} />
        Pomodoro Timer
      </h3>

      <div className="pomodoro-mode-tabs">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            type="button"
            className={`pomodoro-mode-btn ${mode === key ? 'active' : ''}`}
            onClick={() => switchMode(key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="pomodoro-display">
        <div className="pomodoro-circle">
          <svg className="pomodoro-progress-ring" viewBox="0 0 120 120">
            <circle
              className="pomodoro-progress-bg"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className="pomodoro-progress-fill"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <div className="pomodoro-time">
            <ModeIcon size={20} className="pomodoro-mode-icon" />
            <span className="pomodoro-time-value">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="pomodoro-controls">
        <button
          type="button"
          className="btn btn-pomodoro-reset"
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          className={`btn btn-pomodoro-main ${isRunning ? 'running' : ''}`}
          onClick={toggleTimer}
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="pomodoro-sessions">
        <span>Sessions today: <strong>{sessions}</strong></span>
      </div>
    </div>
  );
}

export default PomodoroTimer;
