// ============================================================
//  GANTI TEKS (aman UTF-8)
//  Cari & ganti teks pada file apa pun TANPA merusak emoji /
//  karakter non-ASCII (beda dari Get-Content PowerShell).
//  Cara pakai: klik dua kali "Ganti Teks.cmd", lalu ikuti
//  pertanyaan di jendela.
// ============================================================
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Antrian input: aman untuk input interaktif maupun pipe otomatis
const lines = [];
const waiting = [];
rl.on('line', l => {
    if (waiting.length) waiting.shift()(l);
    else lines.push(l);
});
rl.on('close', () => {
    while (waiting.length) waiting.shift()('');
});
function ask(q) {
    process.stdout.write(q);
    return new Promise(res => {
        if (lines.length) res(lines.shift());
        else waiting.push(res);
    });
}

async function main() {
    console.log('==============================================');
    console.log('  GANTI TEKS (Aman UTF-8)');
    console.log('==============================================');

    const inputFile = await ask('Path file yang akan diedit: ');
    const file = inputFile.replace(/^"|"$/g, '').trim();
    if (!file || !fs.existsSync(file)) {
        console.error('FILE TIDAK DITEMUKAN: ' + file);
        return;
    }

    const lama = await ask('Teks lama (yang dicari): ');
    if (!lama) {
        console.error('Teks lama tidak boleh kosong.');
        return;
    }
    const baru = await ask('Teks baru (pengganti): ');

    const semuaRaw = (await ask('Ganti SEMUA kemunculan? (y/n, default y): ')).trim().toLowerCase();
    const gantiSemua = !semuaRaw.startsWith('n');

    // Baca sebagai UTF-8 -> emoji & karakter khusus aman
    let isi = fs.readFileSync(file, 'utf8');

    const jumlah = isi.split(lama).length - 1;
    if (jumlah === 0) {
        console.error('Teks lama TIDAK ditemukan di file. Tidak ada yang diubah.');
        return;
    }

    let hasil;
    if (gantiSemua) {
        hasil = isi.split(lama).join(baru);
    } else {
        const idx = isi.indexOf(lama);
        hasil = isi.slice(0, idx) + baru + isi.slice(idx + lama.length);
    }

    // Backup byte-asli sebelum menulis
    const bkp = file + '.backup-' + Date.now();
    fs.copyFileSync(file, bkp);

    // Tulis kembali sebagai UTF-8
    fs.writeFileSync(file, hasil, 'utf8');

    console.log('----------------------------------------------');
    console.log('SELESAI: ' + (gantiSemua ? 'Semua' : '1') + ' dari ' + jumlah + ' kemunculan diganti.');
    console.log('Backup disimpan di: ' + bkp);
    console.log('----------------------------------------------');
}

main().catch(e => console.error('Error: ' + e.message)).finally(() => rl.close());
