// Import model
const bookingModel = require("../models/bookingModel")

// Import random id
const {v4: uuidv4} = require("uuid")

// Import Helper for Template Response
const commonHelper = require("../helper/common")

const userController = {
  getAllBookings: async (req, res) => {
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await bookingModel.selectAllBookings()
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get all bookings" )
    }
    return commonHelper.response(res, selectResult.rows, 200, "Get all bookings success" )
  },

  getDetailBooking: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await bookingModel.selectDetailBooking(queryId)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, selectResult.rows, 500, "Failed to get detail booking" )
    }
    // Check the affected row
    if (selectResult.rowCount > 0){
      return commonHelper.response(res, selectResult.rows, 200, "Get detail booking success" )
    } else {
      return commonHelper.response(res, selectResult.rows, 404, "Booking not found" )
    }
  },

  addBooking: async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
      const insertResult = await bookingModel.insertBooking(req.body)
      return commonHelper.response(res, insertResult.rows, 200, "Booking added" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to add booking" )
    }
  }, 

  editBooking: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    try {
      const insertResult = await bookingModel.updateBooking(req.body)
      return commonHelper.response(res, insertResult.rows, 200, "Booking edited" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to update booking" )
    }
  },

  deleteBooking: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await bookingModel.deleteBooking(queryId)
      return commonHelper.response(res, deleteResult.rows, 200, "Booking deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete booking" )
    }
  }
}

module.exports = userController
