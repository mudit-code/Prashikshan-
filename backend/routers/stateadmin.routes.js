const express = require("express");
const router = express.Router();
const stateadminController = require("../controllers/stateadmin.controller");
const { authMiddleware } = require("../middleware/auth");

router.get("/stats", authMiddleware, stateadminController.getDashboardStats);
router.get("/students", authMiddleware, stateadminController.getStudents);
router.get("/colleges", authMiddleware, stateadminController.getColleges);

module.exports = router;
