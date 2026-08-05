# Versi Online: Kasir & Pembayaran Wali (Aplikasi Android)

Folder ini berisi aplikasi **Android (PWA)** dari kasir koperasi, sehingga wali santri yang
jauh bisa membayar lewat HP mereka dan datanya tersinkron realtime dengan kasir.
Aplikasi ini bisa **dipasang di HP Android** (ada ikon, layar penuh) dan bisa dijadikan
**APK** untuk dibagikan / dipasang resmi.

> **Panduan setup lengkap ada di [`SETUP.md`](SETUP.md)** — termasuk langkah untuk
> menyiapkan proyek Firebase gratis, aturan keamanan, dan checklist saat menjual ke toko lain.

## Isi Folder
- `kasir.html` — aplikasi kasir untuk penjaga koperasi / admin (tersinkron realtime)
- `wali.html` — aplikasi pantau untuk orang tua / wali (**hanya melihat** saldo & mutasi anak)
- `index.html` — halaman pembuka: pilih "Aplikasi Kasir" atau "Aplikasi Wali"
- `config.js` — **isi konfigurasi Firebase Anda di sini**
- `rules.json` — **aturan keamanan Firebase (wajib ditempel ke Realtime Database)**
- `manifest.json` + `icons/` + `sw.js` — pembungkus aplikasi Android (PWA)
- `SETUP.md` — panduan setup & persiapan penjualan
- `README.md` — panduan ini

## Cara Kerja (sesuai keinginan Anda)
1. Wali **tinggal transfer** ke rekening penjaga koperasi (nomor rekening tampil di aplikasi pantau).
2. Wali **konfirmasi via WhatsApp** (tombol "Hubungi Koperasi") untuk melaporkan bukti transfer.
3. **Admin** mencatat / mengonfirmasi pembayaran di menu Tabungan Santri -> Pembayaran Wali.
4. **Saldo bertambah**, dan di HP wali langsung terlihat di kartu saldo + mutasi secara realtime.

> **Aplikasi Wali bersifat read-only (pantau saja)**: wali hanya bisa melihat sisa saldo,
> mutasi tabungan, dan menerima informasi. Seluruh proses pengisian/konfirmasi dilakukan admin.

## Langkah 1: Buat Proyek Firebase (gratis)
1. Buka https://console.firebase.google.com -> **Tambah proyek** -> ikuti langkah (boleh nonaktifkan Google Analytics).
2. Dari halaman proyek: klik ikon **</> (Web)** untuk menambah aplikasi web.
3. Beri nama (misal "Kasir Barokah"), centang "Juga siapkan Firebase Hosting" (opsional), klik **Daftarkan aplikasi**.
4. Anda akan melihat **config** (apiKey, authDomain, databaseURL, dll). **Salin** nilai-nilainya.

## Langkah 2: Aktifkan Realtime Database + Authentication
1. Di menu kiri: **Build -> Realtime Database** -> klik **Buat Database**.
2. Pilih lokasi terdekat (misal asia-southeast1), mode **Test mode** -> Aktifkan.
   > Mode Test hanya sementara. **Wajib** menempelkan aturan dari `rules.json`
   > (tab Rules -> tempel -> Publish) agar database aman dan tidak terkunci.
3. Menu kiri: **Build -> Authentication** -> **Get started** -> tab **Sign-in method**
   -> aktifkan **Email/Password** -> tab **Users** -> **Add user** (email + sandi kasir).
   Email & sandi inilah yang dipakai login aplikasi kasir.

## Langkah 3: Isi config.js
Buka `online/config.js`, ganti nilai `PASTE_*` dengan milik Anda, contoh:
```js
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyABC123...",
    authDomain: "kasir-barokah.firebaseapp.com",
    databaseURL: "https://kasir-barokah-default-rtdb.firebaseio.com",
    projectId: "kasir-barokah",
    storageBucket: "kasir-barokah.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef"
};
```

## Langkah 4: Upload ke GitHub
1. Buat repo baru di github.com (boleh Private agar tidak semua orang mengintip).
2. Upload **isi folder `online/`** ke repo tersebut.
3. Buka repo -> **Settings -> Pages** -> Source: `main` branch, folder `/ (root)` -> Save.
4. Tunggu sebentar, halaman aktif di: `https://USERNAME.github.io/NAMA-REPO/`
   - Pembuka: `.../NAMA-REPO/`
   - Kasir: `.../NAMA-REPO/kasir.html`
   - Wali: `.../NAMA-REPO/wali.html` (kirim link ini ke para wali)

