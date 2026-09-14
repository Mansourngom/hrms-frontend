import { mockDb } from './mockDb';

const settingService = {
  async getSettings() {
    await mockDb.delay();
    const settings = mockDb.getSettings();
    return {
      success: true,
      data: settings,
    };
  },

  async updateSettings(data) {
    await mockDb.delay();
    const current = mockDb.getSettings();

    const updated = {
      ...current,
      ...data,
    };

    mockDb.saveSettings(updated);

    return {
      success: true,
      message: 'Paramètres du système enregistrés avec succès',
      data: updated,
    };
  },
};

export default settingService;
