var bodyParser = require("body-parser");
var multer = require('multer');
var mongoose = require('mongoose');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds113586.mlab.com:13586/quartetdb', { useMongoClient: true });

//create schema - this like blueprint
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

var causeCharity = mongoose.model('causeCharities',causeCharitySchema);
var Company = mongoose.model('Companies');
module.exports = function(app){
  var savedFile;
  var storage = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
          var datetimestamp = Date.now();
          var saveFile;// = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
          var currentDate = new Date();
          var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          //document.write("<b>" + day + "/" + month + "/" + year + "</b>")
          saveFile = file.fieldname + '-' +file.originalname; //+ "-" + day + "-" + month + "-" + year;
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

  app.post('/cseChtReg', function(req, res, next) {
        //console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}"+req.body.picture);
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
                    //console.log(data);
  				          //res.send('Employee Saved.');
                    return res.json(data);
			           });
  });
  app.post('/loadAvailableCharities', function(req, res, next) {

    Company.findOne({companyName: req.body.companyName})
            .exec(function(err,result){

              if(result){
                  //console.log("causesCharities :>>>>>>>>>>>>>>>>>>>>>"+result.causesCharities);
                  var temp = result.causesCharities;
                  var query = causeCharity.find({});
                  query.where('title').nin(result.causesCharities);
                          query.exec(function(err,result1){
                            if(result1){
                                //console.log("result1 :>->->->->-->->>->charity->->>->->->->>-->>-->>"+result1);
                                return res.json(result1);
                            }else{
                              console.log("No result");
                            }

                          });
                  //return res.json(result);
                  //res.redirect('./views/employeeMain.html');
              }else{
                console.log("No result");
                //res.redirect('./views/employeeLogin.html');
              }

            });

  });
  app.get('/loadCharities',function(req,res){

      causeCharity.find({})
              .exec(function(err,result){
                if(result){
                    //console.log("result :>->->->->-->->>->charity->->>->->->->>-->>-->>"+result);
                    return res.json(result);
                }else{
                  console.log("No result");
                }

              });
      });

  /*
  app.post('/empLogin',function(req,res){
      Employee.findOne({email: req.body.empLoginEmail,password: req.body.empLoginPass})
              .exec(function(err,result){

                if(result){
                    console.log("result :>>>>>>>>>>>>>>>>>>>>>"+result);
                    return res.json(result);
                    //res.redirect('./views/employeeMain.html');
                }else{
                  console.log("No result");
                  //res.redirect('./views/employeeLogin.html');
                }

              });
    });*/
};
