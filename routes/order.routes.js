const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus } = require('../controllers/order.controller');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getOrders);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
