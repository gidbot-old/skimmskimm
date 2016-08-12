var querystring = require('querystring');
var MailParser = require('mailparser').MailParser;
var server = require('http').createServer();
var controller = require('./controller.js');

var addresses = {
  "gideonbrosenthal@gmail.com": "skimm",
  "dailyskimm@morning7.theskimm.com": "skimm"
}

server.addListener('request', function(req, res) {
  var chunks = [];
  req.on('data', chunks.push.bind(chunks));
  req.on('end', function() {
    var mailparser = new MailParser();
    mailparser.on("end", function(mail_object) {
      console.log("Mail Received");
      console.log("From:", mail_object.from); 
      var address = mail_object.from[0].address; 

      var service = addresses[address]; 
      if (service) {
        console.log("Subject:", mail_object.subject); 
        controller.parseHtml(mail_object.text, service, null, function (html) {
          console.log(html)
        });
      } else {
        console.log("Email Not From Verified Sender");
      }
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end();
    });
    var params = querystring.parse(chunks.join("").toString());
    mailparser.write(params['message']);
    mailparser.end();
  });
});
var port = process.env.PORT || 3000;
console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');