const Doctor = require('../models/Doctor');

// Render the add doctor page
const renderAddDoctorPage = (req, res) => {
  res.render('pages/doctor-form', {
    title: 'Add Doctor'
  });
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAllDoctors();
    console.log(doctors);
    
    res.render('pages/doctors', {
      title: 'Doctors List',
      doctors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.getDoctorById(req.params.id);
    
    res.render('pages/doctor-card', {
      title: `Doctor details`,
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add a new doctor
const addNewDoctor = async (req, res) => {
  try {
    const { name, specialty, ...contactFields } = req.body;
    const contact_info = JSON.stringify(contactFields);

    await Doctor.addNewDoctor(name, specialty, contact_info)
    
    res.redirect('/doctors');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Render the update doctor page
const renderUpdateDoctorPage = async (req, res) => {
  try {
    const doctor = await Doctor.getDoctorById(req.params.id);
    
    res.render('pages/doctor-form', {
      title: 'Update Doctor',
      doctor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  try {
    const { name, specialty, ...contactFields } = req.body;
    const contact_info = JSON.stringify(contactFields);
    
    await Doctor.updateDoctor(name, specialty, contact_info, req.params.id)
    
    res.redirect('/doctors');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    await Doctor.deleteDoctor(req.params.id)
    
    res.status(200).json({ message: "Doctor deleted" })
  } catch (error) {
    res.status(500).render("pages/error", {
      title: "Error",
      message: "Failed to delete doctor. Please try again.",
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  renderAddDoctorPage,
  addNewDoctor,
  renderUpdateDoctorPage,
  updateDoctor,
  deleteDoctor
};