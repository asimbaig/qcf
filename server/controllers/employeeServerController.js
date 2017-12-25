/*
    Its server-end controller which handles all ajax http calls related to Employees.
*/
//importing node modules express, and body-parser
var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs-extra');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });
//create schema for Employees- this like blueprint
var employeeSchema = new mongoose.Schema({
    fullName:String,
    profilePicture:String,
    address:String,
    phone:String,
    email:String,
    password:String,
    joinDate:Date,
    active:Boolean,
    eventsProgram:[String],
    role: String,
    empRegisterCode: String
});
//creating object of Employees model
var Employee = mongoose.model('Employees',employeeSchema);
//creating object of Companies model
var Company = mongoose.model('Companies');

module.exports = function(app){

  //Finding a company for particular Employee-Registration-Code
  app.post('/empRegCode',function(req,res){
            var tempEmail = req.body.empEmail;

      Company.findOne({empRegisterCode: req.body.regCode}).lean()
              .exec(function(err,result){
                if(result){
                    Employee.findOne({email: tempEmail}).lean()
                            .exec(function(err,result2){
                                  if(result2){
                                        result.flag = "false";
                                        return res.status(400).send({
                                           message: 'Wrong Registration Code or Email address already exist,Try Again.'
                                        });
                                  }else{
                                        result.flag = "true";
                                        return res.json(result);

                                  }
                          });

                }else{

                }

              });
  });

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

  app.post('/uploadEmp', function(req, res) {
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

  //Saving new Employee to Database.
  app.post('/empReg', function(req, res, next) {
        var emp = new Employee;
        emp.fullName = req.body.empName;
        emp.profilePicture = req.body.profilePicture;
        emp.address = req.body.empAddess;
        emp.phone = req.body.empPhone;
        emp.email = req.body.empEmail;
        emp.password = req.body.empPass1
        emp.joinDate = Date.now();
        emp.active = true;
        emp.role = req.body.empRole;
        emp.empRegisterCode = req.body.regCode;


        emp.save(function(err,data){
  				          if(err) {
                      console.log(err);
                      throw err;
                    }
                    return res.json(data);
			           });
  });

  //Removing Event/Program for particular Employee And updating record
  app.post('/RemoveEventProgram',function(req,res){
              Employee.findOne({fullName: req.body.fullName})
                      .exec(function(err,result){
                            if(result){
                                var tempData;
                                var temp = result.eventsProgram;
                                var index = temp.indexOf(req.body.eventProgram);

                                if (index > -1) {
                                    temp.splice(index, 1);
                                }

                                Employee.findOneAndUpdate({fullName: req.body.fullName}, {$set:{eventsProgram:temp}}, {new: true}, function(err, doc){
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

      //Adding Event/Program for particular Employee And updating record
      app.post('/addEventProgram',function(req,res){
              Employee.findOne({fullName: req.body.fullName})
                      .exec(function(err,result){
                            if(result){
                                var tempData;
                                var temp = result.eventsProgram;
                                var index = temp.indexOf(req.body.eventProgram);

                                if (index === -1) {
                                    temp.push(req.body.eventProgram);
                                }

                                Employee.findOneAndUpdate({fullName: req.body.fullName}, {$set:{eventsProgram:temp}}, {new: true}, function(err, doc){
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
      //Finding a employee for particular Employee-Registration-Code(Company)
      app.post('/thisCompanyEmployees',function(req,res){
              Employee.find({empRegisterCode: req.body.empRegisterCode})
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
      app.post('/RemoveEmp',function(req,res){
            fs.remove(req.body.profilePicture, err => {
                        if (err) return console.error(err);
                        Employee.remove({email: req.body.email}, function(err) {
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

      //Load all Employees' record
      app.get('/getAllEmployees',function(req,res){

          Employee.find({})
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

        app.post('/RemoveComp',function(req,res){

                fs.remove(req.body.logoPicture, err => {
                          if (err) return console.error(err);
                          Employee.find({empRegisterCode: req.body.empRegisterCode})
                                  .exec(function(err,result){
                                        if(result){
                                          for(var t in result){
                                            fs.remove(result[t].profilePicture, err => {
                                                        if (err) return console.error(err);
                                                        Employee.remove({email: result[t].email}, function(err) {
                                                            if (!err) {


                                                            }
                                                            else {
                                                                    //message.type = 'Error while deleting Employee';
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
                              Company.remove({email: req.body.email}, function(err) {
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
