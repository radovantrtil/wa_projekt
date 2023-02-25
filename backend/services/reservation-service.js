const {database} = require("../database/database");

class ReservationService {

    async getAll() {
        // Never use the user's order directly! It may contain SQL injection.
        // Cannot use binding with "?" for ORDER BY, hence, must validate the order manually using a condition.
        //let orderByColumn = order === "date" ? "date" : "id_flight";

        return await database().all(
            "SELECT u.id_user,u.login, reservations.flights_id,reservations.id_reservation,reservations.description,u.firstname,u.lastname,f.title, f.datetime FROM reservations JOIN flights f on reservations.flights_id = f.id_flight JOIN users u on u.id_user = reservations.users_id"
        );
    }

    async getById(id) {
        return await database().get(
            "SELECT * FROM reservations WHERE id_reservation = ?",
            id
        );
    }

    async create(reservation) {
        const result = await database().run(
            "INSERT INTO reservations (description, users_id, flights_id) VALUES (?, ?, ?)",
            reservation.description, reservation.users_id, reservation.flights_id
        );
        return await this.getById(result.lastID);
    }

    async update(id, reservation) {
        const result = await database().run(
            "UPDATE reservations SET description = ?,users_id = ?, flights_id = ? WHERE id_reservation = ?",
            reservation.description, reservation.users_id, reservation.flights_id, id
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(id); // the updated article
        }
    }

    async delete(id) {
        await database().run(
            "DELETE FROM reservations WHERE id_reservation = ?",
            id
        );
    }

    async deletedFlight(id){
        await database().run(
            "DELETE FROM reservations WHERE flights_id=?",
            id
        );
    }
}

module.exports = new ReservationService();