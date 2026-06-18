// ═══════════════════════════════════════
//  LUMÉRE — Shared Data & Utilities
//  Sistem Pakar Jenis Kulit (Forward Chaining)
// ═══════════════════════════════════════

const QUESTIONS = [
  // ── OILY (5 soal, max 8 poin) ──
  { text: 'Dalam 2–3 jam setelah cuci muka (tanpa pakai skincare apa pun), apakah wajahmu sudah terlihat berminyak lagi di hampir semua bagian wajah?', rules: { ya: { oily: 2 }, kadang: { oily: 1 } } },
  { text: 'Apakah pori-pori di wajahmu terlihat besar dan jelas, di hampir seluruh wajah?', rules: { ya: { oily: 2 }, kadang: { oily: 1 } } },
  { text: 'Apakah komedo (titik hitam atau putih) sering muncul dan mudah terlihat di banyak area wajah?', rules: { ya: { oily: 1 }, kadang: { oily: 0.5 } } },
  { text: 'Apakah area dahi dan hidungmu terlihat mengkilap saat terkena cahaya, meski kamu belum melakukan aktivitas fisik atau berada di tempat panas?', rules: { ya: { oily: 1 }, kadang: { oily: 0.5 } } },
  { text: 'Apakah jerawat sering muncul di area wajah yang juga terasa berminyak, tanpa disertai rasa perih atau kemerahan?', rules: { ya: { oily: 1 }, kadang: { oily: 0.5 } } },
  // ── DRY (4 soal, max 7 poin) ──
  { text: 'Setelah cuci muka tanpa pakai pelembab, apakah kulitmu terasa kencang atau tidak nyaman dalam 15–30 menit?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah kulitmu sering mengelupas atau bersisik halus, padahal bukan sedang cuaca dingin/kering ekstrem?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah kulitmu terasa kasar saat disentuh, hampir sepanjang waktu?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah wajahmu jarang sekali terlihat berminyak, bahkan di cuaca panas atau lembap?', rules: { ya: { dry: 1 }, kadang: { dry: 0.5 } } },
  // ── COMBINATION (2 soal, max 4 poin) ──
  { text: 'Apakah T-zone (dahi, hidung, dagu) terasa berminyak dalam beberapa jam, sementara pipi pada saat yang sama terasa biasa saja atau malah kering?', rules: { ya: { combination: 2 }, kadang: { combination: 1 } } },
  { text: 'Apakah komedo atau pori besar lebih sering muncul di area dahi & hidung dibanding di pipi?', rules: { ya: { combination: 2 }, kadang: { combination: 1 } } },
  // ── SENSITIVE (3 soal, max 5 poin, dipisah per trigger) ──
  { text: 'Apakah kulitmu pernah terasa perih, panas, atau gatal setelah memakai produk skincare baru — meski produknya berlabel "untuk kulit sensitif"?', rules: { ya: { sensitive: 2 }, kadang: { sensitive: 1 } } },
  { text: 'Apakah wajahmu mudah memerah atau iritasi saat cuaca/suhu di sekitarmu berubah secara tiba-tiba — bukan karena produk?', rules: { ya: { sensitive: 2 }, kadang: { sensitive: 1 } } },
  { text: 'Apakah kamu punya riwayat alergi kulit terhadap kosmetik/skincare tertentu yang sudah pernah terjadi sebelumnya (bukan sekadar khawatir)?', rules: { ya: { sensitive: 1 }, kadang: { sensitive: 0.5 } } },
  // ── NORMAL (1 soal, max 2 poin) ──
  { text: 'Secara umum, apakah wajahmu terasa nyaman dan seimbang sepanjang hari tanpa pakai skincare apa pun?', rules: { ya: { normal: 2 }, kadang: { normal: 1 } } }
];

