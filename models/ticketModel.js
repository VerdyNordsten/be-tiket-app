const Pool = require("../config/db")

const selectAllTickets = () => {
  return Pool.query("SELECT * FROM tickets ORDER BY code ASC")
}

const selectDetailTicket = (queryId) => {
  return Pool.query("SELECT * FROM tickets WHERE id=$1", [queryId])
}

const insertTicket = (queryObject) => {
  const { queryId, id_booking, id_seat, code } = queryObject
  return Pool.query(
      `INSERT INTO tickets(id, id_booking, id_seat, code) ` +
      `VALUES('${queryId}', '${id_booking}', '${id_seat}', '${code}')`
  );
}

const updateTicket = (queryObject) => {
  const { queryId, id_booking, id_seat, code } = queryObject
  return Pool.query(
      `UPDATE tickets SET id_booking='${id_booking}', id_seat='${id_seat}',` +
      `code='${code}' WHERE id='${queryId}'`
  );
}

const deleteTicket = (queryId) => {
  return Pool.query(`DELETE FROM tickets WHERE id='${queryId}'`)
}

module.exports = { 
  selectAllTickets,
  selectDetailTicket,
  insertTicket,
  updateTicket,
  deleteTicket
}