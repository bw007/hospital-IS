const { Router } = require("express");
const {
  getAllPatients,
  renderAddPatientPage,
  getPatientById,
  addNewPatient,
  updatePatient,
  deletePatient,
  renderUpdatePatientPage,
} = require("../controllers/patientController");

const router = Router();

// Add a new patient page
router.get("/add", renderAddPatientPage);

// Get all patients
router.get("/", getAllPatients);

// Get a single patient by ID
router.get("/:id", getPatientById);

// Add a new patient
router.post("/add", addNewPatient);

// Update page
router.get("/:id/edit", renderUpdatePatientPage);

// Update a patient
router.post("/:id/edit", updatePatient);

// Delete a patient
router.delete("/:id", deletePatient);

module.exports = router;