# Panduan Setup & Persiapan Penjualan

Dua bagian: **A** untuk menyiapkan aplikasi di pondok/toko sendiri, **B** untuk langkah-langkah
yang Anda kerjakan ketika ada pembeli. Semua pakai layanan **gratis** (Firebase + GitHub Pages).

---

## Bagian A — Setup aplikasi di pondok sendiri (sekali saja)

### A1. Buat proyek Firebase (gratis)
1. Buka https://console.firebase.google.com → **Tambah proyek** → beri nama (mis. "Kasir Pondok").
2. Matikan **Google Analytics** (tidak perlu) → **Buat proyek**.
3. Di halaman proyek, klik ikon **</> (Web)** → beri nama aplikasi (mis. "Kasir") → **Daftarkan aplikasi**.
4. Anda akan melihat **config** (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`,
   `messagingSenderId`, `appId`). **Salin** — dipakai di A5.

### A2. Aktifkan Authentication (login kasir)
1. Menu kiri: **Build → Authentication** → **Get started**.
2. Tab **Sign-in method** → aktifkan **Email/Password** → **Save**.
3. Tab **Users** → **Add user** → isi email kasir (mis. `kasir@pondokku.id`) + password
   (min. 6 karakter) → **Add**. **Inilah email & password untuk masuk aplikasi kasir.**

### A3. Aktifkan Realtime Database
1. Menu kiri: **Build → Realtime Database** → **Create database**.
2. Pilih lokasi terdekat (mis. `asia-southeast1`) → mode **Test mode** → **Enable**.
   (Sementara saja; sebentar lagi diganti aturan keamanan.)

### A4. Pasang aturan keamanan
1. Di Realtime Database, buka tab **Rules**.
2. Hapus isi lama, lalu tempel isi file **`rules.json`** (ada di folder `online/`).
3. Klik **Publish**.
   > Aturan ini: siapa pun boleh **membaca** (agar wali bisa lihat saldo), tetapi hanya
   > akun kasir yang **sudah login** yang boleh **menulis**.

### A5. Isi config.js
1. Buka `online/config.js` di editor teks.
2. Ganti semua nilai `PASTE_*` dengan config dari A1 (contoh ada di komentar file).
3. Simpan.

### A6. Hosting gratis (GitHub Pages)
1. Buat repo baru di github.com (boleh **Private** agar tidak sembarang orang buka).
2. Upload **isi folder `online/`** ke repo tersebut.
3. Repo → **Settings → Pages** → Source: `main` / `(root)` → **Save**.
4. Tunggu sebentar. Alamat situs: `https://USERNAME.github.io/NAMA-REPO/`
   - Kasir: `.../NAMA-REPO/kasir.html`
   - Wali: `.../NAMA-REPO/wali.html`  ← kirim link ini ke para wali

### A7. Login pertama & data awal
1. Buka `.../kasir.html` di browser.
2. Masuk dengan **email + password** dari A2 (bukan username admin lama).
3. Setelah berhasil login, **data awal (produk & santri) otomatis dibuat** di server.
4. Buka sekali lagi — tidak perlu login ulang (sesi tersimpan otomatis di perangkat).

### A8. Pasang di HP (PWA / APK)
- Di Chrome HP: buka `kasir.html` → menu ⋮ → **Tambahkan ke Layar Utama** → Instal.
- Lakukan hal yang sama untuk `wali.html` di HP para wali.
- Atau buat **APK** via https://www.pwabuilder.com (masukkan URL `kasir.html`) lalu bagikan.

### A9. Kunci lisensi (untuk Anda)
```
node buat-lisensi.js "Pondok Anda" 2027-12-31
```
Masukkan kunci itu di aplikasi → menu **Aktivasi Lisensi**.

---

## Bagian B — Checklist saat ada pembeli (per pembeli)

Ikuti langkah A1–A9 **untuk pembeli tersebut** dengan penyesuaian:

1. Buat **proyek Firebase baru** (gratis) atas nama toko pembeli.
2. Aktifkan **Authentication → Email/Password** → buat **1 akun kasir** (email + sandi), serahkan ke pembeli.
3. Aktifkan **Realtime Database**.
4. Tempel aturan dari **`rules.json`**.
5. Isi `online/config.js` dengan **config proyek pembeli** → upload/deploy ke GitHub Pages milik pembeli
   (atau repo baru). Jangan pakai config yang sama dengan toko lain.
6. Buka `kasir.html` sekali, login dengan akun pembeli → data awal otomatis dibuat.
7. Buat kunci lisensi per toko:
   ```
   node buat-lisensi.js "Nama Toko Pembeli" 2027-12-31
   ```
8. Serahkan ke pembeli:
   - Link kasir + link wali (atau APK)
   - Email & password akun kasir
   - Kunci lisensi
   - Panduan singkat pemakaian

---

## Catatan penting
- **Satu proyek Firebase = satu toko.** Jangan pernah memakai `config.js` yang sama untuk
  toko yang berbeda, atau data mereka akan bercampur.
- **Sandi kasir** kini dikelola Firebase (Authentication → Users), bukan tersimpan di database.
  Reset sandi lewat Firebase Console.
- **Wali** tetap read-only: hanya melihat saldo & mutasi, tidak bisa mengubah apa pun.
- Semua layanan yang dipakai **gratis**; biaya berbayar (jika ada) baru muncul kalau kuota
  Firebase terlewati atau Anda memilih hosting berbayar.
