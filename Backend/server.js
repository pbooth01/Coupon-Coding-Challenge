// server.js

// BASE SETUP
// =============================================================================

var express    = require('express');        // call express
var app        = express();  // define our app using express

var bodyParser = require('body-parser');
var Q = require("q");
var exec = require('child_process').exec;
var cookieParser = require('cookie-parser')
var session = require('express-session')

app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY'}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../Frontend/Resources'));

app.set('views', __dirname + '/../Frontend');
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var port = process.env.PORT || 8090;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8090/api)
router.get('/', function(req, res) {
  res.render('index');
});

router.route('/account-auth')

  .get(function(req, res, next){

    var df = Q.defer();
    var response = "Invalid Credentials";
    var phpScriptPath = __dirname + "/PhpScripts/shopifyAuth.php";
    var argsString = req.query.email + "," + req.query.password + "," + req.query.shopname;

    exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
      if(err){
        console.log(err); /* log error */
        df.reject(err);
      }

      if(phpResponse === 'Valid Credentials'){
        var sess = req.session
        sess.creds = {
          email: req.query.email,
          password: req.query.password,
          shopname: req.query.shopname
        }
      }

      df.resolve(phpResponse);
    });

    df.promise
      .then(function(data){
        res.send(data);
      })
      .catch(function(){
        res.send(response);
      })
  });

router.route('/generate-coupon')

  .post(function(req, res, next){
    var df = Q.defer();
    var discount_type = req.query.coupon_type;
    var value = req.query.coupon_value;
    var minimum_order = req.query.minimum;

    var sess = req.session;
    var phpScriptPath = __dirname + "/PhpScripts/couponCreation.php";

    var argsString = sess.creds.email + "," +
                      sess.creds.password + "," +
                      sess.creds.shopname + "," +
                      discount_type + "," +
                      value + "," +
                      minimum_order;

    exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
      if(err){
        console.log(err); /* log error */
        df.reject(err);
      }
      df.resolve(phpResponse);
    });

    df.promise
      .then(function(data){
        res.send(data);
      })
      .catch(function(){
        res.send("Error Making Coupon");
      })
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);