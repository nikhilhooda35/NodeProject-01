const mongoose = require("mongoose");

const uri =
  "mongodb+srv://trynikhilhooda:nikhilhooda@cluster0.1teoo8t.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
  mongoose.connect(uri).then((res) => {
    console.log(`Mongodb connnected: ${res.connection.host}`);
  });
}

module.exports = {
  connectDB,
};
