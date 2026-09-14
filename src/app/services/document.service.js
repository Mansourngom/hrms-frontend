import { mockDb } from './mockDb';

const populateDocument = (doc, emps) => {
  const emp = emps.find(e => e._id === doc.employee) || doc.employee;
  return {
    ...doc,
    employee: emp,
  };
};

const documentService = {
  async getDocuments(params = {}) {
    await mockDb.delay();
    const docs = mockDb.getDocuments();
    const emps = mockDb.getEmployees();

    let filtered = [...docs];
    if (params.category) {
      filtered = filtered.filter(d => d.category === params.category);
    }
    if (params.employee) {
      filtered = filtered.filter(d => (typeof d.employee === 'object' ? d.employee._id : d.employee) === params.employee);
    }

    const populated = filtered.map(d => populateDocument(d, emps));

    return {
      success: true,
      data: populated,
    };
  },

  async uploadDocument(file, metadata = {}) {
    await mockDb.delay(600);
    const docs = mockDb.getDocuments();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE';
        const sizeKB = Math.round(file.size / 1024);
        const sizeFormatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

        const newDoc = {
          _id: mockDb.generateId('doc'),
          title: metadata.title || file.name,
          category: metadata.category || 'other',
          mimeType: file.type,
          fileExtension: fileExt,
          sizeFormatted,
          sizeBytes: file.size,
          employee: metadata.employee || null,
          confidentiality: metadata.confidentiality || 'public',
          url: reader.result, // Base64 data URL
          createdAt: new Date().toISOString(),
        };

        docs.unshift(newDoc);
        mockDb.saveDocuments(docs);

        resolve({
          success: true,
          message: 'Document téléversé avec succès',
          data: newDoc,
        });
      };

      reader.onerror = () => {
        reject({
          response: {
            data: { message: 'Erreur lors du traitement du fichier' }
          }
        });
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        // Fallback for upload without actual file attachment
        const newDoc = {
          _id: mockDb.generateId('doc'),
          title: metadata.title || 'Document Administratif',
          category: metadata.category || 'other',
          mimeType: 'application/pdf',
          fileExtension: 'PDF',
          sizeFormatted: '1.2 MB',
          sizeBytes: 1200000,
          employee: metadata.employee || null,
          confidentiality: metadata.confidentiality || 'public',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          createdAt: new Date().toISOString(),
        };
        docs.unshift(newDoc);
        mockDb.saveDocuments(docs);
        resolve({
          success: true,
          message: 'Document téléversé avec succès',
          data: newDoc,
        });
      }
    });
  },

  async deleteDocument(id) {
    await mockDb.delay();
    const docs = mockDb.getDocuments();
    const filtered = docs.filter(d => d._id !== id);

    mockDb.saveDocuments(filtered);

    return {
      success: true,
      message: 'Document supprimé avec succès',
    };
  },
};

export default documentService;
