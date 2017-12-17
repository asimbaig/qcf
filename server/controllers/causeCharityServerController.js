/*
    Its server-end controller which handles all ajax http calls related to Causes and Charities.
*/
//importing node modules express, and body-parser
var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs-extra');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

//create schema for Causes & Charities - this like blueprint
var causeCharitySchema = new mongoose.Schema({
    type:String,
    causeType:String,
    title:String,
    address:String,
    phone:String,
    email:String,
    causeCharityDesc:String,
    picture:String,
    regDate:Date
});
//creating object of causeCharities model
var causeCharity = mongoose.model('causeCharities',causeCharitySchema);

var eventProgram = mongoose.model('eventsPrograms');

//creating object of Company model
var Company = mongoose.model('Companies');

//creating object of Employee model
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

  app.post('/uploadcc', function(req, res) {
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

  //Saving new Cause / Charity to Database.
  app.post('/cseChtReg', function(req, res, next) {
        var cc = new causeCharity;
        cc.type = req.body.type;
        cc.causeType = req.body.causeType;
        cc.title = req.body.title;
        cc.causeCharityDesc = req.body.causeCharityDesc;
        cc.picture = req.body.picture;
        cc.address = req.body.address;
        cc.phone = req.body.phone;
        cc.email = req.body.email;
        cc.regDate = Date.now();

        cc.save(function(err,data){
  				          if(err) {
                      console.log(err);
                      throw err;
                    }
                    return res.json(data);
			           });
  });

  //Finding all Charities for which particular company not signed up.
  app.post('/loadAvailableCharities', function(req, res, next) {

    Company.findOne({companyName: req.body.companyName})
            .exec(function(err,result){

              if(result){
                  var temp = result.causesCharities;
                  var query = causeCharity.find({});
                  query.where('title').nin(result.causesCharities);
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

  //Load all Charities' record
  app.get('/loadCharities',function(req,res){

      causeCharity.find({})
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

  //Remove a Cause/Charity
  app.post('/RemoveCseChrty',function(req,res){
          fs.remove(req.body.picture, err => {
                    if (err) return console.error(err);
                    eventProgram.find({CauseCharity:req.body.title})
                            .exec(function(err,result){
                                  if(result){
                                    for(var t in result){
                                      fs.remove(result[t].picture, err => {
                                                if (err) return console.error(err);
                                                Employee.find({})
                                                        .exec(function(err2,result2){
                                                              if(result2){
                                                                for(var t2 in result2){
                                                                          var temp = result2[t2].eventsProgram;

                                                                          var index = temp.indexOf(result[t].title);

                                                                          if (index > -1) {
                                                                              temp.splice(index, 1);
                                                                          }

                                                                          Employee.findOneAndUpdate({email: result2[t2].email}, {$set:{eventsProgram:temp}}, {new: true}, function(err, doc){
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
                                                      eventProgram.remove({title:result[t].title}, function(err) {
                                                          if (!err) {
                                                                  /*return res.status(200).send({
                                                                         message: 'record deleted'
                                                                      });*/

                                                          }
                                                          else {
                                                                  //message.type = 'Error while deleting Employee';
                                                                  /*return res.status(400).send({
                                                                         message: 'Record not deleted.'
                                                                      });*/
                                                          }
                                                      });
                                                      ///////////
                                                      Company.find({})
                                                              .exec(function(err2,result2){
                                                                    if(result2){
                                                                      for(var t in result2){
                                                                                var temp = result2[t].causesCharities;

                                                                                var index = temp.indexOf(req.body.title);

                                                                                if (index > -1) {
                                                                                    temp.splice(index, 1);
                                                                                }

                                                                                Company.findOneAndUpdate({email: result2[t].email}, {$set:{causesCharities:temp}}, {new: true}, function(err, doc){
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
                                        });
                                    }
                                  }else{
                                        return res.status(400).send({
                                           message: 'Record not deleted.'
                                        });
                                  }
                          });
                        //////////////////////
                        causeCharity.remove({title:req.body.title}, function(err) {
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
