/* eslint-disable no-unused-vars */
const adminModel = require("../models/adminModel")
const uuid = require("uuid")
const commonHelper = require("../helper/common")
const authHelper = require("../helper/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10

const adminController = {
  getAllAdmin: async (req, res) => {
    try {
      const { role } = req.payload
      if (role !== "super admin") {
        return commonHelper.response(res, null, 403, "Only Super Admin are allowed to get all Admin")
      }
      let selectResult = await adminModel.getAllAdmin()
      const adminList = selectResult.rows.map((admin) => {
        const { password, ...rest } = admin
        return rest
      })
      return commonHelper.response(res, adminList, 200, "Get all admin success")
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get all admin")
    }
  },

  createAdmin: async (req, res) => {
    try {
      const { role } = req.payload
      if (role !== "super admin") {
        return commonHelper.response(res, null, 403, "Only Super Admin are allowed to Create User Admin")
      }
      const { username, fullname, email, password, phone } = req.body
      const checkEmail = await adminModel.findEmail(email)
      if (checkEmail.rowCount > 0) {
        return commonHelper.response(res, null, 409, "Email admin already exist")
      }
      const hashPassword = await bcrypt.hash(password, saltRounds)
      const id = uuid.v4()
      const data = {
        id,
        username,
        fullname,
        email,
        password: hashPassword,
        phone,
      }
      const result = await adminModel.createAdmin(data)
      return commonHelper.response(res, result.rows, 201, "Create admin has been success")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to create admin")
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body
      if (!emailOrUsername) {
        return commonHelper.response(res, null, 400, "Email/Username is required")
      }
      let admin
      if (emailOrUsername.includes("@")) {
        const {
          rows: [result],
        } = await adminModel.findEmail(emailOrUsername)
        admin = result
      } else {
        const {
          rows: [result],
        } = await adminModel.findUserName(emailOrUsername)
        admin = result
      }
      if (!admin) {
        return commonHelper.response(res, null, 401, "Email/Username is invalid")
      }
      if (!admin.is_actived) {
        return commonHelper.response(res, null, 401, "Admin account is not activated")
      }
      const isValidPassword = bcrypt.compareSync(password, admin.password)
      if (!isValidPassword) {
        return commonHelper.response(res, null, 401, "Password is invalid")
      }
      delete admin.password
      let payload = {
        email: admin.email,
        id: admin.id,
        role: admin.role,
      }
      admin.token = authHelper.generateToken(payload)
      admin.refreshToken = authHelper.generateRefreshToken(payload)
      return commonHelper.response(res, admin, 201, "Login admin is successful")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to login")
    }
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT)
    let payload = {
      email: decoded.email,
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    }
    return commonHelper.response(res, result, 200, "Get refresh token is successful")
  },

  profileAdmin: async (req, res) => {
    const email = req.payload.email
    const {
      rows: [admin],
    } = await adminModel.findEmail(email)
    delete admin.password
    return commonHelper.response(res, admin, 200, "Get data admin is successful")
  },

  activedAdmin: async (req, res) => {
    try {
      const id = req.params.id
      const { is_actived } = req.body
      const { role } = req.payload
      if (role !== "super admin") {
        return commonHelper.response(res, null, 403, "Only Super Admin are allowed to activate/deactivate admin accounts")
      }
      const admin = await adminModel.findId(id)
      if (!admin || !admin.rows || admin.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Admin account not found")
      }
      await adminModel.updateAdmin(id, { is_actived })
      const responseData = {
        id: id,
        is_actived: is_actived,
      }
      return commonHelper.response(res, responseData, 200, "Admin account is activated/deactivated successfully")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to activate/deactivate admin account")
    }
  },
}

module.exports = adminController
