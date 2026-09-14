import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import reportService from '../services/report.service';
import employeeService from '../services/employee.service';
import { mockDb } from '../services/mockDb';
import {
  Users, Calendar, Briefcase, ClipboardList, TrendingUp,
  ArrowUpRight, UserPlus, FileCheck, Cake, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // ─── KPI Data ───────────────────────────────────
  const totalEmployees = stats?.employees ?? employees.length ?? 0;
  const leavesPending = stats?.leavesPending ?? 0;
  const recruitments = stats?.recruitments ?? 0;
  const pendingEvaluations = (mockDb.getGoals?.() || []).filter(g => g.status === 'in_progress').length || 3;

  const kpis = [
    {
      title: 'Total Employés',
      value: totalEmployees,
      badge: '↑ 2.4%',
      badgeColor: 'text-emerald-600 bg-emerald-50',
      icon: Users,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'En Congé Aujourd\'hui',
      value: leavesPending,
      badge: "Aujourd'hui",
      badgeColor: 'text-slate-600 bg-slate-100',
      icon: Calendar,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Postes Ouverts',
      value: recruitments,
      badge: '↑ 5',
      badgeColor: 'text-blue-600 bg-blue-50',
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Évaluations en Attente',
      value: pendingEvaluations,
      badge: 'Action Requise',
      badgeColor: 'text-rose-600 bg-rose-50',
      icon: ClipboardList,
      iconBg: 'bg-slate-100 text-slate-600',
    },
  ];

  // ─── Employee Growth Chart Data ─────────────────
  const growthData = [
    { month: 'Jan', count: Math.max(totalEmployees - 8, 5) },
    { month: 'Fév', count: Math.max(totalEmployees - 6, 7) },
    { month: 'Mar', count: Math.max(totalEmployees - 5, 8) },
    { month: 'Avr', count: Math.max(totalEmployees - 7, 6) },
    { month: 'Mai', count: Math.max(totalEmployees - 3, 10) },
    { month: 'Juin', count: Math.max(totalEmployees - 1, 12) },
    { month: 'Juil', count: totalEmployees },
  ];

  // ─── Department Distribution Data ───────────────
  const departments = mockDb.getDepartments?.() || [];
  const deptDistribution = departments.length > 0
    ? departments.map((d) => {
        const deptEmps = employees.filter(e => (typeof e.department === 'object' ? e.department?._id : e.department) === d._id);
        return { name: d.name, value: deptEmps.length || 1 };
      })
    : [
        { name: 'Recherche & Dév.', value: 45 },
        { name: 'Ventes (Sales)', value: 35 },
        { name: 'Marketing', value: 20 },
      ];

  const deptTotal = deptDistribution.reduce((s, d) => s + d.value, 0);
  const DONUT_COLORS = ['#1e293b', '#6366f1', '#334155'];

  // ─── Recent Activity ────────────────────────────
  const recentActivities = [
    {
      icon: UserPlus,
      iconBg: 'bg-blue-50 text-blue-600',
      text: <><strong>{employees[0]?.firstName || 'Marie'} {employees[0]?.lastName || 'Ndiaye'}</strong> a été embauchée comme <strong>{employees[0]?.position?.title || 'Ingénieur Dév.'}</strong></>,
      time: 'Il y a 2 heures',
    },
    {
      icon: FileCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
      text: <>Demande de congé approuvée pour <strong>{employees[1]?.firstName || 'Cheikh'} {employees[1]?.lastName || 'Diop'}</strong>.</>,
      time: 'Il y a 5 heures',
    },
    {
      icon: ClipboardList,
      iconBg: 'bg-purple-50 text-purple-600',
      text: <>Évaluations de performance T3 générées pour le département <strong>Recherche & Dév.</strong></>,
      time: 'Il y a 1 jour',
    },
  ];

  // ─── Upcoming Anniversaries & Birthdays ─────────
  const upcomingEvents = employees.slice(0, 3).map((emp, idx) => {
    const hireDate = emp.hireDate ? new Date(emp.hireDate) : null;
    const now = new Date();
    const yearsWorked = hireDate ? now.getFullYear() - hireDate.getFullYear() : idx + 1;
    const isBirthday = idx === 1;

    return {
      name: `${emp.firstName} ${emp.lastName}`,
      photo: emp.photo?.url,
      initials: `${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`,
      event: isBirthday ? 'Anniversaire' : `${yearsWorked} ans d'ancienneté`,
      date: idx === 0 ? 'Demain' : idx === 1 ? '12 Oct' : '15 Oct',
    };
  });

  return (
    <div className="space-y-6">

      {/* ─── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">
            Bienvenue, {user?.firstName || 'Admin'}. Voici un résumé de l'activité RH d'aujourd'hui.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm self-start sm:self-auto">
          Dernière mise à jour : À l'instant
        </span>
      </div>

      {/* ─── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-bold ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-500">{kpi.title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">{kpi.value.toLocaleString('fr-FR')}</p>
          </div>
        ))}
      </div>

      {/* ─── Charts Row ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Employee Growth Area Chart */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">Évolution des Effectifs</h3>
            <span className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              Cette Année
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#growthGradient)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#6366f1' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution Donut */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Répartition par Département</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={deptDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {deptDistribution.map((_, index) => (
                  <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value, name) => [`${value} employé(s)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-2">
            {deptDistribution.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                  ></span>
                  <span className="font-medium text-slate-700">{d.name}</span>
                </div>
                <span className="font-bold text-slate-900">
                  {deptTotal > 0 ? Math.round((d.value / deptTotal) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Row ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900">Activité Récente</h3>
            <Link to="/reports" className="text-xs font-semibold text-primary hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className={`h-9 w-9 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0`}>
                  <act.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-slate-700 leading-snug">{act.text}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Anniversaries & Birthdays */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5">Anniversaires & Événements à venir</h3>
          <div className="space-y-4">
            {upcomingEvents.map((ev, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                    {ev.photo ? (
                      <img src={ev.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-500">{ev.initials}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{ev.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      {ev.event.includes('Anniversaire') ? <Cake className="h-3 w-3" /> : <Award className="h-3 w-3" />}
                      {ev.event}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600">{ev.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
