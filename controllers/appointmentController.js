const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { medicalConditions } = require("../utils/medicalConditions");

// Add new appointment form
const renderAddAppointmentPage = async (req, res) => {
  try {
    const patients = await Patient.getAllPatients({ orderBy: "name", orderDir: "asc" });
    const doctors = await Doctor.getAllDoctors({ orderBy: "name", orderDir: "asc" })

    res.render("pages/appointment-form", {
      title: "Add appointment",
      patients,
      doctors
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
  try {
    const { from, to, doctor } = req.query;
    const appointments = await Appointment.getAllAppointments({ from, to, doctor })
    const doctors = await Appointment.getDoctorsWithAppointments();
    
    res.render('pages/appointments', {
      title: 'Appointments',
      appointments,
      doctors,
      values: [from, to, doctor]
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve appointments data"
    });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.getAppointmentById(req.params.id)
    
    res.render("pages/appointment-card", {
      title: "Appointment Details",
      appointment,
      medicalConditions
    });
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not retrieve appointment details"
    });
  }
};

// Add new appointment
const addNewAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_datetime, status } = req.body;
    await Appointment.addAppointment({ patient_id, doctor_id, appointment_datetime, status })
    
    res.redirect("/appointments");
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error", 
      message: "Could not add appointment"
    });
  }
};

// Update a appointment form
const renderUpdateAppointmentPage = async (req, res) => {
  try {
    const appointment = await Appointment.getAppointmentById(req.params.id)
    const patients = await Patient.getAllPatients({ orderBy: "name", orderDir: "asc" });
    const doctors = await Doctor.getAllDoctors({ orderBy: "name", orderDir: "asc" })

    res.render("pages/appointment-form", {
      title: "Update appointment",
      patients,
      appointment,
      doctors
    });
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not load appointment update form"
    });
  }
};

// Update a appointment
const updateAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_datetime, status } = req.body;
    await Appointment.updateAppointment(req.params.id, {patient_id, doctor_name, appointment_datetime, status})    

    res.redirect("/appointments");
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not update appointment"
    });
  }
};

// Delete a appointment
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.deleteAppointment(req.params.id);
    
    res.status(200).json({ message: "appointments deleted" });
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Could not delete appointment"
    });
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