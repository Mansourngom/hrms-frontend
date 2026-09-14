import { mockDb } from './mockDb';

const authService = {
  async login(email, password) {
    await mockDb.delay();
    const users = mockDb.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      throw {
        response: {
          data: { message: 'Identifiants invalides' }
        }
      };
    }

    if (user.status !== 'active') {
      throw {
        response: {
          data: { message: 'Votre compte est inactif' }
        }
      };
    }

    // Save active session locally
    localStorage.setItem('mock_session_user_id', user._id);

    return {
      success: true,
      message: 'Connexion réussie',
      data: {
        user,
        accessToken: 'mock-jwt-access-token',
        refreshToken: 'mock-jwt-refresh-token',
      },
    };
  },

  async register(userData) {
    await mockDb.delay();
    const users = mockDb.getUsers();
    
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw {
        response: {
          data: { message: 'Cette adresse e-mail est déjà utilisée' }
        }
      };
    }

    const newUser = {
      _id: mockDb.generateId('user'),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      role: users.length === 0 ? 'admin' : userData.role || 'employee',
      status: 'active',
      emailVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    mockDb.saveUsers(users);

    localStorage.setItem('mock_session_user_id', newUser._id);

    return {
      success: true,
      message: 'Compte créé avec succès',
      data: {
        user: newUser,
        accessToken: 'mock-jwt-access-token',
        refreshToken: 'mock-jwt-refresh-token',
      },
    };
  },

  async logout() {
    await mockDb.delay(100);
    localStorage.removeItem('mock_session_user_id');
    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  },

  async me() {
    await mockDb.delay(100);
    const userId = localStorage.getItem('mock_session_user_id');
    if (!userId) {
      throw {
        response: {
          data: { message: 'Non authentifié' }
        }
      };
    }

    const users = mockDb.getUsers();
    const user = users.find((u) => u._id === userId);

    if (!user) {
      throw {
        response: {
          data: { message: 'Utilisateur introuvable' }
        }
      };
    }

    return {
      success: true,
      data: user,
    };
  },

  async updatePassword(currentPassword, newPassword) {
    await mockDb.delay();
    const userId = localStorage.getItem('mock_session_user_id');
    if (!userId) throw new Error('Non authentifié');

    const users = mockDb.getUsers();
    const user = users.find((u) => u._id === userId);

    if (user.password !== currentPassword) {
      throw {
        response: {
          data: { message: 'Mot de passe actuel incorrect' }
        }
      };
    }

    user.password = newPassword;
    mockDb.saveUsers(users);

    return {
      success: true,
      message: 'Mot de passe modifié avec succès',
    };
  },

  async forgotPassword(email) {
    await mockDb.delay();
    const users = mockDb.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw {
        response: {
          data: { message: 'Aucun utilisateur trouvé avec cette adresse email' }
        }
      };
    }

    return {
      success: true,
      message: 'OTP généré',
      data: {
        otp: '123456', // Mock default OTP
      },
    };
  },

  async resetPassword(email, otp, password) {
    await mockDb.delay();
    if (otp !== '123456') {
      throw {
        response: {
          data: { message: 'Code OTP invalide' }
        }
      };
    }

    const users = mockDb.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw {
        response: {
          data: { message: 'Utilisateur introuvable' }
        }
      };
    }

    user.password = password;
    mockDb.saveUsers(users);

    return {
      success: true,
      message: 'Mot de passe réinitialisé',
    };
  },
};

export default authService;
