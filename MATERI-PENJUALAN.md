# Materi Penjualan — Aplikasi Kasir & Tabungan Santri (DAFIN-PAY)

Dokumen ini untuk **menawarkan aplikasi ke pembeli** (koperasi/pondok/sekolah/toko) dan sebagai
**lampiran serah terima**. Versi teknis setup ada di [`SETUP.md`](SETUP.md) dan [`README.md`](README.md).

---

## Apa itu?

Aplikasi kasir koperasi/pondok lengkap yang jalan di **HP Android biasa** (tanpa komputer khusus,
tanpa perlu jaringan Wi-Fi khusus) dan bisa dipakai **tanpa internet** sekalipun.

Dua aplikasi dalam satu paket:

| Aplikasi | Untuk | Fungsi |
| --- | --- | --- |
| **Kasir** | Penjaga koperasi / admin | Catat penjualan, kelola stok & saldo, kelola tabungan santri, terima pembayaran wali |
| **Wali** | Orang tua / wali santri | Pantau sisa saldo & mutasi tabungan anak **realtime** (hanya lihat, tidak bisa mengubah) |

---

## Fitur unggulan

- **Kasir cepat** — pencatatan penjualan dan tabungan, saldo & stok terhitung otomatis.
- **Tabungan santri + pembayaran wali** — wali transfer lalu konfirmasi via WhatsApp; admin konfirmasi,
  saldo langsung terlihat realtime di HP wali.
- **Multi-HP kasir dalam satu toko** — dua kasir menulis bersamaan **tidak saling menimpa**
  (dirancang anti-benturan data, pencatatan log append-only).
- **Tetap jalan saat offline** — penjualan/saldo/stok dicatat dulu (status "Menunggu sinkron..."),
  otomatis terkirim begitu internet pulih. Tidak ada yang hilang.
- **Kartu santri digital** — bisa dibagikan/disimpan, nama panjang & nilai tidak saling menutupi,
  ada kode QR.
- **Login aman** — kasir login pakai email + sandi (Firebase Authentication). Sandi tidak tersimpan
  di database; aplikasi wali hanya boleh melihat, bukan mengubah.
- **Bisa dipasang seperti aplikasi asli** (PWA) dan bisa dibuatkan **APK** untuk dibagikan.
- **Biaya operasional Rp 0** — hosting & database memakai layanan gratis (Firebase + GitHub Pages).

---

## Paket lisensi (per toko)

Setiap toko mendapat **kunci lisensi sendiri** (`DAFINPAY-…`). Satu kunci untuk satu toko — tidak bisa
dipakai toko lain. Pilihan masa berlaku:

- **Selamanya** — sekali bayar, aktivasi permanen.
- **Tahunan** — masa aktif sampai tanggal tertentu, bisa diperpanjang dengan kunci baru.

Kunci dimasukkan sekali di menu **Aktivasi Lisensi** pada aplikasi kasir.

> Setiap toko juga memakai **proyek Firebase milik sendiri**, jadi data antar-toko benar-benar terpisah.

---

## Yang diterima pembeli (serah terima)

1. **Link aplikasi kasir** dan **link aplikasi wali** (atau file **APK** untuk dipasang resmi).
2. **Email & password akun kasir** (dibuatkan khusus untuk pembeli).
3. **Kunci lisensi** sesuai paket (selamanya / tahunan).
4. **Panduan pemakaian singkat** + kontak bantuan.

## Alur aktivasi (1–2 jam dari penerimaan)

1. Buka link kasir di Chrome HP → **Tambahkan ke Layar Utama** (atau pasang APK).
2. Buka aplikasi → **Aktivasi Lisensi** → masukkan kunci yang diberikan.
3. **Login** dengan email & password kasir yang diserahkan.
4. Data awal (contoh produk & santri) otomatis terpasang — tinggal diedit sesuai toko.
5. Bagikan link/APK wali ke para wali; mereka login dengan email masing-masing (dibuatkan admin).

---

## Yang perlu disiapkan dari sisi pembeli

- Email **Google** untuk membuat proyek Firebase toko (dibuatkan/ diarahkan oleh kami).
- Daftar nama santri & nomor HP wali (untuk membuat akun wali) — bisa menyusul.
- (Opsional) nomor rekening koperasi untuk ditampilkan di aplikasi wali.

---

## Tanya jawab singkat

- **Apakah butuh internet terus?** Tidak. Kasir tetap bisa mencatat saat offline; sinkron otomatis
  saat online. Aplikasi wali butuh internet untuk melihat saldo realtime.
- **Apakah data aman?** Ya. Login kasir wajib; wali read-only; aturan keamanan database sudah terpasang.
- **Bisa dipakai lebih dari satu kasir?** Bisa, tanpa khawatir data bertabrakan.
- **Kalau HP hilang / ganti HP?** Data tetap aman di server; tinggal instal ulang & login lagi.
- **Kalau lisensi habis?** Aplikasi memberi peringatan; perpanjang dengan kunci baru.

---

## Kontak

_Hubungi penjual untuk demo, harga paket, dan pendampingan aktivasi._

<!--
Catatan untuk penjual:
- Harga & masa berlaku diisi sesuai kebijakan (isi kolom di atas).
- Untuk satu kunci-satu-toko yang tidak bisa disebar, validasi kunci ke server dapat diaktifkan
  (konsultasikan dengan pengembang) — saat ini kunci diverifikasi lokal di perangkat.
-->
