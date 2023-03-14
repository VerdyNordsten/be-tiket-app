// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const destinationController = require("../controllers/destinationController")

router.get("/", destinationController.getAllDestinations)
router.get("/:id", destinationController.getDetailDestination)
router.post("/", destinationController.addDestination)
router.put("/:id", destinationController.editDestination)
router.delete("/:id", destinationController.deleteDestination)

module.exports = router
