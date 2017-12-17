/*
    Its server-end controller which handles all ajax http calls related to Login.
*/
//importing node modules express, and body-parser
var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });


//creating object of Company model
var Company = mongoose.model('Companies');
//creating object of Employees model
var Employee = mongoose.model('Employees');


module.exports = function(app){
  //receing Login Ajax request from Employee/Company Login
  app.post('/Login',function(req,res){
      //Find login record in Companies Model
      Company.findOne({email: req.body.LoginEmail,password: req.body.LoginPass}).lean()
              .exec(function(err,result){

                if(result){
                    result.CompanyFlag = 'true';
                    result.EmployeeFlag = 'false';
                    return res.send(result);

                }else{
                        //Find login record in Employees Model
                        Employee.findOne({email: req.body.LoginEmail,password: req.body.LoginPass}).lean()
                          .exec(function(err,result2){
                            if(result2){
                                result2.EmployeeFlag = 'true';
                                result2.CompanyFlag = 'false';
                                return res.send(result2);
                            }else{
                              return res.status(400).send({
                                     message: 'Invalid Email/Password,Try again.'
                                  });
                            }

                          });
                }

              });
      });


};
