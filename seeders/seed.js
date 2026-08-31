require('dotenv').config();
const { sequelize, Product } = require('../models');
const authService = require('../services/auth.service');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi database berhasil');
    await sequelize.sync();

    // ============================================================
    // SEED USER — buat 2 akun default (admin + customer)
    // 🛡️ DRY: pakai authService.register() yang SAMA dipake di
    // controllers/auth.controller.js, jadi password auto di-hash
    // ============================================================
    const adminResult = await authService.register({
      username: 'admin',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'admin',
    });
    if (adminResult.success) {
      console.log('✅ User admin dibuat (admin / admin123)');
    } else {
      console.log('ℹ️  User admin sudah ada, skip');
    }

    const customerResult = await authService.register({
      username: 'customer',
      password: 'customer123',
      fullName: 'Customer Demo',
      role: 'customer',
    });
    if (customerResult.success) {
      console.log('✅ User customer dibuat (customer / customer123)');
    } else {
      console.log('ℹ️  User customer sudah ada, skip');
    }

    // ============================================================
    // SEED PRODUK — 20 produk, berbagai kategori
    // ============================================================
    const existingProducts = await Product.count();
    if (existingProducts === 0) {
      await Product.bulkCreate([
        // Kaos (4)
        {
          name: 'Kaos Polos A',
          description: 'Bahan cotton combed 30s, adem, tersedia warna hitam & putih. Cocok buat harian, harga lebih terjangkau.',
          price: 75000,
          stock: 50,
          category: 'Kaos',
        },
        {
          name: 'Kaos Polos B',
          description: 'Bahan cotton combed 24s (lebih tebal & premium dari versi A), tersedia warna navy & maroon. Lebih awet.',
          price: 95000,
          stock: 30,
          category: 'Kaos',
        },
        {
          name: 'Kaos Oversize Unisex',
          description: 'Bahan cotton combed 24s, potongan oversize streetwear, tersedia warna sage green & broken white.',
          price: 110000,
          stock: 40,
          category: 'Kaos',
        },
        {
          name: 'Kaos Grafis Urban',
          description: 'Sablon DTF premium, desain minimalis modern. Bahan katun bamboo yang super lembut.',
          price: 125000,
          stock: 25,
          category: 'Kaos',
        },
        // Kemeja (3)
        {
          name: 'Kemeja Flanel',
          description: 'Motif kotak-kotak, bahan tebal, cocok buat cuaca dingin.',
          price: 150000,
          stock: 20,
          category: 'Kemeja',
        },
        {
          name: 'Kemeja Linen Casual',
          description: 'Bahan linen premium, breathable, cocok buat suasana santai maupun semi-formal.',
          price: 175000,
          stock: 15,
          category: 'Kemeja',
        },
        {
          name: 'Kemeja Oxford Slim Fit',
          description: 'Bahan oxford cotton, button-down collar, cocok buat kerja atau acara formal.',
          price: 195000,
          stock: 18,
          category: 'Kemeja',
        },
        // Celana (3)
        {
          name: 'Celana Chino Slim Fit',
          description: 'Warna khaki, bahan stretch, nyaman dipake seharian.',
          price: 180000,
          stock: 15,
          category: 'Celana',
        },
        {
          name: 'Celana Jogger Pants',
          description: 'Bahan baby terry, elastic waistband, cocok buat olahraga atau santai.',
          price: 145000,
          stock: 35,
          category: 'Celana',
        },
        {
          name: 'Celana Cargo Loose Fit',
          description: 'Banyak kantong, gaya militer modern, bahan ripstop tahan lama.',
          price: 210000,
          stock: 20,
          category: 'Celana',
        },
        // Sepatu (3)
        {
          name: 'Sepatu Sneakers Canvas',
          description: 'Cocok buat kasual, tersedia banyak ukuran.',
          price: 220000,
          stock: 30,
          category: 'Sepatu',
        },
        {
          name: 'Sepatu Running Ultra Boost',
          description: 'Sol foam empuk, upper mesh breathable, cocok buat jogging harian.',
          price: 350000,
          stock: 12,
          category: 'Sepatu',
        },
        {
          name: 'Sepatu Slip-On Kulit Sintetis',
          description: 'Gaya minimalis, bisa buat formal maupun kasual. Kulit sintetis berkualitas.',
          price: 275000,
          stock: 18,
          category: 'Sepatu',
        },
        // Jaket (3)
        {
          name: 'Jaket Hoodie Basic',
          description: 'Bahan fleece tebal, hoodie adjustable, cocok buat cuaca dingin.',
          price: 185000,
          stock: 25,
          category: 'Jaket',
        },
        {
          name: 'Jaket Bomber Varsity',
          description: 'Desain klasik varsity, bahan parasut waterproof, dalaman satin.',
          price: 265000,
          stock: 10,
          category: 'Jaket',
        },
        {
          name: 'Jaket Windbreaker Packable',
          description: 'Ultra ringan, bisa dilipat jadi pouch kecil. Cocok buat traveling.',
          price: 195000,
          stock: 22,
          category: 'Jaket',
        },
        // Tas (2)
        {
          name: 'Tas Ransel Laptop 15"',
          description: 'Kompartemen laptop empuk, USB port samping, anti air.',
          price: 280000,
          stock: 15,
          category: 'Tas',
        },
        {
          name: 'Tote Bag Canvas',
          description: 'Bahan canvas tebal, desain minimalis, bisa masuk laptop 13 inch.',
          price: 95000,
          stock: 40,
          category: 'Tas',
        },
        // Aksesoris (2)
        {
          name: 'Topi Baseball Cap',
          description: 'Bahan twill cotton, adjustable strap, bordir logo minimalis.',
          price: 75000,
          stock: 50,
          category: 'Aksesoris',
        },
        {
          name: 'Kacamata Sunglasses UV400',
          description: 'Frame metal, lensa polarized, proteksi UV400. Cocok buat outdoor.',
          price: 120000,
          stock: 30,
          category: 'Aksesoris',
        },
      ]);
      console.log('✅ 20 produk berhasil ditambahkan (7 kategori)');
    } else {
      console.log('ℹ️  Produk udah ada (' + existingProducts + '), skip supaya gak dobel');
    }

    console.log('\nSeeding selesai ✅');
    console.log('Jalankan: npm run dev');
    console.log('Buka http://localhost:3000');
    console.log('Login admin: admin / admin123');
    console.log('Login customer: customer / customer123');
    process.exit(0);
  } catch (err) {
    console.error('Gagal seeding:', err.message);
    process.exit(1);
  }
}

seed();
