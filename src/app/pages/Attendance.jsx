import React, { useEffect, useState } from 'react';
import attendanceService from '../services/attendance.service';
import leaveService from '../services/leave.service';
import employeeService from '../services/employee.service';
import departmentService from '../services/department.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Clock, Calendar, CheckCircle, AlertTriangle, User,
  Plus, Search, Filter, Check, X, UserCheck, Palmtree,
  CalendarDays, FileText, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Attendance = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'leaves'

  // Data states
  const [attendances, setAttendances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Attendance Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attSearch, setAttSearch] = useState('');
  const [attDeptFilter, setAttDeptFilter] = useState('');

  // Leave Filters
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('');

  // Modals state
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Clock-In Form State
  const [clockForm, setClockForm] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present',
    workHours: 8,
    notes: '',
  });

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    employee: '',
    type: 'annual',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    reason: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attRes, leaveRes, empRes, deptRes] = await Promise.all([
        attendanceService.getAttendances(selectedDate),
        leaveService.getLeaves(),
        employeeService.getEmployees(),
        departmentService.getDepartments(),
      ]);

      setAttendances(attRes.data || []);
      setLeaves(leaveRes.data || []);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  // Handle Attendance Save / Pointage
  const handleSaveClockIn = async (e) => {
    e.preventDefault();
    if (!clockForm.employee) {
      toast.error('Veuillez sélectionner un collaborateur');
      return;
    }
    try {
      await attendanceService.logAttendance(clockForm);
      toast.success('Pointage enregistré avec succès');
      setIsClockInModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'enregistrement du pointage');
    }
  };

  // Handle Leave Request Submit
  const handleSaveLeaveRequest = async (e) => {
    e.preventDefault();
    if (!leaveForm.employee) {
      toast.error('Veuillez sélectionner un collaborateur');
      return;
    }
    try {
      await leaveService.createLeaveRequest(leaveForm);
      toast.success('Demande de congé enregistrée avec succès');
      setIsLeaveModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la demande de congé');
    }
  };

  // Handle Leave Status Update (Approve / Reject)
  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      await leaveService.updateLeaveStatus(id, status);
      toast.success(`Demande de congé ${status === 'approved' ? 'approuvée' : 'refusée'}`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour de la demande');
    }
  };

  // Filtered Attendance List
  const filteredAttendances = attendances.filter((a) => {
    const emp = a.employee || {};
    const name = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const deptId = typeof emp.department === 'object' ? emp.department?._id : emp.department;
    
    const matchesSearch = name.includes(attSearch.toLowerCase()) || (emp.employeeCode || '').toLowerCase().includes(attSearch.toLowerCase());
    const matchesDept = !attDeptFilter || deptId === attDeptFilter;
    
    return matchesSearch && matchesDept;
  });

  // Filtered Leaves List
  const filteredLeaves = leaves.filter((l) => {
    return !leaveStatusFilter || l.status === leaveStatusFilter;
  });

  // Calculate Metrics
  const totalPresentToday = attendances.filter(a => a.status === 'present').length;
  const totalLateToday = attendances.filter(a => a.status === 'late').length;
  const totalOnLeaveToday = attendances.filter(a => a.status === 'on_leave').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;
  
  const attendanceRate = employees.length > 0 
    ? Math.round(((totalPresentToday + totalLateToday) / employees.length) * 100) 
    : 96;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="h-7 w-7 text-primary" />
            Présence & Congés
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Suivez les pointages quotidiens et gérez les demandes de congés de vos collaborateurs
          </p>
        </div>

        {/* Action Button depending on Active Tab */}
        <div className="flex items-center gap-3">
          {activeTab === 'attendance' ? (
            <button
              onClick={() => setIsClockInModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Enregistrer un Pointage
            </button>
          ) : (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Demander un Congé
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid (Matching Mockup 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Taux de Présence</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{attendanceRate}%</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-emerald-600">
            {totalPresentToday} Présents aujourd'hui
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Congés en Attente</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{pendingLeavesCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            À valider par la direction
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">En Congé Aujourd'hui</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Palmtree className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{totalOnLeaveToday}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Sur un effectif de {employees.length}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Retards Signalés</span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{totalLateToday}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-rose-500 font-medium">
            Arrivées après l'heure
          </span>
        </div>
      </div>

      {/* Navigation Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'attendance'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          Suivi des Présences (Pointages)
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'leaves'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          Gestion des Demandes de Congés
          {pendingLeavesCount > 0 && (
            <span className="ml-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-bold">
              {pendingLeavesCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ATTENDANCE TRACKING */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher collaborateur..."
                value={attSearch}
                onChange={(e) => setAttSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
              />
            </div>

            {/* Date & Dept Filter */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-200 py-1.5 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
                />
              </div>

              <select
                value={attDeptFilter}
                onChange={(e) => setAttDeptFilter(e.target.value)}
                className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
              >
                <option value="">Tous les départements</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredAttendances.length === 0 ? (
              <div className="py-12 text-center">
                <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Aucun pointage enregistré</h3>
                <p className="text-xs text-slate-400 mt-1">Aucune donnée de présence pour cette date.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-3.5 px-4">Collaborateur</th>
                      <th className="py-3.5 px-4">Département</th>
                      <th className="py-3.5 px-4">Heure Arrivée</th>
                      <th className="py-3.5 px-4">Heure Départ</th>
                      <th className="py-3.5 px-4">Heures Travaillées</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredAttendances.map((att) => {
                      const emp = att.employee || {};
                      return (
                        <tr key={att._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
                                {emp.photo?.url ? (
                                  <img src={emp.photo.url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {emp.firstName} {emp.lastName}
                                </p>
                                <p className="text-xs text-slate-400">{emp.employeeCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-600 text-xs">
                            {emp.department?.name || 'Non assigné'}
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-800 text-xs">
                            {att.checkIn ? `${att.checkIn} h` : '--:--'}
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-800 text-xs">
                            {att.checkOut ? `${att.checkOut} h` : '--:--'}
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-600 text-xs">
                            {att.checkIn && att.checkOut ? '8 h 00' : '0 h'}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                              att.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                              att.status === 'late' ? 'bg-amber-50 text-amber-700' :
                              att.status === 'on_leave' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {att.status === 'present' ? 'Présent' :
                               att.status === 'late' ? 'Retard' :
                               att.status === 'on_leave' ? 'En Congé' : 'Absent'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                setClockForm({
                                  employee: emp._id,
                                  date: selectedDate,
                                  checkIn: att.checkIn || '08:00',
                                  checkOut: att.checkOut || '17:00',
                                  status: att.status || 'present',
                                  workHours: 8,
                                  notes: att.notes || '',
                                });
                                setIsClockInModalOpen(true);
                              }}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary transition-all"
                            >
                              Modifier Pointage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE REQUESTS & APPROVALS */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Filtrer par statut:</span>
            </div>
            <select
              value={leaveStatusFilter}
              onChange={(e) => setLeaveStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-1.5 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">Aucune demande de congé</h3>
                <p className="text-xs text-slate-400 mt-1">Aucune demande ne correspond aux critères.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-3.5 px-4">Collaborateur</th>
                      <th className="py-3.5 px-4">Type de Congé</th>
                      <th className="py-3.5 px-4">Période</th>
                      <th className="py-3.5 px-4">Durée</th>
                      <th className="py-3.5 px-4">Motif</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLeaves.map((l) => {
                      const emp = l.employee || {};
                      return (
                        <tr key={l._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
                                {emp.photo?.url ? (
                                  <img src={emp.photo.url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                  {emp.firstName} {emp.lastName}
                                </p>
                                <p className="text-xs text-slate-400">{emp.department?.name || 'Département'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 text-xs capitalize">
                              {l.type === 'annual' ? 'Congé Annuel' :
                               l.type === 'sick' ? 'Congé Maladie' :
                               l.type === 'special' ? 'Événement Spécial' : 'Autre'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-slate-600">
                            Du {new Date(l.startDate).toLocaleDateString('fr-FR')} au {new Date(l.endDate).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-900 text-xs">
                            {l.daysCount} jours
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate">
                            {l.reason || '-'}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                              l.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                              l.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {l.status === 'approved' ? 'Approuvé' :
                               l.status === 'rejected' ? 'Refusé' : 'En attente'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-1.5">
                            {l.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateLeaveStatus(l._id, 'approved')}
                                  title="Approuver"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateLeaveStatus(l._id, 'rejected')}
                                  title="Refuser"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clock-In Modal */}
      {isClockInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Enregistrer un Pointage</h3>
              <button
                onClick={() => setIsClockInModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClockIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collaborateur *</label>
                <select
                  value={clockForm.employee}
                  onChange={(e) => setClockForm(prev => ({ ...prev, employee: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner un collaborateur</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.firstName} {e.lastName} ({e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={clockForm.date}
                  onChange={(e) => setClockForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heure d'arrivée</label>
                  <input
                    type="time"
                    value={clockForm.checkIn}
                    onChange={(e) => setClockForm(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heure de départ</label>
                  <input
                    type="time"
                    value={clockForm.checkOut}
                    onChange={(e) => setClockForm(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
                <select
                  value={clockForm.status}
                  onChange={(e) => setClockForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="present">Présent</option>
                  <option value="late">Retard</option>
                  <option value="absent">Absent</option>
                  <option value="on_leave">En Congé</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClockInModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Demander un Congé</h3>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeaveRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collaborateur *</label>
                <select
                  value={leaveForm.employee}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, employee: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner un collaborateur</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.firstName} {e.lastName} ({e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Congé</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="annual">Congé Annuel</option>
                  <option value="sick">Congé Maladie</option>
                  <option value="special">Événement Spécial (Mariage/Naissance)</option>
                  <option value="other">Autre / Sans solde</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motif (Optionnel)</label>
                <textarea
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Précisez la raison de la demande..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Soumettre la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
