// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const airlineController = require("../controllers/airlineController")

// Import upload
const upload = require("../middleware/upload.js");

// Import verif token
const { verifyToken } = require("../middleware/auth")

router.get("/", airlineController.getAllAirlines)
router.get("/:id", airlineController.getDetailAirline)
router.post("/", verifyToken, upload.single("photo"), airlineController.addAirline)
router.put("/:id", verifyToken, upload.single("photo"), airlineController.editAirline)
router.delete("/:id", verifyToken, airlineController.deleteAirline)

module.exports = router
