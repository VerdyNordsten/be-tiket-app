// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const notificationController = require("../controllers/notificationController")

router.get("/", notificationController.getAllNotifications)
router.get("/:id", notificationController.getDetailNotification)
router.post("/", notificationController.addNotification)
router.put("/:id", notificationController.editNotification)
router.delete("/:id", notificationController.deleteNotification)

module.exports = router
