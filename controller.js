var skimm_helper = require('./skimm_helper')
	, politico_helper = require('./politico_helper')
	, nytimes_helper = require('./nytimes_helper')
	, mailer = require('./mailer');

function helperFactory (key) {
	var factory = {
		"skimm": skimm_helper,
		"politico": politico_helper,
		"nytimes": nytimes_helper
	}
	return factory[key]; 
}
function getBrowserUrl (text, regexp) {
  var raw = text.match(regexp);
  if (!raw) {
  	return false;
  } else { 
  	raw = raw[0];
  }
  var index = raw.indexOf("http:"); 
  var url = raw.slice(index);
  return url;
}

function parseHtml(text, service, url2, callback) {
	var helper = helperFactory(service); 
	console.log("Service: ", service);
	console.log("URL2", url2);
	console.log("RegExp", helper.getLinkRegExp); 
	var url = getBrowserUrl(text, helper.getLinkRegExp()); 
	url = (url2) ? url2 : url;
	if (url) {
		console.log("Got URL, Initiating Script")
		helper.parseHtml(url, function (html) {
			console.log("Done Parsing");
			console.log(html);
			callback(html);
		});
	} else {
		console.log("Unable to Find Url");
	}
}

exports.parseHtml = parseHtml; 

function getDate () {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yy = today.getFullYear().toString().substring(2);
	if(dd<10){
	    dd='0'+dd
	} 
	if(mm<10){
	    mm='0'+mm
	} 
	return dd+'/'+mm+'/'+yy;
}