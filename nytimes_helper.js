var jsdom = require("jsdom");

var window; 

var parseHtml = function (url, callback) {
  console.log("Parsing NYTimes WWR");
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (err, window2) {
      window = window2; 

      var header = window.$("h4").first();  
      var description = header.next().html(); 
      var htmlForEmail = "<h2> NYTimes WWR: </h2>  <span>" + header.html() + ": " + description +" </span>"
      callback(htmlForEmail);
    }
  );
}

var searchLinkRegExp = function () {
  return new RegExp(/on the web(\n)*.+?(?=>)/i)
} 
exports.getLinkRegExp = searchLinkRegExp;
exports.parseHtml = parseHtml;