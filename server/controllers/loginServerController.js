var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

var Employee = mongoose.model('Employees');
var Company = mongoose.model('Companies');

module.exports = function(app){

  app.post('/Login',function(req,res){
      Company.findOne({email: req.body.LoginEmail,password: req.body.LoginPass}).lean()
              .exec(function(err,result){

                if(result){
                    result.CompanyFlag = 'true';
                    result.EmployeeFlag = 'false';
                    return res.send(result);

                }else{
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
