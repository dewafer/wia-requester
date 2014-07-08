var debug = require('debug')('requester-users');
var express = require('express');
var router = express.Router();
var db = require('../lib/dbutils');

/* GET users listing. */
router.get('/:userid?', function(req, res) {
	var userid = req.params.userid;
	var weiboname = req.param('wn');
	var email = req.param('em');

	debug('wn=' + weiboname);
	debug('em=' + email);
	if(!userid) {
		if(!weiboname || !email){
			// redirect to front page
			res.redirect('/');
			return;
		}
	}

	var selectSql = 'SELECT real_name, weibo_nickname, email_addr, accepted, rejected, reject_reason FROM request WHERE ';
	var params = undefined;
	var display = {found: false, userid: null, name: null, accepted: false, rejected: false, reason: null};
	
	if(userid) {
		selectSql += ' id = ?';
		params = [Number(userid)];
		display.userid = userid;

	} else {
		selectSql += ' weibo_nickname = ? AND email_addr = ?';
		params = [weiboname, email];
	}

	db.query(selectSql, params, function(err, results, done){
		if(err)
			throw err;
		
		debug(JSON.stringify(results));

		display.found = (results.length > 0);
		if(display.found) {
			display.found = true;

			var row = results[0];
			display.name = row['real_name'];

			if(row.accepted == 1){
				display.accepted = true;
			}

			if(row.rejected == 1){
				display.rejected = true;
				display.reason = row['reject_reason'];
			}
		}
		res.render('users', display);

		done();
	});

});

module.exports = router;
