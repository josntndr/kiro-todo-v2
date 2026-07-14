import { Link } from 'react-router-dom';
import {
  ListChecks,
  CheckCircle2,
  LayoutDashboard,
  Timer,
  Target,
  UsersRound,
  ArrowRight,
  Columns3,
  Bell,
} from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Task Management',
    description: 'Organize tasks with priorities, categories, due dates, and subtasks.',
  },
  {
    icon: Columns3,
    title: 'Board View',
    description: 'Visualize your workflow with drag-and-drop Kanban boards.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Get a clear overview of your productivity and progress.',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Stay focused with built-in time management techniques.',
  },
  {
    icon: Target,
    title: 'Goals and Priorities',
    description: 'Set priorities and track what matters most to you.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a deadline with intelligent notifications.',
  },
];

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="landing-bg-glow landing-bg-glow--1" aria-hidden="true" />
      <div className="landing-bg-glow landing-bg-glow--2" aria-hidden="true" />

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
          <Link to="/login" className="landing-nav-link">
            Sign In
          </Link>
          <Link to="/register" className="landing-nav-cta">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Manage your tasks.
            <br />
            <span className="landing-hero-highlight">Stay productive.</span>
          </h1>
          <p className="landing-hero-subtitle">
            TaskFlow helps you organize work, track progress, and accomplish more
            with a clean, focused workspace designed for modern productivity.
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
              <span>Free to use</span>
            </div>
            <div className="landing-hero-checks">
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>No credit card required</span>
            </div>
            <div className="landing-hero-checks">
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>Cloud synced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-features-header">
          <h2 className="landing-features-title">Everything you need to stay on track</h2>
          <p className="landing-features-subtitle">
            Built for individuals and teams who want clarity and control over their work.
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

      {/* CTA Section */}
      <section className="landing-cta">
        <h2 className="landing-cta-title">Ready to get organized?</h2>
        <p className="landing-cta-subtitle">
          Join TaskFlow and start managing your tasks in seconds.
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
        <p className="landing-footer-copy">Built for productivity.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
