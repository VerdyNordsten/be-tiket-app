const express = require("express")
const router = express.Router()
const multer = require("multer")
const form = multer()
const userController = require("../controllers/userController")
const { verifyToken } = require("../middleware/auth")
const { validateLogin, validateRegister } = require("../middleware/validateUser")

router.post("/register", form.none(), validateRegister, userController.registerUser)
router.post("/login", form.none(), validateLogin, userController.loginUser)
router.post("/refresh-token", userController.refreshToken)
router.get("/profile", verifyToken, userController.profileUser)
router.put("/edit", verifyToken, form.none(), userController.editProfile)

module.exports = router
