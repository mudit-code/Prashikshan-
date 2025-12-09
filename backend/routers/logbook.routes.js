const express = require("express");
const logbookController = require("../controllers/logbook.controller");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, logbookController.createEntry);
router.get("/", authMiddleware, logbookController.getEntries);
router.put("/:id", authMiddleware, logbookController.updateEntry);
router.delete("/:id", authMiddleware, logbookController.deleteEntry);

module.exports = router;
