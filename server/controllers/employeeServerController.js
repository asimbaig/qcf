var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });
//create schema - this like blueprint
var employeeSchema = new mongoose.Schema({
    fullName:String,
    profilePicture:String,
    address:String,
    phone:String,
    email:String,
    password:String,
    //company:String,
    joinDate:Date,
    active:Boolean,
    eventsProgram:[String],
    role: String,
    empRegisterCode: String
});

var Employee = mongoose.model('Employees',employeeSchema);
var Company = mongoose.model('Companies');

module.exports = function(app){
  app.post('/empRegCode',function(req,res){
      Company.findOne({empRegisterCode: req.body.regCode}).lean()
              .exec(function(err,result){
                if(result){
                    result.flag = "true";
                    return res.send(result);
                }else{
                  return res.status(400).send({
                         message: 'No records found.'
                      });
                }

              });
  });
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
            fileName:req.file.filename
          });
      });
  });

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
};
