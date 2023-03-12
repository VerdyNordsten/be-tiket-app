// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const passengerController = require("../controllers/passengerController")

router.get("/", passengerController.getAllPassengers)
router.get("/:id", passengerController.getDetailPassenger)
router.post("/", passengerController.addPassenger)
router.put("/:id", passengerController.editPassenger)
router.delete("/:id", passengerController.deletePassenger)

module.exports = router