const SKIN_TYPES = {
  oily: {
    name: 'Kulit Berminyak',
    nameEn: 'Oily Skin',
    icon: '◆',
    iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    color: '#D4A017',
    colorLight: '#FFF8E7',
    description: 'Kulit berminyak ditandai dengan produksi sebum berlebih yang membuat wajah terlihat mengkilap, pori-pori besar, dan kecenderungan mudah berjerawat. Kondisi ini dipengaruhi oleh faktor genetik, hormon, dan lingkungan.',
    tips: ['Cuci muka 2x sehari dengan gentle cleanser', 'Gunakan produk oil-free dan non-comedogenic', 'Jangan skip moisturizer — pilih yang lightweight', 'Exfoliasi 1-2x/minggu untuk membersihkan pori']
  },
  dry: {
    name: 'Kulit Kering',
    nameEn: 'Dry Skin',
    icon: '✦',
    iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L12 14l-3 0 7-10z"/></svg>',
    color: '#B87333',
    colorLight: '#FFF3EA',
    description: 'Kulit kering memiliki produksi sebum yang rendah, sering terasa kencang dan kasar, serta mudah mengelupas. Kulit kering cenderung lebih cepat menunjukkan tanda penuaan seperti garis halus dan kerutan.',
    tips: ['Gunakan cleanser berbahan krim, bukan gel/foam', 'Layer produk: toner → serum → moisturizer kaya', 'Hindari air panas saat cuci muka', 'Gunakan humidifier di ruangan ber-AC']
  },
  combination: {
    name: 'Kulit Kombinasi',
    nameEn: 'Combination Skin',
    icon: '◐',
    iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" opacity="0.2"/></svg>',
    color: '#6B4E71',
    colorLight: '#F5F0FF',
    description: 'Kulit kombinasi memiliki karakteristik campuran — zona T (dahi, hidung, dagu) cenderung berminyak, sementara area pipi bisa normal hingga kering. Perlu perawatan yang seimbang untuk kedua area.',
    tips: ['Rawat zona T dan pipi secara berbeda', 'BHA toner hanya di zona T', 'Pilih moisturizer ringan untuk keseluruhan wajah', 'Gunakan clay mask hanya di area berminyak']
  },
  sensitive: {
    name: 'Kulit Sensitif',
    nameEn: 'Sensitive Skin',
    icon: '❋',
    iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>',
    color: '#C0435A',
    colorLight: '#FFF0F3',
    description: 'Kulit sensitif mudah bereaksi terhadap produk skincare, perubahan cuaca, atau faktor eksternal lainnya. Gejala meliputi kemerahan, rasa perih, dan iritasi. Perlu produk yang lembut dan bebas iritan.',
    tips: ['Selalu patch test produk baru selama 48 jam', 'Pilih produk fragrance-free dan hypoallergenic', 'Gunakan mineral sunscreen (zinc oxide)', 'Perkenalkan produk baru satu per satu']
  },
  normal: {
    name: 'Kulit Normal',
    nameEn: 'Normal Skin',
    icon: '✧',
    iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    color: '#2D7A4F',
    colorLight: '#EDFAF4',
    description: 'Kulit normal memiliki keseimbangan sebum yang baik, pori-pori berukuran normal, tidak terlalu berminyak atau kering, dan jarang mengalami masalah kulit serius. Tetap perlu perawatan rutin untuk menjaga kesehatannya.',
    tips: ['Pertahankan rutinitas skincare yang konsisten', 'Gunakan SPF setiap hari tanpa terkecuali', 'Antioksidan (Vit C) untuk mencegah penuaan', 'Eksfoliasi ringan 1-2x seminggu']
  }
};

const GRADE_INFO = {
  1: { label: 'Ringan', labelEn: 'Mild', color: '#2D7A4F', desc: 'Kondisi kulit masih tergolong ringan. Perawatan dasar sudah cukup efektif.' },
  2: { label: 'Moderate', labelEn: 'Moderate', color: '#D4A017', desc: 'Kondisi kulit memerlukan perhatian lebih dengan rutinitas yang lebih lengkap.' },
  3: { label: 'Signifikan', labelEn: 'Significant', color: '#B87333', desc: 'Kondisi kulit cukup signifikan dan perlu perawatan intensif serta konsisten.' },
  4: { label: 'Parah', labelEn: 'Severe', color: '#C0435A', desc: 'Kondisi kulit memerlukan penanganan serius. Konsultasi dengan profesional sangat dianjurkan.' }
};

