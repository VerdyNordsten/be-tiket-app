// Import model
const destinationModel = require("../models/destinationModel")

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

const destinationController = {
  getAllDestinations: async (req, res) => {
    // Set params as const
    const queryLimit = req.query.limit
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await destinationModel.selectAllDestinations(queryLimit)
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
    // Validate Role
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to add Destination")
    }
    // Generate Id
    req.body.queryId = uuidv4()
    // Upload to google drive
    let uploadResult
    try {
      uploadResult = await uploadPhoto(req.file);
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
      insertResult = await destinationModel.insertDestination(req.body)
    } catch (error) {
      console.log(error)
      try {
        if (uploadResult){
          deletePhoto(uploadResult.id)
        }
      } catch (error) {
        console.log(error)
      }
      if (error.detail && error.detail.includes('already exists.')) {
        return commonHelper.response(res, null, 400, "Destination name already exist" )
      } else {
        return commonHelper.response(res, null, 500, "Failed to add destination" )
      }
    }
    return commonHelper.response(res, insertResult.rows, 200, "Destination added" )
  }, 

  editDestination: async (req, res) => {
    // Validate Role
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to edit Destination")
    }
    // Set param id as const
    const queryId = req.params.id
    req.body.queryId = queryId
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await destinationModel.selectDetailDestination(queryId)
      if (selectResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Destination not found" )
      }
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get data destination" )
    }
    // Update the old photo
    const oldPhoto = selectResult.rows[0].photo;
    if (req.file){
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
        return commonHelper.response(res, null, 500, "Failed to update destination photo" )
      }
    } else {
      req.body.queryFilename = oldPhoto
    }
    // Update other field
    try {
      const updateResult = await destinationModel.updateDestination(req.body)
      return commonHelper.response(res, updateResult.rows, 200, "Destination edited" )
    } catch (error) {
      console.log(error)
      if (error.detail && error.detail.includes('already exists.')) {
        return commonHelper.response(res, null, 400, "Destination name already exist" )
      } else {
        return commonHelper.response(res, null, 500, "Failed to update destination" )
      }
    }
  },

  deleteDestination: async (req, res) => {
    // Validate Role
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to delete Destination")
    }
    // Set param id as const
    const queryId = req.params.id
    // Declare variable for holding query result
    let selectResult
    try {
      selectResult = await destinationModel.selectDetailDestination(queryId)
      if (selectResult.rowCount < 1){
        return commonHelper.response(res, null, 404, "Destination not found" )
      }
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get data destination" )
    }
    // Declare variable for holding query result
    let deleteResult
    try {
      deleteResult = await destinationModel.deleteDestination(queryId)
      const oldPhoto = selectResult.rows[0].photo;
      if (oldPhoto != "undefined" && oldPhoto != "photo.jpg" && oldPhoto != "") {
        const oldPhotoId = oldPhoto.split("=")[1];
        await deletePhoto(oldPhotoId);
      }
      return commonHelper.response(res, deleteResult.rows, 200, "Destination deleted" )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to delete destination" )
    }
  }
}

module.exports = destinationController