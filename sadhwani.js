const config = require('./config');
const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var apiResponse = require("./helpers/apiResponse");
var Router = require("./route/route");
const PORT = process.env.PORT || 5003;



mongoose.Promise = global.Promise;

mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then((err, db) => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== "test") {
        console.log("Connected to %s", config.MONGO_URL);
        console.log("App is running ... \n");
        console.log("Press CTRL + C to stop the process. \n");
       console.log(db)
    }
})
.catch(err => {
    console.error("App starting error:", err.message);
    process.exit(1);
});


var db = mongoose.connection;


const app = express();

//don't show the log when it is test
if(process.env.NODE_ENV !== "test") {
    app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//To allow cross-origin requests
app.use(cors());

// Virtual Path Prefix '/static'
app.use(express.static(__dirname + '/public'));

//Route Prefixes
app.use("/", Router);


// app.all("*", function(req, res) {
//     return apiResponse.notFoundResponse(res, "Page not found");
// });

app.use((err, req, res) => {
    if(err.name == "UnauthorizedError"){
        return apiResponse.unauthorizedResponse(res, err.message);
    }
});


app.listen(PORT, ()=> console.log(PORT));

