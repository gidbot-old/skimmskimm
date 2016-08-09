var querystring = require('querystring');
var MailParser = require("mailparser").MailParser;

var server = require('http').createServer();
server.addListener('request', function(req, res) {
  var chunks = [];
  req.on('data', chunks.push.bind(chunks));
  req.on('end', function() {
    var mailparser = new MailParser();
    mailparser.on("end", function(mail_object) {
      console.log("Mail Received");
      console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
      var address = mail_object.from[0].address; 
      if (address == "gideonbrosenthal@gmail.com" || "theskimmskimm@gmail.com") {
        console.log("Subject:", mail_object.subject); // Hello world!
        console.log("Text body:", );

        generateAndSendEmail(mail_object.text);
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