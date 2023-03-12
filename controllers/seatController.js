const uuid = require("uuid")
const seatModel = require("../models/seatModel")
const commonHelper = require("../helper/common")

const seatController = {
  getAllSeat: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 6
      const offset = (page - 1) * limit
      const sortBY = req.query.sortBY || "no_seat"
      const sort = req.query.sort || "ASC"
      const searchParam = req.query.search ? req.query.search.toLowerCase() : ""
      const id_flight = req.query.id_flight

      const result = await seatModel.selectAllSeatByFlightId(id_flight, limit, offset, searchParam, sortBY, sort)
      if (result.rowCount === 0) {
        return res.json({
          message: "Data not found",
        })
      }
      const {
        rows: [count],
      } = await seatModel.countData()
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData / limit)
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      }
      commonHelper.response(
        res,
        result.rows.map((data) => {
          return {
            ...data,
            name_airline: data.name_airline,
          }
        }),
        200,
        "Get all data seat success",
        pagination
      )
    } catch (error) {
      console.log(error)
    }
  },

  getDetailSeat: async (req, res) => {
    try {
      const id = req.params.id
      const { rows, rowCount } = await seatModel.findSeatWithFlight(id)
      if (!rowCount) {
        return res.json({
          Message: "Data not found",
        })
      }
      const { id_flight, name_airline, no_seat, type_seat, filled } = rows[0]
      const data = {
        id_flight,
        name_airline,
        no_seat,
        type_seat,
        filled,
      }
      commonHelper.response(res, data, 200, "Get detail seat success")
    } catch (err) {
      res.json({
        message: err.message,
      })
    }
  },

  createMultipleSeats: async (req, res) => {
    try {
      const { id_flight, type_seat } = req.body
      const { role } = req.payload
      if (role !== "admin") {
        return commonHelper.response(res, null, 403, "Only Admin are allowed to update Seat")
      }
      let seatNos = []
      if (type_seat === "first class") {
        seatNos = ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D"]
      } else if (type_seat === "business") {
        seatNos = ["3A", "3B", "3C", "3D", "3E", "3F", "4A", "4B", "4C", "4D", "4E", "4F", "5A", "5B", "5C", "5D", "5E", "5F", "6A", "6B", "6C", "6D", "6E", "6F", "7A", "7B", "7C", "7D", "7E", "7F", "8A", "8B", "8C", "8D", "8E", "8F"]
      } else if (type_seat === "economy") {
        seatNos = ["9A", "9B", "9C", "9D", "9E", "9F", "10A", "10B", "10C", "10D", "10E", "10F", "11A", "11B", "11C", "11D", "11E", "11F", "12A", "12B", "12C", "12D", "12E", "12F", "13A", "13B", "13C", "13D", "13E", "13F", "14A", "14B", "14C", "14D", "14E", "14F", "15A", "15B", "15C", "15D", "15E", "15F", "16A", "16B", "16C", "16D", "16E", "16F", "17A", "17B", "17C", "17D", "17E", "17F", "18A", "18B", "18C", "18D", "18E", "18F", "19A", "19B", "19C", "19D", "19E", "19F", "20A", "20B", "20C", "20D", "20E", "20F", "21A", "21B", "21C", "21D", "21E", "21F", "22A", "22B", "22C", "22D", "22E", "22F", "23A", "23B", "23C", "23D", "23E", "23F", "24A", "24B", "24C", "24D", "24E", "24F", "25A", "25B", "25C", "25D", "25E", "25F", "26A", "26B", "26C", "26D", "26E", "26F", "27A", "27B", "27C", "27D", "27E", "27F", "28A", "28B", "28C", "28D", "28E", "28F"]
      } else {
        commonHelper.response(res, null, 400, "Invalid seat type")
        return
      }
      const result = []
      for (let i = 0; i < seatNos.length; i++) {
        const no_seat = seatNos[i]
        const data = {
          id: uuid.v4(),
          id_flight,
          no_seat,
          type_seat,
        }
        const existingSeat = await seatModel.findSeatByFlightIdAndSeatNo(id_flight, no_seat)
        if (existingSeat) {
          result.push({ ...data, message: "Seat already exists for this flight" })
          break // stop the loop after finding one existing seat
        } else {
          await seatModel.insertSeat(data)
          result.push(data)
        }
      }
      if (result.find((r) => r.message === "Seat already exists for this flight")) {
        commonHelper.response(res, null, 400, "Seat already exists for this flight")
      } else {
        commonHelper.response(res, result, 201, "Multiple seats have been created")
      }
    } catch (error) {
      console.error(error)
      commonHelper.response(res, null, 500, "Internal Server Error")
    }
  },

  updateSeat: async (req, res) => {
    const id = req.params.id
    const { no_seat, type_seat, filled } = req.body
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to update Seat")
    }
    const dataPw = await seatModel.findSeatId(id)
    let newData = {}
    if (no_seat) {
      newData.no_seat = no_seat
    }
    if (type_seat) {
      newData.type_seat = type_seat
    }
    if (filled) {
      newData.filled = filled
    }
    const updatedData = {
      no_seat: newData.no_seat || dataPw.rows[0].no_seat,
      type_seat: newData.type_seat || dataPw.rows[0].type_seat,
      filled: newData.filled || dataPw.rows[0].filled,
    }
    await seatModel.updateSeat(updatedData.no_seat, updatedData.type_seat, updatedData.filled, id)
    const responseData = {
      id,
      id_flight: dataPw.rows[0].id_flight,
      no_seat: updatedData.no_seat,
      type_seat: updatedData.type_seat,
      filled: updatedData.filled,
    }
    commonHelper.response(res, responseData, 200, "Edit seat has been successful")
  },

  deleteSeat: async (req, res) => {
    try {
      const { id_flight } = req.body
      const { role } = req.payload
      if (role !== "admin") {
        return commonHelper.response(res, null, 403, "Only Admin are allowed to delete Seat")
      }
      const { rowCount } = await seatModel.findIdFlight(id_flight)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "No seats found for this flight")
      }
      const result = await seatModel.deleteSeat(id_flight)
      commonHelper.response(res, result.rows, 200, "Delete all seat based on id flight have been success")
    } catch (error) {
      console.error(error)
      commonHelper.response(res, null, 500, "Internal Server Error")
    }
  },
}

module.exports = seatController
