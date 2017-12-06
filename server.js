var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var employeeServerController = require('./server/controllers/employeeServerController');
var companiesServerController = require('./server/controllers/companiesServerController');

var eventProgramServerController = require('./server/controllers/eventProgramServerController');
var causeCharityServerController = require('./server/controllers/causeCharityServerController');

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

companiesServerController(app);
employeeServerController(app);
eventProgramServerController(app);
causeCharityServerController(app);

/*
app.get('*',function(req,res){
    res.sendfile('./index.html');
});
*/
app.listen(3000);
console.log("Listening at port : 3000 ....");
