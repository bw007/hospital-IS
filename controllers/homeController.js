const pool = require("../config/db");

const getHomePage = async (req, res) => {
  try {
    const doctors = await pool.query("SELECT COUNT(*) FROM doctors");
    const patients = await pool.query("SELECT COUNT(*) FROM patients");
    const appointments = await pool.query("SELECT COUNT(*) FROM appointments");

    res.render("pages/index", {
      title: "Home",
      doctorsTotal: parseInt(doctors.rows[0].count),
      patientsTotal: parseInt(patients.rows[0].count),
      appointmentsTotal: parseInt(appointments.rows[0].count),
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).render('pages/error', {
      title: 'Error',
      message: 'Failed to load home page data'
    });
  }
};

module.exports = {
  getHomePage,
};
