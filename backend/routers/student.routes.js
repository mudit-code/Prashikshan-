const express = require("express");
const studentController = require("../controllers/student.controller");
const { authMiddleware } = require("../middleware/auth");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const studentRouter = express.Router();
studentRouter.post("/link-college", authMiddleware, upload.single('collegeIdCard'), studentController.linkCollege);

studentRouter.get("/profile", authMiddleware, studentController.getProfile);
studentRouter.get("/applications/summary/:studentId", studentController.getApplicationSummary);
studentRouter.get("/jobs/eligible/:studentId", studentController.getEligibleJobs);
studentRouter.get("/applications/details/:studentId", studentController.getStudentApplicationsWithJobs);


module.exports = studentRouter;