// ============================================================
//  PERBAIKI ENCODING (Mojibake Repair)
//  Memperbaiki file yang teks non-ASCII-nya rusak menjadi
//  kode aneh seperti: ÃƒÂ°Ã…Â¸... / Ã°Å¸â€™§ ... / â€¦ dll.
//  (Kerusakan ini terjadi jika file UTF-8 dibaca-lalu-ditulis
//   ulang lewat tool yang memakai encoding ANSI, mis. PowerShell.)
//  Cara pakai: klik dua kali "Perbaiki Encoding.cmd".
// ============================================================
const fs = require('fs');
const readline = require('readline');

// Tabel Windows-1252 (byte tinggi -> Unicode)
const cp1252High = {
    0x80: 0x20AC, 0x81: 0x0081, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E,
    0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030,
    0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152, 0x8D: 0x008D, 0x8E: 0x017D,
    0x8F: 0x008F, 0x90: 0x0090, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
    0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC,
    0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9D: 0x009D,
    0x9E: 0x017E, 0x9F: 0x0178
};
const unicodeToCp1252 = {};
for (const [b, u] of Object.entries(cp1252High)) unicodeToCp1252[u] = parseInt(b);

// String (Unicode) -> Buffer byte CP1252
function cp1252Encode(str) {
    const out = [];
    for (const ch of str) {
        const cp = ch.codePointAt(0);
        if (cp < 0x80) { out.push(cp); continue; }
        if (cp >= 0xA0 && cp <= 0xFF) { out.push(cp); continue; }
        if (unicodeToCp1252[cp] !== undefined) { out.push(unicodeToCp1252[cp]); continue; }
        throw new Error('karakter U+' + cp.toString(16) + ' (' + ch + ') bukan CP1252');
    }
    return Buffer.from(out);
}

// Satu tingkat pembalikan: UTF-8 decode -> encode CP1252 -> UTF-8 decode
function reverseOnce(buf) {
    return cp1252Encode(buf.toString('utf8'));
}

// Karakter "ciri khas" mojibake hasil encoding ganda
const MARKER = /[ÃÂ°Å¸â‚¬™ƒ„¢§šœ‰Ÿ†‡ˆŠ‹ŒŽ‘’“”•–—˜›]/;

function score(buf) {
    const s = buf.toString('utf8');
    let c = 0;
    for (const ch of s) if (MARKER.test(ch)) c++;
    return c;
}

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
    console.log('  PERBAIKI ENCODING (Mojibake Repair)');
    console.log('==============================================');

    const inputFile = await ask('Path file yang rusak: ');
    const file = inputFile.replace(/^"|"$/g, '').trim();
    if (!file || !fs.existsSync(file)) {
        console.error('FILE TIDAK DITEMUKAN: ' + file);
        return;
    }

    const asli = fs.readFileSync(file);
    let best = { buf: asli, score: score(asli), level: 0 };
    let cur = asli;

    for (let i = 1; i <= 5; i++) {
        try {
            cur = reverseOnce(cur);
        } catch (e) {
            break; // berhenti: teks sudah "bersih", tidak bisa dibalik lagi
        }
        const s = score(cur);
        if (s < best.score) best = { buf: cur, score: s, level: i };
    }

    if (best.level === 0) {
        console.log('Tidak terdeteksi kerusakan mojibake. File tampaknya sudah aman.');
        return;
    }

    const bkp = file + '.backup-' + Date.now();
    fs.copyFileSync(file, bkp);
    fs.writeFileSync(file, best.buf);

    console.log('----------------------------------------------');
    console.log('SELESAI: file dibalik ' + best.level + ' tingkat.');
    console.log('Backup disimpan di: ' + bkp);
    console.log('----------------------------------------------');
}

main().catch(e => console.error('Error: ' + e.message)).finally(() => rl.close());
