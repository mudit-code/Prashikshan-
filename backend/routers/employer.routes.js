const express = require("express");
const employerController = require("../controllers/employer.controller");
const internshipController = require("../controllers/internship.controller");
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
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/profile", authMiddleware, employerController.getProfile);

router.post("/profile", authMiddleware,
    upload.fields([
        { name: 'registrationProof', maxCount: 1 },
        { name: 'authLetter', maxCount: 1 },
        { name: 'companyLogo', maxCount: 1 }
    ]),
    employerController.updateProfile
);

router.get("/internships", authMiddleware, internshipController.getEmployerInternships);

module.exports = router;
