const express = require("express")
const router = express.Router()
const multer = require("multer")
const form = multer()
const flightController = require("../controllers/flightController")
// const { validateCreateFlight, validateUpdateFlight } = require('../middleware/validateFlight')
const { verifyToken } = require("../middleware/auth")

// Add Flight
router.get("/", flightController.getAllFlight)
router.get("/:id", flightController.getDetailFlight)
router.post("/", verifyToken, form.none(), flightController.createFlight)
router.put("/:id", verifyToken, form.none(), flightController.updateFlight)
router.delete("/:id", verifyToken, form.none(), flightController.deleteFlight)

module.exports = router
