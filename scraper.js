var gplay = require('google-play-scraper');
// https://github.com/facundoolano/google-play-scraper
var dbConnector = require("./databaseConnector");
var webPageScraper = require('./scrapePage');

// gplay.app({appId: 'com.nianticlabs.pokemongo'})
//   .then(console.log, console.log);

gplay.list({
  // category: gplay.category.GAME_ACTION,
  collection: gplay.collection.TOP_FREE,
  num: 60,
  country: 'in',
  fullDetail: true
}).then(successCallback).catch(function (err) {
  //handle error
  console.log("Could not fetch apps from gplay");
  console.log(err);
});

function successCallback(resolve) {
  // console.log(resolve);
  var list = JSON.parse(JSON.stringify(resolve));
  console.log("Total apps fetched : " + list.length);
  list.forEach(item => {
    // console.log(item);
    console.log("Processing app : " + item.title + " : " + item.privacyPolicy);
    createApp(item);
    createPrivacyPolicy(item);
  });
}

function createPrivacyPolicy(item) {
  // var connection = dbConnector.get();
  dbConnector.get().then((connection) => {
    connection.collection('policy').findOne({ appId: item.appId })
      .then(policy => {
        console.log("Policy Already exists " + policy.appId);
      })
      .catch(err => {
        console.log("Inserting New Privacy Policy for app " + item.appId);
        getPolicyRecord(item).then((record) => {
          connection.collection('policy').insertOne(record, (err, result) => { });
        });
      });
    // dbConnector.close(connection);
  });
}

function createApp(item) {
  // var connection = dbConnector.get();
  dbConnector.get().then((connection) => {
    connection.collection('app').findOne({ appId: item.appId })
      .then(app => {
        console.log("App Already exists " + app.appId);
      })
      .catch(err => {
        console.log("Creating New App " + item.appId);
        connection.collection('app').insertOne(item, (err, result) => { });
      });
    // dbConnector.close(connection);
  });
}

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

function failureCallback(error) {
  console.error("Error generating audio file: " + error);
}