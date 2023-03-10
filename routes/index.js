const express = require("express")
const router = express.Router()
const userRouter = require("./authRoutes")
const airlineRouter = require("./airlineRoutes")

router.use("/user", userRouter)
router.use("/airlines", airlineRouter)

module.exports = router
