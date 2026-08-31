const { User } = require('../models');

/**
 * 🛡️ DRY - SERVICE LAYER AUTH
 * ============================================================
 * Fungsi register & login disini dipanggil dari:
 * 1. controllers/auth.controller.js (web form)
 * 2. seeders/seed.js (buat default user)
 * Kalo nantinya ada kebutuhan login lewat bot Telegram, tinggal
 * import fungsi yang sama.
 * ============================================================
 */

async function register({ username, password, fullName, role = 'customer' }) {
  const existing = await User.findOne({ where: { username } });
  if (existing) {
    return { success: false, message: 'Username sudah dipakai' };
  }

  const user = await User.create({ username, password, fullName, role });
  return { success: true, user };
}

async function login({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return { success: false, message: 'Username atau password salah' };
  }

  const valid = await user.verifyPassword(password);
  if (!valid) {
    return { success: false, message: 'Username atau password salah' };
  }

  return { success: true, user };
}

async function getUserById(id) {
  return User.findByPk(id, { attributes: { exclude: ['password'] } });
}

module.exports = { register, login, getUserById };
