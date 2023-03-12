const Pool = require("../config/db")

const selectAllNotifications = () => {
  return Pool.query("SELECT * FROM notifications ORDER BY title ASC")
}

const selectDetailNotification = (queryId) => {
  return Pool.query("SELECT * FROM notifications WHERE id=$1", [queryId])
}

const insertNotification = (queryObject) => {
  const { queryId, id_user, title, content, filled } = queryObject
  return Pool.query(
      `INSERT INTO notifications(id, id_user, title, content, filled) ` +
      `VALUES('${queryId}', '${id_user}', '${title}', '${content}', ${filled})`
  );
}

const updateNotification = (queryObject) => {
  const { queryId, id_user, title, content, filled } = queryObject
  return Pool.query(
      `UPDATE notifications SET id_user='${id_user}', title='${title}', content='${content}',` +
      `filled=${filled} WHERE id='${queryId}'`
  );
}

const deleteNotification = (queryId) => {
  return Pool.query(`DELETE FROM notifications WHERE id='${queryId}'`)
}

module.exports = { 
  selectAllNotifications,
  selectDetailNotification,
  insertNotification,
  updateNotification,
  deleteNotification
}