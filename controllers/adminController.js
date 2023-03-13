/* eslint-disable no-unused-vars */
const adminModel = require("../models/adminModel")
const uuid = require("uuid")
const commonHelper = require("../helper/common")
const authHelper = require("../helper/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10

const adminController = {
  registerAdmin: async (req, res) => {
    try {
      const { username, email, password, phone } = req.body
      const checkEmail = await adminModel.findEmail(email)
      if (checkEmail.rowCount > 0) {
        return commonHelper.response(res, null, 409, "Email already exist" )
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
      const result = await adminModel.insertAdmin(data)
      return commonHelper.response(res, result.rows, 201, "Register admin has been success")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to register" )
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body
      const {
        rows: [user],
      } = await adminModel.findEmail(email)
      if (!user) {
        return commonHelper.response(res, null, 401, "Email is invalid" )
      }
      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) {
        return commonHelper.response(res, null, 401, "Password is invalid" )
      }
      delete user.password
      let payload = {
        email: user.email,
        id: user.id, // add the user ID to the payload
        role: user.role,
      }
      user.token = authHelper.generateToken(payload)
      user.refreshToken = authHelper.generateRefreshToken(payload)
      return commonHelper.response(res, user, 201, "Login admin is successful")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to login" )
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
      rows: [user],
    } = await adminModel.findEmail(email)
    delete user.password
    return commonHelper.response(res, user, 200, "Get data admin is successful")
  },
}

module.exports = adminController
