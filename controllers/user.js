const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not Found" });

  return res.status(200).json(user);
}
async function updateUserById(req, res) {
  try {
    const updates = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not Found" });

    await User.findByIdAndUpdate(req.params.id, updates);
    return res.status(200).json({ status: "User Updated" });
  } catch (error) {
    return res.status(500).json({ status: "Failed", error: error.message });
  }
}
async function deleteUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not Found" });

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: "User Deleted" });
  } catch (error) {
    return res.status(500).json({ status: "Failed", error: error.message });
  }
}

async function createNewUser(req, res) {
  try {
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

    return res.status(201).json({ msg: "Success", id: result._id });
  } catch (error) {
    return res.status(500).json({ status: "Failed", error: error.message });
  }
}

module.exports = {
  handleGetAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createNewUser,
};
