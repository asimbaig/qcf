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
          cb(null, file.fieldname + '-' +file.originalname);
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
             fileName:req.file.filename
           });
      });

  });

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
};
