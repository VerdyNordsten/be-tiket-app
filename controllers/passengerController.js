// Import model
const passengerModel = require("../models/passengerModel")

// Import random id
const {v4: uuidv4} = require("uuid")

// Import Helper for Template Response
const commonHelper = require("../helper/common")

const passengerController = {
  getAllPassengers: async (req, res) => {
    // Setup conditional select
    let queryObject = {
      id_booking : req.query.id_booking
    }
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await passengerModel.selectAllPassengers(queryObject)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get all passengers" )
    }
    return commonHelper.response(res, selectResult.rows, 200, "Get all passengers success" )
  },

  getDetailPassenger: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await passengerModel.selectDetailPassenger(queryId)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, selectResult.rows, 500, "Failed to get detail passenger" )
    }
    // Check the affected row
    if (selectResult.rowCount > 0){
      return commonHelper.response(res, selectResult.rows, 200, "Get detail passenger success" )
    } else {
      return commonHelper.response(res, selectResult.rows, 404, "Passenger not found" )
    }
  },

  addPassenger: async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
      const insertResult = await passengerModel.insertPassenger(req.body)
      return commonHelper.response(res, insertResult.rows, 201, "Passenger added" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "bookings".')){
        return commonHelper.response(res, null, 400, "Booking id is not present in table bookings")
      }
      if (error.detail && error.detail.includes('is not present in table "seats".')){
        return commonHelper.response(res, null, 400, "Seat id is not present in table seats")
      }
      return commonHelper.response(res, null, 500, "Failed to add passenger" )
    }
  }, 

  editPassenger: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    try {
      const insertResult = await passengerModel.updatePassenger(req.body)
      if (insertResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Passenger not found" )
      }
      return commonHelper.response(res, insertResult.rows, 200, "Passenger edited" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "bookings".')){
        return commonHelper.response(res, null, 400, "Booking id is not present in table bookings")
      }
      if (error.detail && error.detail.includes('is not present in table "seats".')){
        return commonHelper.response(res, null, 400, "Seat id is not present in table seats")
      }
      return commonHelper.response(res, null, 500, "Failed to update passenger" )
    }
  },

  deletePassenger: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await passengerModel.deletePassenger(queryId)
      if (deleteResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Passenger not found" )
      }
      return commonHelper.response(res, deleteResult.rows, 200, "Passenger deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete passenger" )
    }
  }
}

module.exports = passengerController