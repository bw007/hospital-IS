const { Router } = require("express");
const {
  getAllDoctors,
  renderAddDoctorPage,
  addNewDoctor,
  renderUpdateDoctorPage,
  updateDoctor,
  getDoctorById,
  deleteDoctor,
} = require("../controllers/doctorController");

const router = Router();

router.get("/add", renderAddDoctorPage);
router.get("/", getAllDoctors);
router.post("/add", addNewDoctor);
router.get("/:id", getDoctorById);
router.get("/:id/edit", renderUpdateDoctorPage);
router.post("/:id/edit", updateDoctor);
router.delete("/:id", deleteDoctor)

module.exports = router;
