import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import reportService from '../services/report.service';
import employeeService from '../services/employee.service';
import { mockDb } from '../services/mockDb';
import {
  Users, Calendar, Briefcase, ClipboardList,
  UserPlus, Send, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [response, empRes] = await Promise.all([
          reportService.getDashboardData(),
          employeeService.getEmployees(),
        ]);
        setStats(response.data);
        setEmployees(empRes.data || []);
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
        toast.error('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // ─── Stat KPI Cards ──────────────────────────────
  const totalEmployees = stats?.employees || employees.length || 1248;
  const onLeaveToday = stats?.leavesPending || 32;
  const openPositions = stats?.recruitments || 18;
  const pendingEvaluations = 45;

  const kpis = [
    {
      title: 'Total Employees',
      value: totalEmployees.toLocaleString(),
      badge: '↑ 2.4%',
      badgeType: 'green',
      icon: Users,
      iconBg: 'bg-indigo-50/80 text-indigo-600',
    },
    {
      title: 'On Leave Today',
      value: onLeaveToday.toString(),
      badge: 'Today',
      badgeType: 'neutral',
      icon: Calendar,
      iconBg: 'bg-rose-50 text-rose-500',
    },
    {
      title: 'Open Positions',
      value: openPositions.toString(),
      badge: '↑ 5',
      badgeType: 'green',
      icon: Briefcase,
      iconBg: 'bg-indigo-50/70 text-indigo-500',
    },
    {
      title: 'Pending Evaluations',
      value: pendingEvaluations.toString(),
      badge: 'Action Needed',
      badgeType: 'red',
      icon: ClipboardList,
      iconBg: 'bg-slate-100 text-slate-600',
    },
  ];

  // ─── Chart Data: Employee Growth ─────────────────
  const growthData = [
    { month: 'Jan', count: 180 },
    { month: 'Feb', count: 240 },
    { month: 'Mar', count: 260 },
    { month: 'Apr', count: 520 },
    { month: 'May', count: 480 },
    { month: 'Jun', count: 680 },
    { month: 'Jul', count: 510 },
  ];

  // ─── Chart Data: Department Distribution ─────────
  const deptData = [
    { name: 'Engineering', value: 45, color: '#0f172a' },
    { name: 'Sales', value: 35, color: '#5b5ef7' },
    { name: 'Marketing', value: 20, color: '#064e3b' },
  ];

  // ─── Recent Activity ────────────────────────────
  const recentActivities = [
    {
      id: 1,
      icon: UserPlus,
      iconBg: 'bg-indigo-50 text-indigo-600',
      title: (
        <>
          <span className="font-semibold text-slate-900">Sarah Jenkins</span> was hired as{' '}
          <span className="text-slate-700">Senior Developer</span>.
        </>
      ),
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: Send,
      iconBg: 'bg-slate-100 text-slate-700',
      title: (
        <>
          Leave request approved for <span className="font-semibold text-slate-900">Michael Chang</span>.
        </>
      ),
      time: '5 hours ago',
    },
    {
      id: 3,
      icon: FileText,
      iconBg: 'bg-slate-100 text-slate-600',
      title: (
        <>
          <span className="font-semibold text-slate-900">Q3 Performance Reviews</span> generated for{' '}
          <span className="text-slate-700">Engineering department</span>.
        </>
      ),
      time: '1 day ago',
    },
  ];

  // ─── Upcoming Anniversaries & Birthdays ─────────
  const upcomingEvents = [
    {
      id: 1,
      name: 'Emily Rodriguez',
      subtitle: '5 Year Work Anniversary',
      date: 'Tomorrow',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      id: 2,
      name: 'David Thompson',
      subtitle: 'Birthday',
      date: 'Oct 12',
      initials: 'DT',
    },
    {
      id: 3,
      name: 'Robert Chen',
      subtitle: '1 Year Work Anniversary',
      date: 'Oct 15',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ─── Top Header Overview ────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Welcome back. Here's what's happening today.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-xs">
            Last updated: Just now
          </span>
        </div>
      </div>

      {/* ─── 4 Stat Cards Grid ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-sm transition-all"
          >
            {/* Top row: Icon on left, Badge on right */}
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-2xl ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                {kpi.badgeType === 'green' && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    {kpi.badge}
                  </span>
                )}
                {kpi.badgeType === 'neutral' && (
                  <span className="text-xs font-medium text-slate-500">
                    {kpi.badge}
                  </span>
                )}
                {kpi.badgeType === 'red' && (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                    {kpi.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: Label & Large Value */}
            <div className="mt-5">
              <p className="text-xs font-medium text-slate-500">{kpi.title}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Middle Charts Row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Employee Growth Area Chart */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Employee Growth</h3>
            <button className="rounded-full border border-slate-200 px-3.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              This Year
            </button>
          </div>

          {/* Chart container with soft background */}
          <div className="w-full h-64 rounded-2xl bg-slate-100/60 p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="natural"
                  dataKey="count"
                  stroke="#5b5ef7"
                  strokeWidth={3}
                  fill="url(#growthFill)"
                  dot={false}
                  activeDot={{ r: 6, fill: '#5b5ef7', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Donut Chart */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Department Distribution</h3>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={84}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val, name) => [`${val}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Legend */}
          <div className="space-y-2.5 pt-2">
            {deptData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-medium text-slate-800">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Section ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Activity */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <Link to="/reports" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>
          <div className="space-y-5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-full ${act.iconBg} flex items-center justify-center shrink-0`}>
                  <act.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-xs">
                  <p className="text-slate-800 leading-snug">{act.title}</p>
                  <p className="text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Anniversaries & Birthdays */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-6">Upcoming Anniversaries & Birthdays</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                    {event.avatar ? (
                      <img src={event.avatar} alt={event.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-slate-600">{event.initials}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{event.name}</p>
                    <p className="text-[11px] text-slate-400">{event.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-600">{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
