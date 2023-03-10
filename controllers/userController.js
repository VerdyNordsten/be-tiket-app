/* eslint-disable no-unused-vars */
const userModel = require("../models/userModel")
const uuid = require("uuid")
const commonHelper = require("../helper/common")
const authHelper = require("../helper/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10

const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body
      const checkEmail = await userModel.findEmail(email)
      if (checkEmail.rowCount > 0) {
        return res.json({
          message: "Email already exist",
        })
      }
      const hashPassword = await bcrypt.hash(password, saltRounds)
      const id = uuid.v4()
      const data = {
        id,
        name,
        email,
        password: hashPassword,
      }
      const result = await userModel.insertUser(data)
      commonHelper.response(res, result.rows, 201, "Register has been success")
    } catch (err) {
      res.send(err)
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body
      const {
        rows: [user],
      } = await userModel.findEmail(email)
      if (!user) {
        return res.json({
          message: "Email is invalid",
        })
      }
      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) {
        return res.json({
          message: "Password is invalid",
        })
      }
      delete user.password
      let payload = {
        email: user.email,
        id: user.id, // add the user ID to the payload
      }
      user.token = authHelper.generateToken(payload)
      user.refreshToken = authHelper.generateRefreshToken(payload)
      commonHelper.response(res, user, 201, "Login is successful")
    } catch (err) {
      res.send(err)
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
    commonHelper.response(res, result, 200, "Get refresh token is successful")
  },

  profileUser: async (req, res) => {
    const email = req.payload.email
    const {
      rows: [user],
    } = await userModel.findEmail(email)
    delete user.password
    commonHelper.response(res, user, 200, "Get data profile is successful")
  },

  editProfile: async (req, res) => {
    const userId = req.payload.id
    const { name, password, phone_number } = req.body

    if (req.payload.role !== "worker") {
      return commonHelper.response(res, null, 401, "You are not authorized to edit this profile")
    }

    const dataPw = await userModel.findId(userId)

    let newData = {}
    if (name) {
      newData.name = name
    }
    if (password) {
      newData.password = await bcrypt.hash(password, saltRounds)
    }
    if (phone_number) {
      newData.phone_number = phone_number
    }

    const updatedData = {
      name: newData.name || dataPw.rows[0].name,
      password: newData.password || dataPw.rows[0].password,
      phone_number: newData.phone_number || dataPw.rows[0].phone_number,
    }

    await userModel.editProfileWorker(updatedData.name, updatedData.password, updatedData.phone_number, userId)

    const responseData = {
      id: userId,
      name: updatedData.name,
      email: dataPw.rows[0].email,
      phone_number: updatedData.phone_number,
    }
    commonHelper.response(res, responseData, 200, "Edit profile is successful")
  },
}

module.exports = userController
