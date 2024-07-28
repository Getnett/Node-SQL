const express = require("express");
const UsersRepo = require("../repos/users_repo");

const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await UsersRepo.findAll();

  res.send(users);
});
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await UsersRepo.findById(id);

  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});
router.post("/users", async (req, res) => {
  const { username, bio } = req.body;
  const userInserted = await UsersRepo.insert(username, bio);
  res.send(userInserted);
});
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, bio } = req.body;
  const updatedUser = await UsersRepo.update(id, username, bio);

  if (updatedUser) {
    res.send(updatedUser);
  } else {
    res.sendStatus(404);
  }
});
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await UsersRepo.delete(id);
  if (deletedUser) {
    res.send(deletedUser);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
