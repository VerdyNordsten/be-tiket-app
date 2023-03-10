// Import model
const airlineModel = require("../models/airlineModel")

// Import random id
const {v4: uuidv4} = require("uuid")

// Import Helper for Template Response
const commonHelper = require("../helper/common")

// Import upload google
const {
    updatePhoto,
    uploadPhoto,
    deletePhoto,
} = require("../config/googleDrive.config");

const userController = {
  getAllAirlines: async (req, res) => {
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await airlineModel.selectAllAirlines()
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, selectResult.rows, 500, "Failed to get all airlines" )
    }
    return commonHelper.response(res, selectResult.rows, 200, "Get all airlines success" )
  },

  getDetailAirline: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await airlineModel.selectDetailAirline(queryId)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, selectResult.rows, 500, "Failed to get detail airline" )
    }
    // Check the affected row
    if (selectResult.rowCount > 0){
      return commonHelper.response(res, selectResult.rows, 200, "Get detail airlines success" )
    } else {
      return commonHelper.response(res, selectResult.rows, 404, "Airline not found" )
    }
  },

  addAirline: async (req, res) => {
    // Generate Id
    req.body.queryId = uuidv4()
    // Upload to google drive
    try {
      const uploadResult = await uploadPhoto(req.file);
      const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
      req.body.queryFilename = parentPath.concat(uploadResult.id);
    } catch (error) {
      console.log(error)
      // Default if upload error
      req.body.queryFilename = "photo.jpg";
    }
    // Declare variable for holding query result
    let insertResult
    try {
      insertResult = await airlineModel.insertAirline(req.body)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, insertResult.rows, 500, "Failed to add airline" )
    }
    return commonHelper.response(res, insertResult.rows, 200, "Airline added" )
  }, 

  editAirline: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await airlineModel.selectDetailAirline(queryId)
      if (selectResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Airline not found" )
      }
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get data airline" )
    }
    // Update the old photo
    const oldPhoto = selectResult.rows[0].photo;
    try {
      if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "") {
        const oldPhotoId = oldPhoto.split("=")[1];
        const updateResult = await updatePhoto(
            req.file,
            oldPhotoId
        );
        const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
        req.body.queryFilename = parentPath.concat(updateResult.id);
      } else {
        const uploadResult = await uploadPhoto(req.file);
        const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
        req.body.queryFilename = parentPath.concat(uploadResult.id);
      }
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to update airline photo" )
    }
    // Update other field
    try {
      const insertResult = await airlineModel.updateAirline(req.body)
      return commonHelper.response(res, insertResult.rows, 200, "Airline edited" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to update airline" )
    }
  },

  deleteAirline: async (req, res) => {
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await airlineModel.selectDetailAirline(queryId)
      if (selectResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Airline not found" )
      }
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get data airline" )
    }
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await airlineModel.deleteAirline(queryId)
      const oldPhoto = selectResult.rows[0].photo;
      if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "") {
        const oldPhotoId = oldPhoto.split("=")[1];
        await deletePhoto(oldPhotoId);
      }
      return commonHelper.response(res, deleteResult.rows, 200, "Airline deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete airline" )
    }
  }
}

module.exports = userController
