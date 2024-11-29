const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const articleController = require('../controllers/articleController');
const tagController = require('../controllers/tagController');
const orderController = require('../controllers/orderController')

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/validate', authController.validateToken);
router.post('/logout', authController.logout);
router.post('/me',authenticate, authController.getUserInfo);
router.put('/update',authenticate, authController.updateUserInfo);

router.post("/orders",authenticate, orderController.createOrder);
router.get("/orders",authenticate, orderController.getUserOrders);
router.get('/orders/:orderId/pdf', authenticate, orderController.generateOrderPdf);

module.exports = router;