## Langkah 5: Pasang sebagai Aplikasi Android
Setelah situs aktif (HTTPS), di HP Android:

1. **Kasir/admin**: buka `.../NAMA-REPO/kasir.html` di Chrome.
2. Buka menu Chrome (⋮) -> **Tambahkan ke Layar Utama** -> *Instal*.
3. Selesai. Ikon aplikasi muncul di layar HP, terbuka penuh seperti aplikasi asli.
4. Ulangi dengan `wali.html` (atau cukup beri tahu wali untuk melakukan hal yang sama).

**Tips**: aktifkan di Chrome "Situs dapat meminta untuk diinstal", dan tampilkan panel
*Install app* yang muncul agar tombol instal langsung terlihat.

## Langkah 6 (opsional): Buat File APK (.apk) untuk dibagikan
Aplikasi ini siap dikemas jadi APK tanpa komputer khusus, lewat **PWABuilder**:
1. Buka https://www.pwabuilder.com
2. Masukkan URL situs Anda (misal `https://USERNAME.github.io/NAMA-REPO/`) -> **Start**.
3. Klik **Package for stores** -> pilih **Android** -> isi *App version* -> **Generate**.
4. **Download** file `.apk` (atau `bundle.aab` untuk Play Store).
5. Bagikan APK itu ke HP kasir dan HP para wali untuk dipasang.

> Catatan: versi APK dari PWABuilder memerlukan setidaknya sekali terkoneksi internet
> saat pertama dibuka (data tetap tersinkron realtime via Firebase).

## Keamanan & Skala (anti-benturan data)
- **Satu proyek Firebase = satu instansi/toko.** Jangan memakai `config.js` yang sama untuk
  toko yang berbeda — data mereka akan bercampur di node `barokah`. Setiap toko wajib punya
  proyek Firebase sendiri (tinggal beda isi `config.js`).
- **Login kasir via Firebase Authentication** (email + sandi). Aturan `rules.json` mengizinkan
  siapa pun membaca (agar wali bisa lihat saldo), tetapi **hanya akun kasir yang sudah login
  yang bisa menulis** — sandi tidak lagi tersimpan di database.
- **Banyak HP kasir di satu toko aman**: transaksi penjualan pakai log append-only, saldo & stok
  dihitung atomik per-id, dan perubahan daftar santri/barang digabung lewat transaksi server —
  sehingga dua kasir yang menulis bersamaan tidak saling menimpa.
- **Saat aplikasi dijual/diberikan ke toko lain**: buatkan kunci lisensi per toko dengan
  `node buat-lisensi.js "Nama Toko" [tanggal]`. Untuk pengaman lebih ketat (satu kunci satu toko,
  tidak bisa disebar), validasi kunci perlu dicek ke server/Firebase — hubungi pengembang untuk
  mengaktifkan ini.

## Tips
- **Data awal**: saat `kasir.html` dibuka pertama kali dan database masih kosong,
  data bawaan (produk & santri) otomatis diunggah ke server **setelah login kasir berhasil**.
  Isi/edit santri lewat kasir dulu agar data wali lengkap (nomor HP orang tua penting untuk login).
- **Akses pertama**: buka `kasir.html`, **login dulu** dengan email & password dari Firebase
  Authentication (buat akun di Console), baru data default ter-seed.
- **File offline** `KasirDafin.html` di folder utama tetap bisa dipakai tanpa internet (data lokal).
- **Kasir offline tetap aman**: saat HP kasir tidak terhubung internet, penjualan/saldo/stok
  dicatat dulu (status "Menunggu sinkron...") lalu otomatis dikirim begitu koneksi pulih —
  tidak ada perubahan yang hilang tertimpa data server.
- **Reset data server**: jalankan `kasir.html` -> Pengaturan -> Reset Semua Data hanya menghapus
  localStorage perangkat, bukan data Firebase. Untuk membersihkan Firebase, hapus node `barokah`
  di Realtime Database lewat konsol.
- **Setelah memperbarui aplikasi**: ubah angka versi di bagian atas `sw.js`
  (misal `'barokah-v1'` -> `'barokah-v2'`) lalu deploy ulang, agar HP pengguna
  otomatis mengambil versi baru (cache tidak kadaluarsa sendiri).
