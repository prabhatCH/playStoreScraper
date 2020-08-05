var webPageScraper = require('./scrapePage');
var dbConnector = require("./databaseConnector");

function getPolicyRecord(item) {
  return new Promise(function (resolve, reject) {
    var result = {};
    result.appId = item.appId;
    webPageScraper.scrapeContents(item.privacyPolicy).then((body => {
      result.policy = body;
      console.log("Writing policy record for app : " + result.appId);
      resolve(result);
    })).error((err) => {
      console.log("Could not parse the privacy policy");
      console.log(err);
      reject(err);
    });
  });
}

function createPrivacyPolicy(item) {
    // var connection = dbConnector.get();
    return dbConnector.get().then((connection) => {
      connection.collection('policy').findOne({ appId: item.appId })
        .then(policy => {
          console.log(new Date().getTime() + " Policy Already exists " + policy.appId);
        })
        .catch(err => {
          console.log("Inserting New Privacy Policy for app " + item.appId);
          getPolicyRecord(item).then((record) => {
            connection.collection('policy').insertOne(record, (err, result) => { });
          });
        });
      // dbConnector.close(connection);
      return true;
    });
  }
exports.getPolicyRecord = getPolicyRecord;
exports.createPrivacyPolicy = createPrivacyPolicy;