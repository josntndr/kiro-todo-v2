import { useMemo } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock3, Target, Flame, PieChart as PieChartIcon, Tag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts';
import './ReportsPage.css';

const COLORS = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  slate: '#64748b',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip" style={{
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
    }}>
      {label && <p style={{ margin: 0, marginBottom: 4, fontWeight: 600 }}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ margin: 0, color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip" style={{
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
    }}>
      <p style={{ margin: 0 }}>
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
};

const NoDataMessage = () => (
  <div className="reports-panel-empty">
    <BarChart3 size={24} />
    <p>No data yet</p>
  </div>
);

function ReportsPage({ tasks }) {
  const stats = useMemo(() => {
    const all = tasks || [];
    const total = all.length;
    const completed = all.filter((t) => t.completed).length;
    const pending = all.filter((t) => !t.completed).length;
    const highPriority = all.filter((t) => t.priority === 'High' && !t.completed).length;

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // By priority
    const byPriority = {
      High: all.filter((t) => t.priority === 'High').length,
      Medium: all.filter((t) => t.priority === 'Medium').length,
      Low: all.filter((t) => t.priority === 'Low').length,
    };

    // By status
    const byStatus = {
      'To Do': all.filter((t) => t.status === 'todo').length,
      'In Progress': all.filter((t) => t.status === 'in-progress').length,
      Done: all.filter((t) => t.status === 'done' || t.completed).length,
    };

    // By category
    const categoryMap = {};
    all.forEach((t) => {
      const cat = t.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const byCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // By tag
    const tagMap = {};
    all.forEach((t) => {
      (t.tags || []).forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // Tasks created per day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = all.filter((t) => t.createdAt && t.createdAt.startsWith(dateStr)).length;
      last7Days.push({ day: dayLabel, count, dateStr });
    }

    // Overdue
    const today = new Date().toISOString().split('T')[0];
    const overdue = all.filter((t) => !t.completed && t.dueDate && t.dueDate < today).length;

    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate,
      byPriority,
      byStatus,
      byCategory,
      topTags,
      last7Days,
      overdue,
    };
  }, [tasks]);

  // Chart data derived from stats via useMemo
  const weeklyData = useMemo(() => stats.last7Days, [stats.last7Days]);

  const priorityData = useMemo(() => [
    { name: 'High', count: stats.byPriority.High, fill: COLORS.red },
    { name: 'Medium', count: stats.byPriority.Medium, fill: COLORS.amber },
    { name: 'Low', count: stats.byPriority.Low, fill: COLORS.green },
  ], [stats.byPriority]);

  const statusData = useMemo(() => [
    { name: 'To Do', value: stats.byStatus['To Do'], fill: COLORS.slate },
    { name: 'In Progress', value: stats.byStatus['In Progress'], fill: COLORS.blue },
    { name: 'Done', value: stats.byStatus.Done, fill: COLORS.green },
  ].filter((d) => d.value > 0), [stats.byStatus]);

  const completionData = useMemo(() => [
    { name: 'Completion', value: stats.completionRate, fill: COLORS.blue },
  ], [stats.completionRate]);

  const categoryData = useMemo(() =>
    stats.byCategory.map(([name, count]) => ({ name, count })),
    [stats.byCategory]
  );

  const hasPriorityData = priorityData.some((d) => d.count > 0);
  const hasStatusData = statusData.length > 0;
  const hasCategoryData = categoryData.length > 0;
  const hasWeeklyData = weeklyData.some((d) => d.count > 0);

  // Empty state when no tasks at all
  if (!tasks || tasks.length === 0) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <h1>Reports</h1>
          <p>Insights and analytics about your tasks</p>
        </div>
        <div className="reports-empty-state">
          <BarChart3 size={48} />
          <h2>No tasks yet</h2>
          <p>Create some tasks to see insights and analytics here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Reports</h1>
        <p>Insights and analytics about your tasks</p>
      </div>

      {/* Overview cards */}
      <div className="reports-overview">
        <div className="reports-card reports-card--blue">
          <div className="reports-card-icon">
            <Target size={20} />
          </div>
          <div className="reports-card-info">
            <span className="reports-card-value">{stats.completionRate}%</span>
            <span className="reports-card-label">Completion Rate</span>
          </div>
        </div>
        <div className="reports-card reports-card--green">
          <div className="reports-card-icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="reports-card-info">
            <span className="reports-card-value">{stats.completed}</span>
            <span className="reports-card-label">Completed</span>
          </div>
        </div>
        <div className="reports-card reports-card--amber">
          <div className="reports-card-icon">
            <Clock3 size={20} />
          </div>
          <div className="reports-card-info">
            <span className="reports-card-value">{stats.pending}</span>
            <span className="reports-card-label">Pending</span>
          </div>
        </div>
        <div className="reports-card reports-card--red">
          <div className="reports-card-icon">
            <Flame size={20} />
          </div>
          <div className="reports-card-info">
            <span className="reports-card-value">{stats.highPriority}</span>
            <span className="reports-card-label">High Priority</span>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="reports-grid">
        {/* Weekly Activity */}
        <div className="reports-panel">
          <h3 className="reports-panel-title">
            <TrendingUp size={16} aria-hidden="true" />
            Weekly Activity
          </h3>
          {hasWeeklyData ? (
            <div className="reports-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
                  <Bar dataKey="count" name="Tasks" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </div>

        {/* Tasks by Priority */}
        <div className="reports-panel">
          <h3 className="reports-panel-title">
            <BarChart3 size={16} aria-hidden="true" />
            Tasks by Priority
          </h3>
          {hasPriorityData ? (
            <div className="reports-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priorityData} layout="vertical">
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={60} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
                  <Bar dataKey="count" name="Tasks" radius={[0, 4, 4, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </div>

        {/* Tasks by Status */}
        <div className="reports-panel">
          <h3 className="reports-panel-title">
            <PieChartIcon size={16} aria-hidden="true" />
            Tasks by Status
          </h3>
          {hasStatusData ? (
            <div className="reports-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </div>

        {/* Completion Rate */}
        <div className="reports-panel">
          <h3 className="reports-panel-title">
            <Target size={16} aria-hidden="true" />
            Completion Rate
          </h3>
          <div className="reports-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                startAngle={180}
                endAngle={0}
                data={completionData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={8}
                  background={{ fill: '#1e293b' }}
                  max={100}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="reports-radial-label">
              <span className="reports-radial-value">{stats.completionRate}%</span>
              <span className="reports-radial-text">Complete</span>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="reports-panel">
          <h3 className="reports-panel-title">
            <BarChart3 size={16} aria-hidden="true" />
            Top Categories
          </h3>
          {hasCategoryData ? (
            <div className="reports-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={90} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
                  <Bar dataKey="count" name="Tasks" fill={COLORS.purple} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoDataMessage />
          )}
        </div>

        {/* Top Tags */}
        <div className="reports-panel">
          <h3 className="reports-panel-title">
            <Tag size={16} aria-hidden="true" />
            Top Tags
          </h3>
          {stats.topTags.length > 0 ? (
            <div className="reports-tags">
              {stats.topTags.map(([tag, count]) => (
                <span key={tag} className="reports-tag-chip">
                  {tag} <span className="reports-tag-count">{count}</span>
                </span>
              ))}
            </div>
          ) : (
            <NoDataMessage />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
