const pool = require("../config/db");
const Patient = require("../models/Patient");
const { medicalConditions } = require("../utils/medicalConditions");

// GET /patients/add
const renderAddPatientPage = (req, res) => {
  try {
    res.render("pages/patient-form", {
      title: "Add Patient",
      medicalConditions,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not render add patient page",
    });
  }
};

// GET /patients
const getAllPatients = async (req, res) => {
  try {
    let { from, to, medical_history } = req.query;
    if (from) from = new Date(from).toISOString();
    if (to) to = new Date(to + 'T23:59:59').toISOString();

    const patients = await Patient.getAllPatients({ from, to, medical_history });

    res.render("pages/patients", {
      title: "Patients",
      patients,
      medicalConditions,
      query: req.query,
      message: patients.length === 0 ? "No patients." : null
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve patients data"
    });
  }
};

// GET /patients/:id
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.getPatientById(req.params.id);

    res.render("pages/patient-card", {
      title: "Patient Details",
      patient
    });
  } catch (error) {
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

    await Patient.addNewPatient({ name, age, medical_history, contact_info })

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

    await Patient.updatePatient(req.params.id, { name, age, medical_history, contact_info })

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
    await Patient.deletePatient(req.params.id);
    
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