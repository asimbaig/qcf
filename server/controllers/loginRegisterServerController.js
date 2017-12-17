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

//create schema for Staff - this like blueprint
var staffSchema = new mongoose.Schema({
        email:String,
        password:String,
        role:String
    });

//creating object of Staff model
var Staff = mongoose.model('Staff',staffSchema);

module.exports = function(app){
  //receing adminLogin Ajax request from staff Login
  app.post('/adminLogin',function(req,res){
          //Find login record in Staff Model
          Staff.findOne({email: req.body.LoginEmail,password: req.body.LoginPass}).lean()
                  .exec(function(err,result){
                    if(result){
                        return res.send(result);

                    }else{
                      return res.status(400).send({
                             message: 'Invalid Email/Password,Try again.'

                                });
                    }

                  });
          });

  //receing staffReg Ajax request from staff Registeration
  app.post('/staffReg', function(req, res, next) {
                var stf = new Staff;
                stf.email = req.body.staffEmail;
                stf.password = req.body.staffPass1;
                stf.role = req.body.role;

                stf.save(function(err,data){
          				          if(err) {
                              console.log(err);
                              throw err;
                            }
                            return res.json(data);
        			           });
  });
  //Removing a member of Staff
  app.post('/RemoveStaff',function(req,res){
      Staff.remove({email: req.body.email}, function(err) {
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

  //Load all Companies' record
  app.get('/getStaff',function(req,res){

      Staff.find({})
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
