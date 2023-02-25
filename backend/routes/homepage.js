const express = require("express");
const router = express.Router();


//ENDPOINT
//ROUTE:method:url->ENDPOINT
router.get('/',(
    req,
    res
) => {
    res.send("Hello WA");
});

module.exports = router;