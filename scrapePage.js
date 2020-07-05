const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const rp = require('request-promise');


// const url = 'https://www.snap.com/en-US/privacy/privacy-policy/';
// const url = 'https://www.flipkart.com/pages/privacypolicy';

module.exports = {
  scrapeContents: function (targetUrl) {
    return rp(targetUrl)
      .then(function (html) {
        //success!
        // console.log(html);
        const dom = new JSDOM(html);
        console.log("jsdom created. Checking paragraphs");
        var body = dom.window.document.querySelector("body");
        return body.textContent;
      })
      .catch(function (err) {
        //handle error
        console.log("Could not process the url " + targetUrl);
      });
  }
}