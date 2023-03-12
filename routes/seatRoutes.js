const express = require("express")
const router = express.Router()
const multer = require("multer")
const form = multer()
const seatController = require("../controllers/seatController")
// const { validateCreateSeat, validateUpdateSeat } = require('../middleware/validateSeat')
const { verifyToken } = require("../middleware/auth")

// Add Seat
router.get("/", form.none(), seatController.getAllSeat)
router.get("/:id", seatController.getDetailSeat)
router.post("/", verifyToken, form.none(), seatController.createMultipleSeats)
router.put("/:id", verifyToken, form.none(), seatController.updateSeat)
router.delete("/", verifyToken, form.none(), seatController.deleteSeat)

module.exports = router
