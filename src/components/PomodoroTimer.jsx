import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee, SkipForward } from 'lucide-react';

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
      if (newSessions % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
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

  function skipBreak() {
    switchMode('focus');
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  const progress = 1 - timeLeft / MODES[mode].duration;
  const ModeIcon = MODES[mode].icon;
  const radius = 124;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isBreak = mode === 'shortBreak' || mode === 'longBreak';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '28px',
      padding: '32px 20px',
    }}>
      {/* Mode Tabs - Pill Segmented Control */}
      <div style={{
        display: 'flex',
        background: 'var(--color-surface)',
        borderRadius: '999px',
        padding: '4px',
        gap: '4px',
      }}>
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: mode === key ? '600' : '400',
              background: mode === key ? '#3B82F6' : 'transparent',
              color: mode === key ? '#ffffff' : 'var(--color-text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Display - 280px Circle */}
      <div style={{
        position: 'relative',
        width: '280px',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth="10"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={isBreak ? '#22c55e' : '#3b82f6'}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
          />
        </svg>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1,
        }}>
          <ModeIcon size={24} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-1px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatTime(timeLeft)}
          </span>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            {MODES[mode].label}
          </span>
        </div>
      </div>

      {/* Controls Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          type="button"
          onClick={resetTimer}
          aria-label="Reset timer"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <RotateCcw size={18} />
        </button>

        <button
          type="button"
          onClick={toggleTimer}
          aria-label={isRunning ? 'Pause' : 'Start'}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: isRunning ? '#ef4444' : '#3b82f6',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: isRunning
              ? '0 4px 20px rgba(239, 68, 68, 0.3)'
              : '0 4px 20px rgba(59, 130, 246, 0.3)',
          }}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '2px' }} />}
        </button>

        {isBreak ? (
          <button
            type="button"
            onClick={skipBreak}
            aria-label="Skip break"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <SkipForward size={18} />
          </button>
        ) : (
          <div style={{ width: '44px', height: '44px' }} />
        )}
      </div>

      {/* Skip Break Label */}
      {isBreak && (
        <button
          type="button"
          onClick={skipBreak}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '-12px',
          }}
        >
          <SkipForward size={12} />
          Skip Break
        </button>
      )}

      {/* Session Dots */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '4px',
      }}>
        {Array.from({ length: Math.max(4, sessions) }, (_, i) => (
          <div
            key={i}
            style={{
              width: i < sessions ? '10px' : '8px',
              height: i < sessions ? '10px' : '8px',
              borderRadius: '50%',
              background: i < sessions ? 'var(--color-primary)' : 'var(--color-input)',
              border: i < sessions ? 'none' : '1px solid var(--color-border)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          marginLeft: '8px',
        }}>
          {sessions} session{sessions !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}

export default PomodoroTimer;
