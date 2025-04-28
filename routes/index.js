const { Router } = require("express");

const router = Router();

router.use("/", require("./main"))
router.use("/patients", require("./patients"));

module.exports = router;
