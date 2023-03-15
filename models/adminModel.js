const Pool = require("../config/db")

const findId = (userId) => {
  return Pool.query("SELECT * FROM admin WHERE id = $1", [userId])
}

const findEmail = (email) => {
  return Pool.query("SELECT * FROM admin WHERE email = $1", [email])
}

const insertAdmin = async (data) => {
  return await Pool.query("INSERT INTO admin (id, username, email, password, phone) VALUES ($1, $2, $3, $4, $5)", [data.id, data.username, data.email, data.password, data.phone])
}

module.exports = { findId, findEmail, insertAdmin }
