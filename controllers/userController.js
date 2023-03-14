/* eslint-disable no-unused-vars */
const userModel = require("../models/userModel")
const uuid = require("uuid")
const commonHelper = require("../helper/common")
const authHelper = require("../helper/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10
// Import upload google
const { updatePhoto, uploadPhoto, deletePhoto } = require("../config/googleDrive.config")

const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body
      const checkEmail = await userModel.findEmail(email)
      if (checkEmail.rowCount > 0) {
        return commonHelper.response(res, null, 409, "Email already exist" )
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
      return commonHelper.response(res, result.rows, 201, "Register has been success")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to register")
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body
      const {
        rows: [user],
      } = await userModel.findEmail(email)
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
        role: "user"
      }
      user.token = authHelper.generateToken(payload)
      user.refreshToken = authHelper.generateRefreshToken(payload)
      return commonHelper.response(res, user, 201, "Login is successful")
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

  profileUser: async (req, res) => {
    const email = req.payload.email
    const {
      rows: [user],
    } = await userModel.findEmail(email)
    delete user.password
    return commonHelper.response(res, user, 200, "Get data profile is successful")
  },

  editProfile: async (req, res) => {
    const userId = req.payload.id
    const { name, password, phone, city, address, title, post_code } = req.body
    if (req.payload.id !== userId) {
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
    if (phone) {
      newData.phone = phone
    }
    if (city) {
      newData.city = city
    }
    if (address) {
      newData.address = address
    }
    if (title) {
      newData.title = title
    }
    if (post_code) {
      newData.post_code = post_code
    }
    if (req.file) {
      try {
        let oldPhotoId
        if (dataPw.rows[0].photo !== null) {
          oldPhotoId = dataPw.rows[0].photo.split("=")[1]
          await deletePhoto(oldPhotoId)
        }
        const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH
        const uploadResult = await uploadPhoto(req.file)
        const filename = parentPath.concat(uploadResult.id)
        await updatePhoto(req.file, uploadResult.id)
        newData.photo = filename
      } catch (error) {
        console.log(error)
        return commonHelper.response(res, null, 500, "Failed to update profile photo")
      }
    }
    const updatedData = {
      name: newData.name || dataPw.rows[0].name,
      password: newData.password || dataPw.rows[0].password,
      phone: newData.phone || dataPw.rows[0].phone,
      city: newData.city || dataPw.rows[0].city,
      address: newData.address || dataPw.rows[0].address,
      title: newData.title || dataPw.rows[0].title,
      post_code: newData.post_code || dataPw.rows[0].post_code,
      photo: newData.photo || dataPw.rows[0].photo,
    }
    await userModel.editProfile(updatedData.name, updatedData.password, updatedData.phone, updatedData.city, updatedData.address, updatedData.title, updatedData.post_code, updatedData.photo, userId)
    const responseData = {
      id: userId,
      name: updatedData.name,
      email: dataPw.rows[0].email,
      phone: updatedData.phone,
      city: updatedData.city,
      address: updatedData.address,
      title: updatedData.title,
      post_code: updatedData.post_code,
      photo: updatedData.photo,
    }
    return commonHelper.response(res, responseData, 200, "Edit profile is successful")
  },
}

module.exports = userController
