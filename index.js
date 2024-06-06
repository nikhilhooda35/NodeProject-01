const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://trynikhilhooda:nikhilhooda35@cluster0.1teoo8t.mongodb.net/";

// Connection to MongoDB
try {
  console.log("Connecting to MongoDB...");
  const connectDB = async () => {
    await mongoose.connect(uri);
  };
  connectDB();
  console.log(`Connected successfully to MongoDB ${mongoose.connection.host}`);
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  return;
}

//Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    job_title: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${req.method}: ${req.path}: ${req.ip}: ${Date.now()}:`,
    (err, data) => {
      next();
    }
  );
});


// Routes
app.get("/users", (req, res) => {
  const html = `
     <ul>
     ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
     </ul>
     `;
  res.send(html);
});

// REST API
app.get("/api/users", async (req, res) => {
  const alldbusers = await User.find({});
  return res.json(alldbusers);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const id = Number(req.params.id);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not Found" });

    return res.status(200).json(user);
  })

  .patch(async (req, res) => {
    try {
      const body = req.body;
      const id = Number(req.params.id);

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: "User not Found" });

      await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
      return res.status(200).json({ status: "User Updated" });

    } catch (error) {
      return res.status(500).json({ status: "Failed", error: error.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: "User not Found" });

      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ status: "User Deleted" });

    } catch (error) {
      return res.status(500).json({ status: "Failed", error: error.message });
    }
  });

app.post("/api/users", async (req, res) => {
  //TODO: Create New User
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "Incomplete request" });
  }

  const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  });

  return res.status(201).json({ msg: "success" });
  I;
});

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));
