const { Router } = require("express");
const pool = require("../config/db");

const router = Router();

router.get("/add", async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patients ORDER BY name")
   
    res.render("pages/appointment-form", {
      title: "Add appointment",
      patients: patients.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const appointments = await pool.query(`
      SELECT appointments.*, patients.name AS patient_name
      FROM appointments 
      LEFT JOIN patients ON patients.id = appointments.patient_id
      ORDER BY appointments.created_at DESC
    `);
    
    res.render("pages/appointments", {
      title: "Appointments",
      appointments: appointments.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const appointments = await pool.query(`
      SELECT appointments.name, appointments.salary, jobs.title
      FROM appointments 
      LEFT JOIN jobs ON job_id = appointments.job_id
      WHERE appointments.id = $1  
    `, [ req.params.id ]);

    res.status(200).json(appointments.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.post("/add", async (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_date, status } = req.body;
    console.log(req.body);
    
    await pool.query(`
        INSERT INTO appointments (patient_id, doctor_name, appointment_date, status ) VALUES ($1, $2, $3, $4) RETURNING *
      `, [ patient_id, doctor_name, appointment_date, status || 'scheduled' ]);

    res.redirect('/appointments');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const appointment = await pool.query("SELECT * FROM appointments WHERE id = $1", [req.params.id]);
    const patients = await pool.query("SELECT * FROM patients ORDER BY name");
    
    res.render("pages/appointment-form", {
      title: "Update appointment",
      patients: patients.rows,
      appointment: appointment.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/edit", async (req, res) => { 
  try {
    const { id } = req.params;
    const { patient_id, doctor_name, appointment_date, status } = req.body;

    const oldAppointment = (await pool.query("SELECT * FROM appointments WHERE id = $1", [id])).rows[0];
    
    if (!oldAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ma'lumotlarni yangilash - kelgan ma'lumotlar bo'lmasa eski qiymatlardan foydalanish
    const updatedAppointment = await pool.query(`
        UPDATE appointments 
        SET patient_id = $1, 
            doctor_name = $2, 
            appointment_date = $3, 
            status = $4 
        WHERE id = $5 
        RETURNING *
      `, [
        patient_id || oldAppointment.patient_id,
        doctor_name || oldAppointment.doctor_name,
        appointment_date || oldAppointment.appointment_date,
        status || oldAppointment.status,
        id
      ]
    );
      
    // API so'rovi uchun JSON javob
    res.status(200).json(updatedAppointment.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => { 
  try {
    await pool.query("DELETE FROM appointments WHERE id = $1", [ req.params.id ])

    res.status(200).json({ message: "appointments deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
