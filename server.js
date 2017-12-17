/*
  This is entry point to run this application by: node server.js
*/
//importing node modules express, and body-parser
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

//importing application's server side controllers which handle ajax's http calls from client.
//for Company, Employee, Event Program, Cause Charity and Login client requests
var companiesServerController = require('./server/controllers/companiesServerController');
var employeeServerController = require('./server/controllers/employeeServerController');
var eventProgramServerController = require('./server/controllers/eventProgramServerController');
var causeCharityServerController = require('./server/controllers/causeCharityServerController');
var loginServerController = require('./server/controllers/loginServerController');
var loginRegisterServerController = require('./server/controllers/loginRegisterServerController');

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

//firing off server-end controllers
companiesServerController(app);
employeeServerController(app);
eventProgramServerController(app);
causeCharityServerController(app);
loginServerController(app);
loginRegisterServerController(app);

//Setup port
app.listen(process.env.PORT || 3000);
console.log("Listening at port : 3000 ....");
