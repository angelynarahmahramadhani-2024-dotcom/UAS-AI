// ═══════════════════════════════════════
//  LUMÉRE — Shared Data & Utilities
//  Sistem Pakar Jenis Kulit (Forward Chaining)
// ═══════════════════════════════════════

const QUESTIONS = [
  { text: 'Apakah kulit terlihat mengkilap sepanjang hari dengan produksi sebum berlebih di seluruh wajah?', rules: { ya: { oily: 2 }, kadang: { oily: 1 } } },
  { text: 'Apakah pori-pori terlihat besar dengan minyak muncul merata di seluruh wajah?', rules: { ya: { oily: 2 }, kadang: { oily: 1 } } },
  { text: 'Apakah mudah berjerawat dan sering muncul komedo?', rules: { ya: { oily: 2 }, kadang: { oily: 1 } } },
  { text: 'Apakah makeup mudah luntur dalam waktu ≤2 jam?', rules: { ya: { oily: 1 }, kadang: { oily: 0.5 } } },
  { text: 'Apakah kulit terasa kencang setelah cuci muka tanpa produk apapun?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah kulit mudah mengelupas tanpa cuaca ekstrem?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah kulit terlihat kusam, kasar, dan bersisik?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah garis halus atau kerutan muncul lebih awal dari usia wajar?', rules: { ya: { dry: 1, combination: 1 }, kadang: { dry: 0.5, combination: 0.5 } } },
  { text: 'Apakah jarang muncul minyak sepanjang hari meski tanpa blotting?', rules: { ya: { dry: 2 }, kadang: { dry: 1 } } },
  { text: 'Apakah zona T (dahi, hidung, dagu) berminyak tapi pipi normal atau kering?', rules: { ya: { combination: 2 }, kadang: { combination: 1 } } },
  { text: 'Apakah pori-pori besar hanya di dahi dan hidung, sementara pipi normal?', rules: { ya: { combination: 2 }, kadang: { combination: 1 } } },
  { text: 'Apakah jerawat hanya muncul di zona T, pipi tetap bersih?', rules: { ya: { combination: 2 }, kadang: { combination: 1 } } },
  { text: 'Apakah kulit mudah kemerahan setelah cuci muka meski produk tidak keras?', rules: { ya: { sensitive: 2 }, kadang: { sensitive: 1 } } },
  { text: 'Apakah kulit terasa terbakar atau perih saat memakai produk baru?', rules: { ya: { sensitive: 2 }, kadang: { sensitive: 1 } } },
  { text: 'Apakah ada reaksi ruam atau gatal terhadap kandungan skincare umum?', rules: { ya: { sensitive: 2 }, kadang: { sensitive: 1 } } }
];

