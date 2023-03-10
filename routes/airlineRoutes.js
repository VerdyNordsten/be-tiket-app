// Import express and router
const express = require("express")
const router = express.Router()

// Import controller functions
const airlineController = require("../controllers/airlineController")

// Import upload
const upload = require("../middleware/upload.js");

// router.post("/register", form.none(), validateRegister, userController.registerUser)
// router.post("/login", form.none(), validateLogin, userController.loginUser)
// router.post("/refresh-token", userController.refreshToken)
// router.get("/profile", verifyToken, userController.profileUser)
// router.put("/edit", verifyToken, form.none(), userController.editProfile)

router.get("/", airlineController.getAllAirlines)
router.get("/:id", airlineController.getDetailAirline)
router.post("/", upload.single("photo"), airlineController.addAirline)
router.put("/:id", upload.single("photo"), airlineController.editAirline)
router.delete("/:id", airlineController.deleteAirline)

module.exports = router
