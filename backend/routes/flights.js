const express = require("express");
const router = express.Router();
const flightService = require('../services/flight-service');
const reservationService = require('../services/reservation-service');

router.get('/', async (req, res) => {
    const order = req.query.order;
    const flight = await flightService.getAll(order);
    res.json(flight);
});
router.get('/counts', async(req, res)=>{
   const reservationsCount = await flightService.getFlightResCount();
   res.json(reservationsCount);
});

router.get('/:id/count', async (req, res,)=>{
   const id = parseInt(req.params.id);
   const pocet = await flightService.getCountRes(id);
   res.json(pocet);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const flight = await flightService.getById(id);

    if (flight) {
        res.json(flight);
    } else {
        res.status(404).send("Not found");
    }
});

router.post('/', async (req, res) => {
    const data = req.body;
    const userRole = parseInt(req.user.role);

    if(userRole !== 3) {
        res.status(401).send("Unauthorized! Only technics can add new flights");
        return;
    }

    if (
        data.datetime === undefined || data.datetime?.trim() === "" ||
        data.title === undefined || data.title?.trim() === ""||
        isNaN(data.capacity) || data.capacity<0 ||
        data.information === undefined || data.information?.trim() === "" || flightService.compareDate(data.datetime)) {
        res.status(400).send("Bad input");
        return;
    }

    const flight = await flightService.create(data);

    res.status(201).json(flight);
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const id = parseInt(req.params.id);
    const userRole = parseInt(req.user.role);

    if(userRole !== 3) {
        res.status(401).send("Unauthorized! Only technics can update flights.");
        return;
    }

    if (id<=0 ||
        isNaN(id) || isNaN(data.capacity) || data.capacity<0 ||
        data.title === undefined || data.title?.trim() === ""||
        data.datetime === undefined || data.datetime?.trim() === "" ||
        data.information === undefined || data.information?.trim() === "" || flightService.compareDate(data.date)
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const flight = await flightService.update(id, data);

    if (!flight) {
        res.status(404).send("Not found");
        return;
    }

    res.status(202).json(flight);
});

router.delete('/:id', async (req, res) => {
    const userRole = parseInt(req.user.role);
    if(userRole !== 3) {
        res.status(401).send("Unauthorized! Only technic can delete flight");
        return;
    }
    const id = parseInt(req.params.id);
    if (id<=0 || isNaN(id)) {
        res.status(400).send("Bad input");
        return;
    }
    await flightService.delete(id);
    await reservationService.deletedFlight(id);

    res.status(204).send("No Content");
});

module.exports = router;