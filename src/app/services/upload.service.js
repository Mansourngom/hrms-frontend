import { mockDb } from './mockDb';

const uploadService = {
  async uploadFile(file, title = 'Uploaded File', type = 'other', employeeId = null) {
    await mockDb.delay(500); // Simulate upload time

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        resolve({
          success: true,
          message: 'Fichier téléversé avec succès (Mode d\'essai)',
          data: {
            file: {
              url: reader.result, // base64 data URL
              publicId: `mock_upload_${mockDb.generateId()}`,
              mimeType: file.type,
              size: file.size,
            },
          },
        });
      };

      reader.onerror = (err) => {
        reject({
          response: {
            data: { message: 'Erreur lors du traitement du fichier' }
          }
        });
      };

      reader.readAsDataURL(file);
    });
  },
};

export default uploadService;
