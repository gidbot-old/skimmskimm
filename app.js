var querystring = require('querystring');
var MailParser = require("mailparser").MailParser;

var server = require('https').createServer();
server.addListener('request', function(req, res) {
  var chunks = [];
  req.on('data', chunks.push.bind(chunks));
  req.on('end', function() {
    var mailparser = new MailParser();
    mailparser.on("end", function(mail_object) {
      // TODO: use 'mail_object'
      // see API for https://github.com/andris9/mailparser
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end();
    });
    var params = querystring.parse(chunks.join("").toString());
    mailparser.write(params['message']);
    mailparser.end();
  });
});
var port = process.env.PORT || 443; 
console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');