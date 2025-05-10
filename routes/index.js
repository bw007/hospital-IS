const { Router } = require("express");

const router = Router();

router.use("/", require("./home"));
router.use("/doctors", require("./doctors"));
router.use("/patients", require("./patients"));
router.use("/appointments", require("./appointments"));

module.exports = router;
