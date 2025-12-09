const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/college.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { authMiddleware } = require("../middleware/auth");

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

// Public route to get college list
router.get("/list", collegeController.getCollegeList);

// Protected routes
router.get("/profile", authMiddleware, collegeController.getCollegeProfile);
router.put("/profile", authMiddleware, upload.fields([{ name: 'idProof' }, { name: 'authLetter' }]), collegeController.updateCollegeProfile);
router.get("/stats", authMiddleware, collegeController.getDashboardStats);
router.get("/pending-students", authMiddleware, collegeController.getPendingStudents);
router.get("/approved-students", authMiddleware, collegeController.getApprovedStudents);
router.post("/approve-student/:id", authMiddleware, collegeController.approveStudent);

// Student Records
router.post("/student-record", authMiddleware, collegeController.addStudentRecord);
router.get("/student-records", authMiddleware, collegeController.getStudentRecords);

// Match Student
router.post('/verify-match/:id', authMiddleware, collegeController.verifyStudentMatch);

module.exports = router;
