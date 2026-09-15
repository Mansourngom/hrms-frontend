import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, CreditCard, Calendar, Clock, Award,
  GraduationCap, FileText, Shield, BarChart3, Lock, CheckCircle2,
  ArrowRight, Play, Star, Sparkles, Building2, ChevronRight,
  ShieldCheck, Check, Phone, Globe, Cpu, Zap, HeartHandshake,
  FileCheck, Laptop, Send, UserCheck, Layers
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const previewChartData = [
  { month: 'Jan', count: 180 },
  { month: 'Fév', count: 240 },
  { month: 'Mar', count: 260 },
  { month: 'Avr', count: 480 },
  { month: 'Mai', count: 450 },
  { month: 'Juin', count: 640 },
  { month: 'Juil', count: 520 },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-500 selection:text-white">

      {/* ─── 1. NAVBAR HEADER ───────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo HRNova */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              HN
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                HR<span className="text-blue-600">Nova</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Enterprise Suite
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Fonctionnalités</a>
            <a href="#workflows" className="hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#ecosystem" className="hover:text-blue-600 transition-colors">Écosystème</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Sécurité</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Témoignages</a>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Démarrer l'essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO SECTION ────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-blue-100/50 to-indigo-100/40 blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Release Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/70 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xs mb-8">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            La plateforme RH unifiée de nouvelle génération est disponible
            <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
          </div>

          {/* Main Title */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.15]">
            Le Système RH Unifié pour Piloter vos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              Talents & Opérations
            </span>{' '}
            à Grande Échelle
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Une plateforme tout-en-un puissante, intelligente et intuitive. De la paie automatisée au recrutement prédictif, offrez à vos équipes et managers l'envergure d'exceller au quotidien.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/25 hover:bg-blue-700 hover:scale-102 transition-all cursor-pointer"
            >
              Démarrer l'essai gratuit de 14 jours
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#ecosystem"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-slate-700" />
              Découvrir les modules
            </a>
          </div>

          {/* Social Proof Logos */}
          <div className="mt-14 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Plébiscité par les leaders et entreprises en forte croissance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-black text-sm tracking-wider opacity-75">
              <span>TECHCORP</span>
              <span>SCALEUP.</span>
              <span>GLOBAL FINANCE</span>
              <span>INNOV&CO</span>
              <span>HELIX BIO</span>
            </div>
          </div>

          {/* ─── Hero Floating Dashboard Mockup ─── */}
          <div className="mt-12 rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/60 max-w-5xl mx-auto text-left">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-1 text-[11px] font-medium text-slate-500">
                https://app.hrnova.com/dashboard/overview
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                ● Synchronisé
              </span>
            </div>

            {/* Dashboard Inner Preview */}
            <div className="space-y-4">
              {/* 4 Mini stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block">Effectif Global</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-slate-900">1,248</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-1.5 py-0.5 rounded">↑ 2.4%</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block">Satisfaction RH</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-slate-900">99.4%</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">eNPS Q3</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block">Masse Salariale</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-slate-900">142,500 €</span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded">100% Paie</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block">Pipeline Recrutement</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-slate-900">92.8%</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/60 px-1.5 py-0.5 rounded">18 Postes</span>
                  </div>
                </div>
              </div>

              {/* Chart & Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Dynamique d'Embauche & Rétention</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">2026 Annuel</span>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={previewChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Area type="natural" dataKey="count" stroke="#2563eb" strokeWidth={2.5} fill="url(#heroGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-2">Actions Rapides RH</span>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate">Contrat CDI Marie N.</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Signé</span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate">Congé Cheikh D.</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Approuvé</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="text-[11px] font-bold text-blue-600 hover:underline mt-2">
                    Accéder à votre espace ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. KEY METRICS BANNER ──────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">40%</p>
              <h4 className="text-sm font-bold text-slate-800 mt-2">De temps gagné</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Sur la gestion administrative quotidienne des fiches et saisies RH.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">99.98%</p>
              <h4 className="text-sm font-bold text-slate-800 mt-2">Conformité Légale & RGPD</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Veille conventionnelle permanente et gestion sécurisée des données collaborateurs.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">3x</p>
              <h4 className="text-sm font-bold text-slate-800 mt-2">Vitesse de recrutement</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Accélération du processus candidat grâce au scoring intelligent par IA.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">150+</p>
              <h4 className="text-sm font-bold text-slate-800 mt-2">Filiales & Multi-devises</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Consolidation multi-pays (F CFA, Euro, Dollar) en temps réel.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. 9 MODULES ECOSYSTEM ─────────────────────────── */}
      <section id="ecosystem" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
              Suite RH Tout-en-Un Complète
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Un Écosystème Intégré de 9 Modules Haute Précision
            </h2>
            <p className="mt-4 text-base text-slate-500">
              Chaque brique s'articule parfaitement pour vous offrir une expérience fluide, sans silos ni ressaisies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 1. Recrutement & ATS */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Recrutement & ATS</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Pipeline candidat intelligent, multidiffusion sur jobboards, entretiens automatisés et matching de profils par IA prédictive.
                </p>
              </div>
              <Link to="/recruitment" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Découvrir le module ATS ➔
              </Link>
            </div>

            {/* 2. Paie & Rémunération */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Paie & Rémunération</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Génération des bulletins certifiés, calculs automatisés (primes, cotisations, avances) et génération de fichiers SEPA / bancaires.
                </p>
              </div>
              <Link to="/payroll" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Parcourir le module Paie ➔
              </Link>
            </div>

            {/* 3. Gestion des Congés & Présences */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Gestion des Congés & Présences</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Pointage digitalisé en temps réel, planning d'équipes synchronisé, calcul automatique des RTT, CP et alertes des absences.
                </p>
              </div>
              <Link to="/attendance" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Gérer les congés & pointages ➔
              </Link>
            </div>

            {/* 4. Performance & Entretiens */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Performance & Entretiens</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Suivi des objectifs OKR, cycles d'entretiens annuels et professionnels, feedback 360°, et cartographie dynamique des talents.
                </p>
              </div>
              <Link to="/performance" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Découvrir le module Performance ➔
              </Link>
            </div>

            {/* 5. Formation & LMS */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Formation & LMS</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Parcours d'apprentissage personnalisés, catalogue de formations internes, décompte des budgets et suivi des compétences.
                </p>
              </div>
              <Link to="/learning" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Découvrir le module LMS ➔
              </Link>
            </div>

            {/* 6. Documents & e-Signature */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Documents & e-Signature</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Coffre-fort numérique personnel certifié, signature électronique aux normes eIDAS, et archivage d'entreprise sécurisé.
                </p>
              </div>
              <Link to="/documents" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Sécuriser les documents ➔
              </Link>
            </div>

            {/* 7. Gestion Administrative & Employés */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Dossier Collaborateur & Structure</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Dossier collaborateur 360°, organigramme hiérarchique temps réel, gestion du matériel et synchronisation des situations contractuelles.
                </p>
              </div>
              <Link to="/employees" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Gérer les effectifs ➔
              </Link>
            </div>

            {/* 8. Rapports & People Analytics */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Rapports & People Analytics</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Index d'égalité professionnelle, taux de rotation (turnover), prévisions de masse salariale et tableaux de bord exportables en PDF & Excel.
                </p>
              </div>
              <Link to="/reports" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Découvrir l'Analytics RH ➔
              </Link>
            </div>

            {/* 9. Sécurité & Gouvernance */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sécurité & Gouvernance</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Gestion fine des privilèges selon rôles (RBAC), double authentification, traçabilité exhaustive des actions et conformité ISO/RGPD.
                </p>
              </div>
              <Link to="/settings" className="mt-6 text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                Découvrir la Gouvernance ➔
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. WORKFLOWS & AUTOMATION ──────────────────────── */}
      <section id="workflows" className="border-t border-slate-100 bg-slate-50/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                Workflows & Automatisation
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Automatisation Intelligente de vos Processus Métiers
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Libérez vos équipes des tâches manuelles répétitives. Orchestrez des parcours d'accueil sur-mesure, configurez des relances automatiques et synchronisez les changements de situation sans aucune ligne de code.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Onboarding complet en moins de 15 minutes</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Attribution des technologies, création du contrat et accès aux outils dès l'arrivée.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Alertes et rappels de conformité programmés</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Notification automatique des fins de périodes d'essai, visites médicales et renouvellements.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Synchronisation directe RH et comptabilité</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Fiches de paie, virements et déclarations sans aucune resaisie.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Workflow Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" /> Workflow : Onboarding Développeur
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Actif
                  </span>
                </div>

                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Signature Promesse d'Embauche</p>
                      <p className="text-[10px] text-slate-400">Via signature eIDAS certifiée</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Création automatique des comptes IT</p>
                      <p className="text-[10px] text-slate-400">Google Workspace, Slack, Jira & ERP Cloud</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Attribution Matériel & Bienvenue RH</p>
                      <p className="text-[10px] text-blue-600 font-medium">Expédition ordi et kit d'onboarding</p>
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 6. SECURITY & INFRASTRUCTURE ───────────────────── */}
      <section id="security" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* 4 Badges Left */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                <p className="text-xl font-black text-slate-900">ISO 27001</p>
                <p className="text-xs text-slate-500 mt-1">Audit annuel, sécurité physique et logique certifiée.</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                <p className="text-xl font-black text-slate-900">SecNumCloud</p>
                <p className="text-xs text-slate-500 mt-1">Conformité aux recommandations de l'ANSSI.</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                <p className="text-xl font-black text-slate-900">AES-256</p>
                <p className="text-xs text-slate-500 mt-1">Chiffrement militaire de bout en bout au repos & transit.</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                <p className="text-xl font-black text-slate-900">99.99%</p>
                <p className="text-xs text-slate-500 mt-1">SLA garanti sur l'ensemble de nos serveurs souverains.</p>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                Infrastructure de Classe Entreprise
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Sécurité et Conformité Sans le Moindre Compromis
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Vos données RH constituent les actifs les plus sensibles de votre entreprise. HRNova applique les plus hauts standards de souveraineté et de protection des données.
              </p>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-blue-600 shrink-0" />
                  Contrôle d'accès granulaire et authentification SSO / SAML 2.0
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  Journalisation immuable de chaque consultation et modification
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                  Sauvegardes chiffrées automatiques toutes les 15 minutes
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 7. TESTIMONIAL ─────────────────────────────────── */}
      <section id="testimonials" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Star rating */}
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400" />
            ))}
            <span className="ml-2 text-xs font-bold text-slate-700">Note 4.9/5</span>
          </div>

          <blockquote className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
            « HRNova a transformé notre direction des ressources humaines. Nos managers ont gagné <span className="text-blue-600">12 heures par semaine</span> et l'adoption par nos 1 200 employés a été immédiate dès le premier jour. C'est l'outil RH le plus élégant et performant du marché. »
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Marc de Courcelles"
              className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Marc de Courcelles</p>
              <p className="text-xs text-slate-500">Directeur des Ressources Humaines Groupe · Anthracite Technologies</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 8. CALL TO ACTION BANNER ───────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#091124] p-10 sm:p-16 text-center text-white shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-block rounded-full bg-blue-500/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 border border-blue-500/30">
                Déploiement Rapide en 48 Heures
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                Prêt à révolutionner l'expérience collaborateur dans votre organisation ?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Rejoignez les leaders qui réinventent le futur du travail dès aujourd'hui. Profitez d'un audit de vos processus offert par nos consultants certifiés.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Commencer gratuitement l'essai de 14 jours
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-700 bg-white/5 px-7 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  Contacter un expert commercial
                </Link>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Test gratuit de 14 jours</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Sans engagement de durée</span>
                <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-blue-400" /> Migration des données assistée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-slate-50/70 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Brand column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-base shadow-sm">
                  HN
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  HR<span className="text-blue-600">Nova</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                La suite RH intégrée conçue pour les entreprises en quête de performance RH, d'automatisation sans faille et de satisfaction collaborateur.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Opérationnel & Sécurisé
              </div>
            </div>

            {/* Column: Produit */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Produit</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#ecosystem" className="hover:text-blue-600">Modules RH</a></li>
                <li><a href="#workflows" className="hover:text-blue-600">Automatisations</a></li>
                <li><a href="#security" className="hover:text-blue-600">Sécurité & Conformité</a></li>
                <li><Link to="/reports" className="hover:text-blue-600">People Analytics</Link></li>
              </ul>
            </div>

            {/* Column: Entreprise */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Entreprise</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#" className="hover:text-blue-600">À propos</a></li>
                <li><a href="#" className="hover:text-blue-600">Carrières</a></li>
                <li><a href="#" className="hover:text-blue-600">Centre d'Aide</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>

            {/* Column: Légal */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Légal</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-blue-600">Confidentialité RGPD</a></li>
                <li><a href="#" className="hover:text-blue-600">Gestion des Cookies</a></li>
                <li><a href="#" className="hover:text-blue-600">Conditions Générales</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-200/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 HRNova Inc. Tous droits réservés. HR Management System.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-900">Twitter</a>
              <a href="#" className="hover:text-slate-900">LinkedIn</a>
              <a href="#" className="hover:text-slate-900">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
