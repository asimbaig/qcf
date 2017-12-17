/*
    Its server-end controller which handles all ajax http calls related to Companies.
*/
//importing node modules express, and body-parser
var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs-extra');

//create schema for Companies - this like blueprint
var companySchema = new mongoose.Schema({
  companyName:String,
  logoPicture:String,
  address:String,
  phone:String,
  email:String,
  password:String,
  joinDate:Date,
  active:Boolean,
  causesCharities:[String],
  details: String,
  regCode: String,
  empRegisterCode: String
});

//creating object of Companies model
var Company = mongoose.model('Companies',companySchema);

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

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

  app.post('/uploadcomp', function(req, res) {
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

  //Saving new Company to Database.
  app.post('/comReg', function(req, res, next) {
    var com= new Company;
        com.companyName = req.body.comName;
        com.logoPicture = req.body.logoPicture;
        com.address = req.body.comAddess;
        com.phone = req.body.comPhone;
        com.email = req.body.comEmail;
        com.password = req.body.comPass1
        com.joinDate = Date.now();
        com.active = true;
        com.causesCharities=req.body.causesCharities;
        com.details = req.body.details;
        com.regCode = req.body.regCode;
        com.empRegisterCode = req.body.empRegisterCode;
        com.save(function(err,data){
  				          if(err){
                      console.log(err);
                      throw err;
                    }
                    return res.json(data);
			           });
  });

  //Load record of all Companies
  app.get('/loadCompanies',function(req,res){
          Company.find({})
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

  //Finding a company with particular Employee-Registration-Code
  app.post('/fetchCompany',function(req,res){
              Company.findOne({empRegisterCode: req.body.empRegisterCode})
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

    //Removing Cause/Charity for particular Company and updating record.
    app.post('/RemoveCauseCharity',function(req,res){
                  Company.findOne({companyName: req.body.compName})
                          .exec(function(err,result){
                                if(result){
                                    var tempData;
                                    var temp = result.causesCharities;
                                    var index = temp.indexOf(req.body.causeCharity);

                                    if (index > -1) {
                                        temp.splice(index, 1);
                                    }
                                    Company.findOneAndUpdate({companyName: req.body.compName}, {$set:{causesCharities:temp}}, {new: true}, function(err, doc){
                                                if(err){
                                                    console.log("Something wrong when updating data!");
                                                }
                                                tempData = doc;
                                                 return res.json(tempData);
                                     });
                                }else{
                                  return res.status(400).send({
                                         message: 'No records found.'
                                      });
                                }
                        });
    });

    //Adding Cause/Charity for particular Company and updating record.
    app.post('/addCauseCharity',function(req,res){
                  Company.findOne({companyName: req.body.compName})
                          .exec(function(err,result){
                                if(result){
                                    var tempData;
                                    var temp = result.causesCharities;
                                    var index = temp.indexOf(req.body.causeCharity);

                                    if (index === -1) {
                                        temp.push(req.body.causeCharity);
                                    }
                                    Company.findOneAndUpdate({companyName: req.body.compName}, {$set:{causesCharities:temp}}, {new: true}, function(err, doc){
                                                if(err){
                                                    console.log("Something wrong when updating data!");
                                                }
                                                 return res.json(doc);
                                     });
                                }else{
                                  return res.status(400).send({
                                         message: 'No records found.'
                                      });
                                }
                        });
    });

    //Fetching all Causes / Charities for particular Company.
    app.post('/companysCharities',function(req,res){
                  Company.findOne({companyName: req.body.companyName})
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

    //Load all Companies' record
    app.get('/getAllCompanies',function(req,res){

        Company.find({})
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
