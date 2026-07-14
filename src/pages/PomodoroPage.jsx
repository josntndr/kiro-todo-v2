import PomodoroTimer from '../components/PomodoroTimer';

function PomodoroPage() {
  return (
    <div className="page pomodoro-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100%',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '8px',
        paddingTop: '16px',
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Pomodoro Timer
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          margin: '6px 0 0',
        }}>
          Stay focused with timed work sessions
        </p>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
      }}>
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default PomodoroPage;
