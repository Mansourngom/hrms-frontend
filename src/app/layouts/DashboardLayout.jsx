import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard, Users, CreditCard, Clock, Briefcase,
  TrendingUp, GraduationCap, FileText, BarChart3, Settings,
  HelpCircle, LogOut, Bell, MessageSquare, Search, Menu,
  X, ChevronDown, User, ChevronLeft, ChevronRight, Globe,
  Shield, Check, Send, Sparkles, BookOpen, LifeBuoy, Moon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
  const { user, logout, activeRole, setActiveRole } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Layout States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dropdown States
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [viewModeDropdownOpen, setViewModeDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Demande de congé déposée', text: 'Cheikh Diop a soumis une demande de 2 jours', time: 'Il y a 10 mn', read: false, type: 'leave' },
    { id: 2, title: 'Bulletin de paie disponible', text: 'Les fiches de paie du mois d\'Août sont prêtes', time: 'Il y a 2 heures', read: false, type: 'payroll' },
    { id: 3, title: 'Nouvelle candidature', text: 'Ousmane Camara a postulé comme Dev Fullstack', time: 'Hier', read: false, type: 'recruitment' },
  ]);

  // Messages State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Marie Ndiaye', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', text: 'Bonjour ! As-tu pu valider la note de frais du déplacement ?', time: '10:42' },
    { id: 2, sender: 'Cheikh Diop', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', text: 'Merci beaucoup pour l\'envoi de l\'attestation de travail !', time: '09:15' },
  ]);

  const [chatInput, setChatInput] = useState('');

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSelectRoleView = (roleKey, roleLabel) => {
    setActiveRole(roleKey);
    setViewModeDropdownOpen(false);
    toast.success(`Vue et restrictions basculées en : ${roleLabel}`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user ? `${user.firstName} ${user.lastName}` : 'Vous',
      avatar: user?.avatar?.url || '',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [newMsg, ...prev]);
    setChatInput('');
    toast.success('Message envoyé !');
  };

  const allMenuItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'hr_director', 'manager', 'employee'] },
    { name: t('employees'), path: '/employees', icon: Users, roles: ['admin', 'hr_director', 'manager', 'employee'] },
    { name: t('payroll'), path: '/payroll', icon: CreditCard, roles: ['admin', 'hr_director', 'employee'] }, // Hidden for manager
    { name: t('attendance'), path: '/attendance', icon: Clock, roles: ['admin', 'hr_director', 'manager', 'employee'] },
    { name: t('recruitment'), path: '/recruitment', icon: Briefcase, roles: ['admin', 'hr_director', 'manager'] }, // Hidden for employee
    { name: t('performance'), path: '/performance', icon: TrendingUp, roles: ['admin', 'hr_director', 'manager', 'employee'] },
    { name: t('learning'), path: '/learning', icon: GraduationCap, roles: ['admin', 'hr_director', 'manager', 'employee'] },
    { name: t('documents'), path: '/documents', icon: FileText, roles: ['admin', 'hr_director', 'manager', 'employee'] },
    { name: t('reports'), path: '/reports', icon: BarChart3, roles: ['admin', 'hr_director'] }, // Hidden for manager & employee
    { name: t('settings'), path: '/settings', icon: Settings, roles: ['admin'] }, // Hidden for manager & employee
  ];

  // Dynamic Filtering based on activeRole
  const menuItems = allMenuItems.filter(item => item.roles.includes(activeRole || 'admin'));

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  const roleViews = [
    { key: 'admin', label: '👑 Vue Administrateur & RH' },
    { key: 'manager', label: '👔 Vue Manager d\'Équipe' },
    { key: 'employee', label: '👤 Vue Collaborateur' },
  ];

  const activeRoleLabel = roleViews.find(r => r.key === activeRole)?.label || '👑 Vue Administrateur & RH';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-45 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800/50 bg-[#0f172a] transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-slate-700/50 relative">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-350 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base shadow-md shadow-blue-500/20">
              HN
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <h1 className="text-base font-bold text-white leading-tight">HRNova</h1>
                <p className="text-xs text-slate-400 font-medium">Enterprise Suite</p>
              </div>
            )}
          </div>
          
          {/* Mobile close button */}
          <button
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop collapse toggle button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-[#1e293b] text-slate-400 shadow-sm hover:bg-slate-700 transition-all hover:text-white"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Role View Badge Indicator */}
        {!sidebarCollapsed && (
          <div className="mx-4 mt-3 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-300 truncate">{activeRoleLabel}</span>
          </div>
        )}

        {/* Action Button */}
        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={sidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#5b5ef7] text-white shadow-lg shadow-[#5b5ef7]/25 font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center px-0 py-3.5' : ''}`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Quick Action Button */}
        <div className="p-4 border-t border-slate-800/60">
          {sidebarCollapsed ? (
            <button
              onClick={() => navigate('/attendance')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 shadow-md mx-auto transition-all"
              title="Quick Action"
            >
              <span className="text-lg font-bold">+</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/attendance')}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b101b] border border-slate-700/80 py-3 text-sm font-medium text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span className="text-base font-bold">+</span> Quick Action
            </button>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800/40 p-3 space-y-1">
          <button
            onClick={() => setHelpModalOpen(true)}
            title={sidebarCollapsed ? t('helpCenter') : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{t('helpCenter')}</span>}
          </button>
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? t('logout') : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all text-left ${
              sidebarCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Navbar */}
        <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-6 shrink-0 z-40">
          {/* Search bar & Toggle menu */}
          <div className="flex flex-1 items-center gap-4">
            <button
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search employees, documents..."
                className="w-full rounded-full border border-slate-200/80 bg-slate-100/70 py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Action Icons */}
            <div className="flex items-center gap-1.5 border-r border-slate-100 pr-3 sm:pr-4">
              
              {/* 🔔 Notifications Button & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setMessagesOpen(false);
                  }}
                  className="relative rounded-full p-2.5 text-slate-600 hover:bg-slate-100 transition-all"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ring-1 ring-slate-100 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" /> Notifications
                        </h4>
                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            className="text-[11px] font-semibold text-primary hover:underline"
                          >
                            Tout marquer lu
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              n.read ? 'border-slate-100 bg-white opacity-70' : 'border-primary/20 bg-primary/5 font-semibold'
                            }`}
                          >
                            <p className="text-slate-900 font-bold">{n.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">{n.text}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 💬 Messages Button & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setMessagesOpen(!messagesOpen);
                    setNotificationsOpen(false);
                  }}
                  className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
                  title="Discussions"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                </button>

                {messagesOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMessagesOpen(false)} />
                    <div className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ring-1 ring-slate-100 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" /> Messages Internes
                        </h4>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {messages.map((m) => (
                          <div key={m.id} className="flex gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                              {m.avatar ? (
                                <img src={m.avatar} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <User className="h-4 w-4 text-slate-400 m-2" />
                              )}
                            </div>
                            <div className="flex-1 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">{m.sender}</span>
                                <span className="text-[10px] text-slate-400">{m.time}</span>
                              </div>
                              <p className="text-slate-600 mt-0.5 leading-tight">{m.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder="Répondre..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 py-1.5 px-3 text-xs outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="rounded-xl bg-primary p-1.5 text-white hover:bg-primary-hover transition-all"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>

              {/* 🌙 Dark Mode / Theme Toggle Icon */}
              <button
                onClick={() => toast.success('Mode sombre bientôt disponible')}
                className="rounded-full p-2.5 text-slate-600 hover:bg-slate-100 transition-all"
                title="Mode Sombre"
              >
                <Moon className="h-5 w-5" />
              </button>

              {/* ❓ Help Button */}
              <button
                onClick={() => setHelpModalOpen(true)}
                className="rounded-full p-2.5 text-slate-600 hover:bg-slate-100 transition-all"
                title="Aide & Support"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 uppercase"
              >
                <Globe className="h-4 w-4 text-slate-500" />
                <span>{language}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-36 rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-slate-100">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left ${
                          language === lang.code
                            ? 'bg-primary-light text-primary font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {language === lang.code && <span className="text-[10px] uppercase font-bold">●</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 🔄 Switch View button (ROLE SWITCHER) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setViewModeDropdownOpen(!viewModeDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Shield className="h-4 w-4 text-primary" />
                <span>{activeRoleLabel.split(' ')[1]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {viewModeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setViewModeDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 z-50 w-64 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-slate-100">
                    <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-50">
                      Changer les droits & la vue
                    </p>
                    {roleViews.map((rv) => (
                      <button
                        key={rv.key}
                        onClick={() => handleSelectRoleView(rv.key, rv.label)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs text-left transition-all ${
                          activeRole === rv.key
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{rv.label}</span>
                        {activeRole === rv.key && <Check className="h-3.5 w-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50 text-left transition-all"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="h-9 w-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user ? `${user.firstName} ${user.lastName}` : 'Chargement...'}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 capitalize">
                    {activeRole ? activeRole.replace('_', ' ') : 'Employé'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden xl:block" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-lg ring-1 ring-slate-100">
                    <div className="px-3 py-2 border-b border-slate-50">
                      <p className="text-sm font-semibold text-slate-900">
                        {user ? `${user.firstName} ${user.lastName}` : ''}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4" />
                      <span>{t('profile')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Modal: Help & Support */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold text-slate-900">Centre d'Aide & FAQ Nexus HR</h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900 text-sm">💡 Comment fonctionne la gestion des rôles ?</p>
                <p className="text-slate-500">
                  Utilisez le bouton <strong>Changement de vue</strong> dans la barre supérieure pour permuter instantanément entre la Vue Administrateur RH, la Vue Manager et la Vue Collaborateur, et observer les restrictions de menu et d'actions associées.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900 text-sm">💳 Comment télécharger un bulletin de paie ?</p>
                <p className="text-slate-500">
                  Rendez-vous dans la rubrique <strong>Paie</strong>, puis cliquez sur le bouton <strong>"Bulletin"</strong> pour ouvrir la modale d'impression moderne et télécharger le PDF.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900 text-sm">🌐 Comment changer la langue de l'interface ?</p>
                <p className="text-slate-500">
                  Utilisez le sélecteur de langue <strong>FR / EN / ES</strong> situé dans la barre supérieure à droite.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm"
              >
                Fermer l'aide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
