const express = require("express");
const router = express.Router();
const reservationService = require('../services/reservation-service');
const flightService = require('../services/flight-service');
const otherPersonService = require('../services/otherPerson-service');


router.get('/', async (req, res) => {
    const reservation = await reservationService.getAll();
    res.json(reservation);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const userRole = parseInt(req.user.role);
    if(userRole !== 2) {
        res.status(401).send("Unauthorized! Only secretary can view all reservations");
        return;
    }
    const reservation = await reservationService.getById(id);

    if (reservation) {
        res.json(reservation);
    } else {
        res.status(404).send("Not found");
    }
});

router.post('/', async (req, res) => {
    const data = req.body;

    if (
        data.description === undefined || data.description?.trim() === "" ||
        isNaN(data.users_id) || data.users_id<=0 ||isNaN(data.flights_id) || data.flights_id <=0
    ) {
        res.status(400).send("Bad input");
        return;
    }
    const flight = await flightService.getById(data.flights_id);
    const obsazeno = await flightService.getCountRes(data.flights_id);

    if(flight.capacity <= obsazeno.pocet){
        res.status(409).send("Flight is full");
        return;
    }
    const reservation = await reservationService.create(data);
    res.status(201).json(reservation);
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const id = parseInt(req.params.id);

    if (
        isNaN(id) || id<=0 || data.description === undefined || data.description?.trim() === "" ||
        isNaN(data.users_id) || data.users_id<=0 ||isNaN(data.flights_id) || data.flights_id <=0
    ) {
        res.status(400).send("Bad input");
        return;
    }

    const reservation = await reservationService.update(id, data);

    if (!reservation) {
        res.status(404).send("Not found");
        return;
    }

    res.status(202).json(reservation);
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id<=0 || isNaN(id)) {
        res.status(400).send("Bad input");
        return;
    }

    await reservationService.delete(id);
    await otherPersonService.deletedReservation(id);
    res.status(204).send("No Content");
});

module.exports = router;