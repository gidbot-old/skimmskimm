var helper = require('./helper')
	, mailer = require('./mailer');

function getBrowserUrl (text) {
  var raw = text.match(/View it in your browser.(\n)*.+?(?=>)/i);
  if (!raw) {
  	return false;
  } else { 
  	raw = raw[0];
  }
  var index = raw.indexOf("http:"); 
  var url = raw.slice(index);
  return url;
}

function generateAndSendEmail(text) {
	var url = getBrowserUrl(text); 
	if (url) {
		console.log("Got URL, Initiating Script")
		helper.parseHtml(url, function (json) {
			console.log("HTML Parsed");
			var subject = "theSkimmSkimm for " + getDate();
			var body = generateHtmlEmail(json); 
			mailer.sendEmail(subject, body, function (response) {
				console.log("Digest " + response); 
			});
		});
	} else {
		console.log("Unable to Find Url");
	}
}

exports.generateAndSendEmail = generateAndSendEmail; 

function generateHtmlEmail (input) {
	console.log("Generating Email"); 
	console.log("Input: " , input); 
	var topStory = input.topStory; 
	var html = "<html> <body style='text-align: center;'> <h1> Top Story: </h1> ";
	html += topStory.html[0];
	if (topStory.html[1]) {
		html += topStory.html[1];
	}
    html += "<h2> Other Stores: </h2>"; 
	for (var i = 0; i < input.otherStories.length; i++) { 
		var story = input.otherStories[i];
		html+= story[0];	
		if (story[1]) {
			html+= story[1] + "<br>";			
		} 		
	}

	html += "</body> </html>";
	return html; 
}

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