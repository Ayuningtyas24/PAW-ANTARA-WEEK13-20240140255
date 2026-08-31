require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { sequelize } = require("./models");
const startBot = require("./bot/bot");
const { attachUser } = require("./middleware/auth");

const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const chatRoutes = require("./routes/chat.routes");
const pageRoutes = require("./routes/page.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // buat baca body dari form HTML

// ============================================================
// SESSION — dibutuhin buat login/logout (req.session.userId)
// ============================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "telegram-shop-bot-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
      httpOnly: true,
    },
  })
);

// ============================================================
// 🛡️ DRY — ATTACH USER ke SEMUA route
// Middleware ini inject res.locals.user supaya view bisa akses
// data user TANPA harus ngirim manual dari setiap controller
// ============================================================
app.use(attachUser);

// ============================================================
// ROUTES
// ============================================================
app.use("/", authRoutes);         // /login, /register, /logout
app.use("/admin", adminRoutes);   // /admin, /admin/products, /admin/invoices
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/", pageRoutes);         // /, /order, /invoices, /invoices/:id

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Koneksi database berhasil");

    await sequelize.sync();
    console.log("Sync model selesai");

    // Express (halaman web tempat user belanja) dan bot Telegram (khusus
    // admin) jalan BARENG dalam 1 process, sama-sama manggil service
    // layer yang sama (liat services/)
    app.listen(PORT, () => {
      console.log(`Server web jalan di http://localhost:${PORT}`);
    });

    startBot();
  } catch (err) {
    console.error("Gagal konek ke database:", err.message);
  }
}

start();
