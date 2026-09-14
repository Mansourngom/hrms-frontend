import React, { useEffect, useState } from 'react';
import documentService from '../services/document.service';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Folder, FileText, Upload, Search, Filter, HardDrive, ShieldAlert,
  Eye, Download, Trash2, LayoutGrid, List, Plus, X, User, Lock,
  FileCheck, Shield, Sparkles, CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Documents = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'contract' | 'medical' | 'payroll' | 'policy'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Data States
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [confidentialityFilter, setConfidentialityFilter] = useState('');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'contract',
    employee: '',
    confidentiality: 'public',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docRes, empRes] = await Promise.all([
        documentService.getDocuments({ category: activeCategory !== 'all' ? activeCategory : undefined }),
        employeeService.getEmployees(),
      ]);

      setDocuments(docRes.data || []);
      setEmployees(empRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadForm.title) {
        setUploadForm(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.title) {
      toast.error('Veuillez donner un titre au document');
      return;
    }

    try {
      await documentService.uploadDocument(selectedFile, uploadForm);
      toast.success('Document téléversé avec succès');
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadForm({ title: '', category: 'contract', employee: '', confidentiality: 'public' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du téléversement');
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    try {
      await documentService.deleteDocument(id);
      toast.success('Document supprimé');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Filtered List
  const filteredDocs = documents.filter((d) => {
    const title = d.title.toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase());
    const matchesConf = !confidentialityFilter || d.confidentiality === confidentialityFilter;
    return matchesSearch && matchesConf;
  });

  // Calculate Metrics
  const totalDocsCount = documents.length;
  const totalSizeBytes = documents.reduce((sum, d) => sum + (d.sizeBytes || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);
  const confidentialCount = documents.filter(d => d.confidentiality === 'confidential' || d.confidentiality === 'restricted').length;

  const categoriesList = [
    { id: 'all', label: '📁 Tous les Documents' },
    { id: 'contract', label: '📄 Contrats & Embauche' },
    { id: 'medical', label: '🏥 Certificats & Santé' },
    { id: 'payroll', label: '💳 Bulletins & Paie' },
    { id: 'policy', label: '🏢 Politiques & Procédures' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Folder className="h-7 w-7 text-primary" />
            Gestion des Documents
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Centralisez, catégorisez et partagez les documents administratifs de l'entreprise
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
        >
          <Upload className="h-4 w-4" />
          Téléverser un Document
        </button>
      </div>

      {/* KPI Cards Grid (Matching Mockup 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Documents</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Folder className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{totalDocsCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-blue-600">
            Fichiers archivés au total
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Espace Utilisé</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HardDrive className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {totalSizeMB} <span className="text-xs font-semibold text-slate-500">MB</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-600 h-full w-[12%]"></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Documents Confidentiels</span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{confidentialCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-rose-600">
            Accès restreint aux RH
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Ajouts Récents</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{filteredDocs.length}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Fichiers dans la catégorie actuelle
          </span>
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Toolbar & View Mode Toggle */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par titre de document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={confidentialityFilter}
            onChange={(e) => setConfidentialityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
          >
            <option value="">Tous les niveaux</option>
            <option value="public">Public</option>
            <option value="restricted">Restreint</option>
            <option value="confidential">Confidentiel</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-primary font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Vue Grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white shadow-xs text-primary font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Vue Liste"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-100">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Aucun document trouvé</h3>
          <p className="text-xs text-slate-400 mt-1">Téléversez des fichiers pour alimenter l'archivage documentaire.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDocs.map((doc) => {
            const emp = doc.employee || {};
            return (
              <div key={doc._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs">
                      {doc.fileExtension || 'PDF'}
                    </div>
                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      doc.confidentiality === 'confidential' ? 'bg-rose-50 text-rose-700' :
                      doc.confidentiality === 'restricted' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {doc.confidentiality}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{doc.title}</h3>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <p className="flex items-center justify-between text-[11px]">
                      <span>Taille:</span>
                      <strong className="text-slate-700">{doc.sizeFormatted}</strong>
                    </p>
                    <p className="flex items-center justify-between text-[11px]">
                      <span>Date:</span>
                      <span className="text-slate-600">{new Date(doc.createdAt).toLocaleDateString('fr-FR')}</span>
                    </p>
                    {emp.firstName && (
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-primary pt-1">
                        <User className="h-3 w-3" />
                        {emp.firstName} {emp.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Eye className="h-3.5 w-3.5" /> Aperçu
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={doc.url}
                      download={doc.title}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      title="Télécharger"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteDoc(doc._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3.5 px-4">Fichier</th>
                  <th className="py-3.5 px-4">Titre du Document</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Collaborateur</th>
                  <th className="py-3.5 px-4">Taille</th>
                  <th className="py-3.5 px-4">Confidentialité</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDocs.map((doc) => {
                  const emp = doc.employee || {};
                  return (
                    <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 font-extrabold text-xs text-primary uppercase">
                        {doc.fileExtension || 'PDF'}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 text-xs max-w-xs truncate">
                        {doc.title}
                      </td>
                      <td className="py-4 px-4 text-xs capitalize text-slate-600">
                        {doc.category}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-700">
                        {emp.firstName ? `${emp.firstName} ${emp.lastName}` : '-'}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                        {doc.sizeFormatted}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold uppercase ${
                          doc.confidentiality === 'confidential' ? 'bg-rose-50 text-rose-700' :
                          doc.confidentiality === 'restricted' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {doc.confidentiality}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-600 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Téléverser un Document</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sélectionner un fichier *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/60 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    {selectedFile ? selectedFile.name : 'Cliquez ou glissez un fichier ici'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, DOCX (Max 10 MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre du Document *</label>
                <input
                  type="text"
                  placeholder="ex: Contrat de travail / Attestation"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="contract">Contrats & Embauche</option>
                  <option value="medical">Certificats & Santé</option>
                  <option value="payroll">Bulletins & Paie</option>
                  <option value="policy">Politiques & Procédures</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attribuer à un Collaborateur (Optionnel)</label>
                <select
                  value={uploadForm.employee}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, employee: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="">Aucun (Document général entreprise)</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau de Confidentialité</label>
                <select
                  value={uploadForm.confidentiality}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, confidentiality: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value="public">Public (Visible par tous)</option>
                  <option value="restricted">Restreint (Managers & RH)</option>
                  <option value="confidential">Confidentiel (Direction & RH)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Téléverser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Document Preview */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400">Taille: {previewDoc.sizeFormatted}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-slate-100/50 min-h-[300px]">
              {previewDoc.mimeType?.startsWith('image/') || previewDoc.url?.startsWith('data:image/') ? (
                <img src={previewDoc.url} alt={previewDoc.title} className="max-h-[400px] object-contain rounded-lg shadow-md" />
              ) : (
                <div className="text-center space-y-3">
                  <FileText className="h-16 w-16 text-primary mx-auto" />
                  <p className="text-sm font-bold text-slate-800">{previewDoc.title}</p>
                  <p className="text-xs text-slate-500">Document {previewDoc.fileExtension} prêt au téléchargement.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-slate-100">
              <a
                href={previewDoc.url}
                download={previewDoc.title}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm"
              >
                <Download className="h-4 w-4" />
                Télécharger le fichier
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
