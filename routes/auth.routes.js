const express = require('express');
const router = express.Router();
const {
  renderLogin,
  handleLogin,
  renderRegister,
  handleRegister,
  handleLogout,
} = require('../controllers/auth.controller');

router.get('/login', renderLogin);
router.post('/login', handleLogin);
router.get('/register', renderRegister);
router.post('/register', handleRegister);
router.get('/logout', handleLogout);

module.exports = router;
