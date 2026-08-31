const { Order, OrderItem, Product, User, sequelize } = require('../models');
const { formatRupiah } = require('../utils/formatRupiah');
const bot = require('../config/telegram');

/**
 * 🛡️ DRY - SERVICE LAYER ORDER
 * ============================================================
 * createOrder() dipanggil dari:
 * 1. controllers/page.controller.js  (checkout dari cart)
 * 2. services/gemini.service.js      (AI chat order)
 *
 * Logic cek stok → kurangin stok → simpen order → notif admin
 * SEMUA di sini, gak nyebar ke banyak tempat.
 * ============================================================
 */

/**
 * Buat order baru dengan MULTIPLE ITEMS (support beli 2+ produk sekaligus).
 * Pakai database transaction — all-or-nothing, kalo ada 1 item gagal,
 * semua di-rollback.
 *
 * @param {Object} params
 * @param {string} params.buyerName
 * @param {number|null} params.userId
 * @param {Array<{productId: number, quantity: number}>} params.items
 */
async function createOrder({ buyerName, userId = null, items }) {
  const t = await sequelize.transaction();

  try {
    // 1. Validasi SEMUA item sebelum create
    const productDetails = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product) {
        await t.rollback();
        return { success: false, message: `Produk dengan ID ${item.productId} gak ditemukan` };
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return {
          success: false,
          message: `Stok "${product.name}" gak cukup. Tersedia: ${product.stock}, diminta: ${item.quantity}`,
        };
      }
      productDetails.push({ product, quantity: item.quantity });
    }

    // 2. Hitung total
    let totalAmount = 0;
    for (const { product, quantity } of productDetails) {
      totalAmount += product.price * quantity;
    }

    // 3. Buat Order
    const order = await Order.create(
      { buyerName, userId, totalAmount, status: 'pending' },
      { transaction: t }
    );

    // 4. Buat OrderItem + kurangin stok
    for (const { product, quantity } of productDetails) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity,
          price: product.price,
        },
        { transaction: t }
      );

      product.stock -= quantity;
      await product.save({ transaction: t });
    }

    await t.commit();

    // 5. Notif admin (di luar transaction, gak boleh block order kalo notif gagal)
    await notifyAdminNewOrder(order, productDetails);

    return { success: true, order, items: productDetails };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

/**
 * Kirim notifikasi ke admin lewat Telegram tiap ada order baru.
 * Diupdate buat support multi-item notification.
 */
async function notifyAdminNewOrder(order, productDetails) {
  const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;

  if (!bot || !adminChatId || adminChatId === 'isi-chat-id-admin') {
    console.log('ℹ️  Notifikasi admin dilewati (bot/ADMIN_TELEGRAM_CHAT_ID belum diset)');
    return;
  }

  const itemLines = productDetails.map(({ product, quantity }) => {
    const stockWarning = product.stock <= 5 ? ' ⚠️ MENIPIS' : '';
    return `  • ${product.name} x${quantity} = ${formatRupiah(product.price * quantity)}${stockWarning}`;
  });

  const text = [
    '🔔 Order baru masuk!',
    '',
    `Pembeli: ${order.buyerName}`,
    `Order ID: #${order.id}`,
    '',
    'Produk:',
    ...itemLines,
    '',
    `💰 Total: ${formatRupiah(order.totalAmount)}`,
  ].join('\n');

  try {
    await bot.sendMessage(adminChatId, text);
  } catch (err) {
    console.error('Gagal kirim notifikasi ke admin:', err.message);
  }
}

async function getAllOrders() {
  return Order.findAll({
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
      {
        model: User,
        attributes: ['id', 'username', 'fullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
}

async function getOrdersByUserId(userId) {
  return Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
}

async function getOrderById(id) {
  return Order.findByPk(id, {
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
      {
        model: User,
        attributes: ['id', 'username', 'fullName'],
      },
    ],
  });
}

async function updateOrderStatus(id, status) {
  const order = await Order.findByPk(id);
  if (!order) {
    return { success: false, message: 'Order tidak ditemukan' };
  }

  order.status = status;
  await order.save();
  return { success: true, order };
}

async function countOrders() {
  return Order.count();
}

async function getTotalRevenue() {
  const result = await Order.sum('totalAmount');
  return result || 0;
}

module.exports = {
  createOrder,
  notifyAdminNewOrder,
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  countOrders,
  getTotalRevenue,
};
