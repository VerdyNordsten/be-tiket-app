const Pool = require("../config/db")

const selectAllPassengers = (queryObject) => {
  let conditional = ``
  if (queryObject && queryObject.id_booking){
    conditional = `WHERE id_booking='${queryObject.id_booking}'`
  }
  return Pool.query(`SELECT * FROM passengers ${conditional} ORDER BY name ASC`)
}

const selectDetailPassenger = (queryId) => {
  return Pool.query("SELECT * FROM passengers WHERE id=$1", [queryId])
}

const insertPassenger = (queryObject) => {
  const { queryId, id_booking, id_seat, name, category_passenger } = queryObject
  return Pool.query(
      `INSERT INTO passengers(id, id_booking, id_seat, name, category_passenger) ` +
      `VALUES('${queryId}', '${id_booking}', '${id_seat}', '${name}', '${category_passenger}')`
  );
}

const updatePassenger = (queryObject) => {
  const { queryId, id_booking, id_seat, name, category_passenger } = queryObject
  return Pool.query(
      `UPDATE passengers SET id_booking='${id_booking}', name='${name}', id_seat='${id_seat}'` +
      `category_passenger='${category_passenger}' WHERE id='${queryId}'`
  );
}

const deletePassenger = (queryId) => {
  return Pool.query(`DELETE FROM passengers WHERE id='${queryId}'`)
}

module.exports = { 
  selectAllPassengers,
  selectDetailPassenger,
  insertPassenger,
  updatePassenger,
  deletePassenger
}