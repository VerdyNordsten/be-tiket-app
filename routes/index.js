const express = require("express")
const router = express.Router()
const userRouter = require("./authRoutes")

router.use("/user", userRouter)

module.exports = router
