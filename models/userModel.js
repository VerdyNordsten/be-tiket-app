const Pool = require("../config/db")

const findId = (userId) => {
  return Pool.query("SELECT * FROM users WHERE id = $1", [userId])
}

const findEmail = (email) => {
  return Pool.query("SELECT * FROM users WHERE email = $1", [email])
}

const insertUser = async (data) => {
  return await Pool.query("INSERT INTO users (id, name, email, password, type) VALUES ($1, $2, $3, $4, $5)", [data.id, data.name, data.email, data.password, data.type])
}

const editProfile = (name, password, phone, city, address, title, post_code, photo, id) => {
  return new Promise((resolve, reject) => {
    const query = {
      text: "UPDATE users SET name=$1, password=$2, phone=$3, city=$4, address=$5, title=$6, post_code=$7, photo=$8 WHERE id=$9",
      values: [name, password, phone, city, address, title, post_code, photo, id],
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
