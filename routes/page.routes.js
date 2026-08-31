const express = require('express');
const router = express.Router();
const { renderHome, submitOrder, renderSuccess } = require('../controllers/page.controller');
const { renderInvoices, renderInvoiceDetail } = require('../controllers/invoice.controller');
const { requireLogin } = require('../middleware/auth');

router.get('/', renderHome);
router.post('/order', requireLogin, submitOrder);
router.get('/order/success/:orderId', renderSuccess);
router.get('/invoices', requireLogin, renderInvoices);
router.get('/invoices/:id', requireLogin, renderInvoiceDetail);

module.exports = router;
