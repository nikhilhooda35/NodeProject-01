const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  fs.appendFile("log.txt", `\n${req.method}: ${req.path}: ${req.ip}: ${Date.now()}:`, (err, data) => {
    next();
  })
});

app.use((req, res, next) => {
  console.log("Hello from middleware 2", req.myUserName);
  // return res.send("Hello from middleware 2");
  // You can write DB query here
  next();
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
app.get("/api/users", (req, res) => {
  console.log('In Get users', req.myUserName);
  return res.json(users);
});
 
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    let usend = []
    const user = users.map((user) => { if (user.id === id) { usend.push(user) } });
    return res.json(usend);
  })

  .patch((req, res) => {
    try {
      const body = req.body;
      const id = Number(req.params.id);
      let allusers = [...users];
      let userFound = false;

      allusers = allusers.map((user) => {
        if (user.id === id) {
          userFound = true;
          Object.keys(body).forEach((key) => {
            if (user.hasOwnProperty(key)) {
              user[key] = body[key];
            }
          });
        }
        return user;
      });

      if (!userFound) {
        return res.status(404).json({ status: "User not found" });
      }

      fs.writeFile(
        "./MOCK_DATA.json",
        JSON.stringify(allusers, null, 2),
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ status: "Failed to save user data", error: err.message });
          }
          return res.json({ status: "Success" });
        }
      );
    } catch (error) {
      return res.status(500).json({ status: "Failed", error: error.message });
    }
  })

  .delete((req, res) => {
    try {
      const id = Number(req.params.id);
      console.log("id--", id);
      let allusers = [...users];
      const initialLength = allusers.length;

      // Filter out the user with the given id
      allusers = allusers.filter((user) => user.id !== id);

      if (allusers.length === initialLength) {
        return res.status(404).json({ status: "User not found" });
      }

      fs.writeFile(
        "./MOCK_DATA.json",
        JSON.stringify(allusers, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({
              status: "Failed to delete user data",
              error: err.message,
            });
          }
          return res.json({ status: "User Deleted" });
        }
      );
    } catch (error) {
      return res.status(500).json({ status: "Failed", error: error.message });
    }
  });

app.post("/api/users", (req, res) => {
  //TODO: Create New User
  const body = req.body;
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));
