const Pool = require("../config/db")

const selectAllFlight = (limit, offset, searchParam, sortBY, sort) => {
  const query = `
    SELECT 
      flights.*, 
      airlines.name as name_airline,
      airlines.photo as image_airline
    FROM flights
    INNER JOIN airlines ON flights.id_airline = airlines.id
    WHERE lower(flights.starting_place) LIKE $1
    ORDER BY ${sortBY} ${sort}
    LIMIT $2
    OFFSET $3
  `
  const values = [`%${searchParam}%`, limit, offset]
  return Pool.query(query, values)
}

const findFlightWithAirline = (id) => {
  const query = `
    SELECT 
      flights.*, 
      airlines.name as name_airline,
      airlines.photo as image_airline  
    FROM flights 
    INNER JOIN airlines ON flights.id_airline = airlines.id 
    WHERE flights.id = $1
  `
  const values = [id]
  return Pool.query(query, values)
}

const insertFlight = (data) => {
  const { id, id_airline, departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price } = data
  const query = `
    INSERT INTO flights(
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
      price
    ) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`
  const values = [id, id_airline, departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price]
  return Pool.query(query, values)
}

const updateFlight = (departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price, id) => {
  return new Promise((resolve, reject) => {
    const query = {
      text: "UPDATE flights SET departure_date=$1, departure_time=$2, arrived_date=$3, arrived_time=$4, starting_place=$5, destination_place=$6, transit=$7, luggage=$8, meal=$9, wifi=$10, class_flight=$11, type_trip=$12, capacity=$13, terminal=$14, gate=$15, price=$16 WHERE id=$17",
      values: [departure_date, departure_time, arrived_date, arrived_time, starting_place, destination_place, transit, luggage, meal, wifi, class_flight, type_trip, capacity, terminal, gate, price, id],
    }
    Pool.query(query, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const deleteFlight = (id) => {
  return Pool.query("DELETE FROM flights WHERE id=$1", [id])
}

const findFlightId = (id) => {
  return Pool.query("SELECT * FROM flights WHERE id = $1", [id])
}

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM flights")
}

module.exports = {
  selectAllFlight,
  findFlightWithAirline,
  insertFlight,
  updateFlight,
  deleteFlight,
  findFlightId,
  countData,
}
