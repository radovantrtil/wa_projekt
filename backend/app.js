const express = require("express");
const app = express();
const homepageRouter = require("./routes/homepage");
const userRouter = require("./routes/users");
const flightRouter = require("./routes/flights");
const reservationRouter = require("./routes/reservations");
const otherPersonRouter = require("./routes/otherPerson");
const notificationRouter = require("./routes/notifications");
const {jwtConfig} = require("./config");
const jwt = require("express-jwt");
const { initializeDatabase } = require("./database/database");
const cors = require("cors");
const config = require("./config");

//set up
initializeDatabase();
app.use(express.json());
app.use(cors({origin:config.allowedFrontendOrigin}));

//protected routes from unauthorized access
app.use('/flights',jwt(jwtConfig));
app.use('/user/info',jwt(jwtConfig));
app.use('/reservations',jwt(jwtConfig));
app.use('/otherpersons',jwt(jwtConfig));
app.use('/notifications',jwt(jwtConfig));


//register all routes
app.use('/otherpersons', otherPersonRouter);
app.use('/',homepageRouter);
app.use('/user',userRouter);
app.use('/flights',flightRouter);
app.use("/reservations", reservationRouter);
app.use('/notifications', notificationRouter);
//start up and give port
const port = 3000;
app.listen(port,()=> {
    console.log(`App is up and running on port ${port}`);
});