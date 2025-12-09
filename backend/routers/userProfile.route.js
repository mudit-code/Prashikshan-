const express = require("express");
const profilerouter = express.Router();
const controller = require("../controllers/userProfile.controller");



profilerouter.get("/:userId", controller.getUserProfile);


module.exports = profilerouter;