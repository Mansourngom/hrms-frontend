import api from './api';

const normalizeEmployee = (emp) => {
  if (!emp) return null;

  return {
    ...emp,
    _id: emp.id?.toString() || emp._id,
    id: emp.id,
    firstName: emp.first_name || emp.firstName || '',
    lastName: emp.last_name || emp.lastName || '',
    email: emp.email || '',
    phone: emp.phone || '',
    address: typeof emp.address === 'string' ? emp.address : '',
    photo: emp.photo ? (typeof emp.photo === 'string' ? { url: emp.photo } : emp.photo) : null,
    department: emp.department ? {
      _id: emp.department?.toString(),
      id: emp.department,
      name: emp.department_name || 'Département',
    } : null,
    position: typeof emp.position === 'string' ? {
      _id: emp.position,
      title: emp.position,
    } : emp.position || { title: 'Non spécifié' },
    contract: {
      type: (emp.contract_type || emp.contractType || 'CDI').toLowerCase(),
    },
    contractType: emp.contract_type || emp.contractType || 'CDI',
    hireDate: emp.hire_date || emp.hireDate || new Date().toISOString().split('T')[0],
    salary: emp.salary ? (typeof emp.salary === 'object' ? emp.salary : { base: parseFloat(emp.salary) || 0, currency: 'XOF' }) : { base: 0, currency: 'XOF' },
    status: (emp.status || 'ACTIVE').toLowerCase(),
    createdAt: emp.created_at,
    updatedAt: emp.updated_at,
  };
};

const buildEmployeeRequestData = (data) => {
  // 1. Format address string
  let addressStr = '';
  if (typeof data.address === 'object' && data.address !== null) {
    const parts = [data.address.street, data.address.city, data.address.country].filter(Boolean);
    addressStr = parts.join(', ');
  } else if (typeof data.address === 'string') {
    addressStr = data.address.trim();
  }

  // 2. Format salary decimal string
  let salaryStr = '0';
  if (typeof data.salary === 'object' && data.salary !== null) {
    salaryStr = (data.salary.base !== undefined && data.salary.base !== null) 
      ? data.salary.base.toString() 
      : '0';
  } else if (data.salary !== undefined && data.salary !== null) {
    salaryStr = data.salary.toString();
  }

  // 3. Format contract_type
  let contractType = 'CDI';
  if (data.contract?.type) {
    contractType = data.contract.type.toUpperCase();
  } else if (data.contractType) {
    contractType = data.contractType.toUpperCase();
  } else if (data.contract_type) {
    contractType = data.contract_type.toUpperCase();
  }

  // 4. Format position
  let positionStr = '';
  if (typeof data.position === 'object' && data.position !== null) {
    positionStr = data.position.title || data.position.name || '';
  } else if (typeof data.position === 'string') {
    positionStr = data.position;
  }

  // Check if a new file upload is present
  const fileToUpload = data.avatarFile instanceof File ? data.avatarFile 
    : (data.photo instanceof File ? data.photo : null);

  if (fileToUpload) {
    const formData = new FormData();
    formData.append('first_name', data.firstName || data.first_name || '');
    formData.append('last_name', data.lastName || data.last_name || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone || '');
    formData.append('address', addressStr);
    formData.append('position', positionStr);
    formData.append('contract_type', contractType);
    formData.append('hire_date', data.hireDate || data.hire_date || new Date().toISOString().split('T')[0]);
    formData.append('salary', salaryStr);
    formData.append('status', (data.status || 'ACTIVE').toUpperCase());
    formData.append('photo', fileToUpload);

    if (data.department) {
      const rawDeptId = typeof data.department === 'object' 
        ? (data.department.id || data.department._id) 
        : data.department;
      const parsedId = parseInt(rawDeptId, 10);
      if (!isNaN(parsedId)) {
        formData.append('department', parsedId);
      }
    }

    return { payload: formData, isFormData: true };
  }

  // Clean JSON payload (without photo string to avoid Django file validation error)
  const jsonPayload = {
    first_name: data.firstName || data.first_name || '',
    last_name: data.lastName || data.last_name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: addressStr,
    position: positionStr,
    contract_type: contractType,
    hire_date: data.hireDate || data.hire_date || new Date().toISOString().split('T')[0],
    salary: salaryStr,
    status: (data.status || 'ACTIVE').toUpperCase(),
  };

  if (data.department) {
    const rawDeptId = typeof data.department === 'object' 
      ? (data.department.id || data.department._id) 
      : data.department;
    const parsedId = parseInt(rawDeptId, 10);
    if (!isNaN(parsedId)) {
      jsonPayload.department = parsedId;
    }
  }

  return { payload: jsonPayload, isFormData: false };
};

const parseErrorMessage = (error, defaultMsg) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (typeof data === 'object') {
      const fieldErrors = Object.entries(data)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join(' | ');
      if (fieldErrors) return fieldErrors;
    }
  }
  return error.message || defaultMsg;
};

const employeeService = {
  async getEmployees(params = {}) {
    const apiParams = {};
    if (params.search) apiParams.search = params.search;
    if (params.department) apiParams.department = params.department;
    if (params.status) apiParams.status = params.status.toUpperCase();
    if (params.contractType) apiParams.contract_type = params.contractType.toUpperCase();
    if (params.page) apiParams.page = params.page;
    if (params.ordering) apiParams.ordering = params.ordering;

    const response = await api.get('/employees/', { params: apiParams });
    const rawList = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.results || []);

    const data = rawList.map(normalizeEmployee);

    return {
      success: true,
      data,
      count: response.data?.count || data.length,
    };
  },

  async getEmployee(id) {
    const response = await api.get(`/employees/${id}/`);
    return {
      success: true,
      data: normalizeEmployee(response.data),
    };
  },

  async createEmployee(data) {
    try {
      const { payload, isFormData } = buildEmployeeRequestData(data);
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const response = await api.post('/employees/', payload, config);
      return {
        success: true,
        message: 'Collaborateur ajouté avec succès',
        data: normalizeEmployee(response.data),
      };
    } catch (err) {
      const msg = parseErrorMessage(err, "Erreur lors de la création de l'employé");
      throw new Error(msg);
    }
  },

  async updateEmployee(id, data) {
    try {
      const { payload, isFormData } = buildEmployeeRequestData(data);
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const response = await api.patch(`/employees/${id}/`, payload, config);
      return {
        success: true,
        message: 'Collaborateur mis à jour',
        data: normalizeEmployee(response.data),
      };
    } catch (err) {
      const msg = parseErrorMessage(err, "Erreur lors de la mise à jour");
      throw new Error(msg);
    }
  },

  async archiveEmployee(id) {
    const response = await api.patch(`/employees/${id}/`, { status: 'ARCHIVED' });
    return {
      success: true,
      message: 'Collaborateur archivé',
      data: normalizeEmployee(response.data),
    };
  },

  async reactivateEmployee(id) {
    const response = await api.patch(`/employees/${id}/`, { status: 'ACTIVE' });
    return {
      success: true,
      message: 'Collaborateur réactivé',
      data: normalizeEmployee(response.data),
    };
  },

  async deleteEmployee(id) {
    await api.delete(`/employees/${id}/`);
    return {
      success: true,
      message: 'Collaborateur supprimé',
    };
  },
};

export default employeeService;
