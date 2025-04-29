const { Router } = require("express");

const router = Router();

router.use("/", require("./home"))
router.use("/patients", require("./patients"));

module.exports = router;