const RECOMMENDATIONS = {
  oily: {
    1: [
      { step: 'Cleanser', name: 'Gentle Foaming Cleanser', desc: 'Pembersih lembut berbasis air untuk membersihkan minyak tanpa mengiritasi.', icon: '○' },
      { step: 'Moisturizer', name: 'Oil-Free Moisturizer', desc: 'Pelembab ringan tanpa minyak untuk menjaga hidrasi tanpa menambah kilap.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Gel Sunscreen', desc: 'Sunscreen gel ringan non-comedogenic untuk perlindungan harian.', icon: '◎' }
    ],
    2: [
      { step: 'Cleanser', name: 'Gel Cleanser', desc: 'Pembersih gel yang efektif mengangkat minyak berlebih.', icon: '○' },
      { step: 'Toner', name: 'BHA Toner Ringan', desc: 'Toner dengan Salicylic Acid konsentrasi rendah untuk mengontrol sebum.', icon: '◈' },
      { step: 'Moisturizer', name: 'Oil-Free Moisturizer', desc: 'Pelembab water-based untuk hidrasi optimal.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Matte Sunscreen', desc: 'Sunscreen dengan finish matte untuk kulit berminyak.', icon: '◎' }
    ],
    3: [
      { step: 'Cleanser', name: 'Gel Cleanser + Exfoliator', desc: 'Pembersih gel dan eksfoliasi rutin 2x seminggu.', icon: '○' },
      { step: 'Toner', name: 'BHA Toner 2%', desc: 'Toner Salicylic Acid 2% untuk membersihkan pori-pori.', icon: '◈' },
      { step: 'Serum', name: 'Niacinamide Serum 10%', desc: 'Serum niacinamide untuk mengontrol sebum dan mengecilkan pori.', icon: '✦' },
      { step: 'Treatment', name: 'Clay Mask 2x/minggu', desc: 'Masker tanah liat untuk menyerap minyak berlebih.', icon: '◐' },
      { step: 'Sunscreen', name: 'SPF 50+ Gel Sunscreen', desc: 'Sunscreen gel dengan perlindungan tinggi.', icon: '◎' }
    ],
    4: [
      { step: 'Cleanser', name: 'Medicated Cleanser', desc: 'Pembersih medis dengan Benzoyl Peroxide atau Salicylic Acid.', icon: '○' },
      { step: 'Treatment', name: 'BHA/AHA Chemical Exfoliant', desc: 'Eksfolian kimia untuk mengatasi jerawat parah dan komedo.', icon: '◆' },
      { step: 'Serum', name: 'Niacinamide + Zinc Serum', desc: 'Kombinasi niacinamide dan zinc untuk kontrol sebum intensif.', icon: '✦' },
      { step: 'Penting', name: 'Konsultasi Dokter Segera', desc: 'Kondisi kulit berminyak grade 4 memerlukan penanganan dermatologis profesional.', icon: '⊕' }
    ]
  },
  dry: {
    1: [
      { step: 'Cleanser', name: 'Gentle Creamy Cleanser', desc: 'Pembersih krim lembut yang tidak menghilangkan kelembaban alami.', icon: '○' },
      { step: 'Moisturizer', name: 'Light Moisturizer', desc: 'Pelembab ringan dengan hyaluronic acid.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Moisturizing Sunscreen', desc: 'Sunscreen dengan formula melembabkan.', icon: '◎' }
    ],
    2: [
      { step: 'Cleanser', name: 'Creamy Cleanser', desc: 'Pembersih krim non-foaming untuk kulit kering.', icon: '○' },
      { step: 'Serum', name: 'Hyaluronic Acid Serum', desc: 'Serum HA untuk mengikat kelembaban ke kulit.', icon: '✦' },
      { step: 'Moisturizer', name: 'Rich Moisturizer', desc: 'Pelembab kaya dengan ceramide dan glycerin.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Cream Sunscreen', desc: 'Sunscreen krim untuk perlindungan + hidrasi.', icon: '◎' }
    ],
    3: [
      { step: 'Cleanser', name: 'Creamy Gentle Cleanser', desc: 'Pembersih super lembut untuk kulit sangat kering.', icon: '○' },
      { step: 'Serum', name: 'Ceramide + HA Serum', desc: 'Serum reparasi barrier dengan ceramide dan hyaluronic acid.', icon: '✦' },
      { step: 'Moisturizer', name: 'Rich Barrier Cream', desc: 'Krim pelembab intensif dengan ceramide, squalane, dan shea butter.', icon: '◇' },
      { step: 'Face Oil', name: 'Facial Oil Rosehip/Jojoba', desc: 'Minyak wajah untuk mengunci kelembaban semalaman.', icon: '◉' },
      { step: 'Sunscreen', name: 'SPF 50+ Moisturizing Sunscreen', desc: 'Sunscreen melembabkan dengan perlindungan tinggi.', icon: '◎' }
    ],
    4: [
      { step: 'Treatment', name: 'Barrier Repair Cream', desc: 'Krim perbaikan barrier intensif dengan ceramide dan cholesterol.', icon: '◆' },
      { step: 'Face Oil', name: 'Intensive Face Oil', desc: 'Minyak wajah intensif untuk restorasi kulit sangat kering.', icon: '◉' },
      { step: 'Moisturizer', name: 'Ultra-Rich Night Cream', desc: 'Krim malam ekstra kaya untuk perbaikan kulit saat tidur.', icon: '◇' },
      { step: 'Penting', name: 'Konsultasi Intensif', desc: 'Kulit kering grade 4 mungkin indikasi kondisi medis — segera konsultasi dermatologis.', icon: '⊕' }
    ]
  },
  combination: {
    1: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih lembut yang seimbang untuk semua area wajah.', icon: '○' },
      { step: 'Moisturizer', name: 'Lightweight Moisturizer', desc: 'Pelembab ringan yang cocok untuk zona T dan pipi.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Sunscreen', desc: 'Sunscreen ringan untuk perlindungan harian.', icon: '◎' }
    ],
    2: [
      { step: 'Cleanser', name: 'Gel-Cream Cleanser', desc: 'Pembersih antara gel dan krim untuk kulit kombinasi.', icon: '○' },
      { step: 'Toner', name: 'Balancing Toner', desc: 'Toner penyeimbang untuk menyamakan kondisi zona T dan pipi.', icon: '◈' },
      { step: 'Moisturizer', name: 'Lightweight Moisturizer', desc: 'Pelembab ringan untuk seluruh wajah.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Balanced Sunscreen', desc: 'Sunscreen ringan dengan formula balanced.', icon: '◎' }
    ],
    3: [
      { step: 'Cleanser', name: 'Gel Cleanser', desc: 'Pembersih gel untuk mengatasi zona T yang berminyak.', icon: '○' },
      { step: 'Toner', name: 'BHA Toner Zona T', desc: 'Aplikasikan BHA toner hanya di zona T.', icon: '◈' },
      { step: 'Serum', name: 'Niacinamide Serum', desc: 'Serum niacinamide untuk menyeimbangkan seluruh wajah.', icon: '✦' },
      { step: 'Moisturizer', name: 'Gel + Krim per Zona', desc: 'Gel untuk zona T, krim lebih kaya untuk area pipi.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 50+ Semi-Matte', desc: 'Sunscreen dengan finish semi-matte.', icon: '◎' }
    ],
    4: [
      { step: 'Treatment', name: 'Targeted Zona T', desc: 'Perawatan intensif zona T dengan BHA dan niacinamide.', icon: '◆' },
      { step: 'Moisturizer', name: 'Adaptive Moisturizer', desc: 'Pelembab adaptif untuk masing-masing zona wajah.', icon: '◇' },
      { step: 'Penting', name: 'Konsultasi Dermatologis', desc: 'Kulit kombinasi grade 4 memerlukan evaluasi profesional.', icon: '⊕' }
    ]
  },
  sensitive: {
    1: [
      { step: 'Cleanser', name: 'Fragrance-Free Cleanser', desc: 'Pembersih tanpa pewangi, hypoallergenic.', icon: '○' },
      { step: 'Moisturizer', name: 'Barrier Moisturizer Ringan', desc: 'Pelembab ringan untuk memperkuat skin barrier.', icon: '◇' },
      { step: 'Sunscreen', name: 'Mineral SPF 30+ Sunscreen', desc: 'Sunscreen mineral (zinc oxide) yang lembut di kulit.', icon: '◎' }
    ],
    2: [
      { step: 'Cleanser', name: 'Fragrance-Free Cleanser', desc: 'Pembersih ultra-lembut tanpa iritan.', icon: '○' },
      { step: 'Serum', name: 'Centella Asiatica Serum', desc: 'Serum centella untuk menenangkan dan memperbaiki kulit.', icon: '✦' },
      { step: 'Moisturizer', name: 'Gentle Barrier Cream', desc: 'Krim pelembab lembut dengan ceramide.', icon: '◇' },
      { step: 'Sunscreen', name: 'Mineral SPF 30+ Sunscreen', desc: 'Sunscreen mineral hypoallergenic.', icon: '◎' }
    ],
    3: [
      { step: 'Cleanser', name: 'Ultra-Gentle Cleanser', desc: 'Pembersih paling lembut untuk kulit sangat sensitif.', icon: '○' },
      { step: 'Serum', name: 'Centella + Panthenol Serum', desc: 'Serum penenang kombinasi centella dan panthenol.', icon: '✦' },
      { step: 'Moisturizer', name: 'Soothing Barrier Cream', desc: 'Krim penenang dengan madecassoside.', icon: '◇' },
      { step: 'Tips', name: 'Patch Test Wajib', desc: 'Selalu lakukan patch test 48 jam sebelum menggunakan produk baru.', icon: '◈' }
    ],
    4: [
      { step: 'Treatment', name: 'Minimalist Skincare Only', desc: 'Gunakan produk sesedikit mungkin — hanya cleanser dan moisturizer.', icon: '◆' },
      { step: 'Moisturizer', name: 'Medical-Grade Barrier Cream', desc: 'Pelembab grade medis untuk restorasi barrier.', icon: '◇' },
      { step: 'Penting', name: 'Konsultasi Segera', desc: 'Kulit sensitif grade 4 memerlukan penanganan medis profesional segera.', icon: '⊕' }
    ]
  },
  normal: {
    1: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih lembut untuk menjaga keseimbangan kulit.', icon: '○' },
      { step: 'Moisturizer', name: 'Light Moisturizer', desc: 'Pelembab ringan untuk menjaga hidrasi.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Daily Sunscreen', desc: 'Sunscreen harian untuk perlindungan UV.', icon: '◎' }
    ],
    2: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih lembut pH-balanced.', icon: '○' },
      { step: 'Toner', name: 'Hydrating Toner Ringan', desc: 'Toner ringan untuk menjaga kelembaban.', icon: '◈' },
      { step: 'Moisturizer', name: 'Light Moisturizer', desc: 'Pelembab harian yang menjaga keseimbangan.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 30+ Broad-Spectrum', desc: 'Sunscreen harian broad-spectrum.', icon: '◎' }
    ],
    3: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih wajah lembut.', icon: '○' },
      { step: 'Toner', name: 'BHA/AHA Toner Ringan', desc: 'Toner eksfoliasi ringan untuk preventif.', icon: '◈' },
      { step: 'Serum', name: 'Soothing Serum', desc: 'Serum penenang dengan green tea atau centella.', icon: '✦' },
      { step: 'Moisturizer', name: 'Balanced Moisturizer', desc: 'Pelembab seimbang untuk kulit normal.', icon: '◇' },
      { step: 'Sunscreen', name: 'SPF 50+ Sunscreen', desc: 'Sunscreen perlindungan tinggi.', icon: '◎' }
    ],
    4: [
      { step: 'Catatan', name: 'Kondisi Tidak Biasa', desc: 'Grade 4 untuk kulit normal sangat jarang. Mungkin ada kondisi underlying yang perlu diperiksa.', icon: '◈' },
      { step: 'Penting', name: 'Konsultasi Dermatologis', desc: 'Segera konsultasikan kondisi kulit Anda dengan dermatologis profesional.', icon: '⊕' }
    ]
  }
};

