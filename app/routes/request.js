var debug = require('debug')('requester-request');
var express = require('express');
var router = express.Router();
var db = require('../lib/dbutils');
var CONSTANT = require('../lib/constant');
var MAX_NUMBER = CONSTANT.MAX_TESTER_NUMBER;

router.post('/', function(req, res) {
	var name = req.param('name');
	var weiboname = req.param('weiboname');
	var email = req.param('email');


	if(!checkParam(name)){
		res.redirect('/?err=' + encodeURIComponent('输入的姓名有误。'));
		return;
	}
	if(!checkParam(weiboname)){
		res.redirect('/?err=' + encodeURIComponent('输入的微博昵称有误。'));
		return;
	}
	if(!checkParam(email)){
		res.redirect('/?err=' + encodeURIComponent('输入的电子邮件地址有误。'));
		return;
	}

	// debug info
	debug('name:' + name);
	debug('weiboname:' + weiboname);
	debug('email:' + email);

	// trim
	name = name.trim();
	weiboname = weiboname.trim();
	email = email.trim();

	db.query(CONSTANT.SQL_COUNT_ACCEPTED, quotaCheck)

	function quotaCheck(err, results, done){
		if(err) throw err;
		done();

		var quota = MAX_NUMBER - results[0]['COUNT'];

		if( quota <= 0){

			var errorMsg ='抱歉亲，测试人员的名额已经用完了。';
			res.redirect('/?err=' + errorMsg);

		} else {

			db.query('SELECT COUNT(*) AS COUNT FROM request WHERE weibo_nickname = ? AND email_addr = ?', [weiboname, email], countCheck);

		}
	}

	function countCheck(err, results, done){
		if(err) throw err;
		done();

		debug2(results);

		if(results[0]['COUNT'] !== 0){

			var errorMsg ='该微博昵称已申请过，请换一个再试试，或者查询申请结果：' + weiboname ;
			res.redirect('/?err=' + errorMsg);

		} else {

				// check OK and go on...
				db.query('INSERT INTO request (real_name, weibo_nickname, email_addr) values (?, ?, ?)',[name, weiboname, email], inserted);

			}
		}

		function inserted(err, result, done){

			if(err) throw err;
			res.redirect('/users/' + result.insertId);
			done();

		}

	});


module.exports = router;

function checkParam(param){

	if(!param || !(param.trim())) {
		return false;
	}

	if(param.trim().length > 100){
		return false;
	}

	return true;
}

function debug2(object){
	for(var i in object){
		var value = object[i];
		if(value instanceof Object){
			debug(i+"+=");
			debug2(value);
		}else{
			debug(i+"=" + value);
		}
	}
}