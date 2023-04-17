const express = require("express");
const router = express.Router();
const userProfiles = require("../services/userProfiles");

router.get("/getUserList", async function (req, res, next) {
  try {
    res.json(await userProfiles.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting user profiles `, err.message);
    next(err);
  }
});

router.post("/createProfile", async function (req, res, next) {
  try {
    res.json(await userProfiles.create(req.body));
  } catch (err) {
    console.error(`Error while creating user profile`, err.message);
    next(err);
  }
});

router.put('/updateUserInfo/:id', async function(req, res, next) {
  try {
    res.json(await userProfiles.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating user profiles`, err.message);
    next(err);
  }
});

router.delete('/deleteUserProfile/:id', async function(req, res, next) {
  try {
    res.json(await userProfiles.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting user profile`, err.message);
    next(err);
  }
});

module.exports = router;