// ─── Forward Chaining Engine ───────────────────────────────
// Catatan revisi: winner & grading sekarang berbasis RASIO (skor / maxPossible
// per kategori), bukan skor mentah. Ini memperbaiki 3 isu:
// 1. Tie-breaking yang sebelumnya bias ke urutan deklarasi objek (oily selalu
//    menang duluan kalau skor seri dengan kategori lain).
// 2. Ketidakadilan grading: kategori dengan maxPossible kecil (misal combination
//    max 4) tidak lagi otomatis di-grade lebih rendah/tinggi secara tidak adil
//    dibanding kategori dengan maxPossible besar (oily max 8).
// 3. Kategori "normal" yang secara struktural sulit menang lewat skor mentah
//    (max 2 poin) — sekarang ditentukan lewat ambang rasio: jika tidak ada
//    kategori lain yang gejalanya signifikan (rasio < NORMAL_THRESHOLD),
//    hasilnya normal.

const NORMAL_THRESHOLD = 0.3; // di bawah ini, dianggap tidak ada gejala dominan signifikan

// Hitung maxPossible per kategori secara otomatis dari QUESTIONS,
// supaya kalau soal diubah lagi nanti, maxPossible tidak perlu diupdate manual.
function calculateMaxPossible() {
  const max = { oily: 0, dry: 0, combination: 0, sensitive: 0, normal: 0 };
  for (const q of QUESTIONS) {
    if (!q.rules.ya) continue;
    for (const [type, pts] of Object.entries(q.rules.ya)) {
      max[type] += pts; // jawaban 'ya' selalu poin tertinggi per soal
    }
  }
  return max;
}

