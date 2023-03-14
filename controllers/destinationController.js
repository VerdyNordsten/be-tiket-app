// Import model
const destinationModel = require("../models/destinationModel")

// Import random id
const {v4: uuidv4} = require("uuid")

// Import Helper for Template Response
const commonHelper = require("../helper/common")

const destinationController = {
  getAllDestinations: async (req, res) => {
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await destinationModel.selectAllDestinations()
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get all destinations" )
    }
    return commonHelper.response(res, selectResult.rows, 200, "Get all destinations success" )
  },

  getDetailDestination: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await destinationModel.selectDetailDestination(queryId)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, selectResult.rows, 500, "Failed to get detail destination" )
    }
    // Check the affected row
    if (selectResult.rowCount > 0){
      return commonHelper.response(res, selectResult.rows, 200, "Get detail destination success" )
    } else {
      return commonHelper.response(res, selectResult.rows, 404, "Destination not found" )
    }
  },

  addDestination: async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    try {
      const insertResult = await destinationModel.insertDestination(req.body)
      return commonHelper.response(res, insertResult.rows, 200, "Destination added" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "passengers".')){
        return commonHelper.response(res, null, 400, "Passenger id is not present in table passengers")
      }
      return commonHelper.response(res, null, 500, "Failed to add destination" )
    }
  }, 

  editDestination: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    try {
      const insertResult = await destinationModel.updateDestination(req.body)
      if (insertResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Destination not found" )
      }
      return commonHelper.response(res, insertResult.rows, 200, "Destination edited" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('is not present in table "passengers".')){
        return commonHelper.response(res, null, 400, "Passenger id is not present in table passengers")
      }
      return commonHelper.response(res, null, 500, "Failed to update destination" )
    }
  },

  deleteDestination: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await destinationModel.deleteDestination(queryId)
      if (deleteResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Destination not found" )
      }
      return commonHelper.response(res, deleteResult.rows, 200, "Destination deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete destination" )
    }
  }
}

module.exports = destinationController