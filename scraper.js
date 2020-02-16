var gplay = require('google-play-scraper');

// gplay.app({appId: 'com.nianticlabs.pokemongo'})
//   .then(console.log, console.log);

gplay.list({
    category: gplay.category.GAME_ACTION,
    collection: gplay.collection.TOP_FREE,
    num: 5,
    fullDetail: true
  })
  .then(successCallback);

  function successCallback(resolve) {
    // console.log(resolve);
    var list = JSON.parse(JSON.stringify(resolve));
    console.log("Total apps fetched : " + list.length);
    list.forEach(item => console.log(item.title + " : " + item.privacyPolicy));
  }
  
  function failureCallback(error) {
    console.error("Error generating audio file: " + error);
  }