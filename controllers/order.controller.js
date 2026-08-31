const orderService = require('../services/order.service');
const sendResponse = require('../utils/response');

// read-only, buat admin/dashboard liat histori order
async function getOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();
    return sendResponse(res, { message: 'Berhasil ambil order', data: orders });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

// Admin update status pesanan
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];
    if (!validStatuses.includes(status)) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: `Status tidak valid. Pilih salah satu: ${validStatuses.join(', ')}`,
      });
    }

    const result = await orderService.updateOrderStatus(id, status);
    if (!result.success) {
      return sendResponse(res, { code: 404, success: false, message: result.message });
    }

    return sendResponse(res, { message: 'Status pesanan berhasil diupdate', data: result.order });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

module.exports = { getOrders, updateOrderStatus };
