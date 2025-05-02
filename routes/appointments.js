const { Router } = require("express");
const pool = require("../config/db");
const { medicalConditions } = require("../utils/medicalConditions");

const router = Router();

router.get("/add", async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patients ORDER BY name");

    res.render("pages/appointment-form", {
      title: "Add appointment",
      patients: patients.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  const { from, to } = req.query;

  const query = `
    SELECT appointments.*, patients.name AS patient_name
    FROM appointments
    LEFT JOIN patients ON patients.id = appointments.patient_id
    ${from && to ? `WHERE appointment_date BETWEEN '${from}' AND '${to}'` : ''}
    ORDER BY appointments.created_at DESC
  `;

  const appointments = await pool.query(query);

  res.render('pages/appointments', {
    title: 'Appointments',
    appointments: appointments.rows,
    values: [from, to]
  });
});


router.get("/:id", async (req, res) => {
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
      return medicalConditions.find((c) => c.value === condition.trim()).label;
    }).join(", ");

    res.render("pages/appointment-card", {
      title: "Appointment Details",
      appointment: appointment.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_date, status } = req.body;

    await pool.query(
      `
        INSERT INTO appointments (patient_id, doctor_name, appointment_date, status ) VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [patient_id, doctor_name, appointment_date, status || "scheduled"]
    );

    res.redirect("/appointments");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const appointment = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [req.params.id]
    );
    const patients = await pool.query("SELECT * FROM patients ORDER BY name");

    res.render("pages/appointment-form", {
      title: "Update appointment",
      patients: patients.rows,
      appointment: appointment.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/edit", async (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_date, status } = req.body;

    const oldAppointment = (
      await pool.query("SELECT * FROM appointments WHERE id = $1", [
        req.params.id,
      ])
    ).rows[0];

    await pool.query(`
        UPDATE appointments 
        SET patient_id = $1, doctor_name = $2, appointment_date = $3, status = $4 
        WHERE id = $5 
        RETURNING *
      `,
      [
        patient_id || oldAppointment.patient_id,
        doctor_name || oldAppointment.doctor_name,
        appointment_date || oldAppointment.appointment_date,
        status || oldAppointment.status,
        req.params.id,
      ]
    );

    res.redirect("/appointments");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM appointments WHERE id = $1", [req.params.id]);

    res.status(200).json({ message: "appointments deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
