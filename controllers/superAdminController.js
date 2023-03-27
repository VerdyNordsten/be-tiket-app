/* eslint-disable no-unused-vars */
const superAdminModel = require("../models/superAdminModel")
const uuid = require("uuid")
const commonHelper = require("../helper/common")
const authHelper = require("../helper/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10

const superAdminController = {
  createSuperAdmin: async (req, res) => {
    try {
      const { username, email, password, phone } = req.body
      const checkEmail = await superAdminModel.findEmail(email)
      if (checkEmail.rowCount > 0) {
        return commonHelper.response(res, null, 409, "Email Super admin already exist" )
      }
      const hashPassword = await bcrypt.hash(password, saltRounds)
      const id = uuid.v4()
      const data = {
        id,
        username,
        email,
        password: hashPassword,
        phone,
      }
      const result = await superAdminModel.createSuperAdmin(data)
      return commonHelper.response(res, result.rows, 201, "Create Super admin has been success")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to create admin" )
    }
  },

  loginSuperAdmin: async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body
      if (!emailOrUsername) {
        return commonHelper.response(res, null, 400, "Email/Username is required")
      }
      let superAdmin
      if (emailOrUsername.includes("@")) {
        const {
          rows: [result],
        } = await superAdminModel.findEmail(emailOrUsername)
        superAdmin = result
      } else {
        const {
          rows: [result],
        } = await superAdminModel.findUserName(emailOrUsername)
        superAdmin = result
      }
      if (!superAdmin) {
        return commonHelper.response(res, null, 401, "Email/Username is invalid")
      }
      const isValidPassword = bcrypt.compareSync(password, superAdmin.password)
      if (!isValidPassword) {
        return commonHelper.response(res, null, 401, "Password is invalid")
      }
      delete superAdmin.password
      let payload = {
        email: superAdmin.email,
        id: superAdmin.id,
        role: superAdmin.role,
      }
      superAdmin.token = authHelper.generateToken(payload)
      superAdmin.refreshToken = authHelper.generateRefreshToken(payload)
      return commonHelper.response(res, superAdmin, 201, "Login Super admin is successful")
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

  profileSuperAdmin: async (req, res) => {
    const email = req.payload.email
    const {
      rows: [superAdmin],
    } = await superAdminModel.findEmail(email)
    delete superAdmin.password
    return commonHelper.response(res, superAdmin, 200, "Get data super admin is successful")
  },
}

module.exports = superAdminController
