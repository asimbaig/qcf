var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

//create schema - this like blueprint
var eventProgramSchema = new mongoose.Schema({
    type:String,
    title:String,
    eventProgramDesc:String,
    location:String,
    picture:String,
    date:Date,
    regDate:Date,
    CauseCharity:String,
    organizer:String
  });

var eventProgram = mongoose.model('eventsPrograms',eventProgramSchema);
var Company = mongoose.model('Companies');
module.exports = function(app){
  var savedFile;
  var storage = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' +file.originalname);
      }
  });

  var upload = multer({ //multer settings
                  storage: storage
              }).single('file');

  app.post('/uploadep', function(req, res) {
      upload(req,res,function(err){
          if(err){
               console.log(err);
               res.json({error_code:1,err_desc:err});
               return;
          }
          res.json({
            error_code:0,
            err_desc:null,
            fileName:req.file.filename
          });
      });
  });
  app.post('/loadAvailableEvtProg', function(req, res, next) {

    Company.findOne({empRegisterCode: req.body.empRegisterCode})
            .exec(function(err,result){

              if(result){
                  var temp = result.causesCharities;
                  var query = eventProgram.find({});
                  query.where('CauseCharity').in(result.causesCharities);
                          query.exec(function(err,result1){
                            if(result1){
                                return res.json(result1);
                            }else{
                              return res.status(400).send({
                                     message: 'No records found.'
                                  });
                            }

                          });
              }else{
                return res.status(400).send({
                       message: 'No records found.'
                    });
              }
            });
  });
  app.post('/evtPrgReg', function(req, res, next) {
        var ep = new eventProgram;
        ep.type = req.body.type;
        ep.picture = req.body.picture;
        ep.title = req.body.title;
        ep.eventProgramDesc = req.body.eventProgramDesc;
        ep.location = req.body.location;
        ep.date = req.body.date;
        ep.regDate = Date.now();
        ep.CauseCharity = req.body.CauseCharity;
        ep.organizer = req.body.organizer;
        ep.save(function(err,data){
  				          if(err) {
                      console.log(err);
                      throw err;
                    }
                    return res.json(data);
			           });
  });
  app.get('/loadEvents',function(req,res){
          eventProgram.find({})
                  .exec(function(err,result){
                    if(result){
                        return res.json(result);
                    }else{
                      return res.status(400).send({
                             message: 'No records found.'
                          });
                    }
                  });
  });
};
