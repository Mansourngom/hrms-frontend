import { mockDb } from './mockDb';

const populateAttendance = (att, emps, depts, positions) => {
  const emp = emps.find((e) => e._id === att.employee) || att.employee;
  let populatedEmp = emp;
  if (typeof emp === 'object' && emp !== null) {
    const dept = depts.find((d) => d._id === emp.department) || emp.department;
    const pos = positions.find((p) => p._id === emp.position) || emp.position;
    populatedEmp = { ...emp, department: dept, position: pos };
  }

  return {
    ...att,
    employee: populatedEmp,
  };
};

const attendanceService = {
  async getAttendances(date) {
    await mockDb.delay();
    const attendances = mockDb.getAttendances();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const positions = mockDb.getPositions();

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Filter by date
    let filtered = attendances.filter((a) => a.date === targetDate);

    // If an employee doesn't have an attendance record for this date, auto-create a default 'absent' / unrecorded record so they appear in the UI
    const activeEmps = emps.filter(e => e.status === 'active' || e.status === 'on_leave');
    activeEmps.forEach((emp) => {
      const exists = filtered.find(a => (typeof a.employee === 'object' ? a.employee._id : a.employee) === emp._id);
      if (!exists) {
        const newRecord = {
          _id: mockDb.generateId('att'),
          employee: emp._id,
          date: targetDate,
          checkIn: null,
          checkOut: null,
          status: emp.status === 'on_leave' ? 'on_leave' : 'absent',
          workHours: 0,
          notes: '',
          createdAt: new Date().toISOString(),
        };
        attendances.push(newRecord);
        filtered.push(newRecord);
      }
    });

    mockDb.saveAttendances(attendances);

    const populated = filtered.map((a) => populateAttendance(a, emps, depts, positions));

    return {
      success: true,
      data: populated,
    };
  },

  async logAttendance(data) {
    await mockDb.delay();
    const attendances = mockDb.getAttendances();

    const idx = attendances.findIndex(
      (a) => (typeof a.employee === 'object' ? a.employee._id : a.employee) === data.employee && a.date === data.date
    );

    let record;
    if (idx !== -1) {
      attendances[idx] = {
        ...attendances[idx],
        ...data,
      };
      record = attendances[idx];
    } else {
      record = {
        _id: mockDb.generateId('att'),
        ...data,
        createdAt: new Date().toISOString(),
      };
      attendances.push(record);
    }

    mockDb.saveAttendances(attendances);

    return {
      success: true,
      message: 'Pointage enregistré avec succès',
      data: record,
    };
  },
};

export default attendanceService;
