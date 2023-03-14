const Pool = require("../config/db")

const selectAllFlight = (limit, offset, sortBY, sort, starting_place, destination_place, type_trip, transit, departure_date, class_flight, is_round_trip, filter_luggage, filter_meal, filter_wifi) => {
  let query = `
    SELECT 
      flights.*, 
      airlines.name as name_airline,
      airlines.photo as image_airline
    FROM flights
    INNER JOIN airlines ON flights.id_airline = airlines.id
    WHERE 
      flights.starting_place ILIKE $1 AND 
      flights.destination_place ILIKE $2 AND 
      flights.type_trip = $3 AND 
      ( 
        ($4 = 'direct' AND flights.transit = 'direct') OR 
        ($4 = 'transit' AND flights.transit = 'transit') OR 
        ($4 = 'direct,transit' AND flights.transit IN ('direct', 'transit')) OR 
        ($4 = 'transit,direct' AND flights.transit IN ('transit', 'transit')) OR 
        ($4 IS NULL) 
      ) AND 
      (
        (flights.departure_date = $5) OR 
        ($5 IS NULL)
      ) AND 
      (
        (flights.class_flight = $6) OR 
        ($6 IS NULL)
      )
  `

  const values = [`%${starting_place}%`, `%${destination_place}%`, type_trip, transit || null, departure_date || null, class_flight || null]

  if (filter_luggage !== "") {
    if (filter_luggage === "luggage") {
      query += `AND flights.luggage = true `
    }
  }
  if (filter_luggage === "luggage") {
    query += `AND flights.luggage = true `
  }

  if (filter_meal !== "") {
    if (filter_meal === "meal") {
      query += `AND flights.meal = true `
    }
  }
  if (filter_meal === "meal") {
    query += `AND flights.meal = true `
  }

  if (filter_wifi !== "") {
    if (filter_wifi === "wifi") {
      query += `AND flights.wifi = true `
    }
  }
  if (filter_wifi === "wifi") {
    query += `AND flights.wifi = true `
  }

  query += `
    ORDER BY ${sortBY} ${sort}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `

  values.push(limit, offset)
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

const countFilteredFlight = (starting_place, destination_place, type_trip, departure_date, class_flight, filter_transit) => {
  let query = `
    SELECT 
      COUNT(*) as count
    FROM flights
    WHERE 
  `
  let values = []

  query += `
    flights.starting_place ILIKE $1 AND
    flights.destination_place ILIKE $2 AND
    flights.type_trip = $3
  `
  values = [`%${starting_place}%`, `%${destination_place}%`, type_trip]

  if (departure_date) {
    query += ` AND flights.departure_date = $${values.length + 1}`
    values.push(departure_date)
  }

  if (class_flight) {
    query += ` AND flights.class_flight = $${values.length + 1}`
    values.push(class_flight)
  }

  if (filter_transit) {
    const transitArr = filter_transit.split(",")
    let transitQuery = ""
    transitArr.forEach((transit, index) => {
      transitQuery += `${index === 0 ? "" : " OR "}flights.transit ILIKE $${values.length + index + 1}`
      values.push(`%${transit}%`)
    })
    query += ` AND (${transitQuery})`
  }

  return Pool.query(query, values)
}

module.exports = {
  selectAllFlight,
  findFlightWithAirline,
  insertFlight,
  updateFlight,
  deleteFlight,
  findFlightId,
  countData,
  countFilteredFlight,
}
