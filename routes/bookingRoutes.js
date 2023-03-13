// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const bookingController = require("../controllers/bookingController")

// Import verif token
const { verifyToken } = require("../middleware/auth")

router.get("/", bookingController.getAllBookings)
router.get("/:id", bookingController.getDetailBooking)
router.post("/", verifyToken, bookingController.addBooking)
router.put("/:id", verifyToken, bookingController.editBooking)
router.delete("/:id", verifyToken,bookingController.deleteBooking)

module.exports = router
