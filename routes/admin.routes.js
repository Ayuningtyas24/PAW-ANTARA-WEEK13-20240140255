const express = require('express');
const router = express.Router();
const { renderDashboard, renderProducts, renderInvoices } = require('../controllers/admin.controller');
const { requireAdmin } = require('../middleware/auth');

// Semua route admin dilindungi middleware requireAdmin
router.get('/', requireAdmin, renderDashboard);
router.get('/products', requireAdmin, renderProducts);
router.get('/invoices', requireAdmin, renderInvoices);

module.exports = router;
