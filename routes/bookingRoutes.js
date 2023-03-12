// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const bookingController = require("../controllers/bookingController")

router.get("/", bookingController.getAllBookings)
router.get("/:id", bookingController.getDetailBooking)
router.post("/", bookingController.addBooking)
router.put("/:id", bookingController.editBooking)
router.delete("/:id", bookingController.deleteBooking)

module.exports = router
