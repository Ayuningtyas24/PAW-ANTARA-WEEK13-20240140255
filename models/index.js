const sequelize = require('../config/database');
const Product = require('./product.model');
const Order = require('./order.model');

module.exports = { sequelize, Product, Order };
