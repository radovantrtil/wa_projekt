const express = require("express");
const router = express.Router();
const notificationService = require('../services/notification-service');;

router.get('/', async (req, res) => {
    const order = req.query.order;
    const flight = await notificationService.getAll(order);
    res.json(flight);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const notification = await notificationService.getById(id);

    if (notification) {
        res.json(notification);
    } else {
        res.status(404).send("Not found");
    }
});

router.post('/', async (req, res) => {
    const data = req.body;
    const userRole = parseInt(req.user.role);

    if(userRole !== 3 && userRole!==2) {
        res.status(401).send("Unauthorized! Only technics and secretary can add new notifications");
        return;
    }

    if (
        data.description === undefined || data.description?.trim() === "" ||
        data.type === undefined || data.type?.trim() === "") {
        res.status(400).send("Bad input");
        return;
    }

    const notification = await notificationService.create(data);

    res.status(201).json(notification);
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const id = parseInt(req.params.id);
    const userRole = parseInt(req.user.role);

    if(userRole !== 3 && userRole!==2) {
        res.status(401).send("Unauthorized! Only technics can update flights.");
        return;
    }

    if (id<=0 ||
        isNaN(id) ||  data.description === undefined || data.description?.trim() === "" ||
        data.type === undefined || data.type?.trim() === ""
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const notification = await notificationService.update(id, data);

    if (!notification) {
        res.status(404).send("Not found");
        return;
    }

    res.status(202).json(notification);
});

router.delete('/:id', async (req, res) => {
    const userRole = parseInt(req.user.role);
    if(userRole !== 3 && userRole !== 2) {
        res.status(401).send("Unauthorized! Only technic can delete flight");
        return;
    }
    const id = parseInt(req.params.id);
    if (id<=0 || isNaN(id)) {
        res.status(400).send("Bad input");
        return;
    }
    await notificationService.delete(id);

    res.status(204).send("No Content");
});

module.exports = router;