const express = require("express");

const { connectDB } = require("./connnection");
const { logRequestResponse } = require("./middlewares");
const userRouter = require("./routes/user");
const app = express();
const PORT = 8000;

//Connnection

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://trynikhilhooda:LPYeLinVyk1Tu8It@cluster0.1teoo8t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequestResponse("log.txt"));

//Routes
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));
