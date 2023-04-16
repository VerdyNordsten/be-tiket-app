const Pool = require("../config/db")

const findId = (userId) => {
  return Pool.query("SELECT * FROM super_admin WHERE id = $1", [userId])
}

const findEmail = (email) => {
  return Pool.query("SELECT * FROM super_admin WHERE email = $1", [email])
}

const findUserName = (username) => {
  return Pool.query("SELECT * FROM super_admin WHERE username = $1", [username])
}

const createSuperAdmin = async (data) => {
  return await Pool.query("INSERT INTO super_admin (id, username, email, password, phone) VALUES ($1, $2, $3, $4, $5)", [data.id, data.username, data.email, data.password, data.phone])
}

module.exports = { findId, findEmail, findUserName, createSuperAdmin }
