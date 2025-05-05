const pool = require("../config/db");
const { medicalConditions } = require("../utils/medicalConditions");

// GET /patients/add
const renderAddPatientPage = (req, res) => {
  res.render("pages/patient-form", {
    title: "Add Patient",
    medicalConditions,
  });
};

// GET /patients
const getAllPatients = async (req, res) => {
  try {
    let query = "SELECT * FROM patients";
    const queryParams = [];

    if (req.query.medical_history) {
      const selectedMedicalConditions = Array.isArray(req.query.medical_history) 
        ? req.query.medical_history 
        : [req.query.medical_history];
      
      if (selectedMedicalConditions.length > 0) {
        const conditions = selectedMedicalConditions.map((condition, index) => {
          queryParams.push(`%"${condition}"%`);
          return `medical_history LIKE $${index + 1}`;
        });
        query += " WHERE " + conditions.join(" OR ");
      }
    }

    const patients = await pool.query(query, queryParams);

    patients.rows.forEach((patient) => {
      let medicalHistory = [];
      
      if (patient.medical_history) {
        medicalHistory = patient.medical_history
          .replace(/[{}]/g, '')
          .split(',')
          .map(item => item.replace(/"/g, '').trim());
      }
      
      patient.medical_history = medicalHistory.map((condition) => {
        const found = medicalConditions.find((c) => c.value === condition.trim());
        return found ? found.label : condition.trim();
      }).join(", ");
    });

    res.render("pages/patients", {
      title: "Patients",
      patients: patients.rows,
      medicalConditions,
      query: req.query,
      message: patients.rows.length === 0 ? "No patients." : null
    });
  } catch (error) {
    console.error("Database error:", error);
    console.error(error.stack);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve patients data"
    });
  }
};

// GET /patients/:id
const getPatientById = async (req, res) => {
  try {
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [
      req.params.id,
    ]);

    let medicalHistory = patient.rows[0].medical_history.replace(/[{}]/g, '')
      .split(',')
      .map(item => item.replace(/"/g, '').trim());
    
    patient.rows[0].medical_history = medicalHistory.map((condition) => {
      return medicalConditions.find((c) => c.value === condition.trim()).label;
    }).join(", ");

    res.render("pages/patient-card", {
      title: "Patient Details",
      patient: patient.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve patient data",
    });
  }
};

// POST /patients/add
const addNewPatient = async (req, res) => {
  try {
    const { name, age, medical_history, ...contactFields } = req.body;
    const contact_info = JSON.stringify(contactFields);

    await pool.query(
      "INSERT INTO patients (name, age, medical_history, contact_info) VALUES ($1, $2, $3, $4)",
      [name, age, medical_history, contact_info]
    );

    res.redirect("/patients");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("pages/add-patient", {
      title: "Add Patient",
      error: "Failed to add patient. Please try again.",
      formData: req.body,
    });
  }
};

// Render update page
const renderUpdatePatientPage = async (req, res) => {
  try {
    const patient = await pool.query("SELECT * FROM patients WHERE id = $1", [
      req.params.id,
    ]);
    
    res.render("pages/patient-form", {
      title: "Update Patient",
      patient: patient.rows[0],
      medicalConditions
    });
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve patient data for update",
    });
  }
}

// PUT /patients/:id
const updatePatient = async (req, res) => {
  try {    
    const { name, age, medical_history, ...contactFields } = req.body;
    const contact_info = JSON.stringify(contactFields);
    console.log(contact_info);
    
    await pool.query(
      "UPDATE patients SET name = $1, age = $2, medical_history = $3, contact_info = $4 WHERE id = $5 RETURNING *",
      [name, age, medical_history, contact_info, req.params.id]
    );

    res.redirect("/patients");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Failed to update patient. Please try again.",
    });
  }
};

// DELETE /patients/delete/:id
const deletePatient = async (req, res) => {
  try {
    await pool.query("DELETE FROM patients WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Failed to delete patient. Please try again.",
    });
  }
};

module.exports = {
  renderAddPatientPage,
  getAllPatients,
  getPatientById,
  addNewPatient,
  renderUpdatePatientPage,
  updatePatient,
  deletePatient,
};