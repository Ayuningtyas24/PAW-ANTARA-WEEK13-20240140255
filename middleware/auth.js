const authService = require('../services/auth.service');

/**
 * 🛡️ DRY - MIDDLEWARE AUTH
 * ============================================================
 * Middleware ini dipake di SEMUA route yang butuh proteksi,
 * jadi pengecekan login/role gak perlu ditulis ulang di setiap
 * controller — cukup pasang middleware di router.
 * ============================================================
 */

/**
 * Suntik user ke res.locals supaya semua view bisa akses data user
 * TANPA harus ngirim manual dari setiap controller (DRY)
 */
const statusColorMap = {
  pending: 'yellow',
  diproses: 'blue',
  dikirim: 'purple',
  selesai: 'green',
  dibatalkan: 'red',
};
function getStatusColor(status) {
  return statusColorMap[status] || 'gray';
}

async function attachUser(req, res, next) {
  res.locals.user = null;
  res.locals.getStatusColor = getStatusColor;
  if (req.session && req.session.userId) {
    try {
      const user = await authService.getUserById(req.session.userId);
      if (user) {
        res.locals.user = user.toJSON();
      }
    } catch (err) {
      console.error('attachUser error:', err.message);
    }
  }
  next();
}

/**
 * Proteksi halaman: harus sudah login
 */
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    // Kalau request dari AJAX/fetch (misal cart checkout), balikin JSON 401
    if (req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json')) {
      return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu' });
    }
    return res.redirect('/login');
  }
  next();
}

/**
 * Proteksi halaman admin: harus login + role admin
 */
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  if (!res.locals.user || res.locals.user.role !== 'admin') {
    return res.redirect('/');
  }
  next();
}

module.exports = { attachUser, requireLogin, requireAdmin };
