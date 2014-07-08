var express = require('express');
var router = express.Router();
var db = require('../lib/dbutils');
var CONSTANT = require('../lib/constant');
var MAX_NUMBER = CONSTANT.MAX_TESTER_NUMBER;

/* GET home page. */
router.get('/', function(req, res) {
  
  db.query(CONSTANT.SQL_COUNT_ACCEPTED, function(err, results, done){
  	if(err) throw err;

  	var number = results[0]['COUNT'];
  	var quota = MAX_NUMBER - number;
  	
  	if( quota < 0){
  		quota = 0;
  	}

    var jsonResult = {quota: quota};
  	res.json(jsonResult);

  	done();

  });

});

module.exports = router;
