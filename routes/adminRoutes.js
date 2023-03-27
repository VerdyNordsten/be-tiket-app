const express = require("express")
const router = express.Router()
const multer = require("multer")
const form = multer()
const adminController = require("../controllers/adminController")
const { verifyToken } = require("../middleware/auth")
const { validateLogin, validateCreate } = require("../middleware/validateAdmin")

router.get("/list", verifyToken, adminController.getAllAdmin)
router.post("/create", verifyToken, form.none(), validateCreate, adminController.createAdmin)
router.put("/:id", verifyToken, form.none(), adminController.activedAdmin)
router.post("/login", form.none(), validateLogin, adminController.loginAdmin)
router.post("/refresh-token", adminController.refreshToken)
router.get("/profile", verifyToken, adminController.profileAdmin)

module.exports = router
