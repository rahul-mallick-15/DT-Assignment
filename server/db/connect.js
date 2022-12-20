const mongoClient = require("mongodb").MongoClient;
let mongodb;

function connect(callback) {
  mongoClient.connect(process.env.URL, (err, client) => {
    mongodb = client.db(process.env.DATABASE);
    callback(err);
  });
}

function get() {
  return mongodb;
}

function close() {
  mongodb.close();
}

module.exports = {
  connect,
  get,
  close,
};

// async function connectDB(url) {
//   try {
//     const client = new MongoClient(url);
//     await client.connect();
//     return client;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }
