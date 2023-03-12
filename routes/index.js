const express = require("express")
const router = express.Router()
const userRouter = require("./authRoutes")
const airlineRouter = require("./airlineRoutes")
const bookingRouter = require("./bookingRoutes")

router.use("/user", userRouter)
router.use("/airlines", airlineRouter)
router.use("/bookings", bookingRouter)

module.exports = router
