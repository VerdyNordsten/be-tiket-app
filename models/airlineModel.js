const Pool = require("../config/db")

const selectAllAirlines = () => {
  return Pool.query("SELECT * FROM airlines ORDER BY name ASC")
}

const selectDetailAirline = (queryId) => {
  return Pool.query("SELECT * FROM airlines WHERE id=$1", [queryId])
}

const insertAirline = (queryObject) => {
  const { queryId, name, queryFilename, active } = queryObject
  return Pool.query(
      `INSERT INTO airlines(id, name, photo, active) ` +
      `VALUES('${queryId}', '${name}', '${queryFilename}', '${active}')`
  );
}

const updateAirline = (queryObject) => {
  const { queryId, name, queryFilename, active } = queryObject
  return Pool.query(
      `UPDATE airlines SET name='${name}', photo='${queryFilename}',` +
      `active='${active}' WHERE id='${queryId}'`
  );
}

const deleteAirline = (queryId) => {
  return Pool.query(`DELETE FROM airlines WHERE id='${queryId}'`)
}

module.exports = { 
  selectAllAirlines,
  selectDetailAirline,
  insertAirline,
  updateAirline,
  deleteAirline
}