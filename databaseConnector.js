const mongo = require('mongodb');

const mongoDbUrl = "mongodb://localhost";

function getConnection() {
    var mongoClient = mongo.MongoClient;
    var dbConnection = mongoClient.connect(mongoDbUrl, { useUnifiedTopology: true }, function (err, connection) {
        if (err) {
            console.log("Could not connect to DB");
            throw err;
        };
        console.log("Database created and connected!");
        return connection.db("privacy_policy");
    });
    return dbConnection;
}

function closeConnection(connection) {
    connection.close();
}

module.exports.get = () => {
    // if(!connection) {
    //     throw new Error('Call connect first!');
    // }
    // return connection;
    return new Promise(function (resolve, reject) {
        // try {
        //     resolve(getConnection());
        // } catch (err) {
        //     reject(err);
        // }
        var mongoClient = mongo.MongoClient;
        mongoClient.connect(mongoDbUrl, { useUnifiedTopology: true }, function (err, connection) {
            if (err) {
                console.log("Could not connect to DB");
                // throw err;
                reject(err);
            } else {
                console.log("Database created and connected!");
                // return connection.db("privacy_policy");
                resolve(connection.db("privacy_policy"));
            }
        });
    });
}

module.exports.close = (connection) => {
    closeConnection(connection);
}