import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left side: branding/illustration */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-12 text-white lg:flex relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl shadow-md shadow-blue-500/30">
            HN
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white">
              HR<span className="text-blue-400">Nova</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Enterprise Suite
            </span>
          </div>
        </Link>
        
        <div className="my-auto space-y-6 relative z-10 max-w-lg">
          <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-bold text-blue-300">
            PLATEFORME RH UNIFIÉE
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Pilotez vos équipes et vos opérations à grande échelle.
          </h1>
          <p className="text-base text-slate-300 font-normal leading-relaxed">
            Une suite d'outils intelligents pour automatiser votre gestion RH, de l'onboarding collaborateur jusqu'à la paie et la performance.
          </p>
        </div>

        <div className="text-xs text-slate-400 relative z-10 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} HRNova. Tous droits réservés.</span>
          <Link to="/" className="text-blue-400 hover:underline">← Retour à l'accueil</Link>
        </div>
      </div>

      {/* Right side: form area */}
      <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-1/2 bg-slate-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
