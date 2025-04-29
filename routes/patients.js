const { Router } = require("express");
const pool = require("../config/db");

const router = Router();

// Add a new patient page
router.get("/add", (req, res) => {  
  res.render("pages/add-patient", {
    title: "Add Patient",
  });
});

// Get all patients
router.get("/", async (req, res) => {  
  try {
    const patients = await pool.query("SELECT * FROM patients");
    
    res.render("pages/patients", {
      title: "Patients",
      patients: patients.rows,
      message: patients.rows.length === 0 ? "No patients found" : null
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve patients data"
    });
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
    const { name, age, medical_history, ...contactFields } = req.body;
    const contact_info = JSON.stringify(contactFields);
    
    if (!name || !age || !medical_history) {
      return res.status(400).render("pages/add-patient", {
        title: "Add Patient",
        error: "Name, age and medical history are required",
        formData: req.body
      });
    }

    await pool.query(
      "INSERT INTO patients (name, age, medical_history, contact_info) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age, medical_history, contact_info]
    );

    res.redirect("/patients");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("pages/add-patient", {
      title: "Add Patient",
      error: "Failed to add patient. Please try again.",
      formData: req.body
    });
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
