const productService = require('../services/product.service');
const orderService = require('../services/order.service');

async function renderHome(req, res) {
  try {
    // 🛡️ DRY: fungsi yang sama dipake di banyak tempat
    const products = await productService.getAllProducts();
    const storeName = process.env.STORE_NAME || 'Toko Kita';

    res.render('index', {
      products: products.map((p) => p.toJSON()),
      storeName,
      error: null,
    });
  } catch (err) {
    res.status(500).send('Gagal memuat halaman: ' + err.message);
  }
}

async function submitOrder(req, res) {
  try {
    const { buyerName, items } = req.body;
    const user = res.locals.user;

    if (!buyerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Data order tidak valid' });
    }

    // 🛡️ DRY: fungsi yang sama dipake juga oleh Gemini AI service
    const result = await orderService.createOrder({
      buyerName,
      userId: user ? user.id : null,
      items: items.map((item) => ({
        productId: parseInt(item.productId, 10),
        quantity: parseInt(item.quantity, 10),
      })),
    });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.json({ success: true, orderId: result.order.id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal proses order: ' + err.message });
  }
}

async function renderSuccess(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.redirect('/');
    }

    const storeName = process.env.STORE_NAME || 'Toko Kita';
    res.render('success', {
      storeName,
      order: order.toJSON(),
    });
  } catch (err) {
    res.status(500).send('Gagal memuat halaman: ' + err.message);
  }
}

module.exports = { renderHome, submitOrder, renderSuccess };
