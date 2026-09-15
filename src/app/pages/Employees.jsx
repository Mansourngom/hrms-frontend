import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeService from '../services/employee.service';
import departmentService from '../services/department.service';
import positionService from '../services/position.service';
import uploadService from '../services/upload.service';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, Search, SlidersHorizontal, Eye, Edit2, Archive, CheckCircle, 
  Trash2, Mail, Phone, MapPin, X, Upload, User, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Employees = () => {
  const { t } = useLanguage();
  const { user, activeRole } = useAuth();
  const isAdmin = (user?.role === 'admin') || (activeRole === 'admin');
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedPos, setSelectedPos] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Drawer & Edit states
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // File Upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    birthDate: '',
    hireDate: '',
    address: {
      street: '',
      city: '',
      country: 'Sénégal',
      postalCode: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    department: '',
    position: '',
    manager: '',
    contract: {
      type: 'cdi',
      startDate: '',
      endDate: '',
      status: 'active',
    },
    salary: {
      base: 0,
      currency: 'XOF',
    },
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes, posRes] = await Promise.all([
        employeeService.getEmployees(),
        departmentService.getDepartments(),
        positionService.getPositions()
      ]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
      setPositions(posRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const email = (emp.email || '').toLowerCase();
    const code = (emp.employeeCode || '').toLowerCase();
    const query = search.toLowerCase();
    
    const matchesSearch = fullName.includes(query) || email.includes(query) || code.includes(query);
    const matchesDept = selectedDept ? (emp.department?._id || emp.department) === selectedDept : true;
    const matchesPos = selectedPos ? (emp.position?._id || emp.position) === selectedPos : true;
    const matchesStatus = selectedStatus ? emp.status === selectedStatus : true;

    return matchesSearch && matchesDept && matchesPos && matchesStatus;
  });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle Avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Open Drawer
  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData({
      employeeCode: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'male',
      birthDate: '',
      hireDate: new Date().toISOString().split('T')[0],
      address: {
        street: '',
        city: '',
        country: 'Sénégal',
        postalCode: '',
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
      department: '',
      position: '',
      manager: '',
      contract: {
        type: 'cdi',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
      },
      salary: {
        base: 0,
        currency: 'XOF',
      },
      notes: '',
    });
    setShowDrawer(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setAvatarFile(null);
    setAvatarPreview(emp.photo?.url || null);
    
    // Format dates for inputs
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toISOString().split('T')[0];
    };

    setFormData({
      employeeCode: emp.employeeCode || '',
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      gender: emp.gender || 'male',
      birthDate: formatDate(emp.birthDate),
      hireDate: formatDate(emp.hireDate),
      address: {
        street: emp.address?.street || '',
        city: emp.address?.city || '',
        country: emp.address?.country || 'Sénégal',
        postalCode: emp.address?.postalCode || '',
      },
      emergencyContact: {
        name: emp.emergencyContact?.name || '',
        relationship: emp.emergencyContact?.relationship || '',
        phone: emp.emergencyContact?.phone || '',
      },
      department: emp.department?._id || emp.department || '',
      position: emp.position?._id || emp.position || '',
      manager: emp.manager?._id || emp.manager || '',
      contract: {
        type: emp.contract?.type || 'cdi',
        startDate: formatDate(emp.contract?.startDate),
        endDate: formatDate(emp.contract?.endDate),
        status: emp.contract?.status || 'active',
      },
      salary: {
        base: emp.salary?.base || 0,
        currency: emp.salary?.currency || 'XOF',
      },
      notes: emp.notes || '',
    });
    setShowDrawer(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer définitivement cet employé ?')) return;

    try {
      await employeeService.deleteEmployee(id);
      toast.success('Employé supprimé avec succès');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleArchive = async (emp) => {
    try {
      if (emp.status === 'archived') {
        await employeeService.reactivateEmployee(emp._id);
        toast.success('Employé réactivé avec succès');
      } else {
        await employeeService.archiveEmployee(emp._id);
        toast.success('Employé archivé avec succès');
      }
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  // Submit Drawer Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeCode) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setUploading(true);
    try {
      const payload = {
        ...formData,
        avatarFile: avatarFile || null,
      };

      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee._id, payload);
        toast.success('Fiche employé modifiée avec succès');
      } else {
        await employeeService.createEmployee(payload);
        toast.success('Employé créé avec succès');
      }
      setShowDrawer(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      const msg = error.message || error.response?.data?.detail || error.response?.data?.message || "Erreur lors de l'enregistrement";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Annuaire des Employés</h2>
          <p className="text-sm text-slate-500 font-medium">Consultez, modifiez et gérez les fiches de vos collaborateurs.</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Ajouter un collaborateur
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Rechercher nom, code, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
          />
        </div>

        {/* Custom selects */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-600 focus:border-primary"
          >
            <option value="">Tous les Départements</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-600 focus:border-primary"
          >
            <option value="">Tous les Postes</option>
            {positions.map((pos) => (
              <option key={pos._id} value={pos._id}>{pos.title}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-600 focus:border-primary"
          >
            <option value="">Tous les Statuts</option>
            <option value="active">Actif</option>
            <option value="archived">Archivé</option>
            <option value="on_leave">En Congé</option>
            <option value="terminated">Licencié</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">{t('emptyList')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4">Collaborateur</th>
                  <th className="py-4">Code</th>
                  <th className="py-4">Département</th>
                  <th className="py-4">Poste</th>
                  <th className="py-4">Date d'embauche</th>
                  <th className="py-4">Statut</th>
                  <th className="py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-55 hover:bg-slate-50/50 transition-colors">
                    {/* User Card */}
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
                          {emp.photo?.url ? (
                            <img src={emp.photo.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-600">{emp.employeeCode}</td>
                    <td className="py-4">
                      {emp.department ? (
                        <span className="font-medium text-slate-700">{emp.department.name || emp.department}</span>
                      ) : (
                        <span className="text-slate-400 italic">Non assigné</span>
                      )}
                    </td>
                    <td className="py-4">
                      {emp.position ? (
                        <span className="font-medium text-slate-700">{emp.position.title || emp.position}</span>
                      ) : (
                        <span className="text-slate-400 italic">Non spécifié</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-500">
                      {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ${
                        emp.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        emp.status === 'archived' ? 'bg-amber-50 text-amber-700' :
                        emp.status === 'on_leave' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {emp.status === 'active' ? 'Actif' :
                         emp.status === 'archived' ? 'Archivé' :
                         emp.status === 'on_leave' ? 'En Congé' : 'Licencié'}
                      </span>
                    </td>
                    {/* Action buttons */}
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/employees/${emp._id}`)}
                        title="Consulter le profil"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(emp)}
                        title="Modifier"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleArchive(emp)}
                        title={emp.status === 'archived' ? 'Réactiver' : 'Archiver'}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all ${
                          emp.status === 'archived'
                            ? 'hover:border-emerald-250 hover:text-emerald-600'
                            : 'hover:border-amber-250 hover:text-amber-600'
                        }`}
                      >
                        {emp.status === 'archived' ? <CheckCircle className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        title="Supprimer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-600 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Drawer (Add/Edit) */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white shadow-xl flex flex-col h-full animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingEmployee ? 'Modifier le collaborateur' : 'Créer une fiche collaborateur'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Saisissez les informations de profil de l'employé.</p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)} 
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Photo Uploader */}
              <div className="flex flex-col items-center sm:flex-row gap-4 border-b border-slate-50 pb-6">
                <div className="relative h-20 w-20 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-slate-350" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">Avatar / Photo de profil</p>
                  <p className="text-xs text-slate-400">Recommandé : PNG, JPG 512x512px. Stocké sur Cloudinary.</p>
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-all mt-2">
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    Télécharger
                    <input type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Section 1: Identification */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">1. Identification & Contact</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Code Employé *</label>
                    <input
                      type="text"
                      name="employeeCode"
                      value={formData.employeeCode}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm uppercase focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jean"
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Dupont"
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email Professionnel *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jean.dupont@entreprise.com"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3.5 text-sm focus:border-primary outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Téléphone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+221 77 123 45 67"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3.5 text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Genre</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none bg-white focus:border-primary"
                    >
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Date de Naissance</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Date d'embauche *</label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Affiliation RH */}
              <div className="space-y-4 pt-4 border-t border-slate-55 border-t-slate-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">2. Affectation & Rémunération</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Département</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none bg-white focus:border-primary"
                    >
                      <option value="">Sélectionner</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Poste</label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none bg-white focus:border-primary"
                    >
                      <option value="">Sélectionner</option>
                      {positions.map((pos) => (
                        <option key={pos._id} value={pos._id}>{pos.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Manager / Responsable</label>
                    <select
                      name="manager"
                      value={formData.manager}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none bg-white focus:border-primary"
                    >
                      <option value="">Sélectionner</option>
                      {employees.filter(e => e._id !== editingEmployee?._id).map((emp) => (
                        <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Type de Contrat</label>
                    <select
                      value={formData.contract.type}
                      onChange={(e) => handleNestedInputChange('contract', 'type', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none bg-white focus:border-primary"
                    >
                      <option value="cdi">CDI</option>
                      <option value="cdd">CDD</option>
                      <option value="internship">Stage</option>
                      <option value="consultant">Freelance / Consultant</option>
                      <option value="temporary">Intérim / Temporaire</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Salaire de Base (F CFA)</label>
                    <input
                      type="number"
                      value={formData.salary.base}
                      onChange={(e) => handleNestedInputChange('salary', 'base', parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Fin de Contrat (Si CDD/Stage)</label>
                    <input
                      type="date"
                      value={formData.contract.endDate}
                      onChange={(e) => handleNestedInputChange('contract', 'endDate', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Adresse */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">3. Adresse Postale</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Rue / Adresse</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                        placeholder="Avenue Cheikh Anta Diop"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3.5 text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Ville</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                      placeholder="Dakar"
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Pays</label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Emergency Contact */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">4. Contact d'Urgence</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Nom Complet</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                      placeholder="Mamadou Diop"
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Relation</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                      placeholder="Frère, Mère, Conjoint..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                      placeholder="+221 70 987 65 43"
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Notes RH / Commentaires</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Informations supplémentaires à inscrire sur le dossier..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary"
                ></textarea>
              </div>
            </form>

            {/* Drawer Footer Actions */}
            <div className="flex h-20 items-center justify-end gap-3 border-t border-slate-100 px-6 shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-650 hover:bg-slate-100 transition-all"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
