import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      const otp = response.data?.otp;
      
      if (otp) {
        toast.success(`[DEV MODE] Votre code OTP est: ${otp}`);
      } else {
        toast.success("Un e-mail contenant le code de réinitialisation a été envoyé");
      }
      
      // Navigate to reset password page, passing the email in state
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Erreur lors de la demande';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/50">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h2>
        <p className="mt-2 text-sm text-slate-500">
          Saisissez votre e-mail pour recevoir un code OTP de réinitialisation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Adresse Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@entreprise.com"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover shadow-md shadow-primary/10 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              Envoyer le code OTP
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-8 text-center border-t border-slate-50 pt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
