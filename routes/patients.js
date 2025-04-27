const { Router } = require("express");
const pool = require("../config/db");

const router = Router();

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patients");

    if (patients.rows.length === 0) {
      return res.status(404).json({ message: "Patients not found" });
    }

    res.status(200).json(patients.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [
      req.params.id,
    ]);

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new patient
router.post("/add", async (req, res) => {
  try {
    const { name, age, medical_history, contact_info } = req.body;

    const newPatient = await pool.query(
      "INSERT INTO patients (name, age, medical_history, contact_info) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age, medical_history, contact_info]
    );

    res.status(201).json(newPatient.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a patient
router.put("/:id", async (req, res) => {
  try {
    const { name, age, medical_history, contact_info } = req.body;

    const updatedPatient = await pool.query(
      "UPDATE patients SET name = $1, age = $2, medical_history = $3, contact_info = $4 WHERE id = $5 RETURNING *",
      [name, age, medical_history, contact_info, req.params.id]
    );

    if (updatedPatient.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(updatedPatient.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a patient
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM patients WHERE job_id = $1", [req.params.id]);

    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
