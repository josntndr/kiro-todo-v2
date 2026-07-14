import { Link } from 'react-router-dom';
import {
  ListChecks,
  CheckCircle2,
  Timer,
  Target,
  ArrowRight,
  Columns3,
  CalendarDays,
  BarChart3,
  Zap,
  Shield,
  Sparkles,
} from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Task Management',
    description: 'Create, organize, and track tasks with priorities, categories, tags, and subtasks.',
  },
  {
    icon: Columns3,
    title: 'Kanban Boards',
    description: 'Visualize your workflow with drag-and-drop columns for every status.',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Stay focused with built-in work/break cycles and session tracking.',
  },
  {
    icon: CalendarDays,
    title: 'Calendar View',
    description: 'See your tasks on a calendar and never miss a deadline again.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Track productivity trends with visual charts and completion stats.',
  },
  {
    icon: Target,
    title: 'Smart Priorities',
    description: 'Prioritize what matters with High, Medium, Low levels and due dates.',
  },
];

const STATS = [
  { value: '100%', label: 'Free to use' },
  { value: '∞', label: 'Unlimited tasks' },
  { value: 'Real-time', label: 'Cloud sync' },
  { value: '2', label: 'Themes' },
];

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="landing-bg-glow landing-bg-glow--1" aria-hidden="true" />
      <div className="landing-bg-glow landing-bg-glow--2" aria-hidden="true" />
      <div className="landing-bg-grid" aria-hidden="true" />

      {/* Navigation */}
      <header className="landing-nav">
        <div className="landing-nav-brand">
          <div className="landing-nav-logo">
            <ListChecks size={20} aria-hidden="true" />
          </div>
          <span className="landing-nav-name">
            <span className="landing-nav-task">Task</span>
            <span className="landing-nav-flow">Flow</span>
          </span>
        </div>
        <nav className="landing-nav-links">
          <Link to="/login" className="landing-nav-link">Sign In</Link>
          <Link to="/register" className="landing-nav-cta">
            Get Started <ArrowRight size={14} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Sparkles size={14} />
          <span>Now with dark & light themes</span>
        </div>
        <h1 className="landing-hero-title">
          Your tasks,
          <br />
          <span className="landing-hero-highlight">beautifully organized.</span>
        </h1>
        <p className="landing-hero-subtitle">
          TaskFlow is a modern productivity app that helps you manage tasks, track habits, 
          and stay focused — all in one clean, distraction-free workspace.
        </p>
        <div className="landing-hero-actions">
          <Link to="/register" className="landing-btn landing-btn--primary">
            Start for free
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/login" className="landing-btn landing-btn--secondary">
            Sign in to your account
          </Link>
        </div>
        <div className="landing-hero-social-proof">
          <div className="landing-hero-checks">
            <CheckCircle2 size={15} aria-hidden="true" />
            <span>Free forever</span>
          </div>
          <div className="landing-hero-checks">
            <CheckCircle2 size={15} aria-hidden="true" />
            <span>No credit card</span>
          </div>
          <div className="landing-hero-checks">
            <CheckCircle2 size={15} aria-hidden="true" />
            <span>Cloud synced</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="landing-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="landing-stat-item">
            <span className="landing-stat-value">{stat.value}</span>
            <span className="landing-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-features-header">
          <h2 className="landing-features-title">Everything you need to stay productive</h2>
          <p className="landing-features-subtitle">
            Powerful features designed for individuals who want clarity and control over their work.
          </p>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="landing-feature-card">
                <div className="landing-feature-icon">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="landing-feature-title">{feature.title}</h3>
                <p className="landing-feature-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why TaskFlow Section */}
      <section className="landing-why">
        <h2 className="landing-why-title">Why choose TaskFlow?</h2>
        <div className="landing-why-grid">
          <div className="landing-why-card">
            <Zap size={24} className="landing-why-icon" />
            <h3>Lightning Fast</h3>
            <p>Built with modern tech for instant load times and smooth interactions.</p>
          </div>
          <div className="landing-why-card">
            <Shield size={24} className="landing-why-icon" />
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and stored securely with Firebase authentication.</p>
          </div>
          <div className="landing-why-card">
            <Sparkles size={24} className="landing-why-icon" />
            <h3>Beautiful Design</h3>
            <p>A clean, modern interface with dark and light themes that you'll love using.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2 className="landing-cta-title">Ready to get organized?</h2>
        <p className="landing-cta-subtitle">
          Join TaskFlow today and start managing your tasks in seconds. No setup required.
        </p>
        <Link to="/register" className="landing-btn landing-btn--primary landing-btn--lg">
          Create your free account
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <ListChecks size={16} aria-hidden="true" />
          <span>TaskFlow</span>
        </div>
        <p className="landing-footer-copy">© 2025 TaskFlow. Built for productivity.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
