import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Briefcase,
  Users,
  Compass,
  Laptop
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import reportService from '../services/report.service';
import { toast } from 'react-hot-toast';

const Reports = () => {
  const [costPeriod, setCostPeriod] = useState('annuel'); // 'mensuel' | 'annuel'

  const handleExportExcel = async () => {
    try {
      const data = await reportService.exportEmployeesExcel();
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Rapport Excel téléchargé !');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'export Excel");
    }
  };

  const handleExportPdf = async () => {
    try {
      const data = await reportService.exportEmployeesPdf();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Rapport PDF téléchargé !');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'export PDF");
    }
  };

  // Mock data for graphs matching Mockup 1 layout
  const departmentData = [
    { name: 'R&D', employees: 320 },
    { name: 'Sales', employees: 450 },
    { name: 'Mktg', employees: 180 },
    { name: 'Support', employees: 210 },
    { name: 'Admin', employees: 88 },
  ];

  const genderData = [
    { name: 'Femmes', value: 48, color: '#3b82f6' }, // blue/violet
    { name: 'Hommes', value: 50, color: '#1e3a8a' }, // dark blue
    { name: 'Non binaire / Autre', value: 2, color: '#94a3b8' }, // slate gray
  ];

  const costAnalysisData = [
    {
      dept: 'Recherche & Dév.',
      icon: Laptop,
      color: 'text-blue-600 bg-blue-50',
      count: 320,
      avgSalary: 68500,
      totalCost: 21900000,
      percent: 43,
      trend: '+2.4%',
      trendType: 'up'
    },
    {
      dept: 'Ventes (Sales)',
      icon: Briefcase,
      color: 'text-emerald-600 bg-emerald-50',
      count: 450,
      avgSalary: 45200,
      totalCost: 20300000,
      percent: 40,
      trend: '-1.1%',
      trendType: 'down'
    },
    {
      dept: 'Marketing',
      icon: Compass,
      color: 'text-indigo-600 bg-indigo-50',
      count: 180,
      avgSalary: 52000,
      totalCost: 9300000,
      percent: 12,
      trend: '0.0%',
      trendType: 'neutral'
    }
  ];

  const metrics = [
    {
      title: 'TOTAL EMPLOYÉS',
      value: '1,248',
      change: '+4.2%',
      changeType: 'up',
      period: 'vs. mois dernier',
      bgClass: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'TAUX DE TURNOVER',
      value: '8.4%',
      change: '+1.1%',
      changeType: 'down', // rising turnover is generally negative
      period: 'Annuel glissant',
      bgClass: 'bg-rose-50 text-rose-700'
    },
    {
      title: 'COÛTS SALARIAUX (MENSUELS)',
      value: '4.2M F CFA',
      change: '-0.5%',
      changeType: 'up', // lower costs is generally positive
      period: 'vs. budget alloué',
      bgClass: 'bg-emerald-50 text-emerald-700'
    },
    {
      title: 'ANCIENNETÉ MOYENNE',
      value: '4.6 ans',
      change: 'Stable',
      changeType: 'neutral',
      period: 'Stable sur 6 mois',
      bgClass: 'bg-slate-55 bg-slate-50 text-slate-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Rapports et Analytics</h2>
          <p className="text-sm text-slate-500 font-medium">Aperçu détaillé des métriques clés des ressources humaines.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            Export PDF
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Excel
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{metric.title}</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">{metric.value}</span>
              <span className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-xs font-semibold ${metric.bgClass}`}>
                {metric.changeType === 'up' && <TrendingUp className="h-3 w-3" />}
                {metric.changeType === 'down' && <TrendingDown className="h-3 w-3" />}
                {metric.change}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-450 font-medium">{metric.period}</p>
          </div>
        ))}
      </div>

      {/* Graphs Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Breakdown BarChart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-950">Répartition par Département</h3>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-750">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="employees" fill="#0256d6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Diversity DonutChart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-950">Diversité & Genre</h3>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-750">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative flex-1 flex items-center justify-center min-h-[200px]">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Center Text Ratio */}
            <div className="absolute flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium">Ratio</span>
              <span className="text-sm font-bold text-blue-900">48/50</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 mt-4">
            {genderData.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-slate-500 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-800">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Cost Analysis Table */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Analyse des Coûts Salariaux</h3>
          <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-100">
            <button
              onClick={() => setCostPeriod('mensuel')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                costPeriod === 'mensuel' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setCostPeriod('annuel')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                costPeriod === 'annuel' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Annuel
            </button>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4">Département</th>
                <th className="py-4">Effectif</th>
                <th className="py-4">Salaire Moyen (Annuel)</th>
                <th className="py-4">Masse Salariale Totale</th>
                <th className="py-4">% du Total</th>
                <th className="py-4">Tendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {costAnalysisData.map((row, idx) => {
                // Adjust figures if period is monthly
                const avgSalary = costPeriod === 'mensuel' ? Math.round(row.avgSalary / 12) : row.avgSalary;
                const totalCost = costPeriod === 'mensuel' ? (row.totalCost / 12).toFixed(1) + 'M' : (row.totalCost / 1000000).toFixed(1) + 'M';

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2 shrink-0 ${row.color}`}>
                          <row.icon className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-800">{row.dept}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-600">{row.count}</td>
                    <td className="py-4 font-semibold text-slate-800">
                      {avgSalary.toLocaleString('fr-FR')} F CFA
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {totalCost} F CFA
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 max-w-[120px]">
                        <span className="text-xs font-semibold text-slate-500 w-8">{row.percent}%</span>
                        <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${row.percent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        row.trendType === 'up' ? 'text-rose-600' : 
                        row.trendType === 'down' ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {row.trendType === 'up' && <ArrowUpRight className="h-4 w-4" />}
                        {row.trendType === 'down' && <ArrowDownRight className="h-4 w-4" />}
                        {row.trendType === 'neutral' && <Minus className="h-4 w-4" />}
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
