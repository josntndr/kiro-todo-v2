import PomodoroTimer from '../components/PomodoroTimer';

function PomodoroPage() {
  return (
    <div className="page pomodoro-page">
      <div className="page-header">
        <h1 className="page-title">Pomodoro Timer</h1>
        <p className="page-subtitle">Stay focused with timed work sessions</p>
      </div>

      <div className="pomodoro-page-content">
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default PomodoroPage;
