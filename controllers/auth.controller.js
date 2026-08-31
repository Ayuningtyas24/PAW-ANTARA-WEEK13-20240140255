const authService = require('../services/auth.service');

async function renderLogin(req, res) {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('login', { error: null, storeName: process.env.STORE_NAME || 'Toko Kita' });
}

async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('login', {
        error: 'Username dan password wajib diisi',
        storeName: process.env.STORE_NAME || 'Toko Kita',
      });
    }

    // 🛡️ DRY: logic verifikasi password ada di auth.service.js
    const result = await authService.login({ username, password });

    if (!result.success) {
      return res.render('login', {
        error: result.message,
        storeName: process.env.STORE_NAME || 'Toko Kita',
      });
    }

    req.session.userId = result.user.id;
    req.session.userRole = result.user.role;

    // Redirect berbeda berdasarkan role
    if (result.user.role === 'admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/');
  } catch (err) {
    res.render('login', {
      error: 'Terjadi kesalahan: ' + err.message,
      storeName: process.env.STORE_NAME || 'Toko Kita',
    });
  }
}

async function renderRegister(req, res) {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('register', { error: null, storeName: process.env.STORE_NAME || 'Toko Kita' });
}

async function handleRegister(req, res) {
  try {
    const { username, password, fullName } = req.body;

    if (!username || !password || !fullName) {
      return res.render('register', {
        error: 'Semua field wajib diisi',
        storeName: process.env.STORE_NAME || 'Toko Kita',
      });
    }

    if (password.length < 4) {
      return res.render('register', {
        error: 'Password minimal 4 karakter',
        storeName: process.env.STORE_NAME || 'Toko Kita',
      });
    }

    // 🛡️ DRY: logic register ada di auth.service.js
    const result = await authService.register({
      username,
      password,
      fullName,
      role: 'customer', // register publik selalu jadi customer
    });

    if (!result.success) {
      return res.render('register', {
        error: result.message,
        storeName: process.env.STORE_NAME || 'Toko Kita',
      });
    }

    // Auto-login setelah register
    req.session.userId = result.user.id;
    req.session.userRole = result.user.role;
    return res.redirect('/');
  } catch (err) {
    res.render('register', {
      error: 'Terjadi kesalahan: ' + err.message,
      storeName: process.env.STORE_NAME || 'Toko Kita',
    });
  }
}

function handleLogout(req, res) {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err.message);
    res.redirect('/login');
  });
}

module.exports = { renderLogin, handleLogin, renderRegister, handleRegister, handleLogout };
