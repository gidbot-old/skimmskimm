var requestify = require("requestify"); 
var apiKey = process.env.MAILCHIMP_API_KEY; 

var path = "https://us13.api.mailchimp.com/3.0/campaigns/";
var listId = "7f6705304e";

var authBody = {
  username: 'apikey',
  password: apiKey
}

var newCampaignBody = {
  type: "regular",
  recipients: {
    list_id: listId
  },
  settings: {
    subject_line: "Some Stuff Happened Yesterday", 
    from_name: "theSkimmSkimm",
    reply_to: "theSkimmSkimm@gmail.com"
  }
}

var duplicateCampain = function (subject, emailBody) {
  var promise = new Promise(function (resolve, reject) {
    newCampaignBody.settings.subject_line = subject;

    requestify.request(path, {
        method: 'POST',
        auth: authBody,
        dataType: 'json',
        body: newCampaignBody
    }).then(function (response) {
      console.log("Campaign Created")
      var newCampaignId = JSON.parse(response.body).id;
      var contentData = {
        newCampaignId: newCampaignId,
        emailBody: emailBody
      }
      resolve(contentData); 

    }, function (err) {
      reject(err); 
    }); 
  }); 
  return promise;
};

var setContent = function (contentData) {
  var promise = new Promise(function (resolve, reject) {
    requestify.request(path + contentData.newCampaignId + '/content', {
        method: 'PUT',
        auth: authBody,
        body: {
          html: contentData.emailBody
        }, 
        dataType: 'json'    
    })
    .then(function (response) {
        // get the response body
        console.log("Content Set"); 
        resolve(contentData.newCampaignId);
    }, function (err) {
      reject(err); 
    });
  });
  return promise; 
}

var sendCampaign = function (newCampaignId) {
  var promise = new Promise (function (resolve, reject) {
    requestify.request(path +  newCampaignId +'/actions/send', {
      method: "POST", 
      auth: authBody
    }).then(function (response) {
      console.log("Campaign Sent"); 
      resolve(response.code);
    }, function (err) { 
      console.log("err: ", err);
      reject(err);
    }); 

  }); 
  return promise;
}

var sendEmail = function (subject, emailBody, callback) {
  duplicateCampain(subject, emailBody)
  .then(setContent)
  .then(sendCampaign)
  .then(function (response) {
    console.log("Email Digest Succeeded") // Success!
    callback("Succes"); 
  }, function (err) {
    console.log("Email Digest Failed"); // Error!
    callback("Failure"); 
  }); 
}

exports.sendEmail = sendEmail; 