# Laporan Pengerjaan Tugas Pertemuan 13

## 1. Data Produk
![Data Produk Banyak](./screenshots/01_data_produk_banyak.png)
*Keterangan Poin 1 (Data Produk): Screenshot halaman katalog produk (`/`) yang menampilkan 20 data produk dalam 7 kategori (Kaos, Kemeja, Celana, Sepatu, Jaket, Tas, Aksesoris). Ini membuktikan data produk berjumlah banyak dan bukan hanya 1-2 data dummy.*

## 2. CRUD Produk (Admin)
### Create Produk
![Before Create](./screenshots/02_crud_before_create.png)
*Keterangan Poin 2 (CRUD Produk - Before Create): Tampilan daftar produk pada halaman admin (`/admin/products`) sebelum dilakukan penambahan produk baru.*

![Form Create Modal](./screenshots/03_crud_create_modal.png)
*Keterangan Poin 2 (CRUD Produk - Form Create): Admin mengisi form modal penambahan produk baru ("Jaket Leather Premium", Rp350.000, stok 15).*

![After Create](./screenshots/04_crud_after_create.png)
*Keterangan Poin 2 (CRUD Produk - After Create): Tampilan daftar produk setelah produk baru berhasil ditambahkan dan tersimpan ke database.*

### Update Produk
![Form Edit Modal](./screenshots/05_crud_edit_modal.png)
*Keterangan Poin 2 (CRUD Produk - Form Update): Admin membuka form modal edit untuk memperbarui harga dan jumlah stok pada produk.*

![After Update](./screenshots/06_crud_after_update.png)
*Keterangan Poin 2 (CRUD Produk - After Update): Tampilan daftar produk setelah data harga dan stok berhasil diperbarui oleh admin.*

### Delete Produk
![Confirm Delete](./screenshots/07_crud_delete_confirm.png)
*Keterangan Poin 2 (CRUD Produk - Confirm Delete): Admin mengonfirmasi penghapusan salah satu produk dari daftar produk.*

![After Delete](./screenshots/08_crud_after_delete.png)
*Keterangan Poin 2 (CRUD Produk - After Delete): Tampilan daftar produk setelah produk tersebut berhasil dihapus dari database.*

## 3. Login 2 Role
### Login Customer
![Login Customer Redirect](./screenshots/09_login_customer_redirect.png)
*Keterangan Poin 3 (Login 2 Role - Customer): User melakukan login dengan akun Customer (`customer` / `customer123`) dan diarahkan ke halaman katalog (`/`) dengan navbar khusus customer.*

### Login Admin
![Login Admin Redirect](./screenshots/10_login_admin_redirect.png)
*Keterangan Poin 3 (Login 2 Role - Admin): User melakukan login dengan akun Admin (`admin` / `admin123`) dan diarahkan ke Dashboard Admin (`/admin`) dengan menu navigasi khusus pengelola.*

## 4. Multiple Order
![Cart Multiple Items](./screenshots/11_multiple_order_cart.png)
*Keterangan Poin 4 (Multiple Order - Cart): Pembeli menambahkan 2 jenis produk berbeda sekaligus ("Kaos Polos A" dan "Kemeja Flanel") ke dalam keranjang belanja.*

![Invoice Multiple Items Saved](./screenshots/12_multiple_order_invoice.png)
*Keterangan Poin 4 (Multiple Order - Data Saved): Bukti pada halaman invoice bahwa seluruh produk (2+ item) yang dipesan dalam 1 transaksi tersimpan lengkap di database.*

## 5. Invoice & Ubah Status (Admin)
### Detail Invoice
![Detail Invoice Admin](./screenshots/13_admin_invoice_detail.png)
*Keterangan Poin 5 (Invoice & Ubah Status Admin - Detail): Admin membuka halaman detail invoice suatu pesanan (`/invoices/:id`) untuk memeriksa rincian pemesan, produk, dan total pembayaran.*

### Ubah Status Pesanan (Before → After)
![Status Before Pending](./screenshots/14_status_before_pending.png)
*Keterangan Poin 5 (Invoice & Ubah Status Admin - Before): Status pesanan awal berada pada posisi "pending" dengan badge berwarna kuning.*

![Status After Diproses](./screenshots/15_status_after_diproses.png)
*Keterangan Poin 5 (Invoice & Ubah Status Admin - After): Status pesanan setelah diubah oleh admin menjadi "diproses" dengan badge berwarna biru dan notifikasi sukses.*

## 6. Tampilan
![Tampilan Katalog UI](./screenshots/16_tampilan_katalog_ui.png)
*Keterangan Poin 6 (Tampilan - Katalog UI): Tampilan akhir halaman katalog produk dengan layout grid modern, filter kategori, dan floating cart button.*

![Tampilan Login UI](./screenshots/17_tampilan_login_ui.png)
*Keterangan Poin 6 (Tampilan - Login UI): Tampilan akhir halaman login dengan desain Glassmorphism dan warna gradient modern.*
