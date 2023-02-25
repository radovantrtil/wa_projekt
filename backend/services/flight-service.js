const {database} = require("../database/database");

class FlightService {
    compareDate(input){
        const ts = Date.now();

        const today = new Date(ts);
        const inputDate = new Date(input);

        return today>inputDate;
    }

    async getAll(order = "id_flight") {
        // Never use the user's order directly! It may contain SQL injection.
        // Cannot use binding with "?" for ORDER BY, hence, must validate the order manually using a condition.
        let orderByColumn = order === "datetime" ? "datetime" : "id_flight";

        return await database().all(
            "SELECT * FROM flights ORDER BY " + orderByColumn
        );
    }

    async getById(id) {
        return await database().get(
            "SELECT * FROM flights WHERE id_flight = ?",
            id
        );
    }
    async getFlightResCount(){
        return await database().all(
            "SELECT id_flight, count(*) pocet FROM reservations JOIN flights f on reservations.flights_id = f.id_flight LEFT JOIN otherPerson oP on reservations.id_reservation = oP.reservetion_id group by id_flight;\n"
        );
    }
    async getCountRes(id){
        return await database().get(
            "SELECT id_flight,count(*) pocet FROM reservations JOIN flights f on reservations.flights_id = f.id_flight LEFT JOIN otherPerson oP on reservations.id_reservation = oP.reservetion_id WHERE id_flight = ?", id
        );
    }
    async create(flight) {
        const result = await database().run(
            "INSERT INTO flights (datetime,capacity, information, title) VALUES (?,?,?,?)",
            flight.datetime, flight.capacity, flight.information, flight.title
        );
        return await this.getById(result.lastID);
    }

    async update(id, flight) {
        const result = await database().run(
            "UPDATE flights SET datetime = ?, capacity = ?, information = ?, title= ? WHERE id_flight = ?",
            flight.datetime, flight.capacity, flight.information, flight.title, id
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(id); // the updated article
        }
    }

    async delete(id) {
        await database().run(
            "DELETE FROM flights WHERE id_flight = ?",
            id
        );
    }
}

module.exports = new FlightService();