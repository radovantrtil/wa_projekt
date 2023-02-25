const {database} = require("../database/database");

class OtherPersonService {

    async getAll() {
        return await database().all(
            "SELECT * FROM otherPerson"
        );
    }
    async getAllWithResId(id){
        return await database().all(
            "SELECT * FROM otherPerson WHERE reservetion_id=?", id
        );
    }

    async getById(id) {
        return await database().get(
            "SELECT * FROM otherPerson WHERE id_otherPerson = ?",
            id
        );
    }

    async create(otherPerson) {
        const result = await database().run(
            "INSERT INTO otherPerson (firstname, lastname, reservetion_id) VALUES (?, ?, ?)",
            otherPerson.firstname, otherPerson.lastname, otherPerson.reservetion_id
        );
        return await this.getById(result.lastID);
    }

    async update(id, reservation) {
        const result = await database().run(
            "UPDATE otherPerson SET firstname = ?,lastname = ?, reservetion_id = ? WHERE id_otherPerson = ?",
            otherPerson.firstname, otherPerson.lastname, otherPerson.reservetion_id, id
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(id); // the updated article
        }
    }

    async delete(id) {
        await database().run(
            "DELETE FROM otherPerson WHERE id_otherPerson = ?",
            id
        );
    }

    async deletedReservation(id){
        await database().run(
            "DELETE FROM otherPerson WHERE reservetion_id =?", id
        );
    }
}

module.exports = new OtherPersonService();