// Import Helper for Template Response
const commonHelper = require("../helper/common")

const validateLogin = async (req, res, next) => {
  const { emailOrUsername, password } = req.body
  try {
    const checkEmailOrUsername = async (emailOrUsername) => {
      if (emailOrUsername === "") throw new Error("Email/Username is required")
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailOrUsername) && !/^[a-zA-Z0-9._-]+$/.test(emailOrUsername)) throw new Error("Invalid email/username format")
    }
    const checkPassword = async (password) => {
      if (password === "") throw new Error("Password is required")
      if (password.length < 8) throw new Error("Password must be at least 8 characters")
      if (/\s/.test(password)) throw new Error("Password should not contain any spaces")
    }
    await Promise.all([checkEmailOrUsername(emailOrUsername), checkPassword(password)])
    next()
  } catch (error) {
    return commonHelper.response(res, null, 400, error.message)
  }
}

const validateCreate = async (req, res, next) => {
  const { username, email, password, phone, fullName } = req.body
  try {
    const checkUserNameRegister = async (username) => {
      if (username === "") throw new Error("Username is required")
      if (!/^[a-zA-Z0-9._-]{2,}$/.test(username)) throw new Error("Invalid username format")
    }
    const checkFullNameRegister = async (fullName) => {
      if (fullName === "") throw new Error("Full name is required")
      if (!/^[a-zA-Z ]+$/.test(fullName)) throw new Error("Full name must be alphabetic")
    }
    const checkEmailRegister = async (email) => {
      if (email === "") throw new Error("Email is required")
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new Error("Invalid email format")
    }
    const checkPasswordRegister = async (password) => {
      if (password === "") throw new Error("Password is required")
      if (password.length < 8) throw new Error("Password must be at least 8 characters")
      if (/\s/.test(password)) throw new Error("Password should not contain any spaces")
    }
    const checkPhoneRegister = async (phone) => {
      if (phone === "") throw new Error("Phone number is required")
      if (!/^\d{0,13}$/.test(phone)) throw new Error("Invalid phone number format")
    }
    await Promise.all([checkUserNameRegister(username), checkFullNameRegister(fullName), checkEmailRegister(email), checkPasswordRegister(password), checkPhoneRegister(phone)])
    next()
  } catch (error) {
    return commonHelper.response(res, null, 400, error.message)
  }
}

module.exports = { validateLogin, validateCreate }
