// Import model
const notificationModel = require("../models/notificationModel")

// Import random id
const {v4: uuidv4} = require("uuid")

// Import Helper for Template Response
const commonHelper = require("../helper/common")

const notificationController = {
  getAllNotifications: async (req, res) => {
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await notificationModel.selectAllNotifications()
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get all notifications" )
    }
    return commonHelper.response(res, selectResult.rows, 200, "Get all notifications success" )
  },

  getDetailNotification: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await notificationModel.selectDetailNotification(queryId)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, selectResult.rows, 500, "Failed to get detail notification" )
    }
    // Check the affected row
    if (selectResult.rowCount > 0){
      return commonHelper.response(res, selectResult.rows, 200, "Get detail notification success" )
    } else {
      return commonHelper.response(res, selectResult.rows, 404, "Notification not found" )
    }
  },

  addNotification: async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
      const insertResult = await notificationModel.insertNotification(req.body)
      return commonHelper.response(res, insertResult.rows, 200, "Notification added" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "users".')){
        return commonHelper.response(res, null, 400, "User id is not present in table users")
      }
      return commonHelper.response(res, null, 500, "Failed to add notification" )
    }
  }, 

  editNotification: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    try {
      const insertResult = await notificationModel.updateNotification(req.body)
      if (insertResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Notification not found" )
      }
      return commonHelper.response(res, insertResult.rows, 200, "Notification edited" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "users".')){
        return commonHelper.response(res, null, 400, "User id is not present in table users")
      }
      return commonHelper.response(res, null, 500, "Failed to update notification" )
    }
  },

  deleteNotification: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await notificationModel.deleteNotification(queryId)
      if (deleteResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Notification not found" )
      }
      return commonHelper.response(res, deleteResult.rows, 200, "Notification deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete notification" )
    }
  }
}

module.exports = notificationController