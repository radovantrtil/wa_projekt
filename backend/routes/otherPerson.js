const express = require("express");
const router = express.Router();
const otherPersonService = require('../services/otherPerson-service');

router.get('/', async (req, res) => {

    const order = req.query.order;
    const otherPerson = await otherPersonService.getAll();
    res.json(otherPerson);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id<=0 || isNaN(id)) {
        res.status(400).send("Bad input");
        return;
    }
    const otherPerson = await otherPersonService.getById(id);

    if (otherPerson) {
        res.json(otherPerson);
    } else {
        res.status(404).send("Not found");
    }
});

router.post('/', async (req, res) => {
    const data = req.body;
    if (
        data.firstname === undefined || data.firstname?.trim() === "" ||
        data.lastname === undefined || data.lastname?.trim() === "" ||
        isNaN(data.reservetion_id) || data.reservetion_id<=0
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const otherPerson = await otherPersonService.create(data);

    res.status(201).json(otherPerson);
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const id = parseInt(req.params.id);

    if (
        isNaN(id)|| id<=0 || data.firstname === undefined || data.firstname?.trim() === "" ||
        data.lastname === undefined || data.lastname?.trim() === "" ||
        isNaN(data.reservetion_id) || data.reservetion_id<=0
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const otherPerson = await otherPersonService.update(id, data);

    if (!otherPerson) {
        res.status(404).send("Not found");
        return;
    }

    res.status(202).json(otherPerson);
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id<=0 || isNaN(id)) {
        res.status(400).send("Bad input");
        return;
    }
    await otherPersonService.delete(id);
    res.status(204).send("No Content");
});

module.exports = router;