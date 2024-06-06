const express = require("express");
const router = express.Router();

// REST API
router.get("/", async (req, res) => {
  const alldbusers = await User.find({});
  return res.json(alldbusers);
});

router
  .route("/:id")
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

router.post("/", async (req, res) => {
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

module.exports = router;
