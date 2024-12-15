const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const tagController = require('../controllers/tagController');

router.post("/",authenticate ,tagController.createTag);
router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagById);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
