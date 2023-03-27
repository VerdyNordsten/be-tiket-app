const express = require("express")
const router = express.Router()
const multer = require("multer")
const form = multer()
const superAdminController = require("../controllers/superAdminController")
const { verifyToken } = require("../middleware/auth")
const { validateLogin, validateCreate } = require("../middleware/validateAdmin")

router.post("/create", form.none(), validateCreate, superAdminController.createSuperAdmin)
router.post("/login", form.none(), validateLogin, superAdminController.loginSuperAdmin)
router.post("/refresh-token", superAdminController.refreshToken)
router.get("/profile", verifyToken, superAdminController.profileSuperAdmin)

module.exports = router
