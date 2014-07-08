// for noConflict
(function($){

	// error msg
	var queryparam = new queryString();
	if(queryparam.err){
		$('#errorPanel').removeClass('hidden');
		var msg = decodeURIComponent(queryparam.err);
		$('#errorMsg').text(msg);
	}

	var hashparam = new hashString();
	if(hashparam.hash){
		// is tab
		var tabselector = '#' + hashparam.hash;
		if($(tabselector).attr('role') == 'tab-content'){
			tabActive(tabselector);
		}
	}

	// for(var i in queryparam){
	// 	console.log(i + "=" + queryparam[i]);
	// }

	// tab clicks
	$('.nav-tabs a, .navbar-form.navbar-right a').click(function(event){
		tabActive($(this).attr('href'));
	});

	// form check
	$('form').submit(function(event){
		$(this).find('input').each(function(index, item){
			var v = $(item).val();
			if(!v || !(v.trim())){
				$(item).focus();
				$(item).parent().addClass('has-error');
				$(item).parent().find('.label.label-danger').text('必填').removeClass('hidden');
				event.preventDefault();
				return false;
			}
			if(v.trim().length > 50){
				$(item).focus();
				$(item).parent().addClass('has-error');
				$(item).parent().find('.label.label-danger').text('太长').removeClass('hidden');
				event.preventDefault();
				return false;
			}
		});
	});

	// check error clear
	$('input').change(function(event){
		$(this).parent().removeClass('has-error').find('.label.label-danger').addClass('hidden');
	});


	// get surplus
	var apiData = false;
	$.getJSON('/api', null, function(data){
		if(data){
			apiData = data;
		}
		updateApiData(apiData);
	});

	$('a[href="#reqform"], a[href="#requestForm"]').tooltip({
		placement: 'auto',
		title: "正在获取信息...",
		container: 'body'
	});

})(jQuery);

function tabActive(selector){

	$('.nav.nav-tabs > li').removeClass('active');
	$('.nav.nav-tabs a[href=' + selector + ']').parent().addClass('active');

	var t = $(selector);
	t.siblings('div').addClass('hidden');
	t.removeClass('hidden');

	// console.log(selector);
	// console.log(t.length);
}

function queryString(){
	
	this.querystring = window.location.search.substring(1);
	var pair = this.querystring.split("&");
	if(!pair.forEach){
		pair.forEach = function(fn){
			for(var i in pair)
				fn.call(this, pair[i]);
		}
	}
	
	var self = this;
	pair.forEach(function(pair) {
		if(pair){
			var item = pair.split("=");
			self[item[0]] = item[1]; 
		}
	});

}

function hashString(){

	this.hash = window.location.hash.substring(1);
	// console.log(this.hash);

}


function updateApiData(apiData){
	// tool tip
	var tooltipMsg;
	var n;
	
	if(apiData){
		n = apiData.quota;
	}
	
	if(n && n > 0){
		tooltipMsg = "".concat('还有',n,'个测试人员名额。');
	} else {
		tooltipMsg = "".concat('测试人员名额木有了...');
	}

	$('a[href="#reqform"], a[href="#requestForm"]').attr('data-original-title', tooltipMsg);
	$('#api-data-info-here').text(tooltipMsg);
	
	if(!n){
		$('#requestForm > fieldset').attr('disabled', true);
	}
}