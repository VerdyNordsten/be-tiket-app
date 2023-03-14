// Import model
const bookingModel = require("../models/bookingModel")
const passengerModel = require("../models/passengerModel")
const ticketModel = require("../models/ticketModel")

// Import random id
const {v4: uuidv4} = require("uuid")

// Import Helper for Template Response
const commonHelper = require("../helper/common")

const payBooking = async (bookingId) => {
  let selectPassengerResult
  try {
    console.log(bookingId)
    const queryObject = {
      id_booking: bookingId
    }
    selectPassengerResult = await passengerModel.selectAllPassengers(queryObject)
    selectPassengerResult.rows.forEach(async (element)=>{
      const queryId = uuidv4()
      const queryObject = {
        queryId: queryId,
        id_passenger: element.id,
        code: uuidv4().slice(0,3)
      }
      await ticketModel.insertTicket(queryObject)
      await bookingModel.updateFilledSeat(element.id_seat)
    })
  } catch (error) {
    console.log(error)
  }
}

const bookingController = {
  getAllBookings: async (req, res) => {
    // Set query as const
    const queryObject = {
      id_user: req.query.id_user
    }
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await bookingModel.selectAllBookings(queryObject)
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
    // Use token as replacement for user id
    if (req.payload.role && req.payload.role === "user"){
      req.body.id_user = req.payload.id
    }
    // Generate Id
    req.body.queryId = uuidv4()
    try {
      const insertResult = await bookingModel.insertBooking(req.body)
      return commonHelper.response(res, req.body, 201, "Booking added" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "users".')){
        return commonHelper.response(res, null, 400, "User id is not present in table users")
      }
      if (error.detail && error.detail.includes('is not present in table "flights".')){
        return commonHelper.response(res, null, 400, "Flight id is not present in table flights")
      }
      return commonHelper.response(res, null, 500, "Failed to add booking" )
    }
  }, 

  editBooking: async (req, res) => {
    // Validate Role
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to edit Booking")
    }
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    let selectResult
    try {
      selectResult = await bookingModel.selectDetailBooking(queryId)
      if (selectResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Booking not found" )
      }
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to select booking")
    }
    const oldStatus = selectResult.rows[0].status
    const newStatus = req.body.status
    try {
      const insertResult = await bookingModel.updateBooking(req.body)
      if (newStatus && oldStatus == 0 && newStatus == 1){
        // const selectFlightResult = await bookingModel.selectDetailFlightById()
        await payBooking(queryId)
      }
      return commonHelper.response(res, insertResult.rows, 200, "Booking edited" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "users".')){
        return commonHelper.response(res, null, 400, "User id is not present in table users")
      }
      if (error.detail && error.detail.includes('is not present in table "flights".')){
        return commonHelper.response(res, null, 400, "Flight id is not present in table flights")
      }
      return commonHelper.response(res, null, 500, "Failed to update booking" )
    }
  },

  deleteBooking: async (req, res) => {
    // Validate Role
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to delete Booking")
    }
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await bookingModel.deleteBooking(queryId)
      if (deleteResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Booking not found" )
      }
      return commonHelper.response(res, deleteResult.rows, 200, "Booking deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete booking" )
    }
  }
}

module.exports = bookingController