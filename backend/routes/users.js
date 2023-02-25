const express = require("express");
const router = express.Router();
const userService = require("../services/user-service");
const flightService = require("../services/flight-service");

//login user
router.post('/login', async (req, res) => {
    const data = req.body;
    if (data.login === undefined || data.login.trim() === "" ||
        data.password === undefined || data.password.trim() === ""
    ) {
        res.status(400).send("Bad input");
        return;
    }
    const user = await userService.getByLogin(req.body.login);

    if(!user){
        res.status(401).send("User not found");
        return;
    }
    if(userService.hashPassword(data.password) !== user.password){
        res.status(403).send("Password is incorrect");
        return;
    }
    const response = {
        token: userService.generateToken(user)
    };
    console.log(response);
    res.status(201).json(response);
});

//register new user
router.post('/', async (req, res) => {
    const data = req.body;
    if (data.login === undefined || data.login.trim() === "" ||
        data.password === undefined || data.password.trim() === "" ||
        data.firstname === undefined || data.firstname.trim() === "" ||
        data.lastname === undefined || data.lastname.trim() === "" ||
        isNaN(data.user_type_id) || data.user_type_id < 1 || data.user_type_id>3
    ) {
        res.status(400).send("Bad input");
        return;
    }
    const userExists = await userService.getByLogin(data.login);
    console.log(userExists);
    // existuje uživatel?
    if(userExists){
        res.status(401).send("Login already exists");
        return;
    }

    const user = await userService.create(data);

    res.status(201).send('Account was successfully created').json(user);
});

router.get('/info', async (req, res) => {
    // this is how to get the currently logged-in user and their data
    const tokenPayload = req.user;
    console.log(tokenPayload);
    res.json(tokenPayload);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await userService.getById(id);
    if (id<=0 || isNaN(id)) {
        res.status(400).send("Bad input");
        return;
    }
    if (user) {
        res.json(user);
    } else {
        res.status(404).send("Not found");
    }
});

router.get('/', async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
});


module.exports = router;