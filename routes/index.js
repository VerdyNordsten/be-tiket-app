const express = require("express")
const router = express.Router()
const userRouter = require("./authRoutes")
const adminRouter = require("./adminRoutes")
const airlineRouter = require("./airlineRoutes")
const flightRouter = require("./flightRoutes")

router.use("/user", userRouter)
router.use("/admin", adminRouter)
router.use("/airlines", airlineRouter)
router.use("/flights", flightRouter)

module.exports = router
