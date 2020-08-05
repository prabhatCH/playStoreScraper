var dbConnector = require("./databaseConnector");

function createApp(item) {
  // var connection = dbConnector.get();
  return dbConnector.get().then((connection) => {
    connection.collection('app').findOne({ appId: item.appId })
      .then(app => {
        console.log(new Date().getTime() + " App Already exists " + app.appId);
      })
      .catch(err => {
        console.log("Creating New App " + item.appId);
        connection.collection('app').insertOne(item, (err, result) => { });
      });
    // dbConnector.close(connection);
    return true;
  });
}
exports.createApp = createApp;
