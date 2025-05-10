const pool = require("../config/db");
const { medicalConditions } = require("../utils/medicalConditions");

// Add new appointment form
const renderAddAppointmentPage = async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patients ORDER BY name");
    const doctors = await pool.query("SELECT * FROM doctors ORDER BY name");

    res.render("pages/appointment-form", {
      title: "Add appointment",
      patients: patients.rows,
      doctors: doctors.rows
    });
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not load appointment form"
    });
  }
}

// Get all appointments page
const getAllAppointments = async (req, res) => {
  const { from, to, doctor } = req.query;

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
    paramIndex ++;
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
  
  try {
    const appointments = await pool.query(query, values);
    
    const doctorsQuery = `
      SELECT DISTINCT d.id, d.name 
      FROM doctors d
      INNER JOIN appointments a ON d.id = a.doctor_id
      ORDER BY d.name
    `;
    const doctors = await pool.query(doctorsQuery);
    
    res.render('pages/appointments', {
      title: 'Appointments',
      appointments: appointments.rows,
      doctors: doctors.rows,
      values: [from, to, doctor]
    });
  } catch (error) {
    console.error("Database error:", error);
    
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve appointments data"
    });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await pool.query(`
      SELECT appointments.*, patients.name AS patient_name, patients.medical_history AS patient_medical_history
      FROM appointments 
      LEFT JOIN patients ON patients.id = appointments.patient_id
      WHERE appointments.id = $1
    `,
      [req.params.id]
    );
    
    let medicalHistory = appointment.rows[0].patient_medical_history.replace(/[{}]/g, '')
      .split(',')
      .map(item => item.replace(/"/g, '').trim());
      
    appointment.rows[0].patient_medical_history = medicalHistory.map((condition) => {
        const found = medicalConditions.find((c) => c.value === condition.trim());
        return found ? found.label : condition.trim();
    }).join(", ");
    
    res.render("pages/appointment-card", {
      title: "Appointment Details",
      appointment: appointment.rows[0],
      medicalConditions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new appointment
const addNewAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_datetime, status } = req.body;

    await pool.query(`
        INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, status ) values ($1, $2, $3, $4) RETURNING *
      `,
      [patient_id, doctor_id, appointment_datetime, status || "scheduled"]
    );

    res.redirect("/appointments");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a appointment form
const renderUpdateAppointmentPage = async (req, res) => {
  try {
    const appointment = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [req.params.id]
    );
    const patients = await pool.query("SELECT * FROM patients ORDER BY name");

    const doctors = await pool.query("SELECT * FROM doctors ORDER BY name");

    res.render("pages/appointment-form", {
      title: "Update appointment",
      patients: patients.rows,
      appointment: appointment.rows[0],
      doctors: doctors.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a appointment
const updateAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_datetime, status } = req.body;

    const oldAppointment = (
      await pool.query("SELECT * FROM appointments WHERE id = $1", [
        req.params.id,
      ])
    ).rows[0];

    await pool.query(`
        UPDATE appointments 
        SET patient_id = $1, doctor_id = $2, appointment_datetime = $3, status = $4 
        WHERE id = $5 
        RETURNING *
      `,
      [
        patient_id || oldAppointment.patient_id,
        doctor_name || oldAppointment.doctor_id,
        appointment_datetime || oldAppointment.appointment_datetime,
        status || oldAppointment.status,
        req.params.id,
      ]
    );

    res.redirect("/appointments");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a appointment
const deleteAppointment = async (req, res) => {
  try {
    await pool.query("DELETE FROM appointments WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "appointments deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  renderAddAppointmentPage,
  getAllAppointments,
  getAppointmentById,
  renderAddAppointmentPage,
  addNewAppointment,
  renderUpdateAppointmentPage,
  updateAppointment,
  deleteAppointment
}