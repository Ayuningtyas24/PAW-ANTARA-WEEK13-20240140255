const productService = require('../services/product.service');
const orderService = require('../services/order.service');

/**
 * 🛡️ DRY: Admin controller reuses the SAME service functions
 * as the customer-facing controllers. No duplicate business logic.
 */

async function renderDashboard(req, res) {
  try {
    const storeName = process.env.STORE_NAME || 'Toko Kita';
    const totalProducts = await productService.countProducts();
    const totalOrders = await orderService.countOrders();
    const totalRevenue = await orderService.getTotalRevenue();

    res.render('admin/dashboard', {
      storeName,
      stats: { totalProducts, totalOrders, totalRevenue },
    });
  } catch (err) {
    res.status(500).send('Gagal memuat dashboard: ' + err.message);
  }
}

async function renderProducts(req, res) {
  try {
    const storeName = process.env.STORE_NAME || 'Toko Kita';
    const products = await productService.getAllProducts();

    res.render('admin/products', {
      storeName,
      products: products.map((p) => p.toJSON()),
    });
  } catch (err) {
    res.status(500).send('Gagal memuat produk: ' + err.message);
  }
}

async function renderInvoices(req, res) {
  try {
    const storeName = process.env.STORE_NAME || 'Toko Kita';
    const orders = await orderService.getAllOrders();

    res.render('admin/invoices', {
      storeName,
      orders: orders.map((o) => o.toJSON()),
    });
  } catch (err) {
    res.status(500).send('Gagal memuat invoice: ' + err.message);
  }
}

module.exports = { renderDashboard, renderProducts, renderInvoices };
