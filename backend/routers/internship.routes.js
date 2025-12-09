const express = require("express");
const internshipController = require("../controllers/internship.controller");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, internshipController.createInternship);
router.get("/", internshipController.getAllInternships);

module.exports = router;
