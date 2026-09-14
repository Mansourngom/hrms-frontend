import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left side: branding/illustration */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary font-bold text-lg shadow-sm">
            N
          </div>
          <span className="text-xl font-bold tracking-wide">Nexus HR</span>
        </div>
        
        <div className="my-auto space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Gérez vos équipes en toute simplicité
          </h1>
          <p className="text-lg text-blue-100 font-medium">
            Une suite d'outils professionnels pour piloter vos Ressources Humaines, du recrutement jusqu'à la paie.
          </p>
        </div>

        <div className="text-sm text-blue-200">
          &copy; {new Date().getFullYear()} Nexus HR. Tous droits réservés.
        </div>
      </div>

      {/* Right side: form area */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-slate-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
