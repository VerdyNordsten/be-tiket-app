const Pool = require("../config/db")

const selectAllDestinations = (queryLimit) => {
  if (!queryLimit){
    queryLimit = 10
  }
  return Pool.query(`SELECT * FROM destinations ORDER BY popularity DESC LIMIT '${queryLimit}'`)
}

const selectDetailDestination = (queryId) => {
  return Pool.query("SELECT * FROM destinations WHERE id=$1", [queryId])
}

const insertDestination = (queryObject) => {
  const { queryId, name, description, queryFilename} = queryObject
  return Pool.query(
      `INSERT INTO destinations(id, name, description, photo) ` +
      `VALUES('${queryId}', '${name}', '${description}', '${queryFilename}')`
  );
}

const updateDestination = (queryObject) => {
  const { queryId, name, popularity, description, queryFilename} = queryObject
  return Pool.query(
      `UPDATE destinations SET name='${name}',` +
      `popularity='${popularity}', photo='${queryFilename}', description='${description}' WHERE id='${queryId}'`
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