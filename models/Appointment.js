const pool = require("../config/db");
const { medicalConditions } = require("../utils/medicalConditions");

class Appointment {
  constructor(data) {
    Object.assign(this, data)
  }

  // Get all appointments
  static async getAllAppointments({ from, to, doctor }) {
    try {
      let whereConditions = [];
      const values = [];
      let paramIndex = 1;

      if (from && to) {
        whereConditions.push(`appointment_datetime BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
        values.push(from, to);
        paramIndex += 2;
      } else if (from) {
        whereConditions.push(`appointment_datetime >= $${paramIndex}`);
        values.push(from);
        paramIndex += 1;
      } else if (to) {
        whereConditions.push(`appointment_datetime <= $${paramIndex}`);
        values.push(to);
        paramIndex += 1;
      }

      if (doctor) {
        whereConditions.push(`appointments.doctor_id = $${paramIndex}`);
        values.push(doctor);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      const query = `
        SELECT appointments.*, patients.name AS patient_name, doctors.name AS doctor_name
        FROM appointments
        LEFT JOIN patients ON patients.id = appointments.patient_id
        LEFT JOIN doctors ON doctors.id = appointments.doctor_id
        ${whereClause}
        ORDER BY appointments.created_at DESC
      `;

      const result = await pool.query(query, values);
        
      return result.rows.map(row => new Appointment(row))
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Get Doctors With Appointments
  static async getDoctorsWithAppointments() {
    try {
      const query = `
        SELECT DISTINCT d.id, d.name 
        FROM doctors d
        INNER JOIN appointments a ON d.id = a.doctor_id
        ORDER BY d.name
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Get appointment by Id
  static async getAppointmentById(id) {  
    try {
      const appointment = await pool.query(`
        SELECT appointments.*, patients.name AS patient_name, doctors.name AS doctor_name, patients.medical_history AS patient_medical_history
        FROM appointments 
        LEFT JOIN patients ON patients.id = appointments.patient_id
        LEFT JOIN doctors ON doctors.id = appointments.doctor_id
        WHERE appointments.id = $1
      `, [id]);
      
      let medicalHistory = appointment.rows[0].patient_medical_history.replace(/[{}]/g, '')
        .split(',')
        .map(item => item.replace(/"/g, '').trim());
        
      appointment.rows[0].patient_medical_history = medicalHistory.map((condition) => {
          const found = medicalConditions.find((c) => c.value === condition.trim());
          return found ? found.label : condition.trim();
      }).join(", ");

      return new Appointment(appointment.rows[0])
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Add new appointment
  static async addAppointment({ patient_id, doctor_id, appointment_datetime, status }) {
    try {
      const query = `
        INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;

      const result = await pool.query(query, [patient_id, doctor_id, appointment_datetime, status || "scheduled"]);
      return new Appointment(result.rows[0]);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Update appointment
  static async updateAppointment(id, { patient_id, doctor_name, appointment_datetime, status }) {
    const oldAppointment = (await pool.query("SELECT * FROM appointments WHERE id = $1", [id])).rows[0];
    const updateQuery = `
        UPDATE appointments 
        SET patient_id = $1, doctor_id = $2, appointment_datetime = $3, status = $4 
        WHERE id = $5 
        RETURNING *
      `;

    await pool.query(updateQuery, [
      patient_id || oldAppointment.patient_id,
      doctor_name || oldAppointment.doctor_id,
      appointment_datetime || oldAppointment.appointment_datetime,
      status || oldAppointment.status,
      id,
    ])

    return await this.getAppointmentById(id);
  }

  // Delete appointment
  static async deleteAppointment(id) {
    try {
      const query = 'DELETE FROM appointments WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

module.exports = Appointment;