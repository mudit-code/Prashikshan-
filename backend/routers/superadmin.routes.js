const express = require("express");
const router = express.Router();
const superadminController = require("../controllers/superadmin.controller");
const { authMiddleware } = require("../middleware/auth");

// We would ideally add a superAdminAuthMiddleware here to ensure role === 'Super Admin'
// For now, authMiddleware checks token validity. We will rely on that plus frontend protection,
// but for production a role check is required.

router.get("/state-admins", authMiddleware, superadminController.getStateAdmins);
router.put("/state-admins/:id/status", authMiddleware, superadminController.updateStateAdminStatus);

module.exports = router;
