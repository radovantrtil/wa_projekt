const {database} = require("../database/database");

class NotificationService {
    async getAll() {
        return await database().all(
            "SELECT * FROM notifications"
        );
    }

    async getById(id) {
        return await database().get(
            "SELECT * FROM notifications WHERE id_notification = ?",
            id
        );
    }

    async create(notification) {
        const result = await database().run(
            "INSERT INTO notifications (description, type) VALUES (?,?)",
            notification.description, notification.type
        );
        return await this.getById(result.lastID);
    }

    async update(id, notification) {
        const result = await database().run(
            "UPDATE notifications SET description = ?, type = ? WHERE id_notification = ?",
            notification.description, notification.type, id
        );

        if (result.changes === 0) {
            return null; // not found
        } else {
            return await this.getById(id); // the updated article
        }
    }

    async delete(id) {
        await database().run(
            "DELETE FROM notifications WHERE id_notification = ?",
            id
        );
    }
}

module.exports = new NotificationService();