const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const articleController = require('../controllers/articleController');

router.post('/create',articleController.createArticle);
router.post('/get_articles', articleController.getMinimalArticles);
router.get('/:id', articleController.getArticleDetails);
router.delete('/:id',authenticate, articleController.deleteArticle);
router.put('/:id',authenticate, articleController.updateArticle);

module.exports = router;
