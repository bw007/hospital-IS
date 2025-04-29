const { Router } = require("express");
const pool = require("../config/db");

const router = Router();

router.get("/add", async (req, res) => {
  try {
    res.render("pages/add-appointment", {
      title: "add appointments"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const appointments = await pool.query("SELECT * FROM appointments");

    res.render("pages/appointments", {
      title: "appointments",
      appointmentss: appointments.rows,
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
    const { name, salary, degree, job_id } = req.body;
    const newappointments = await pool.query(`
        INSERT INTO appointments (name, salary, degree, job_id) VALUES ($1, $2, $3, $4) RETURNING *
      `, [ name, salary, degree, job_id ]);

    res.status(201).json(newappointments.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/edit/:id", async (req, res) => { 
  try {
    const { id } = req.params;
    const { name, salary, degree, job_id } = req.body;

    const oldappointments = (await pool.query("SELECT * FROM appointments WHERE id = $1", [ id ])).rows[0];

    const updateappointments = await pool.query(`
        UPDATE appointments SET name = $1, salary = $2, degree = $3, job_id = $4 WHERE id = $5 RETURNING *
      `, [
        name ? name : oldappointments.name,
        salary ? salary : oldappointments.salary,
        degree ? degree : oldappointments.degree,
        job_id ? job_id : oldappointments.job_id,
        id
      ]
    );
      
    res.status(201).json(updateappointments.rows[0]);
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
