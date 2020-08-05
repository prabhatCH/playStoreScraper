var gplay = require('google-play-scraper');
// https://github.com/facundoolano/google-play-scraper
var dbConnector = require("./databaseConnector");
const appService = require("./appService");
const policyService = require("./policyService");

// gplay.app({appId: 'com.nianticlabs.pokemongo'})
//   .then(console.log, console.log);

gplay.list({
  // category: gplay.category.GAME_ACTION,
  collection: gplay.collection.TOP_GROSSING_GAMES,
  num: 5,
  country: 'in',
  fullDetail: true
}).then(successCallback).catch(function (err) {
  //handle error
  console.log("Could not fetch apps from gplay");
  console.log(err);
});

async function successCallback(resolve) {
  // console.log(resolve);
  var list = JSON.parse(JSON.stringify(resolve));
  console.log("Total apps fetched : " + list.length);
  for(const item of list) {
  // list.forEach(item => {
    // console.log(item);
    console.log(new Date().getTime() + " Processing app : " + item.title + " : " + item.privacyPolicy);
    const isItemProcessed = await processItem(item);
    console.log(new Date().getTime() + " Processed app : " + item.title + " : " + isItemProcessed);
  // });
  }
}

function processItem(item) {
  appService.createApp(item).then(() => {
    policyService.createPrivacyPolicy(item).then(() => {
      console.log(new Date().getTime() + " App and policy both processed");
    });
  });
  return true;
}