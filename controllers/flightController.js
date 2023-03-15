const uuid = require("uuid")
const flightModel = require("../models/flightModel")
const commonHelper = require("../helper/common")
const moment = require("moment")

const flightController = {
  getAllFlight: async (req, res) => {
    try {
      const TRIP_TYPE = {
        ONE_WAY: "one way",
        ROUNDED_TRIP: "rounded trip",
      }
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 2
      const offset = (page - 1) * limit
      const sortBY = req.query.sortBY || "price"
      const sort = req.query.sort || "ASC"
      const starting_place = req.query.starting_place || ""
      const destination_place = req.query.destination_place || ""
      const departure_date = req.query.departure_date || ""
      const class_flight = req.query.class_flight || ""
      const type_trip = req.query.type_trip || TRIP_TYPE.ONE_WAY
      const transit = req.query.transit || ""
      const filter_luggage = req.query.filter_luggage || ""
      const filter_meal = req.query.filter_meal || ""
      const filter_wifi = req.query.filter_luggage || ""
      let airlines = req.query.airlines || ""
  
      if (airlines !== "") {
        airlines = airlines.split(",")
      }
  
      let is_round_trip = false
      if (type_trip === TRIP_TYPE.ROUNDED_TRIP) {
        is_round_trip = true
      }
  
      const result = await flightModel.selectAllFlight(
        limit,
        offset,
        sortBY,
        sort,
        starting_place,
        destination_place,
        type_trip,
        transit,
        departure_date,
        class_flight,
        is_round_trip,
        filter_luggage,
        filter_meal,
        filter_wifi,
        airlines
      )
      
      if (!result || !result.rows || result.rows.length === 0) {
        return commonHelper.response(res, null, 404, "Data not found")
      }
      
      const totalData = result.totalData
      const totalPage = result.totalPage
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      }
      
      commonHelper.response(
        res,
        result.rows.map((data) => {
          const dep_time = moment(data.departure_time, "HH:mm")
          const arr_time = moment(data.arrived_time, "HH:mm")
          const duration = moment.duration(arr_time.diff(dep_time))
          const minutes = duration.minutes()
          let duration_formatted = ""
          if (duration.asHours() < 1) {
            duration_formatted = `${minutes} minutes`
          } else {
            const hours = Math.floor(duration.asHours())
            duration_formatted = `${hours} hours ${minutes} minutes`
          }
          return {
            ...data,
            name_airline: data.name_airline,
            image_airline: data.image_airline,
            departure_date: moment(data.departure_date).format("DD-MMMM-YYYY"),
            departure_time: dep_time.format("HH:mm"),
            arrived_date: moment(data.arrived_date).format("DD-MMMM-YYYY"),
            arrived_time: arr_time.format("HH:mm"),
            duration_time: duration_formatted,
          }
        }),
        200,
        "get data success",
        pagination
      )
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, null, 500, "Failed to get all flights")
    }
  },


  getDetailFlight: async (req, res) => {
    try {
      const id = req.params.id
      const { rows, rowCount } = await flightModel.findFlightWithAirline(id)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Data not found")
      }
      const { id_airline, departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price, name_airline, image_airline } = rows[0]
      const dep_time = moment(departure_time, "HH:mm")
      const arr_time = moment(arrived_time, "HH:mm")
      const duration = moment.duration(arr_time.diff(dep_time))
      const minutes = duration.minutes()
      let duration_formatted = ""
      if (duration.asHours() < 1) {
        duration_formatted = `${minutes} minutes`
      } else {
        const hours = Math.floor(duration.asHours())
        duration_formatted = `${hours} hours ${minutes} minutes`
      }
      const data = {
        id_airline,
        name_airline,
        image_airline,
        departure_date: moment(departure_date).format("DD-MMMM-YYYY"),
        departure_time: dep_time.format("HH:mm"),
        arrived_date: moment(arrived_date).format("DD-MMMM-YYYY"),
        arrived_time: arr_time.format("HH:mm"),
        duration_time: duration_formatted,
        starting_place,
        destination_place,
        transit,
        luggage,
        meal,
        wifi,
        class_flight,
        type_trip,
        capacity,
        terminal,
        gate,
        price,
      }
      return commonHelper.response(res, data, 200, "Get detail flight success")
    } catch (err) {
      console.log(err)
      return commonHelper.response(res, null, 500, "Failed to get detail flight")
    }
  },

  createFlight: async (req, res) => {
    const { id_airline, departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price } = req.body
    const id = uuid.v4()
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to add Flight")
    }
    const departureDate = moment(departure_date)
    const arrivedDate = moment(arrived_date)
    if (departureDate.isAfter(arrivedDate)) {
      const errorMessage = `Departure date ${departureDate.format("DD MMMM YYYY")} can't be after arrived date ${arrivedDate.format("DD MMMM YYYY")}`
      return commonHelper.response(res, null, 400, errorMessage)
    }
    if (departureDate.isSame(arrivedDate) && moment(departure_time, "HH:mm").isAfter(moment(arrived_time, "HH:mm"))) {
      const errorMessage = `Departure time ${moment(departure_time, "HH:mm").format("HH:mm")} can't be after arrived time ${moment(arrived_time, "HH:mm").format("HH:mm")} on the same day`
      return commonHelper.response(res, null, 400, errorMessage)
    }
    const data = {
      id,
      id_airline,
      departure_date,
      departure_time,
      arrived_date,
      arrived_time,
      starting_place,
      destination_place,
      transit,
      luggage,
      meal,
      wifi,
      class_flight,
      type_trip,
      capacity,
      terminal,
      gate,
      price,
    }
    flightModel
      .insertFlight(data)
      .then(() => {
        return commonHelper.response(res, data, 201, "Flight has been added")
      })
      .catch((err) => {
        console.log(err)
        return commonHelper.response(res, null, 500, "Failed to create flight")
      })
  },

  updateFlight: async (req, res) => {
    const id = req.params.id
    const { departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price } = req.body
    const { role } = req.payload
    if (role !== "admin") {
      return commonHelper.response(res, null, 403, "Only Admin are allowed to update Flight")
    }
    const dataPw = await flightModel.findFlightId(id)
    if (dataPw.rowCount < 1) {
      return commonHelper.response(res, null, 404, "Flight not found")
    }
    let newData = {}
    if (departure_date) {
      newData.departure_date = departure_date
    }
    if (departure_time) {
      newData.departure_time = departure_time
    }
    if (arrived_date) {
      newData.arrived_date = arrived_date
    }
    if (arrived_time) {
      newData.arrived_time = arrived_time
    }
    if (starting_place) {
      newData.starting_place = starting_place
    }
    if (destination_place) {
      newData.destination_place = destination_place
    }
    if (transit) {
      newData.transit = transit
    }
    if (luggage) {
      newData.luggage = luggage
    }
    if (meal) {
      newData.meal = meal
    }
    if (wifi) {
      newData.wifi = wifi
    }
    if (class_flight) {
      newData.class_flight = class_flight
    }
    if (type_trip) {
      newData.type_trip = type_trip
    }
    if (capacity) {
      newData.capacity = capacity
    }
    if (terminal) {
      newData.terminal = terminal
    }
    if (gate) {
      newData.gate = gate
    }
    if (price) {
      newData.price = price
    }
    const updatedData = {
      departure_date: newData.departure_date || dataPw.rows[0].departure_date,
      departure_time: newData.departure_time || dataPw.rows[0].departure_time,
      arrived_date: newData.arrived_date || dataPw.rows[0].arrived_date,
      arrived_time: newData.arrived_time || dataPw.rows[0].arrived_time,
      starting_place: newData.starting_place || dataPw.rows[0].starting_place,
      destination_place: newData.destination_place || dataPw.rows[0].destination_place,
      transit: newData.transit || dataPw.rows[0].transit,
      luggage: newData.luggage || dataPw.rows[0].luggage,
      meal: newData.meal || dataPw.rows[0].meal,
      wifi: newData.wifi || dataPw.rows[0].wifi,
      class_flight: newData.class_flight || dataPw.rows[0].class_flight,
      type_trip: newData.type_trip || dataPw.rows[0].type_trip,
      capacity: newData.capacity || dataPw.rows[0].capacity,
      terminal: newData.terminal || dataPw.rows[0].terminal,
      gate: newData.gate || dataPw.rows[0].gate,
      price: newData.price || dataPw.rows[0].price,
    }
    await flightModel.updateFlight(updatedData.departure_date, updatedData.departure_time, updatedData.arrived_date, updatedData.arrived_time, updatedData.starting_place, updatedData.destination_place, updatedData.transit, updatedData.luggage, updatedData.meal, updatedData.wifi, updatedData.class_flight, updatedData.type_trip, updatedData.capacity, updatedData.terminal, updatedData.gate, updatedData.price, id)
    const responseData = {
      id,
      id_airline: dataPw.rows[0].id_airline,
      departure_date: updatedData.departure_date,
      departure_time: updatedData.departure_time,
      arrived_date: updatedData.arrived_date,
      arrived_time: updatedData.arrived_time,
      starting_place: updatedData.starting_place,
      destination_place: updatedData.destination_place,
      transit: updatedData.transit,
      luggage: updatedData.luggage,
      meal: updatedData.meal,
      wifi: updatedData.wifi,
      class_flight: updatedData.class_flight,
      type_trip: updatedData.type_trip,
      capacity: updatedData.capacity,
      terminal: updatedData.terminal,
      gate: updatedData.gate,
      price: updatedData.price,
    }
    return commonHelper.response(res, responseData, 200, "Edit flight has been successful")
  },

  deleteFlight: async (req, res) => {
    try {
      const id = req.params.id
      const { role } = req.payload
      if (role !== "admin") {
        return commonHelper.response(res, null, 403, "Only Admin are allowed to delete Flight")
      }
      const { rowCount } = await flightModel.findFlightId(id)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Flight id not found")
      }
      flightModel
        .deleteFlight(id)
        .then((result) => {
          return commonHelper.response(res, result.rows, 200, "Flight has been deleted")
        })
        .catch((err) => {
          return commonHelper.response(err, null, 500, "Failed to delete flight")
        })
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = flightController
