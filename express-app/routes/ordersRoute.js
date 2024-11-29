const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const orderController = require('../controllers/orderController')

router.post("/",authenticate, orderController.createOrder);
router.get("/",authenticate, orderController.getUserOrders);
router.get('/:orderId/pdf', authenticate, orderController.generateOrderPdf);

module.exports = router;
