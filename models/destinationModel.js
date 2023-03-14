const Pool = require("../config/db")

const selectAllDestinations = () => {
  return Pool.query("SELECT * FROM destinations ORDER BY popularity ASC")
}

const selectDetailDestination = (queryId) => {
  return Pool.query("SELECT * FROM destinations WHERE id=$1", [queryId])
}

const insertDestination = (queryObject) => {
  const { queryId, name } = queryObject
  return Pool.query(
      `INSERT INTO destinations(id, name) ` +
      `VALUES('${queryId}', '${name}')`
  );
}

const updateDestination = (queryObject) => {
  const { queryId, name, popularity } = queryObject
  return Pool.query(
      `UPDATE destinations SET name='${name}',` +
      `popularity='${popularity}' WHERE id='${queryId}'`
  );
}

const deleteDestination = (queryId) => {
  return Pool.query(`DELETE FROM destinations WHERE id='${queryId}'`)
}

module.exports = { 
  selectAllDestinations,
  selectDetailDestination,
  insertDestination,
  updateDestination,
  deleteDestination
}