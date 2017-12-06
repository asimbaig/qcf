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
    company:String,
    joinDate:Date,
    active:Boolean,
    eventsProgram:[String]
});

var Employee = mongoose.model('Employees',employeeSchema);

module.exports = function(app){
  var savedFile;
  var storage = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
          var datetimestamp = Date.now();
          var saveFile;// = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
          saveFile = file.fieldname + '-' +file.originalname;
          cb(null, saveFile);
          //console.log("filename: "+ file.fieldname);
          //console.log("originalname: "+file.originalname);
          //savedFile = __dirname+ "\\uploads\\" + saveFile;
          //console.log("saveFile: "+ __dirname+ "\\uploads\\" + saveFile);
      }
  });

  var upload = multer({ //multer settings
                  storage: storage
              }).single('file');

  app.post('/upload', function(req, res) {
      upload(req,res,function(err){
          if(err){
               console.log(err);
               res.json({error_code:1,err_desc:err});
               return;
          }
           res.json({error_code:0,err_desc:null});
      });
  });

  app.post('/empReg', function(req, res, next) {
        //console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}"+req.body.profilePicture);
        var emp = new Employee;
        emp.fullName = req.body.empName;
        emp.profilePicture = req.body.profilePicture;
        emp.address = req.body.empAddess;
        emp.phone = req.body.empPhone;
        emp.email = req.body.empEmail;
        emp.password = req.body.empPass1
        emp.company = req.body.empCompany
        emp.joinDate = Date.now();
        emp.active = true;
        //emp.eventsProgram = ["event1","event2","program1"];
        //emp.eventsProgram.push("event1");
        //emp.eventsProgram.push("event2");
        //emp.eventsProgram.push("program1");

        emp.save(function(err,data){
  				          if(err) {
                      console.log(err);
                      throw err;
                    }
                    //console.log(data);
  				          //res.send('Employee Saved.');
                    return res.json(data);
			           });
  });
  app.post('/empLogin',function(req,res){
      Employee.findOne({email: req.body.empLoginEmail,password: req.body.empLoginPass})
              .exec(function(err,result){

                if(result){
                    //console.log("result :>>>>>>>>>login>>>>>>>>>>>>"+result);
                    return res.json(result);
                    //res.redirect('./views/employeeMain.html');
                }else{
                  console.log("No result");
                  //res.redirect('./views/employeeLogin.html');
                }

              });
      });
      app.post('/RemoveEventProgram',function(req,res){
              Employee.findOne({fullName: req.body.fullName})
                      .exec(function(err,result){
                            if(result){
                                //console.log("result :>>>>>>>>>eventProgramRemove>>>>>>>>>>>>"+result);

                                var tempData;
                                var temp = result.eventsProgram;
                                var index = temp.indexOf(req.body.eventProgram);

                                if (index > -1) {
                                    temp.splice(index, 1);
                                }
                                //console.log("result :>>>>>>>>>eventProgramAfter>>>>>>>>>>>>"+temp);

                                Employee.findOneAndUpdate({fullName: req.body.fullName}, {$set:{eventsProgram:temp}}, {new: true}, function(err, doc){
                                            if(err){
                                                console.log("Something wrong when updating data!");
                                            }
                                            tempData = doc;
                                            //console.log("tempData :"+tempData);
                                             return res.json(tempData);
                                 });
                            }else{
                                console.log("No result");
                            }
                    });
      });
      app.post('/addEventProgram',function(req,res){
              Employee.findOne({fullName: req.body.fullName})
                      .exec(function(err,result){
                            if(result){
                                //console.log("result :>>>>>>>>>addEventProgram>>>>>>>>>>>>"+result);

                                var tempData;
                                var temp = result.eventsProgram;
                                //console.log(">>>>>>>>>>>>>>>ITEM in node>>>>>>>>>>>>>>>>>>>>>> "+req.body.eventProgram);
                                var index = temp.indexOf(req.body.eventProgram);

                                if (index === -1) {
                                    temp.push(req.body.eventProgram);
                                }
                                //console.log("result :>>>>>>>>>addEventProgramAfter>>>>>>>>>>>>"+temp);

                                Employee.findOneAndUpdate({fullName: req.body.fullName}, {$set:{eventsProgram:temp}}, {new: true}, function(err, doc){
                                            if(err){
                                                console.log("Something wrong when updating data!");
                                            }
                                             //console.log("tempData :"+doc);
                                             return res.json(doc);
                                 });
                            }else{
                                console.log("No result");
                            }
                    });
      });


};
