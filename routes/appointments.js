const { Router } = require("express");
const {
  renderAddAppointmentPage,
  getAllAppointments,
  getAppointmentById,
  renderUpdateAppointmentPage,
  updateAppointment,
  deleteAppointment,
  addNewAppointment,
} = require("../controllers/appointmentController");

const router = Router();

// Add appointment page
router.get("/add", renderAddAppointmentPage);

// Get all appointments
router.get("/", getAllAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Add appointment
router.post("/add", addNewAppointment);

// Update appointment page
router.get("/:id/edit", renderUpdateAppointmentPage);

// Update appointment
router.post("/:id/edit", updateAppointment);

// Delete appointment
router.delete("/:id", deleteAppointment);

module.exports = router;