const MAX_POSSIBLE = calculateMaxPossible();

function processAnswers(answers) {
  const scores = { oily: 0, dry: 0, combination: 0, sensitive: 0, normal: 0 };
  for (let i = 0; i < QUESTIONS.length; i++) {
    const answer = answers[i];
    const q = QUESTIONS[i];
    if (answer === 'ya' && q.rules.ya) {
      for (const [type, pts] of Object.entries(q.rules.ya)) scores[type] += pts;
    } else if (answer === 'kadang' && q.rules.kadang) {
      for (const [type, pts] of Object.entries(q.rules.kadang)) scores[type] += pts;
    }
  }

  // Hitung rasio hanya untuk 4 kategori "bergejala" (bukan normal, karena
  // normal ditentukan lewat ambang rasio kategori lain, bukan rasio dirinya sendiri)
  const symptomTypes = ['oily', 'dry', 'combination', 'sensitive'];
  const ratios = {};
  for (const type of symptomTypes) {
    ratios[type] = MAX_POSSIBLE[type] > 0 ? scores[type] / MAX_POSSIBLE[type] : 0;
  }

  const maxRatio = Math.max(...Object.values(ratios));

  let skinType;
  if (maxRatio < NORMAL_THRESHOLD) {
    skinType = 'normal';
  } else {
    // Tie-breaking: kalau rasio seri, menang berdasarkan skor mentah tertinggi
    // (bukan urutan deklarasi objek seperti versi sebelumnya)
    const topTypes = symptomTypes.filter(t => ratios[t] === maxRatio);
    skinType = topTypes.length === 1
      ? topTypes[0]
      : topTypes.reduce((a, b) => scores[a] >= scores[b] ? a : b);
  }

  const maxScore = scores[skinType];

  // Grade untuk 'normal' SELALU rendah (1) — karena masuk kategori normal artinya
  // tidak ada gejala dominan yang signifikan (rasio kategori lain < threshold).
  // Tidak masuk akal secara klinis ada "normal grade 4"; itu kontradiksi konsep
  // (lihat juga catatan matriks rekomendasi: normal grade 4 = kondisi tidak biasa).
  // Skor soal #15 sendiri TIDAK dipakai untuk menentukan grade, hanya sebagai
  // sinyal pendukung opsional di data scores untuk ditampilkan di radar chart.
  let grade;
  if (skinType === 'normal') {
    grade = 1;
  } else {
    const ratio = ratios[skinType];
    grade = 1;
    if (ratio >= 0.75) grade = 4;
    else if (ratio >= 0.5) grade = 3;
    else if (ratio >= 0.25) grade = 2;
  }

  return { skinType, grade, maxScore, scores };
}

