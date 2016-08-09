var notifier = require('mail-notifier')
	, helper = require('./helper')
	, mailer = require('./mailer');

var imap = {
      user: process.env.SKIMM_EMAIL,
      password: process.env.SKIMM_PASSWORD,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
};

console.log("Server.js Loaded");

notifier(imap).on('mail',function (mail){
  console.log("Emai Received"); 
  console.log("From: " , mail.from);
  var url = getBrowserUrl(mail.text.toString());
  generateAndSendEmail(url);
}).start();

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

function generateAndSendEmail(url) { 
	console.log("Got URL, Initiating Script")
	helper.parseHtml(url, function (json) {
		console.log("HTML Parsed");
		var subject = "theSkimmSkimm for " + getDate();
		var body = generateHtmlEmail(json); 
		mailer.sendEmail(subject, body, function (response) {
			console.log("Digest " + response); 
		});
	});
}

function generateHtmlEmail (input) {
	console.log("Generating Email"); 
	var topStory = input.topStory; 
	var html = "<html> <body style='text-align: center;'> <h1> Top Story: </h1> ";
	html += "Something with <a target='_blank' href ='" + topStory.link+"'>" + topStory.importantWords[0].match +"</a> <br> "; 
    html += "<h2> Other Stores: </h2>"; 
	for (var story of input.otherStories) { 
		var story = "Some stuff happend with <a target='_blank' href ='" + story.link+"'>" + story.importantWords[0].match +"</a> <br> "; 
		html+= "" + story + "<br>";
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