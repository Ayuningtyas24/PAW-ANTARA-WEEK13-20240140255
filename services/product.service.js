const { Product } = require('../models');
const { formatRupiah } = require('../utils/formatRupiah');

/**
 * 🛡️ DRY - SERVICE LAYER
 * ============================================================
 * Semua fungsi di file ini dipanggil dari BANYAK tempat:
 * 1. controllers/product.controller.js (REST API / web CRUD)
 * 2. controllers/page.controller.js    (render halaman katalog)
 * 3. bot/handlers/stok.handler.js      (bot Telegram /stok)
 * 4. services/gemini.service.js        (AI chat context)
 * 5. controllers/admin.controller.js   (admin dashboard)
 *
 * Tanpa layer ini, query bakal ditulis berulang di banyak tempat.
 * ============================================================
 */

async function getAllProducts() {
  return Product.findAll({ order: [['id', 'ASC']] });
}

async function getProductById(id) {
  return Product.findByPk(id);
}

async function getProductsByCategory(category) {
  return Product.findAll({
    where: { category },
    order: [['id', 'ASC']],
  });
}

async function createProduct({ name, description, price, stock, category, imageUrl }) {
  return Product.create({ name, description, price, stock, category, imageUrl });
}

async function updateProduct(id, data) {
  const product = await Product.findByPk(id);
  if (!product) {
    return { success: false, message: 'Produk tidak ditemukan' };
  }

  await product.update(data);
  return { success: true, product };
}

async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    return { success: false, message: 'Produk tidak ditemukan' };
  }

  await product.destroy();
  return { success: true, message: 'Produk berhasil dihapus' };
}

/**
 * Format daftar produk jadi teks siap kirim — dipake bot Telegram
 * buat balesan /produk. Sengaja dipisah dari getAllProducts() biar
 * fungsi query & fungsi format gak nyampur (single responsibility).
 */
function formatProductListText(products) {
  if (products.length === 0) {
    return 'Belum ada produk tersedia.';
  }

  const lines = products.map((p) => {
    const stockInfo = p.stock > 0 ? `Stok: ${p.stock}` : 'HABIS';
    return `#${p.id} — ${p.name}\n${formatRupiah(p.price)} | ${stockInfo}`;
  });

  return lines.join('\n\n');
}

async function countProducts() {
  return Product.count();
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  formatProductListText,
  countProducts,
};
