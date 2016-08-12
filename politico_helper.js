var jsdom = require("jsdom");

var window; 

var parseHtml = function (url, callback) {
  console.log("Parsing Politico");
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (err, window2) {
      window = window2; 

      var firstElement = window.$(".story-text").first().children().first(); 
      var paragraph = returnHTMLForTag(firstElement, "P"); 
      var htmlForEmail = "<h2> Politico: </h2>  <span>" + paragraph +" </span>"
      callback(htmlForEmail);
    }
  );
}

function returnHTMLForTag (elem, tag) { 
  for (var i = 0; i < 10; i++) {
    if (elem.prop("tagName") == tag) {
      return elem.html();
    }
    elem = elem.next();
  } 
  return false; 
}

var searchLinkRegExp = function () {
  return new RegExp(/View online version(\n)*.+?(?=>)/i)
} 
exports.getLinkRegExp = searchLinkRegExp;
exports.parseHtml = parseHtml;