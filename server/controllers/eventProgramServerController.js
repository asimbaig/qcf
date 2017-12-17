/*
    Its server-end controller which handles all ajax http calls related to Events & Programs.
*/
//importing node modules express, and body-parser
var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs-extra');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

//create schema for Events & Programs - this like blueprint
var eventProgramSchema = new mongoose.Schema({
    type:String,
    title:String,
    eventProgramDesc:String,
    location:String,
    picture:String,
    date:String,
    regDate:Date,
    CauseCharity:String,
    organizer:String
  });

//creating object of eventsPrograms model
var eventProgram = mongoose.model('eventsPrograms',eventProgramSchema);
//creating object of Companies model
var Company = mongoose.model('Companies');
var Employee = mongoose.model('Employees');
module.exports = function(app){

  //Storing uploaded image file at server
  var storage = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var saveFile = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
          cb(null, saveFile);
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
            fileName:req.file.filename,
            originalName:req.file.originalname
          });
      });
  });

  //Finding Events and Programs for which particular Employee not signed up.
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

  //Saving new Event / Program to Database.
  app.post('/evtPrgReg', function(req, res, next) {
        var ep = new eventProgram;
        ep.type = req.body.type;
        ep.picture = req.body.picture;
        ep.title = req.body.title;
        ep.eventProgramDesc = req.body.eventProgramDesc;
        ep.location = req.body.location;
        ep.date = req.body.event_date;

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

  //Loading records for all Events and Programs
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

  app.post('/RemoveEvtProg',function(req,res){
          fs.remove(req.body.picture, err => {
                    if (err) return console.error(err);
                    Employee.find({})
                            .exec(function(err,result){
                                  if(result){
                                    for(var t in result){
                                              var temp = result[t].eventsProgram;

                                              var index = temp.indexOf(req.body.title);

                                              if (index > -1) {
                                                  temp.splice(index, 1);
                                              }

                                              Employee.findOneAndUpdate({email: result[t].email}, {$set:{eventsProgram:temp}}, {new: true}, function(err, doc){
                                                          if(err){
                                                              console.log("Something wrong when updating data!");
                                                          }
                                                           //return res.json(doc);
                                             });

                                    }
                                  }else{
                                        return res.status(400).send({
                                           message: 'Record not deleted.'
                                        });
                                  }
                          });
                        //////////////////////
                        eventProgram.remove({title:req.body.title}, function(err) {
                            if (!err) {
                                    return res.status(200).send({
                                           message: 'record deleted'
                                        });

                            }
                            else {
                                    //message.type = 'Error while deleting Employee';
                                    return res.status(400).send({
                                           message: 'Record not deleted.'
                                        });
                            }
                        });
                  });
  });
};
