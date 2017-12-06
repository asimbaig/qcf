var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

//create schema - this like blueprint
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
  details: String
});

var Company = mongoose.model('Companies',companySchema);

module.exports = function(app){
  var savedFile;
  var storage = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
          var datetimestamp = Date.now();
          var saveFile; //= file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
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

  app.post('/comReg', function(req, res, next) {
    //console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}"+req.body.logoPicture);
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
        com.save(function(err,data){
  				          if(err){
                      console.log(err);
                      throw err;
                    }
                    //console.log(data);
  				          //res.send('Company Saved.');
                    return res.json(data);
			           });
  });


  app.post('/comLogin',function(req,res){
      Company.findOne({email: req.body.comLoginEmail,password: req.body.comLoginPass})
              .exec(function(err,result){

                if(result){
                    //console.log("result :>>>>>>>>>>>>>>>>>>>>>"+result);
                    return res.json(result);
                }else{
                  console.log("No result");
                }

              });
      });
      app.get('/loadCompanies',function(req,res){

          Company.find({})
                  .exec(function(err,result){
                    if(result){
                        //console.log("result :>->->->->-->->>->->->>->->->->>-->>-->>"+result);
                        return res.json(result);
                    }else{
                      console.log("No result");
                    }

                  });
          });

          app.post('/fetchCompany',function(req,res){
              Company.findOne({companyName: req.body.company})
                      .exec(function(err,result){

                        if(result){
                            //console.log("result :>>>>>>>>>company>>>>>>>>>>>>"+result);
                            return res.json(result);
                        }else{
                          console.log("No result");
                        }

                      });
              });
          app.post('/RemoveCauseCharity',function(req,res){
                  Company.findOne({companyName: req.body.compName})
                          .exec(function(err,result){
                                if(result){
                                    //console.log("result :>>>>>>>>>companyRemove>>>>>>>>>>>>"+result);

                                    var tempData;
                                    var temp = result.causesCharities;
                                    var index = temp.indexOf(req.body.causeCharity);

                                    if (index > -1) {
                                        temp.splice(index, 1);
                                    }
                                    //console.log("result :>>>>>>>>>companyRemoveAfter>>>>>>>>>>>>"+temp);

                                    Company.findOneAndUpdate({companyName: req.body.compName}, {$set:{causesCharities:temp}}, {new: true}, function(err, doc){
                                                if(err){
                                                    console.log("Something wrong when updating data!");
                                                }
                                                tempData = doc;
                                                console.log("tempData :"+tempData);
                                                 return res.json(tempData);
                                     });
                                }else{
                                    console.log("No result");
                                }
                        });
          });
          app.post('/addCauseCharity',function(req,res){
                  Company.findOne({companyName: req.body.compName})
                          .exec(function(err,result){
                                if(result){
                                    //console.log("result :>>>>>>>>>companyRemove>>>>>>>>>>>>"+result);

                                    var tempData;
                                    var temp = result.causesCharities;
                                    var index = temp.indexOf(req.body.causeCharity);

                                    if (index === -1) {
                                        temp.push(req.body.causeCharity);
                                        //temp.splice(index, 1);
                                    }
                                    //console.log("result :>>>>>>>>>companyRemoveAfter>>>>>>>>>>>>"+temp);

                                    Company.findOneAndUpdate({companyName: req.body.compName}, {$set:{causesCharities:temp}}, {new: true}, function(err, doc){
                                                if(err){
                                                    console.log("Something wrong when updating data!");
                                                }
                                                //tempData = doc;
                                                console.log("tempData :"+doc);
                                                 return res.json(doc);
                                     });
                                }else{
                                    console.log("No result");
                                }
                        });
          });
};
