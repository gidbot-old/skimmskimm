var jsdom = require("jsdom");

var TextRazor = require('textrazor')
var textRazor = new TextRazor("b65f3fee73329eb4a581058a011c8b022868367e0385cd2790acbeec");

var window; 

function parseHmtl (url, callback) {
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (err, window2) {
      window = window2; 
      var skimmedWhile = window.$("em")[0].textContent; 
      var quoteOfTheDay = window.$("#quote-of-the-day").first().next().html();

      var topStoryElement = window.$("#top-story").first(); 
      var topStoryText = returnHtmlForTag(topStoryElement, "P"); 
     
      var topStory = { 
        headline: topStoryElement.text(), 
        link: findFirstLink(topStoryElement)
      }
      //ToDo: Check if there's a number

      getImportantWords(topStoryText, function (topStoryWords) {
        topStory.imoprtantWords = topStoryWords;
        getOtherStories(function (otherStories) {

          var info = {
            skimmedWhile: skimmedWhile, 
            quoteOfTheDay: quoteOfTheDay, 
            topStory: topStory,
            otherStories: otherStories
          }
          console.log(info);   
        });
        
      });

    }
  );
}

function returnHtmlForTag (elem, tag) { 
  for (var i = 0; i < 10; i++) {
    if (elem.prop("tagName") == tag) {
      return elem.html();
    }
    elem = elem.next();
  } 
  return false; 
}

function findFirstLink (elem) {
  for (var i = 0; i < 10; i++) {
    var links = elem.find("a"); 
    if (links.length > 0) {
      return links[0].href;
    }
    elem = elem.next();
  } 
  return false;  
}

function getRepeatAfterMe () {

  var h1s = window.$("h1");
  for (var i = 0; i < h1s.length; i++) {
    if (window.$(h1s[i]).text() == "REPEAT AFTER ME...") {
      return window.$(h1s[i]); 
    }
  }
  return false; 
} 

function getOtherStories (callback) {
  var current = getRepeatAfterMe(); 
  var results = []; 
  while (current && current.length > 0) {
    if (current.hasClass("p1") && current.hasClass("skimm-p")) {
      var story = {
        text: current.text(), 
        link: findFirstLink(current)
      }
      results.push(story);
    }
    current = current.next();
  }
  addImportantWords(results, function (finalStories) {
    callback(finalStories); 
  }); 
}

function addImportantWords (stories, callback) {
  function recurse (currentIndex) {
    if (currentIndex < stories.length) {
      getImportantWords(stories[currentIndex].text, function (results) {
        delete stories[currentIndex].text;
        stories[currentIndex].importantWords = results; 
        recurse(currentIndex+1);
      });
    } else {
      callback(stories);
    }
  }
  recurse(0); 
}

function getImportantWords (search, callback) {
  textRazor.exec(search)
  .then(function (res) {
    var entities = res.response.entities; 
    var results = []; 
    if (entities) {
      for (var i = 0; i < 2; i++) {
        results.push(
          { 
            match: entities[i].matchedText, 
            type: entities[i].type
          });
      }
      callback(results);      
    } else {
      callback(false);
    }

  })
  .catch(function (err) {
    console.log(err);
    callback(err);
  });
}

exports.parseHmtl = parseHmtl; 