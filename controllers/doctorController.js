const Doctor = require('../models/Doctor');

// Render the add doctor page
const renderAddDoctorPage = (req, res) => {
  try {
    res.render('pages/doctor-form', {
      title: 'Add Doctor'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('pages/error', {
      title: 'Error', 
      message: 'Failed to load doctor form'
    });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAllDoctors();
    
    res.render('pages/doctors', {
      title: 'Doctors List',
      doctors
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('pages/error', {
      title: 'Error',
      message: 'Failed to load doctors list'
    });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.getDoctorById(req.params.id);
    
    if (!doctor) {
      return res.status(404).render('pages/error', {
        title: 'Error',
        message: 'Doctor not found'
      });
    }

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

    await Doctor.addNewDoctor({ name, specialty, contact_info })
    
    res.redirect('/doctors');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('pages/error', {
      title: 'Error',
      message: 'Failed to add new doctor'
    });
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
    console.error('Error:', error);
    res.status(500).render('pages/error', {
      title: 'Error',
      message: 'Failed to load doctor update form'
    });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  try {
    const { name, specialty, ...contactFields } = req.body;
    const contact_info = JSON.stringify(contactFields);
    
    const updatedDoctor = await Doctor.updateDoctor(req.params.id, { name, specialty, contact_info });
    
    if (!updatedDoctor) {
      return res.status(404).render('pages/error', {
        title: 'Not Found',
        message: 'Doctor not found'
      });
    }
    
    res.redirect('/doctors');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('pages/error', {
      title: 'Error',
      message: 'Failed to update doctor'
    });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.deleteDoctor(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
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