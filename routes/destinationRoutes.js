// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const destinationController = require("../controllers/destinationController")

// Import upload
const upload = require("../middleware/upload.js");

// Import verif token
const { verifyToken } = require("../middleware/auth")

router.get("/", destinationController.getAllDestinations)
router.get("/:id", destinationController.getDetailDestination)
router.post("/", verifyToken, upload.single("photo"), destinationController.addDestination)
router.put("/:id", verifyToken, upload.single("photo"), destinationController.editDestination)
router.delete("/:id", verifyToken, destinationController.deleteDestination)

module.exports = router
