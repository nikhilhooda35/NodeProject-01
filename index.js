const express = require("express");

const { connectDB } = require("./connnection");
const { logRequestResponse } = require("./middlewares");
const userRouter = require("./routes/user");
const app = express();
const PORT = 8000;

//Connnection
connectDB();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequestResponse("log.txt"));

//Routes
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));
