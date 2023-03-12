const express = require("express")
const router = express.Router()
const userRouter = require("./authRoutes")
const adminRouter = require("./adminRoutes")
const airlineRouter = require("./airlineRoutes")
const flightRouter = require("./flightRoutes")
const bookingRouter = require("./bookingRoutes")
const notificationRouter = require("./notificationRoutes")
const seatRouter = require("./seatRoutes")

router.use("/user", userRouter)
router.use("/admin", adminRouter)
router.use("/airlines", airlineRouter)
router.use("/flights", flightRouter)
router.use("/bookings", bookingRouter)
router.use("/notifications", notificationRouter)
router.use("/seats", seatRouter)

module.exports = router