const SKIN_TYPES = {
  oily: {
    name: 'Kulit Berminyak',
    nameEn: 'Oily Skin',
    icon: '💧',
    color: '#D4A017',
    colorLight: '#FFF8E7',
    description: 'Kulit berminyak ditandai dengan produksi sebum berlebih yang membuat wajah terlihat mengkilap, pori-pori besar, dan kecenderungan mudah berjerawat. Kondisi ini dipengaruhi oleh faktor genetik, hormon, dan lingkungan.',
    tips: ['Cuci muka 2x sehari dengan gentle cleanser', 'Gunakan produk oil-free dan non-comedogenic', 'Jangan skip moisturizer — pilih yang lightweight', 'Exfoliasi 1-2x/minggu untuk membersihkan pori']
  },
  dry: {
    name: 'Kulit Kering',
    nameEn: 'Dry Skin',
    icon: '🍂',
    color: '#B87333',
    colorLight: '#FFF3EA',
    description: 'Kulit kering memiliki produksi sebum yang rendah, sering terasa kencang dan kasar, serta mudah mengelupas. Kulit kering cenderung lebih cepat menunjukkan tanda penuaan seperti garis halus dan kerutan.',
    tips: ['Gunakan cleanser berbahan krim, bukan gel/foam', 'Layer produk: toner → serum → moisturizer kaya', 'Hindari air panas saat cuci muka', 'Gunakan humidifier di ruangan ber-AC']
  },
  combination: {
    name: 'Kulit Kombinasi',
    nameEn: 'Combination Skin',
    icon: '☯️',
    color: '#6B4E71',
    colorLight: '#F5F0FF',
    description: 'Kulit kombinasi memiliki karakteristik campuran — zona T (dahi, hidung, dagu) cenderung berminyak, sementara area pipi bisa normal hingga kering. Perlu perawatan yang seimbang untuk kedua area.',
    tips: ['Rawat zona T dan pipi secara berbeda', 'BHA toner hanya di zona T', 'Pilih moisturizer ringan untuk keseluruhan wajah', 'Gunakan clay mask hanya di area berminyak']
  },
  sensitive: {
    name: 'Kulit Sensitif',
    nameEn: 'Sensitive Skin',
    icon: '🌸',
    color: '#C0435A',
    colorLight: '#FFF0F3',
    description: 'Kulit sensitif mudah bereaksi terhadap produk skincare, perubahan cuaca, atau faktor eksternal lainnya. Gejala meliputi kemerahan, rasa perih, dan iritasi. Perlu produk yang lembut dan bebas iritan.',
    tips: ['Selalu patch test produk baru selama 48 jam', 'Pilih produk fragrance-free dan hypoallergenic', 'Gunakan mineral sunscreen (zinc oxide)', 'Perkenalkan produk baru satu per satu']
  },
  normal: {
    name: 'Kulit Normal',
    nameEn: 'Normal Skin',
    icon: '⭐',
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
      { step: 'Cleanser', name: 'Gentle Foaming Cleanser', desc: 'Pembersih lembut berbasis air untuk membersihkan minyak tanpa mengiritasi.', icon: '🧴' },
      { step: 'Moisturizer', name: 'Oil-Free Moisturizer', desc: 'Pelembab ringan tanpa minyak untuk menjaga hidrasi tanpa menambah kilap.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Gel Sunscreen', desc: 'Sunscreen gel ringan non-comedogenic untuk perlindungan harian.', icon: '☀️' }
    ],
    2: [
      { step: 'Cleanser', name: 'Gel Cleanser', desc: 'Pembersih gel yang efektif mengangkat minyak berlebih.', icon: '🧴' },
      { step: 'Toner', name: 'BHA Toner Ringan', desc: 'Toner dengan Salicylic Acid konsentrasi rendah untuk mengontrol sebum.', icon: '🌿' },
      { step: 'Moisturizer', name: 'Oil-Free Moisturizer', desc: 'Pelembab water-based untuk hidrasi optimal.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Matte Sunscreen', desc: 'Sunscreen dengan finish matte untuk kulit berminyak.', icon: '☀️' }
    ],
    3: [
      { step: 'Cleanser', name: 'Gel Cleanser + Exfoliator', desc: 'Pembersih gel dan eksfoliasi rutin 2x seminggu.', icon: '🧴' },
      { step: 'Toner', name: 'BHA Toner 2%', desc: 'Toner Salicylic Acid 2% untuk membersihkan pori-pori.', icon: '🌿' },
      { step: 'Serum', name: 'Niacinamide Serum 10%', desc: 'Serum niacinamide untuk mengontrol sebum dan mengecilkan pori.', icon: '✨' },
      { step: 'Treatment', name: 'Clay Mask 2x/minggu', desc: 'Masker tanah liat untuk menyerap minyak berlebih.', icon: '🎭' },
      { step: 'Sunscreen', name: 'SPF 50+ Gel Sunscreen', desc: 'Sunscreen gel dengan perlindungan tinggi.', icon: '☀️' }
    ],
    4: [
      { step: 'Cleanser', name: 'Medicated Cleanser', desc: 'Pembersih medis dengan Benzoyl Peroxide atau Salicylic Acid.', icon: '🧴' },
      { step: 'Treatment', name: 'BHA/AHA Chemical Exfoliant', desc: 'Eksfolian kimia untuk mengatasi jerawat parah dan komedo.', icon: '⚗️' },
      { step: 'Serum', name: 'Niacinamide + Zinc Serum', desc: 'Kombinasi niacinamide dan zinc untuk kontrol sebum intensif.', icon: '✨' },
      { step: '⚠️ Penting', name: 'Konsultasi Dokter Segera', desc: 'Kondisi kulit berminyak grade 4 memerlukan penanganan dermatologis profesional.', icon: '🏥' }
    ]
  },
  dry: {
    1: [
      { step: 'Cleanser', name: 'Gentle Creamy Cleanser', desc: 'Pembersih krim lembut yang tidak menghilangkan kelembaban alami.', icon: '🧴' },
      { step: 'Moisturizer', name: 'Light Moisturizer', desc: 'Pelembab ringan dengan hyaluronic acid.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Moisturizing Sunscreen', desc: 'Sunscreen dengan formula melembabkan.', icon: '☀️' }
    ],
    2: [
      { step: 'Cleanser', name: 'Creamy Cleanser', desc: 'Pembersih krim non-foaming untuk kulit kering.', icon: '🧴' },
      { step: 'Serum', name: 'Hyaluronic Acid Serum', desc: 'Serum HA untuk mengikat kelembaban ke kulit.', icon: '✨' },
      { step: 'Moisturizer', name: 'Rich Moisturizer', desc: 'Pelembab kaya dengan ceramide dan glycerin.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Cream Sunscreen', desc: 'Sunscreen krim untuk perlindungan + hidrasi.', icon: '☀️' }
    ],
    3: [
      { step: 'Cleanser', name: 'Creamy Gentle Cleanser', desc: 'Pembersih super lembut untuk kulit sangat kering.', icon: '🧴' },
      { step: 'Serum', name: 'Ceramide + HA Serum', desc: 'Serum reparasi barrier dengan ceramide dan hyaluronic acid.', icon: '✨' },
      { step: 'Moisturizer', name: 'Rich Barrier Cream', desc: 'Krim pelembab intensif dengan ceramide, squalane, dan shea butter.', icon: '💧' },
      { step: 'Face Oil', name: 'Facial Oil Rosehip/Jojoba', desc: 'Minyak wajah untuk mengunci kelembaban semalaman.', icon: '🌹' },
      { step: 'Sunscreen', name: 'SPF 50+ Moisturizing Sunscreen', desc: 'Sunscreen melembabkan dengan perlindungan tinggi.', icon: '☀️' }
    ],
    4: [
      { step: 'Treatment', name: 'Barrier Repair Cream', desc: 'Krim perbaikan barrier intensif dengan ceramide dan cholesterol.', icon: '🛡️' },
      { step: 'Face Oil', name: 'Intensive Face Oil', desc: 'Minyak wajah intensif untuk restorasi kulit sangat kering.', icon: '🌹' },
      { step: 'Moisturizer', name: 'Ultra-Rich Night Cream', desc: 'Krim malam ekstra kaya untuk perbaikan kulit saat tidur.', icon: '💧' },
      { step: '⚠️ Penting', name: 'Konsultasi Intensif', desc: 'Kulit kering grade 4 mungkin indikasi kondisi medis — segera konsultasi dermatologis.', icon: '🏥' }
    ]
  },
  combination: {
    1: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih lembut yang seimbang untuk semua area wajah.', icon: '🧴' },
      { step: 'Moisturizer', name: 'Lightweight Moisturizer', desc: 'Pelembab ringan yang cocok untuk zona T dan pipi.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Sunscreen', desc: 'Sunscreen ringan untuk perlindungan harian.', icon: '☀️' }
    ],
    2: [
      { step: 'Cleanser', name: 'Gel-Cream Cleanser', desc: 'Pembersih antara gel dan krim untuk kulit kombinasi.', icon: '🧴' },
      { step: 'Toner', name: 'Balancing Toner', desc: 'Toner penyeimbang untuk menyamakan kondisi zona T dan pipi.', icon: '🌿' },
      { step: 'Moisturizer', name: 'Lightweight Moisturizer', desc: 'Pelembab ringan untuk seluruh wajah.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Balanced Sunscreen', desc: 'Sunscreen ringan dengan formula balanced.', icon: '☀️' }
    ],
    3: [
      { step: 'Cleanser', name: 'Gel Cleanser', desc: 'Pembersih gel untuk mengatasi zona T yang berminyak.', icon: '🧴' },
      { step: 'Toner', name: 'BHA Toner Zona T', desc: 'Aplikasikan BHA toner hanya di zona T.', icon: '🌿' },
      { step: 'Serum', name: 'Niacinamide Serum', desc: 'Serum niacinamide untuk menyeimbangkan seluruh wajah.', icon: '✨' },
      { step: 'Moisturizer', name: 'Gel + Krim per Zona', desc: 'Gel untuk zona T, krim lebih kaya untuk area pipi.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 50+ Semi-Matte', desc: 'Sunscreen dengan finish semi-matte.', icon: '☀️' }
    ],
    4: [
      { step: 'Treatment', name: 'Targeted Zona T', desc: 'Perawatan intensif zona T dengan BHA dan niacinamide.', icon: '⚗️' },
      { step: 'Moisturizer', name: 'Adaptive Moisturizer', desc: 'Pelembab adaptif untuk masing-masing zona wajah.', icon: '💧' },
      { step: '⚠️ Penting', name: 'Konsultasi Dermatologis', desc: 'Kulit kombinasi grade 4 memerlukan evaluasi profesional.', icon: '🏥' }
    ]
  },
  sensitive: {
    1: [
      { step: 'Cleanser', name: 'Fragrance-Free Cleanser', desc: 'Pembersih tanpa pewangi, hypoallergenic.', icon: '🧴' },
      { step: 'Moisturizer', name: 'Barrier Moisturizer Ringan', desc: 'Pelembab ringan untuk memperkuat skin barrier.', icon: '💧' },
      { step: 'Sunscreen', name: 'Mineral SPF 30+ Sunscreen', desc: 'Sunscreen mineral (zinc oxide) yang lembut di kulit.', icon: '☀️' }
    ],
    2: [
      { step: 'Cleanser', name: 'Fragrance-Free Cleanser', desc: 'Pembersih ultra-lembut tanpa iritan.', icon: '🧴' },
      { step: 'Serum', name: 'Centella Asiatica Serum', desc: 'Serum centella untuk menenangkan dan memperbaiki kulit.', icon: '✨' },
      { step: 'Moisturizer', name: 'Gentle Barrier Cream', desc: 'Krim pelembab lembut dengan ceramide.', icon: '💧' },
      { step: 'Sunscreen', name: 'Mineral SPF 30+ Sunscreen', desc: 'Sunscreen mineral hypoallergenic.', icon: '☀️' }
    ],
    3: [
      { step: 'Cleanser', name: 'Ultra-Gentle Cleanser', desc: 'Pembersih paling lembut untuk kulit sangat sensitif.', icon: '🧴' },
      { step: 'Serum', name: 'Centella + Panthenol Serum', desc: 'Serum penenang kombinasi centella dan panthenol.', icon: '✨' },
      { step: 'Moisturizer', name: 'Soothing Barrier Cream', desc: 'Krim penenang dengan madecassoside.', icon: '💧' },
      { step: '⚠️ Tips', name: 'Patch Test Wajib', desc: 'Selalu lakukan patch test 48 jam sebelum menggunakan produk baru.', icon: '🧪' }
    ],
    4: [
      { step: 'Treatment', name: 'Minimalist Skincare Only', desc: 'Gunakan produk sesedikit mungkin — hanya cleanser dan moisturizer.', icon: '🛡️' },
      { step: 'Moisturizer', name: 'Medical-Grade Barrier Cream', desc: 'Pelembab grade medis untuk restorasi barrier.', icon: '💧' },
      { step: '⚠️ Penting', name: 'Konsultasi Segera', desc: 'Kulit sensitif grade 4 memerlukan penanganan medis profesional segera.', icon: '🏥' }
    ]
  },
  normal: {
    1: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih lembut untuk menjaga keseimbangan kulit.', icon: '🧴' },
      { step: 'Moisturizer', name: 'Light Moisturizer', desc: 'Pelembab ringan untuk menjaga hidrasi.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Daily Sunscreen', desc: 'Sunscreen harian untuk perlindungan UV.', icon: '☀️' }
    ],
    2: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih lembut pH-balanced.', icon: '🧴' },
      { step: 'Toner', name: 'Hydrating Toner Ringan', desc: 'Toner ringan untuk menjaga kelembaban.', icon: '🌿' },
      { step: 'Moisturizer', name: 'Light Moisturizer', desc: 'Pelembab harian yang menjaga keseimbangan.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 30+ Broad-Spectrum', desc: 'Sunscreen harian broad-spectrum.', icon: '☀️' }
    ],
    3: [
      { step: 'Cleanser', name: 'Gentle Cleanser', desc: 'Pembersih wajah lembut.', icon: '🧴' },
      { step: 'Toner', name: 'BHA/AHA Toner Ringan', desc: 'Toner eksfoliasi ringan untuk preventif.', icon: '🌿' },
      { step: 'Serum', name: 'Soothing Serum', desc: 'Serum penenang dengan green tea atau centella.', icon: '✨' },
      { step: 'Moisturizer', name: 'Balanced Moisturizer', desc: 'Pelembab seimbang untuk kulit normal.', icon: '💧' },
      { step: 'Sunscreen', name: 'SPF 50+ Sunscreen', desc: 'Sunscreen perlindungan tinggi.', icon: '☀️' }
    ],
    4: [
      { step: '⚠️ Catatan', name: 'Kondisi Tidak Biasa', desc: 'Grade 4 untuk kulit normal sangat jarang. Mungkin ada kondisi underlying yang perlu diperiksa.', icon: '⚠️' },
      { step: '⚠️ Penting', name: 'Konsultasi Dermatologis', desc: 'Segera konsultasikan kondisi kulit Anda dengan dermatologis profesional.', icon: '🏥' }
    ]
  }
};

// ─── Forward Chaining Engine ───────────────────────────────
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
  const maxScore = Math.max(...Object.values(scores));
  const skinType = maxScore === 0 ? 'normal' : Object.keys(scores).find(k => scores[k] === maxScore);
  const maxPossible = skinType === 'oily' ? 7 : skinType === 'dry' ? 9 : skinType === 'combination' ? 6 : skinType === 'sensitive' ? 6 : 9;
  const ratio = maxScore / maxPossible;
  let grade = 1;
  if (ratio >= 0.75) grade = 4;
  else if (ratio >= 0.5) grade = 3;
  else if (ratio >= 0.25) grade = 2;
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
