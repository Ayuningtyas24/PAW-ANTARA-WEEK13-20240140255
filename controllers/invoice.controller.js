const orderService = require('../services/order.service');

async function renderInvoices(req, res) {
  try {
    const storeName = process.env.STORE_NAME || 'Toko Kita';
    const user = res.locals.user;
    let orders;

    // Admin liat semua order, customer cuma liat punya sendiri
    if (user && user.role === 'admin') {
      orders = await orderService.getAllOrders();
    } else if (user) {
      orders = await orderService.getOrdersByUserId(user.id);
    } else {
      orders = [];
    }

    res.render('invoices', {
      orders: orders.map((o) => o.toJSON()),
      storeName,
    });
  } catch (err) {
    res.status(500).send('Gagal memuat invoice: ' + err.message);
  }
}

async function renderInvoiceDetail(req, res) {
  try {
    const { id } = req.params;
    const storeName = process.env.STORE_NAME || 'Toko Kita';
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).send('Invoice tidak ditemukan');
    }

    // Customer cuma bisa liat invoice sendiri
    const user = res.locals.user;
    if (user && user.role !== 'admin' && order.userId !== user.id) {
      return res.status(403).send('Akses ditolak');
    }

    res.render('invoice-detail', {
      order: order.toJSON(),
      storeName,
    });
  } catch (err) {
    res.status(500).send('Gagal memuat detail invoice: ' + err.message);
  }
}

module.exports = { renderInvoices, renderInvoiceDetail };
