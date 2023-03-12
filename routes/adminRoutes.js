const express = require("express")
const router = express.Router()
const multer = require("multer")
const form = multer()
const adminController = require("../controllers/adminController")
const { verifyToken } = require("../middleware/auth")
const { validateLogin, validateRegister } = require("../middleware/validateAdmin")

router.post("/register", form.none(), validateRegister, adminController.registerAdmin)
router.post("/login", form.none(), validateLogin, adminController.loginAdmin)
router.post("/refresh-token", adminController.refreshToken)
router.get("/profile", verifyToken, adminController.profileAdmin)

module.exports = router
