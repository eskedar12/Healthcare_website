import { Appointment, Branch, Doctor, User } from '../models/index.js';
import { generateBookingReference } from '../utils/generateReference.js';
import { Op } from 'sequelize';

export const createAppointment = async (appointmentData) => {
  const data = { ...appointmentData };

  if (data.branch_id && !data.branch) {
    const branch = await Branch.findByPk(data.branch_id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    data.branch = branch.name;
  }

  if (data.doctor_id && !data.doctor_name) {
    const doctor = await Doctor.findByPk(data.doctor_id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    data.doctor_name = doctor.name;
  }

  // Generate unique booking reference
  let bookingReference;
  let isUnique = false;
  
  while (!isUnique) {
    bookingReference = generateBookingReference();
    const existing = await Appointment.findOne({ 
      where: { appointment_id: bookingReference } 
    });
    if (!existing) isUnique = true;
  }
  
  const appointment = await Appointment.create({
    ...data,
    appointment_id: bookingReference
  });
  
  return appointment;
};

export const getAllAppointments = async (filters = {}) => {
  const { 
    branch_id, 
    status, 
    start_date, 
    end_date, 
    search,
    department,
    assigned_to
  } = filters;
  
  const where = {};
  
  if (branch_id) where.branch_id = branch_id;
  if (status) where.status = status;
  if (department) where.department = department;
  if (assigned_to) where.assigned_to = assigned_to;
  
  if (start_date && end_date) {
    where.preferred_date = {
      [Op.between]: [start_date, end_date]
    };
  } else if (start_date) {
    where.preferred_date = {
      [Op.gte]: start_date
    };
  } else if (end_date) {
    where.preferred_date = {
      [Op.lte]: end_date
    };
  }
  
  if (search) {
    where[Op.or] = [
      { patient_name: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { appointment_id: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const appointments = await Appointment.findAll({
    where,
    order: [['date', 'DESC'], ['time', 'ASC']]
  });
  
  return appointments;
};

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      { model: Doctor, attributes: ['id', 'name', 'specialty'] }
    ]
  });
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  return appointment;
};

export const getAppointmentByReference = async (reference) => {
  const appointment = await Appointment.findOne({
    where: { appointment_id: reference }
  });
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  return appointment;
};

export const updateAppointment = async (id, updateData) => {
  const appointment = await Appointment.findByPk(id);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  await appointment.update(updateData);
  
  // Fetch updated appointment
  const updatedAppointment = await Appointment.findByPk(id, {
    include: [
      { model: Doctor, attributes: ['id', 'name', 'specialty'] }
    ]
  });
  
  return updatedAppointment;
};

export const updateAppointmentStatus = async (id, status, assigned_to = null) => {
  const appointment = await Appointment.findByPk(id);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  const updateData = { status };
  if (assigned_to) updateData.assigned_to = assigned_to;
  
  await appointment.update(updateData);
  
  const updatedAppointment = await Appointment.findByPk(id, {
    include: [
      { model: Doctor, attributes: ['id', 'name', 'specialty'] }
    ]
  });
  
  return updatedAppointment;
};

export const cancelAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  if (appointment.status === 'cancelled') {
    throw new Error('Appointment is already cancelled');
  }
  
  if (appointment.status === 'completed') {
    throw new Error('Cannot cancel completed appointment');
  }
  
  await appointment.update({ status: 'cancelled' });
  
  return appointment;
};

export const getCalendarData = async (filters = {}) => {
  const { branch_id, date, start_date, end_date } = filters;
  
  let dateFilter = {};
  
  if (date) {
    dateFilter = { date };
  } else if (start_date && end_date) {
    dateFilter = {
      date: {
        [Op.between]: [start_date, end_date]
      }
    };
  }
  
  const where = {};
  if (branch_id) where.branch_id = branch_id;
  
  const appointments = await Appointment.findAll({
    where: { ...where, ...dateFilter },
    order: [['date', 'ASC'], ['time', 'ASC']]
  });
  
  // Group by date
  const calendarData = {};
  appointments.forEach(appointment => {
    const dateKey = appointment.date;
    if (!calendarData[dateKey]) {
      calendarData[dateKey] = [];
    }
    calendarData[dateKey].push(appointment);
  });
  
  return calendarData;
};

export const getAppointmentStats = async (filters = {}) => {
  const { branch_id, start_date, end_date } = filters;
  
  const where = {};
  if (branch_id) where.branch_id = branch_id;
  
  if (start_date && end_date) {
    where.date = {
      [Op.between]: [start_date, end_date]
    };
  }
  
  const total = await Appointment.count({ where });
  
  const statusCounts = await Appointment.findAll({
    where,
    attributes: [
      'status',
      [Appointment.sequelize.fn('COUNT', Appointment.sequelize.col('id')), 'count']
    ],
    group: ['status']
  });
  
  const stats = {
    total,
    byStatus: {}
  };
  
  statusCounts.forEach(item => {
    stats.byStatus[item.status] = parseInt(item.get('count'));
  });
  
  return stats;
};