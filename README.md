# 🎂 Website Ucapan Ulang Tahun ke-23: Riki Baihaki 💙✨
*(100% Pure HTML5, CSS3, & Modern JavaScript — Tanpa Perlu PHP/Database)*

Website ucapan ulang tahun interaktif, modern, dan estetis yang dirancang khusus untuk **Riki Baihaki** yang merayakan ulang tahun ke-23. Dibangun dengan konsep desain **Glassmorphism**, palet warna **Midnight Blue & Ice Blue Glow**, serta animasi interaktif yang memukau.

---

## 🌟 Fitur Utama (Pure Client-Side)

1. **Bisa Dibuka Langsung Tanpa Web Server**:
   - Cukup **klik 2x pada file `index.html`**, website langsung terbuka sempurna di Google Chrome, Edge, Safari, atau browser HP tanpa perlu XAMPP / Laragon / PHP!
   - Sangat mudah diunggah ke hosting gratis seperti **GitHub Pages**, **Netlify**, atau **Vercel**.

2. **Cover / Surprise Opening Screen**:
   - Background canvas partikel bintang & *shooting star* interaktif yang bereaksi terhadap kursor mouse.
   - Tombol pembuka *"Buka Kado Spesial / Tap to Open"*.
   - Transisi tirai halus, audio romantis otomatis, letupan *confetti*, dan efek ketikan (*typewriter*) judul: `"Happy 23rd Birthday, Riki Baihaki! 💙"`.

3. **Floating Audio Controller & Synthesizer Fallback**:
   - Pemutar musik berbentuk piringan vinyl berputar dengan visualisator equalizer gelombang suara aktif.
   - Tombol Play / Pause fleksibel.
   - Dilengkapi *Web Audio API Synthesizer fallback* (jika belum memasukkan file mp3, website tetap mengeluarkan nada melodi piano romantis secara otomatis!).

4. **Surat Cinta / Birthday Letter Card**:
   - Kartu ucapan personal bernuansa glassmorphism dengan stempel lilin (*wax seal*) eksklusif angka 23.
   - Teks doa mendalam, penuh kasih sayang dan apresiasi atas perjuangan serta kedewasaan Riki.

5. **Virtual Birthday Cake (Interactive Mini Feature)**:
   - Kue ulang tahun CSS bertingkat dengan lilin angka 23 dan nyala api berkedip realistis.
   - Tombol *"Tiup Lilin Sekarang"*: api lilin padam, efek asap halus mengepul, meledakkan hujan kembang api *confetti*, serta memunculkan pesan doa spesial.
   - Opsi untuk *"Nyalakan Lilin Lagi"* agar interaksi bisa diulang kapan saja.

6. **Galeri Kenangan Interaktif (Pigura Bertambah Otomatis & Bisa Ubah/Hapus)**:
   - Pigura foto bertambah dinamis setiap kali tombol **`+ Tambah Foto Kenangan Baru`** diklik (bisa menambah foto sebanyak yang diinginkan).
   - Setiap pigura foto dilengkapi tombol **`Ubah`** (untuk mengedit foto/caption pada pigura tersebut) dan tombol **`Hapus`** (ikon tempat sampah).
   - Pop-up modal upload dengan fitur *drag & drop* dan pratinjau (*preview*) foto langsung sebelum disimpan.
   - Menggunakan teknologi **IndexedDB Browser**, sehingga foto berukuran besar tersimpan permanen di browser tanpa batas sempit localStorage dan tanpa butuh server PHP.
   - Efek **3D Tilt Perspective** halus saat kursor digerakkan di atas kartu foto.
   - Modal **Lightbox** untuk melihat foto dalam ukuran penuh saat diklik.

7. **Wish Box & Prayer Wall (Local Storage Persistence)**:
   - Form interaktif dengan nama, pesan doa, dan pilihan ikon reaksi (💙, ✨, 🎂, 🥂, 🚀, 🤍).
   - Pesan tersimpan otomatis ke `localStorage` browser dan langsung muncul secara instan disertai kembang api bintang tanpa reload halaman.

8. **Easter Egg Footer**:
   - Klik ikon hati pada footer untuk memunculkan letupan hati melayang (*floating hearts shower*).

---

## 📁 Struktur Direktori (HTML, CSS, JS Murni)

```text
ultah_mylove/
├── assets/
│   ├── audio/
│   │   └── README.txt         # Panduan menaruh musik instrumental (.mp3)
│   ├── css/
│   │   └── style.css          # Styling glassmorphism, responsive, & keyframe animations
│   ├── img/
│   │   ├── photo1.svg         # Visual estetis momen 1 (Awal Perjalanan)
│   │   ├── photo2.svg         # Visual estetis momen 2 (Petualangan)
│   │   ├── photo3.svg         # Visual estetis momen 3 (Tawa & Kopi)
│   │   └── photo4.svg         # Visual estetis momen 4 (Chapter 23)
│   └── js/
│       └── main.js            # Engine interaktif: partikel, audio, confetti, tilt, upload IndexedDB, & wish
├── index.html                 # Halaman utama (Cukup klik 2x untuk membuka)
└── README.md                  # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan

Karena sekarang sudah 100% menggunakan **HTML, CSS, dan JavaScript**:

1. Buka File Explorer di laptop/komputer kamu.
2. Masuk ke folder: `d:\SEMESTER 7\ultah_mylove`.
3. **Klik 2x pada file `index.html`**.
4. Website akan langsung terbuka dan berjalan sempurna di Google Chrome, Microsoft Edge, atau browser favoritmu!

---

## 🎨 Tips Personalisasi

### 1. Menambahkan Musik Latar Favorit
- Siapkan file audio lagu kesukaan Riki atau instrumental romantis berformat `.mp3`.
- Beri nama file: `bgm.mp3`.
- Letakkan di dalam folder: `assets/audio/bgm.mp3`.

### 2. Menambah Foto Kenangan
- Cukup buka websitenya, scroll ke bagian **Galeri Jejak Kenangan**, lalu klik tombol **`+ Tambah Foto Momen Baru`**!
- Kamu bisa langsung memilih foto dari laptop atau HP, memberi judul dan caption, lalu klik simpan. Foto akan langsung tampil di galeri.
