import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, 
  DollarSign, FileText, User, Printer, CheckCircle, ShieldAlert 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'job' | 'leaves'

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeService.getEmployee(id);
        setEmployee(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la récupération du profil de l'employé");
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8">
        <ShieldAlert className="h-12 w-12 text-slate-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Employé introuvable</h3>
        <button
          onClick={() => navigate('/employees')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          onClick={() => navigate('/employees')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-550 hover:text-slate-900 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Printer className="h-4 w-4 text-slate-550" />
          Imprimer le profil
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
          {employee.photo?.url ? (
            <img src={employee.photo.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-slate-350" />
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {employee.firstName} {employee.lastName}
            </h2>
            <span className={`inline-flex self-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
              employee.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
              employee.status === 'archived' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {employee.status === 'active' ? 'Actif' :
               employee.status === 'archived' ? 'Archivé' :
               employee.status === 'on_leave' ? 'En Congé' : 'Licencié'}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500">{employee.employeeCode}</p>
          <p className="text-sm text-slate-600 font-medium">
            {employee.position?.title || 'Aucun poste'} · {employee.department?.name || 'Aucun département'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'personal' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Informations Personnelles
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'job' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Contrat & Rémunération
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'leaves' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Solde de Congés
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2">Détails personnels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Email Professionnel</p>
                    <p className="font-semibold text-slate-800">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Téléphone</p>
                    <p className="font-semibold text-slate-800">{employee.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Adresse</p>
                    <p className="font-semibold text-slate-800">
                      {employee.address?.street ? `${employee.address.street}, ${employee.address.city}, ${employee.address.country}` : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Date de naissance</p>
                    <p className="font-semibold text-slate-800">
                      {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Genre</p>
                    <p className="font-semibold text-slate-800 capitalize">
                      {employee.gender === 'male' ? 'Homme' : employee.gender === 'female' ? 'Femme' : 'Autre'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 mt-6 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2 mb-4">Contact d'urgence</h3>
              {employee.emergencyContact?.name ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Nom</p>
                    <p className="font-semibold text-slate-800">{employee.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Relation</p>
                    <p className="font-semibold text-slate-800">{employee.emergencyContact.relationship || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Téléphone d'urgence</p>
                    <p className="font-semibold text-slate-850 font-bold text-slate-800">{employee.emergencyContact.phone}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Aucun contact d'urgence spécifié.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'job' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2">Contrat & Poste</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Type de Contrat</p>
                    <p className="font-bold text-primary uppercase">{employee.contract?.type || 'CDI'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Date d'embauche</p>
                    <p className="font-semibold text-slate-800">
                      {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Responsable Direct (Manager)</p>
                    <p className="font-semibold text-slate-800">
                      {employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : 'Aucun'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Salaire de Base Mensuel</p>
                    <p className="font-bold text-lg text-slate-900">
                      {employee.salary?.base?.toLocaleString('fr-FR') || 0} F CFA
                    </p>
                  </div>
                </div>
                {employee.contract?.endDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Date de Fin de Contrat</p>
                      <p className="font-semibold text-rose-600">
                        {new Date(employee.contract.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            {employee.notes && (
              <div className="pt-4 mt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2 mb-3">Notes de dossier</h3>
                <p className="text-sm text-slate-550 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl">
                  {employee.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-2">Solde de congés restants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Congés Annuels</p>
                <p className="text-3xl font-bold text-slate-900">{employee.leaveBalance?.annual || 24} jours</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Congés Maladie</p>
                <p className="text-3xl font-bold text-slate-900">{employee.leaveBalance?.sick || 10} jours</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Autres absences</p>
                <p className="text-3xl font-bold text-slate-900">{employee.leaveBalance?.other || 0} jours</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
