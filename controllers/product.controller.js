const productService = require('../services/product.service');
const sendResponse = require('../utils/response');

/**
 * 🛡️ DRY: Semua operasi produk lewat productService
 * yang sama dipake juga di bot handler dan AI service.
 */

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    return sendResponse(res, { message: 'Berhasil ambil produk', data: products });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    if (!name || !price) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'Nama dan harga produk wajib diisi',
      });
    }

    const product = await productService.createProduct({
      name,
      description,
      price: parseInt(price, 10),
      stock: parseInt(stock, 10) || 0,
      category: category || 'Umum',
      imageUrl,
    });

    return sendResponse(res, { code: 201, message: 'Produk berhasil ditambahkan', data: product });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.price) data.price = parseInt(data.price, 10);
    if (data.stock !== undefined) data.stock = parseInt(data.stock, 10);

    const result = await productService.updateProduct(id, data);
    if (!result.success) {
      return sendResponse(res, { code: 404, success: false, message: result.message });
    }

    return sendResponse(res, { message: 'Produk berhasil diupdate', data: result.product });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    if (!result.success) {
      return sendResponse(res, { code: 404, success: false, message: result.message });
    }

    return sendResponse(res, { message: result.message });
  } catch (err) {
    return sendResponse(res, { code: 500, success: false, message: err.message });
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
