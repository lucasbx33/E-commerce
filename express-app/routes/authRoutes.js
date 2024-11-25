const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const articleController = require('../controllers/articleController');
const tagController = require('../controllers/tagController');
// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/validate', authController.validateToken);
router.post('/logout', authController.logout);
router.post('/me',authenticate, authController.getUserInfo);
router.put('/update',authenticate, authController.updateUserInfo);

router.post('/articles',articleController.createArticle);
router.post('/get_articles', articleController.getMinimalArticles);
router.get('/articles/:id', articleController.getArticleDetails);
router.delete('articles/:id', articleController.deleteArticle);

router.post("/tags", tagController.createTag);
router.get("/tags", tagController.getAllTags);
router.get("/tags/:id", tagController.getTagById);
router.delete("/tags/:id", tagController.deleteTag);

module.exports = router;
