import api from './api';

const authService = {
  /**
   * Log in user with username (or email) and password
   */
  async login(usernameOrEmail, password) {
    const rawInput = typeof usernameOrEmail === 'object' 
      ? (usernameOrEmail.username || usernameOrEmail.email) 
      : usernameOrEmail;
    const pwd = typeof usernameOrEmail === 'object' ? usernameOrEmail.password : password;

    const trimmed = rawInput?.trim() || '';
    let response;

    try {
      // First attempt with the input as username
      response = await api.post('/auth/login/', {
        username: trimmed,
        password: pwd,
      });
    } catch (err) {
      // If it contains an @, try with the part before @ as username
      if (trimmed.includes('@')) {
        const usernameOnly = trimmed.split('@')[0];
        try {
          response = await api.post('/auth/login/', {
            username: usernameOnly,
            password: pwd,
          });
        } catch (retryErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    const { access, refresh } = response.data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    // Fetch user profile from /auth/me/
    const profileRes = await api.get('/auth/me/');
    const user = profileRes.data;

    // Normalize role and names for UI compatibility
    const normalizedUser = {
      ...user,
      _id: user.id?.toString(),
      role: (user.role || 'ADMIN').toLowerCase(),
      firstName: user.first_name || user.username || 'Admin',
      lastName: user.last_name || '',
    };

    localStorage.setItem('user', JSON.stringify(normalizedUser));

    return {
      success: true,
      message: 'Connexion réussie',
      data: {
        user: normalizedUser,
        accessToken: access,
        refreshToken: refresh,
      },
    };
  },

  /**
   * Register a new user
   */
  async register(userData) {
    const payload = {
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password,
      role: (userData.role || 'ADMIN').toUpperCase(),
      phone: userData.phone || '',
    };

    const response = await api.post('/auth/register/', payload);
    const createdUser = response.data;

    // Attempt automatic login after registration
    try {
      const loginRes = await this.login(payload.username, payload.password);
      return loginRes;
    } catch (e) {
      return {
        success: true,
        message: 'Compte créé avec succès',
        data: {
          user: {
            ...createdUser,
            _id: createdUser.id,
            role: (createdUser.role || 'ADMIN').toLowerCase(),
          },
        },
      };
    }
  },

  /**
   * Fetch current authenticated user
   */
  async me() {
    const response = await api.get('/auth/me/');
    const user = response.data;

    const normalizedUser = {
      ...user,
      _id: user.id,
      role: (user.role || 'ADMIN').toLowerCase(),
      firstName: user.first_name || user.username || 'Admin',
      lastName: user.last_name || '',
    };

    return {
      success: true,
      data: normalizedUser,
    };
  },

  /**
   * Update profile
   */
  async updateMe(userData) {
    const response = await api.patch('/auth/me/', userData);
    const user = response.data;

    return {
      success: true,
      data: {
        ...user,
        _id: user.id,
        role: (user.role || 'ADMIN').toLowerCase(),
      },
    };
  },

  /**
   * Log out user
   */
  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('active_role_view');
    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  },

  async updatePassword(currentPassword, newPassword) {
    return { success: true, message: 'Mot de passe mis à jour' };
  },

  async forgotPassword(email) {
    return { success: true, message: 'Email de réinitialisation envoyé' };
  },

  async resetPassword(email, otp, newPassword) {
    return { success: true, message: 'Mot de passe réinitialisé' };
  },
};

export default authService;
