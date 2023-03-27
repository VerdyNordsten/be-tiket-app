const Pool = require("../config/db")

const getAllAdmin = () => {
  return Pool.query("SELECT * FROM admin ORDER BY fullname ASC")
}

const findId = (userId) => {
  return Pool.query("SELECT * FROM admin WHERE id = $1", [userId])
}

const findEmail = (email) => {
  return Pool.query("SELECT * FROM admin WHERE email = $1", [email])
}

const findUserName = (username) => {
  return Pool.query("SELECT * FROM admin WHERE username = $1", [username])
}

const createAdmin = async (data) => {
  return await Pool.query("INSERT INTO admin (id, username, fullname, email, password, phone) VALUES ($1, $2, $3, $4, $5, $6)", [data.id, data.username, data.fullname, data.email, data.password, data.phone])
}

const updateAdmin = (id, data) => {
  const query = {
    text: "UPDATE admin SET is_actived=$1 WHERE id = $2",
    values: [data.is_actived, id],
  }
  return Pool.query(query)
}


module.exports = { getAllAdmin, findId, findEmail, findUserName, createAdmin, updateAdmin }
