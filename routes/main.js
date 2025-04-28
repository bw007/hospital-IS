const { Router } = require("express");
const pool = require("../config/db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patients");
    const appointments = await pool.query("SELECT * FROM appointments");

    res.render("pages/index", {
      title: "Home",
      patients: patients.rows.length,
      appointments: appointments.rows.length,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
