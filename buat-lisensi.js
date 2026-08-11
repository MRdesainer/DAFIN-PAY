/**
 * Generator kunci lisensi aplikasi DAFIN-PAY.
 *
 * Pemakaian:
 *   node buat-lisensi.js "Nama Instansi/Toko"              -> lisensi selamanya
 *   node buat-lisensi.js "Nama Instansi/Toko" 2026-12-31   -> lisensi s/d tanggal
 *
 * Format kunci: DAFINPAY-<payload-base64url>-<checksum>
 * Payload berisi JSON {n:<nama>, e:<exp atau kosong>}.
 */

function hashKunci(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h.toString(36).toUpperCase().padStart(8, '0');
}

function encodeLisensi(nama, exp) {
  if (!nama || !nama.trim()) throw new Error('Nama instansi/toko wajib diisi.');
  const payload = JSON.stringify({ n: nama.trim(), e: (exp || '').trim() });
  const b64 = Buffer.from(payload, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return 'DAFINPAY-' + b64 + '-' + hashKunci(b64 + 'RUKYAH2024');
}

function main() {
  const nama = process.argv[2];
  const exp = process.argv[3] || '';
  if (!nama) {
    console.log('Pemakaian: node buat-lisensi.js "Nama Instansi/Toko" [YYYY-MM-DD]');
    process.exit(1);
  }
  if (exp && !/^\d{4}-\d{2}-\d{2}$/.test(exp)) {
    console.log('Tanggal kedaluwarsa harus format YYYY-MM-DD.');
    process.exit(1);
  }
  const kunci = encodeLisensi(nama, exp);
  console.log('Instansi : ' + nama.trim());
  console.log('Berlaku  : ' + (exp ? 's/d ' + exp : 'Selamanya'));
  console.log('Kunci    : ' + kunci);
}

main();