// ─── LocalStorage Helpers ──────────────────────────────────
function getHistory() {
  try { return JSON.parse(localStorage.getItem('lumere_history') || '[]'); } catch { return []; }
}

function saveResult(entry) {
  const history = getHistory();
  history.unshift(entry);
  if (history.length > 20) history.pop();
  localStorage.setItem('lumere_history', JSON.stringify(history));
}

// ─── Theme Management ──────────────────────────────────────
function getTheme() {
  return localStorage.getItem('lumere_theme') || 'light';
}

function setTheme(theme) {
  localStorage.setItem('lumere_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function applyStoredTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}

// ─── Toast ────────────────────────────────────────────────
function showToast(msg, type = 'default') {
  let toast = document.getElementById('lumere-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lumere-toast';
    document.body.appendChild(toast);
  }
  toast.className = 'lumere-toast lumere-toast--' + type;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Page Transition ──────────────────────────────────────
function navigateTo(url) {
  document.body.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 350);
}

// ─── Mobile Burger Menu ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navRight = document.querySelector('.nav-right');
  const navCenter = document.querySelector('.nav-center');
  
  if (nav && navRight && navCenter) {
    // Create Burger Button
    const burgerBtn = document.createElement('button');
    burgerBtn.className = 'burger-btn';
    burgerBtn.setAttribute('aria-label', 'Toggle menu');
    burgerBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    navRight.appendChild(burgerBtn);
    
    // Create Mobile Menu Overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Header (Logo & Close)
    const menuHeader = document.createElement('div');
    menuHeader.className = 'mobile-menu-header';
    menuHeader.innerHTML = `
      <a class="nav-logo" onclick="navigateTo('index.html')">
        <img src="logo_vokasi-removebg-preview.png" alt="Logo Vokasi SIGAP" class="logo-vokasi"/>LUMÉRE<span>®</span>
      </a>
      <button class="mobile-close-btn" aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    
    // Content (Links)
    const menuContent = document.createElement('div');
    menuContent.className = 'mobile-menu-content';
    
    Array.from(navCenter.children).forEach(link => {
      const clonedLink = link.cloneNode(true);
      clonedLink.className = link.className.replace('nav-link', 'mobile-link');
      clonedLink.addEventListener('click', () => {
        if (!clonedLink.hasAttribute('onclick')) {
          closeMenu();
        }
      });
      menuContent.appendChild(clonedLink);
    });
    
    // Divider
    const menuDivider = document.createElement('div');
    menuDivider.className = 'mobile-menu-divider';
    
    // Footer (Theme & CTA)
    const menuFooter = document.createElement('div');
    menuFooter.className = 'mobile-menu-footer';
    
    const themeToggle = navRight.querySelector('.theme-toggle');
    if (themeToggle) {
      const clonedTheme = themeToggle.cloneNode(true);
      clonedTheme.id = 'mobileThemeToggle';
      clonedTheme.addEventListener('click', () => {
        setTheme(getTheme() === 'dark' ? 'light' : 'dark');
      });
      menuFooter.appendChild(clonedTheme);
    }
    
    const btnNav = navRight.querySelector('.btn-nav');
    if (btnNav) {
      const clonedBtn = document.createElement('a');
      clonedBtn.className = 'mobile-menu-cta';
      clonedBtn.innerHTML = '✦ Mulai Sekarang';
      clonedBtn.onclick = () => { closeMenu(); navigateTo('quiz.html'); };
      menuFooter.appendChild(clonedBtn);
    }
    
    mobileMenu.appendChild(menuHeader);
    mobileMenu.appendChild(menuContent);
    mobileMenu.appendChild(menuDivider);
    mobileMenu.appendChild(menuFooter);
    
    document.body.appendChild(mobileMenu);
    
    // Toggle Logic
    let isOpen = false;
    
    const openMenu = () => {
      isOpen = true;
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    
    const closeMenu = () => {
      isOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };
    
    burgerBtn.addEventListener('click', openMenu);
    menuHeader.querySelector('.mobile-close-btn').addEventListener('click', closeMenu);
  }
});