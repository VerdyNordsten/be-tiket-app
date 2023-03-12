const Pool = require("../config/db")

const selectAllSeatByFlightId = (id_flight, limit, offset, searchParam, sortBY, sort) => {
  const query = `
    SELECT 
      seats.*, 
      airlines.name as name_airline
    FROM seats
    INNER JOIN flights ON seats.id_flight = flights.id
    INNER JOIN airlines ON flights.id_airline = airlines.id
    WHERE lower(seats.no_seat) LIKE $1 AND seats.id_flight = $2 
    ORDER BY ${sortBY} ${sort}
    LIMIT $3
    OFFSET $4
  `
  const values = [`%${searchParam}%`, id_flight, limit, offset]
  return Pool.query(query, values)
}

const findSeatWithFlight = (id) => {
  const query = `
    SELECT 
      seats.*, 
      airlines.name as name_airline
    FROM seats 
    INNER JOIN flights ON seats.id_flight = flights.id
    INNER JOIN airlines ON flights.id_airline = airlines.id
    WHERE seats.id = $1
  `
  const values = [id]
  return Pool.query(query, values)
}

const insertSeat = (data) => {
  const { id, id_flight, no_seat, type_seat } = data
  const query = `
    INSERT INTO seats(
      id, 
      id_flight, 
      no_seat, 
      type_seat
    ) 
    VALUES($1, $2, $3, $4)`
  const values = [id, id_flight, no_seat, type_seat]
  return Pool.query(query, values)
}

const findSeatByFlightIdAndSeatNo = (flightId, seatNo) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM seats WHERE id_flight = $1 AND no_seat = $2"
    Pool.query(query, [flightId, seatNo], (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results.rows[0])
      }
    })
  })
}

const updateSeat = (no_seat, type_seat, filled, id) => {
  return new Promise((resolve, reject) => {
    const query = {
      text: "UPDATE seats SET no_seat=$1, type_seat=$2, filled=$3 WHERE id=$4",
      values: [no_seat, type_seat, filled, id],
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

const deleteSeatQuery = "DELETE FROM seats WHERE id_flight = $1";

const deleteSeat = (id_flight) => {
  return Pool.query(deleteSeatQuery, [id_flight]);
};

const findIdFlight = (id_flight) => {
  return Pool.query("SELECT * FROM seats WHERE id_flight = $1", [id_flight]);
};

const findSeatId = (id) => {
  return Pool.query("SELECT * FROM seats WHERE id = $1", [id])
}

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM seats")
}

module.exports = {
  selectAllSeatByFlightId,
  findSeatWithFlight,
  insertSeat,
  findSeatByFlightIdAndSeatNo,
  updateSeat,
  deleteSeat,
  findIdFlight,
  findSeatId,
  countData,
}
