/* Table 'users' */
CREATE TABLE IF NOT EXISTS users(
                      id_user INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                      login TEXT NOT NULL UNIQUE,
                      password TEXT NOT NULL,
                      firstname TEXT NOT NULL,
                      lastname TEXT NOT NULL,
                      user_type_id INTEGER  NOT NULL,
                      CONSTRAINT user_type_users
                          FOREIGN KEY (user_type_id) REFERENCES user_type (id_user_type)
);

/* Table 'user_type' */
CREATE TABLE IF NOT EXISTS user_type(
                          id_user_type INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                          role TEXT NOT NULL UNIQUE,
                          description TEXT
);

/* Table 'reservations' */
CREATE TABLE IF NOT EXISTS reservations(
                             id_reservation INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                             description TEXT,
                             users_id INTEGER NOT NULL,
                             flights_id INTEGER NOT NULL,
                             CONSTRAINT users_reservations FOREIGN KEY (users_id) REFERENCES users (id_user),
                             CONSTRAINT flights_reservations
                                 FOREIGN KEY (flights_id) REFERENCES flights (id_flight)
);

/* Table 'flights' */
CREATE TABLE IF NOT EXISTS flights(
                        id_flight INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        title TEXT NOT NULL,
                        datetime TEXT NOT NULL,
                        capacity INTEGER NOT NULL,
                        information TEXT NOT NULL
);

/* Table 'notifications' */
CREATE TABLE IF NOT EXISTS notifications(
                              id_notification INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                              description TEXT,
                              type TEXT
);

/* Table 'user_notifications' */
CREATE TABLE IF NOT EXISTS user_notifications(
                                   notifications_id INTEGER NOT NULL,
                                   users_id INTEGER NOT NULL,
                                   PRIMARY KEY (users_id, notifications_id),
                                   CONSTRAINT notifications_user_notifications
                                           FOREIGN KEY (notifications_id) REFERENCES notifications (id_notification),
                                   CONSTRAINT users_user_notifications
                                       FOREIGN KEY (users_id) REFERENCES users (id_user)
);

/* Other persons in reservation */
CREATE TABLE IF NOT EXISTS otherPerson(
    id_otherPeson INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    reservetion_id INTEGER NOT NULL,
    CONSTRAINT otherPerson_reservations FOREIGN KEY (reservetion_id) REFERENCES reservations (id_reservation)
)