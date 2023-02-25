const jwt = require("jsonwebtoken");
const {jwtConfig, passwordConfig} = require("../config");
const {database} = require("../database/database");
const crypto = require("crypto");

class UserService{
    generateToken(user){
        const tokenPayload = {
            id_user: user.id_user,
            login: user.login,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.user_type_id,
        };
        return jwt.sign(
            tokenPayload,
            jwtConfig.secret,
            {
                algorithm: jwtConfig.algorithms[0]
            }
        );
    }

    hashPassword(password){
        return crypto.pbkdf2Sync(
            password,
            passwordConfig.salt,
            passwordConfig.iterations,
            passwordConfig.keylen,
            passwordConfig.digest,
        ).toString("hex");
    }

    async getByLogin(login) {
        return await database().get(
            "SELECT * FROM users WHERE login = ?", login
        );
    }

    async create(user){
        const result = await database().run(
            "INSERT INTO users (login, password, firstname, lastname, user_type_id) VALUES (?,?,?,?,?)",
            user.login,
            this.hashPassword(user.password),
            user.firstname,
            user.lastname,
            user.user_type_id
        );
    }
    async getById(id) {
        return await database().get(
            "SELECT firstname,lastname, login FROM users WHERE id_user = ?",
            id
        );
    }
    async getAllUsers(){
        return await database().all(
            "SELECT id_user,firstname, lastname FROM users",
        );
    }

}

module.exports = new UserService();