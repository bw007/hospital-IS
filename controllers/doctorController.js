const pool = require('../config/db');

// Render the add doctor page
const renderAddDoctorPage = (req, res) => {
  res.render('pages/doctor-form', {
    title: 'Add Doctor'
  });
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await pool.query('SELECT * FROM doctors');
    console.log(doctors.rows);
    
    res.render('pages/doctors', {
      title: 'Doctors List',
      doctors: doctors.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [req.params.id]);
    
    res.render('pages/doctor-card', {
      title: `Doctor details`,
      doctor: doctor.rows[0]
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
    
    await pool.query(
      'INSERT INTO doctors (name, specialty, contact_info) VALUES ($1, $2, $3) RETURNING *',
      [name, specialty, contact_info]
    );
    
    res.redirect('/doctors');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Render the update doctor page
const renderUpdateDoctorPage = async (req, res) => {
  try {
    const doctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [req.params.id]);
    
    res.render('pages/doctor-form', {
      title: 'Update Doctor',
      doctor: doctor.rows[0]
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
    
    await pool.query(
      'UPDATE doctors SET name = $1, specialty = $2, contact_info = $3 WHERE id = $4 RETURNING *',
      [name, specialty, contact_info, req.params.id]
    );
    
    res.redirect('/doctors');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    await pool.query('DELETE FROM doctors WHERE id = $1', [req.params.id]);
    res.redirect('/doctors');
  } catch (error) {
    res.status(500).json({ message: error.message });
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