const Pool = require("../config/db")

const selectAllBookings = (queryObject) => {
  let conditional = ``
  if (queryObject && queryObject.id_user){
    conditional = `WHERE id_user='${queryObject.id_user}'`
  }
  return Pool.query(`SELECT * FROM bookings ${conditional} ORDER BY name_contact ASC`)
}

const selectDetailBooking = (queryId) => {
  return Pool.query("SELECT * FROM bookings WHERE id=$1", [queryId])
}

const insertBooking = (queryObject) => {
  const { queryId, id_user, id_flight, name_contact, email_contact, phone_contact,
          insurance, capacity, status, total_price } = queryObject
  return Pool.query(
      `INSERT INTO bookings(id, id_user, id_flight, name_contact, email_contact, phone_contact, insurance, capacity, status, total_price) ` +
      `VALUES('${queryId}', '${id_user}', '${id_flight}', '${name_contact}', '${email_contact}', '${phone_contact}', ${insurance}, ${capacity}, ${status}, ${total_price})`
  );
}

const updateBooking = (queryObject) => {
  const { queryId, id_user, id_flight, name_contact, email_contact, phone_contact,
          insurance, capacity, status, total_price } = queryObject
  return Pool.query(
      `UPDATE bookings SET id_user='${id_user}', id_flight='${id_flight}', name_contact='${name_contact}', email_contact='${email_contact}',` +
      `phone_contact='${phone_contact}', insurance=${insurance}, capacity=${capacity}, status=${status}, total_price=${total_price} WHERE id='${queryId}'`
  );
}

const deleteBooking = (queryId) => {
  return Pool.query(`DELETE FROM bookings WHERE id='${queryId}'`)
}

module.exports = { 
  selectAllBookings,
  selectDetailBooking,
  insertBooking,
  updateBooking,
  deleteBooking
}