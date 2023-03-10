const Pool = require("../config/db")

const findId = (userId) => {
  return Pool.query("SELECT * FROM users WHERE id = $1", [userId])
}

const findEmail = (email) => {
  return Pool.query("SELECT * FROM users WHERE email = $1", [email])
}

const insertUser = async (data) => {
  return await Pool.query("INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)", [data.id, data.name, data.email, data.password])
}

const editProfile = (name, password, phone_number, id) => {
  return new Promise((resolve, reject) => {
    const query = {
      text: "UPDATE users SET name=$1, password=$2, phone_number=$3 WHERE id=$4",
      values: [name, password, phone_number, id],
    }
    Pool.query(query, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = { findId, findEmail, insertUser, editProfile }
