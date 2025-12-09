const express = require("express");
const { registerUser,loginUser,getMe,logoutUser } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth");


const Authrouter = express.Router();
Authrouter.post("/register", registerUser);
Authrouter.post("/login", loginUser);
Authrouter.get("/me",authMiddleware, getMe);
Authrouter.post("/logout",authMiddleware, logoutUser);


module.exports = Authrouter;
