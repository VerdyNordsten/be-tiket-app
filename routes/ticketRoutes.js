// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const ticketController = require("../controllers/ticketController")

router.get("/", ticketController.getAllTickets)
router.get("/:id", ticketController.getDetailTicket)
router.post("/", ticketController.addTicket)
router.put("/:id", ticketController.editTicket)
router.delete("/:id", ticketController.deleteTicket)

module.exports = router
