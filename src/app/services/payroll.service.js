import { mockDb } from './mockDb';

const populatePayroll = (pay, emps, depts, positions) => {
  const emp = emps.find((e) => e._id === pay.employee) || pay.employee;
  let populatedEmp = emp;
  if (typeof emp === 'object' && emp !== null) {
    const dept = depts.find((d) => d._id === emp.department) || emp.department;
    const pos = positions.find((p) => p._id === emp.position) || emp.position;
    populatedEmp = { ...emp, department: dept, position: pos };
  }

  return {
    ...pay,
    employee: populatedEmp,
  };
};

const payrollService = {
  async getPayrolls(params = {}) {
    await mockDb.delay();
    const payrolls = mockDb.getPayrolls();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const positions = mockDb.getPositions();

    let filtered = [...payrolls];

    if (params.month) {
      filtered = filtered.filter(p => Number(p.month) === Number(params.month));
    }
    if (params.year) {
      filtered = filtered.filter(p => Number(p.year) === Number(params.year));
    }
    if (params.status) {
      filtered = filtered.filter(p => p.status === params.status);
    }

    const populated = filtered.map((p) => populatePayroll(p, emps, depts, positions));

    return {
      success: true,
      data: populated,
    };
  },

  async getPayroll(id) {
    await mockDb.delay();
    const payrolls = mockDb.getPayrolls();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const positions = mockDb.getPositions();

    const pay = payrolls.find((p) => p._id === id);
    if (!pay) {
      throw {
        response: {
          data: { message: 'Bulletin de paie introuvable' }
        }
      };
    }

    const populated = populatePayroll(pay, emps, depts, positions);

    return {
      success: true,
      data: populated,
    };
  },

  async createPayroll(data) {
    await mockDb.delay();
    const payrolls = mockDb.getPayrolls();

    const baseSalary = Number(data.baseSalary) || 0;
    const allowances = Number(data.allowances) || 0;
    const overtimeHours = Number(data.overtimeHours) || 0;
    const overtimeRate = Number(data.overtimeRate) || 0;
    const deductions = Number(data.deductions) || 0;

    const netSalary = baseSalary + allowances + (overtimeHours * overtimeRate) - deductions;
    const monthStr = String(data.month).padStart(2, '0');

    const newPay = {
      _id: mockDb.generateId('pay'),
      payrollCode: `PAY-${data.year}${monthStr}-${String(payrolls.length + 1).padStart(3, '0')}`,
      employee: data.employee,
      month: Number(data.month),
      year: Number(data.year),
      baseSalary,
      allowances,
      overtimeHours,
      overtimeRate,
      deductions,
      netSalary,
      status: data.status || 'pending',
      paymentDate: data.paymentDate || null,
      paymentMethod: data.paymentMethod || 'wire_transfer',
      createdAt: new Date().toISOString(),
    };

    payrolls.unshift(newPay);
    mockDb.savePayrolls(payrolls);

    return {
      success: true,
      message: 'Bulletin de paie créé avec succès',
      data: newPay,
    };
  },

  async generateMonthlyPayroll(month, year) {
    await mockDb.delay(600);
    const payrolls = mockDb.getPayrolls();
    const emps = mockDb.getEmployees().filter(e => e.status === 'active' || e.status === 'on_leave');

    const monthNum = Number(month);
    const yearNum = Number(year);
    const monthStr = String(monthNum).padStart(2, '0');

    let createdCount = 0;

    emps.forEach((emp) => {
      // Check if employee already has a payslip for this month/year
      const existing = payrolls.find(p => p.employee === emp._id && p.month === monthNum && p.year === yearNum);
      if (!existing) {
        const baseSalary = emp.salary?.base || 400000;
        const allowances = Math.round(baseSalary * 0.05); // 5% bonus simulation
        const deductions = Math.round(baseSalary * 0.05); // 5% deductions simulation
        const netSalary = baseSalary + allowances - deductions;

        payrolls.unshift({
          _id: mockDb.generateId('pay'),
          payrollCode: `PAY-${yearNum}${monthStr}-${String(payrolls.length + 1).padStart(3, '0')}`,
          employee: emp._id,
          month: monthNum,
          year: yearNum,
          baseSalary,
          allowances,
          overtimeHours: 0,
          overtimeRate: 0,
          deductions,
          netSalary,
          status: 'pending',
          paymentDate: null,
          paymentMethod: 'wire_transfer',
          createdAt: new Date().toISOString(),
        });
        createdCount++;
      }
    });

    mockDb.savePayrolls(payrolls);

    return {
      success: true,
      message: `${createdCount} bulletin(s) de paie généré(s) pour ${monthStr}/${yearNum}`,
      data: { createdCount },
    };
  },

  async updatePayrollStatus(id, status, paymentMethod = 'wire_transfer') {
    await mockDb.delay();
    const payrolls = mockDb.getPayrolls();
    const idx = payrolls.findIndex((p) => p._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Bulletin introuvable' }
        }
      };
    }

    payrolls[idx].status = status;
    if (status === 'paid') {
      payrolls[idx].paymentDate = new Date().toISOString().split('T')[0];
      payrolls[idx].paymentMethod = paymentMethod;
    }

    mockDb.savePayrolls(payrolls);

    return {
      success: true,
      message: 'Statut du bulletin mis à jour',
      data: payrolls[idx],
    };
  },

  async deletePayroll(id) {
    await mockDb.delay();
    const payrolls = mockDb.getPayrolls();
    const filtered = payrolls.filter((p) => p._id !== id);

    if (payrolls.length === filtered.length) {
      throw {
        response: {
          data: { message: 'Bulletin introuvable' }
        }
      };
    }

    mockDb.savePayrolls(filtered);

    return {
      success: true,
      message: 'Bulletin de paie supprimé',
    };
  },
};

export default payrollService;
