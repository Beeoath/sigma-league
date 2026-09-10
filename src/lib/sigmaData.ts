export interface QuizOption {
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string;
  order_index: number;
  question_text: string;
  options: QuizOption[];
  explanation: string;
}

export interface SlideItem {
  id: string;
  slide_order: number;
  title: string;
  content: string;
  image_url?: string;
  formula_latex?: string;
  key_takeaway?: string;
}

export interface ModuleItem {
  id: string;
  order_index: number;
  district_name: string;
  title: string;
  description: string;
  estimated_minutes: number;
  slides_count: number;
  questions_count: number;
  accent_color: string;
}

export const INITIAL_MODULES: ModuleItem[] = [
  {
    id: "modul-1-aljabar",
    order_index: 1,
    district_name: "Algebra District",
    title: "Aljabar Lanjutan & Sistem Persamaan",
    description: "Taklukkan persamaan nilai mutlak, sistem linear tiga variabel (SPLTV), operasi determinan matriks, dan deret aritmetika/geometri.",
    estimated_minutes: 45,
    slides_count: 5,
    questions_count: 15,
    accent_color: "#00F0FF",
  },
  {
    id: "modul-2-fungsi",
    order_index: 2,
    district_name: "Function Tower",
    title: "Fungsi Komposisi & Invers",
    description: "Eksplorasi domain dan kodomain, komposisi fungsi $(f \\circ g)(x)$, hingga merumuskan invers fungsi $f^{-1}(x)$ tingkat lanjut.",
    estimated_minutes: 40,
    slides_count: 5,
    questions_count: 15,
    accent_color: "#FFD600",
  },
  {
    id: "modul-3-geometri",
    order_index: 3,
    district_name: "Geometry City",
    title: "Trigonometri Analitik & Geometri",
    description: "Kuasai perbandingan sudut relasi kuadran I-IV, aturan sinus/cosinus, luas segitiga sembarang, dan matriks transformasi geometri.",
    estimated_minutes: 50,
    slides_count: 5,
    questions_count: 15,
    accent_color: "#FF007A",
  },
  {
    id: "modul-4-peluang",
    order_index: 4,
    district_name: "Probability Zone",
    title: "Kaidah Pencacahan & Teori Peluang",
    description: "Pahami aturan pengisian tempat (filling slot), permutasi siklis, kombinasi pemilihan panitia, hingga peluang kejadian majemuk.",
    estimated_minutes: 40,
    slides_count: 5,
    questions_count: 15,
    accent_color: "#A78BFA",
  },
  {
    id: "modul-5-statistika",
    order_index: 5,
    district_name: "Data District",
    title: "Statistika Deskriptif & Penyebaran Data",
    description: "Analisis tabel distribusi frekuensi berkelompok, cari mean dengan rataan sementara, median, modus, serta simpangan baku data TKA.",
    estimated_minutes: 45,
    slides_count: 5,
    questions_count: 15,
    accent_color: "#10B981",
  },
];

export const INITIAL_SLIDES: Record<string, SlideItem[]> = {
  "modul-1-aljabar": [
    {
      id: "s1-1",
      slide_order: 1,
      title: "Persamaan Nilai Mutlak Linier Satu Variabel",
      content: "Definisi formal nilai mutlak $|x|$ adalah jarak titik $x$ ke titik 0 pada garis bilangan real. Oleh karena itu, $|x| = x$ jika $x \\ge 0$ dan $|x| = -x$ jika $x < 0$.\n\nUntuk menyelesaikan persamaan bentuk $|ax + b| = c$ dengan $c \\ge 0$, kita pecah menjadi dua kemungkinan solusi:\n1. $ax + b = c$\n2. $ax + b = -c$",
      formula_latex: "|x| = \\begin{cases} x, & \\text{jika } x \\ge 0 \\\\ -x, & \\text{jika } x < 0 \\end{cases}",
      key_takeaway: "Nilai mutlak tidak pernah bernilai negatif. Jika $|f(x)| = c$ dengan $c < 0$, maka himpunan penyelesaiannya adalah himpunan kosong $\\emptyset$.",
    },
    {
      id: "s1-2",
      slide_order: 2,
      title: "Pertidaksamaan Nilai Mutlak",
      content: "Ada dua sifat utama pertidaksamaan nilai mutlak:\n\n1. Bentuk $|f(x)| \\le k$ setara dengan interval tertutup: $-k \\le f(x) \\le k$.\n\n2. Bentuk $|f(x)| \\ge k$ setara dengan interval terpisah: $f(x) \\le -k \\text{ atau } f(x) \\ge k$.\n\nJika kedua ruas memuat nilai mutlak $|f(x)| < |g(x)|$, cara termudah adalah menguadratkan kedua ruas sehingga menghasilkan $[f(x) + g(x)][f(x) - g(x)] < 0$.",
      formula_latex: "|f(x)| < k \\iff -k < f(x) < k",
      key_takeaway: "Ingat pola 'Kurang dari = Di antara (APIT)', sedangkan 'Lebih dari = Atau (TERPISAH)'.",
    },
    {
      id: "s1-3",
      slide_order: 3,
      title: "Sistem Persamaan Linear Tiga Variabel (SPLTV)",
      content: "SPLTV memuat tiga variabel berpangkat satu. Bentuk umum:\n$$\\begin{cases} a_1 x + b_1 y + c_1 z = d_1 \\\\ a_2 x + b_2 y + c_2 z = d_2 \\\\ a_3 x + b_3 y + c_3 z = d_3 \\end{cases}$$\n\nMetode penyelesaian paling efisien di soal TKA adalah metode eliminasi-substitusi gabungan. Eliminasi satu variabel yang sama dari dua pasang persamaan berbeda untuk membentuk SPLDV.",
      formula_latex: "D = \\begin{vmatrix} a_1 & b_1 & c_1 \\\\ a_2 & b_2 & c_2 \\\\ a_3 & b_3 & c_3 \\end{vmatrix}",
      key_takeaway: "Bisa juga menggunakan aturan Cramer jika koefisien matriks mudah dihitung determinannya: $x = \\frac{D_x}{D}$, $y = \\frac{D_y}{D}$, $z = \\frac{D_z}{D}$.",
    },
    {
      id: "s1-4",
      slide_order: 4,
      title: "Operasi Matriks & Determinan Ordo 2x2",
      content: "Perkalian matriks baris dikali kolom (Row $\\times$ Column). Untuk matriks $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, determinan dihitung dengan selisih perkalian diagonal utama dan diagonal samping: $\\det(A) = ad - bc$.\n\nInvers matriks $A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$, dengan syarat $\\det(A) \\neq 0$.",
      formula_latex: "A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}",
      key_takeaway: "Matriks singular adalah matriks yang nilai determinannya sama dengan nol sehingga tidak memiliki invers.",
    },
    {
      id: "s1-5",
      slide_order: 5,
      title: "Barisan & Deret Aritmetika Serta Geometri",
      content: "Barisan aritmetika memiliki beda tetap $b = U_n - U_{n-1}$. Suku ke-$n$ adalah $U_n = a + (n-1)b$ dan jumlah $n$ suku pertama $S_n = \\frac{n}{2}(2a + (n-1)b)$.\n\nBarisan geometri memiliki rasio tetap $r = \\frac{U_n}{U_{n-1}}$. Suku ke-$n$ adalah $U_n = a \\cdot r^{n-1}$.\nUntuk deret geometri tak hingga konvergen ($-1 < r < 1$), jumlah tak hingga adalah $S_\\infty = \\frac{a}{1 - r}$.",
      formula_latex: "S_\\infty = \\frac{a}{1 - r}, \\quad -1 < r < 1",
      key_takeaway: "Deret geometri tak hingga hanya konvergen jika $|r| < 1$. Jika $|r| \\ge 1$, deret divergen menuju tak hingga.",
    },
  ],
  "modul-2-fungsi": [
    {
      id: "s2-1",
      slide_order: 1,
      title: "Konsep Relasi, Domain & Range",
      content: "Fungsi $f: A \\to B$ memetakan setiap anggota domain $A$ tepat satu ke anggota kodomain $B$.\n\nDomain alami ditentukan oleh syarat matematika:\n1. Bentuk pecahan $\\frac{f(x)}{g(x)} \\implies g(x) \\neq 0$.\n2. Bentuk akar genap $\\sqrt{f(x)} \\implies f(x) \\ge 0$.\n3. Bentuk logaritma $\\log_a f(x) \\implies f(x) > 0$.",
      formula_latex: "D_f = \\{x \\in \\mathbb{R} \\mid g(x) \\neq 0 \\text{ atau } f(x) \\ge 0\\}",
      key_takeaway: "Periksa selalu syarat penyebut tidak nol dan di dalam akar pangkat genap tidak bernilai negatif.",
    },
    {
      id: "s2-2",
      slide_order: 2,
      title: "Aljabar Fungsi & Pemetaan",
      content: "Dua fungsi $f(x)$ dan $g(x)$ dapat dioperasikan secara aljabar:\n- $(f + g)(x) = f(x) + g(x)$\n- $(f - g)(x) = f(x) - g(x)$\n- $(f \\cdot g)(x) = f(x) \\cdot g(x)$\n- $(\\frac{f}{g})(x) = \\frac{f(x)}{g(x)}, \\quad g(x) \\neq 0$.\n\nDomain hasil operasi adalah irisan domain kedua fungsi: $D_{f \\cap g}$.",
      formula_latex: "D_{f \\pm g} = D_f \\cap D_g",
      key_takeaway: "Irisan domain menjamin nilai variabel terdefinisi secara simultan pada kedua fungsi asal.",
    },
    {
      id: "s2-3",
      slide_order: 3,
      title: "Komposisi Fungsi (f o g)(x)",
      content: "Komposisi $(f \\circ g)(x) = f(g(x))$ berarti memasukkan seluruh ekspresi fungsi $g(x)$ ke dalam setiap variabel $x$ pada fungsi $f$.\n\nPerhatikan bahwa secara umum operasi komposisi fungsi bersifat **tidak komutatif**:\n$$(f \\circ g)(x) \\neq (g \\circ f)(x)$$",
      formula_latex: "(f \\circ g)(x) = f(g(x))",
      key_takeaway: "Sifat asosiatif tetap berlaku: $(f \\circ (g \\circ h))(x) = ((f \\circ g) \\circ h)(x)$.",
    },
    {
      id: "s2-4",
      slide_order: 4,
      title: "Invers Fungsi f^(-1)(x)",
      content: "Jika $y = f(x)$, maka invers fungsinya adalah $x = f^{-1}(y)$.\n\nRumus cepat invers fungsi rasional linier:\n$$f(x) = \\frac{ax + b}{cx + d} \\implies f^{-1}(x) = \\frac{-dx + b}{cx - a}, \\quad x \\neq \\frac{a}{c}$$\n\nTukar posisi koefisien $a$ dan $d$ lalu kalikan masing-masing dengan $-1$.",
      formula_latex: "f(x) = \\frac{ax + b}{cx + d} \\iff f^{-1}(x) = \\frac{-dx + b}{cx - a}",
      key_takeaway: "Fungsi invers hanya ada jika fungsi aslinya merupakan fungsi bijektif (injektif dan surjektif sekaligus).",
    },
    {
      id: "s2-5",
      slide_order: 5,
      title: "Invers dari Fungsi Komposisi",
      content: "Sifat invers pada operasi komposisi membalik urutan pengerjaan:\n$$(f \\circ g)^{-1}(x) = (g^{-1} \\circ f^{-1})(x)$$\n\nBegitu juga dengan tiga fungsi:\n$$(f \\circ g \\circ h)^{-1}(x) = (h^{-1} \\circ g^{-1} \\circ f^{-1})(x)$$\n\nHubungan identitas: $(f \\circ f^{-1})(x) = (f^{-1} \\circ f)(x) = I(x) = x$.",
      formula_latex: "(f \\circ g)^{-1}(x) = (g^{-1} \\circ f^{-1})(x)",
      key_takeaway: "Ingat prinsip memakai sepatu dan kaos kaki: ketika melepas (invers), sepatu dibuka dulu baru kaos kaki!",
    },
  ],
  "modul-3-geometri": [
    {
      id: "s3-1",
      slide_order: 1,
      title: "Sudut Berelasi di Empat Kuadran",
      content: "Tanda perbandingan trigonometri di setiap kuadran:\n- Kuadran I ($0^\\circ - 90^\\circ$): Semua positif (All).\n- Kuadran II ($90^\\circ - 180^\\circ$): Hanya $\\sin$ dan $\\csc$ positif.\n- Kuadran III ($180^\\circ - 270^\\circ$): Hanya $\\tan$ dan $\\cot$ positif.\n- Kuadran IV ($270^\\circ - 360^\\circ$): Hanya $\\cos$ dan $\\sec$ positif.\n\nSingkatan mudah: **Semua - Sindikat - Tangannya - Kosong** (All - Sin - Tan - Cos).",
      formula_latex: "\\sin(180^\\circ - \\alpha) = \\sin \\alpha, \\quad \\cos(180^\\circ - \\alpha) = -\\cos \\alpha",
      key_takeaway: "Gunakan sudut patokan $180^\\circ \\pm \\alpha$ atau $360^\\circ - \\alpha$ agar fungsi trigonometri tidak berubah bentuk.",
    },
    {
      id: "s3-2",
      slide_order: 2,
      title: "Identitas Dasar Trigonometri",
      content: "Identitas Pythagoras trigonometri:\n1. $\\sin^2 \\alpha + \\cos^2 \\alpha = 1$\n2. $1 + \\tan^2 \\alpha = \\sec^2 \\alpha$\n3. $1 + \\cot^2 \\alpha = \\csc^2 \\alpha$\n\nRumus sudut rangkap:\n- $\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha$\n- $\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = 2\\cos^2\\alpha - 1 = 1 - 2\\sin^2\\alpha$",
      formula_latex: "\\sin^2\\alpha + \\cos^2\\alpha = 1",
      key_takeaway: "Kuasai bentuk variasi $\\sin^2\\alpha = 1 - \\cos^2\\alpha$ untuk menyederhanakan pecahan aljabar trigonometri.",
    },
    {
      id: "s3-3",
      slide_order: 3,
      title: "Aturan Sinus dalam Segitiga",
      content: "Pada segitiga sembarang $ABC$ dengan panjang sisi $a, b, c$ di depan sudut $A, B, C$:\n$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$\n\nDi mana $R$ adalah jari-jari lingkaran luar segitiga. Aturan sinus digunakan jika diketahui sisi dan sudut yang berhadapan.",
      formula_latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
      key_takeaway: "Pakai aturan sinus jika ada pasangan sisi dan sudut yang berhadapan lengkap diketahui.",
    },
    {
      id: "s3-4",
      slide_order: 4,
      title: "Aturan Cosinus & Luas Segitiga",
      content: "Aturan cosinus digunakan jika diketahui **sisi-sudut-sisi** (sudut yang diapit) atau **sisi-sisi-sisi**:\n$$a^2 = b^2 + c^2 - 2bc \\cos A$$\n$$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$$\n\nLuas segitiga sembarang:\n$$L = \\frac{1}{2} ab \\sin C = \\frac{1}{2} bc \\sin A = \\frac{1}{2} ac \\sin B$$",
      formula_latex: "a^2 = b^2 + c^2 - 2bc\\cos A",
      key_takeaway: "Jika semua sisi diketahui tanpa sudut, gunakan rumus Heron: $L = \\sqrt{s(s-a)(s-b)(s-c)}$ dengan $s = \\frac{a+b+c}{2}$.",
    },
    {
      id: "s3-5",
      slide_order: 5,
      title: "Transformasi Geometri (Translasi & Refleksi)",
      content: "1. Translasi titik $P(x,y)$ dengan vektor $T = \\begin{pmatrix} a \\\\ b \\end{pmatrix}$ menghasilkan $P'(x+a, y+b)$.\n\n2. Refleksi (Pencerminan):\n- Terhadap sumbu $X$: $(x, -y)$\n- Terhadap sumbu $Y$: $(-x, y)$\n- Terhadap garis $y = x$: $(y, x)$\n- Terhadap garis $y = -x$: $(-y, -x)$\n- Terhadap garis $x = h$: $(2h - x, y)$",
      formula_latex: "\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} a \\\\ b \\end{pmatrix}",
      key_takeaway: "Untuk persamaan kurva $y = f(x)$, substitusikan $x = x' - a$ dan $y = y' - b$ kembali ke persamaan awal.",
    },
  ],
  "modul-4-peluang": [
    {
      id: "s4-1",
      slide_order: 1,
      title: "Aturan Penjumlahan & Perkalian (Filling Slots)",
      content: "Aturan penjumlahan berlaku untuk kejadian yang saling lepas atau alternatif pilihan terpisah ('ATAU'): total cara = $n_1 + n_2 + \\dots$\n\nAturan perkalian berlaku untuk rangkaian kejadian bertahap atau sekaligus ('DAN'): total cara = $n_1 \\times n_2 \\times \\dots$\n\nContoh: Menyusun bilangan ganjil 3 digit dari angka {1, 2, 3, 4, 5} tanpa pengulangan.",
      formula_latex: "N = n_1 \\times n_2 \\times n_3 \\times \\dots \\times n_k",
      key_takeaway: "Isi kotak digit yang memiliki syarat khusus terlebih dahulu (misal kotak satuan untuk bilangan ganjil atau genap).",
    },
    {
      id: "s4-2",
      slide_order: 2,
      title: "Notasi Faktorial & Permutasi",
      content: "Faktorial: $n! = n \\times (n-1) \\times \\dots \\times 1$, dengan $0! = 1$.\n\nPermutasi adalah susunan unsur dengan **memperhatikan urutan** (posisi ketua, sekretaris, bendahara):\n$$P(n, r) = \\frac{n!}{(n-r)!}$$\n\nPermutasi unsur sama:\n$$P = \\frac{n!}{k_1! \\cdot k_2! \\dots}$$",
      formula_latex: "P(n, r) = \\frac{n!}{(n-r)!}",
      key_takeaway: "Urutan diperhatikan jika posisi AB berbeda maknanya dengan BA (misal ranking atau jabatan organisasi).",
    },
    {
      id: "s4-3",
      slide_order: 3,
      title: "Kombinasi (Urutan Tidak Diperhatikan)",
      content: "Kombinasi adalah pemilihan kelompok unsur **tanpa memperhatikan urutan** (memilih regu lomba, mengambil kelereng sekaligus):\n$$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}$$\n\nSifat penting kombinasi:\n$$\\binom{n}{r} = \\binom{n}{n-r}$$",
      formula_latex: "C(n, r) = \\frac{n!}{r!(n-r)!}",
      key_takeaway: "Memilih delegasi 3 orang dari 8 siswa adalah kombinasi karena urutan pemanggilan nama tidak mengubah susunan tim.",
    },
    {
      id: "s4-4",
      slide_order: 4,
      title: "Peluang Kejadian Tunggal & Komplemen",
      content: "Peluang kejadian $A$ pada ruang sampel $S$ berbobot sama:\n$$P(A) = \\frac{n(A)}{n(S)}, \\quad 0 \\le P(A) \\le 1$$\n\nPeluang komplemen (kejadian bukan $A$):\n$$P(A') = 1 - P(A)$$\n\nFrekuensi harapan: $F_h(A) = n \\times P(A)$, di mana $n$ adalah banyak percobaan.",
      formula_latex: "P(A') = 1 - P(A), \\quad F_h(A) = n \\cdot P(A)",
      key_takeaway: "Gunakan komplemen ketika kata soal menyebut 'paling sedikit satu' atau 'sekurang-kurangnya satu'.",
    },
    {
      id: "s4-5",
      slide_order: 5,
      title: "Peluang Kejadian Majemuk",
      content: "1. Kejadian Saling Lepas (tidak beririsan):\n$$P(A \\cup B) = P(A) + P(B)$$\n\n2. Kejadian Tidak Saling Lepas:\n$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$\n\n3. Kejadian Saling Bebas (independen):\n$$P(A \\cap B) = P(A) \\times P(B)$$",
      formula_latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
      key_takeaway: "Dua kejadian saling bebas jika terjadinya peristiwa A sama sekali tidak mempengaruhi peluang terjadinya peristiwa B.",
    },
  ],
  "modul-5-statistika": [
    {
      id: "s5-1",
      slide_order: 1,
      title: "Distribusi Frekuensi & Nilai Tengah",
      content: "Tabel distribusi frekuensi membagi data numerik menjadi beberapa kelas interval.\n- Batas bawah ($b$) dan batas atas ($a$).\n- Tepi bawah: $Tb = b - 0{,}5$.\n- Tepi atas: $Ta = a + 0{,}5$.\n- Panjang kelas: $p = Ta - Tb$.\n- Titik tengah kelas ke-$i$: $x_i = \\frac{b_i + a_i}{2}$.",
      formula_latex: "x_i = \\frac{b_i + a_i}{2}, \\quad p = Ta - Tb",
      key_takeaway: "Titik tengah $x_i$ menjadi wakil nilai untuk seluruh data yang berada di kelas interval tersebut.",
    },
    {
      id: "s5-2",
      slide_order: 2,
      title: "Rata-Rata (Mean) Data Berkelompok",
      content: "Menghitung rataan hitung (mean) data berkelompok:\n$$\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}$$\n\nAtau dengan metode rata-rata sementara $(\\bar{x}_s)$:\n$$\\bar{x} = \\bar{x}_s + \\left( \\frac{\\sum f_i d_i}{\\sum f_i} \\right)$$\ndi mana $d_i = x_i - \\bar{x}_s$. Metode ini memperkecil angka perkalian dan meminimalkan resiko salah hitung.",
      formula_latex: "\\bar{x} = \\frac{\\sum_{i=1}^k f_i x_i}{\\sum_{i=1}^k f_i}",
      key_takeaway: "Pilih $\\bar{x}_s$ dari titik tengah kelas yang frekuensinya paling besar untuk mempermudah perhitungan aljabar.",
    },
    {
      id: "s5-3",
      slide_order: 3,
      title: "Median (Kuartil Tengah) Data Berkelompok",
      content: "Median membagi data menjadi dua bagian sama banyak:\n$$Me = Q_2 = Tb + \\left( \\frac{\\frac{1}{2}n - f_k}{f_m} \\right) \\cdot p$$\n\nKeterangan:\n- $Tb$: Tepi bawah kelas median\n- $n$: Total frekuensi data\n- $f_k$: Frekuensi kumulatif sebelum kelas median\n- $f_m$: Frekuensi kelas median\n- $p$: Panjang kelas interval",
      formula_latex: "Me = Tb + \\left( \\frac{\\frac{1}{2}n - f_k}{f_m} \\right) p",
      key_takeaway: "Cari dulu letak kelas median pada data ke-$\\frac{n}{2}$ dari frekuensi kumulatif tabel.",
    },
    {
      id: "s5-4",
      slide_order: 4,
      title: "Modus Data Berkelompok",
      content: "Modus adalah nilai data yang paling sering muncul (kelas dengan frekuensi terbesar):\n$$Mo = Tb + \\left( \\frac{d_1}{d_1 + d_2} \\right) \\cdot p$$\n\nKeterangan:\n- $Tb$: Tepi bawah kelas modus\n- $d_1$: Selisih frekuensi kelas modus dengan frekuensi kelas sebelumnya\n- $d_2$: Selisih frekuensi kelas modus dengan frekuensi kelas sesudahnya\n- $p$: Panjang kelas interval",
      formula_latex: "Mo = Tb + \\left( \\frac{d_1}{d_1 + d_2} \\right) p",
      key_takeaway: "Nilai $d_1$ dan $d_2$ selalu positif karena frekuensi kelas modus adalah nilai puncak lokal.",
    },
    {
      id: "s5-5",
      slide_order: 5,
      title: "Ukuran Penyebaran (Varians & Simpangan Baku)",
      content: "1. Jangkauan Antarkuartil (Hamparan): $H = Q_3 - Q_1$\n2. Simpangan Kuartil: $Q_d = \\frac{1}{2}(Q_3 - Q_1)$\n3. Varians (Ragam) data tunggal: $S^2 = \\frac{1}{n} \\sum (x_i - \\bar{x})^2$\n4. Simpangan Baku (Deviasi Standar): $S = \\sqrt{S^2} = \\sqrt{\\frac{1}{n} \\sum (x_i - \\bar{x})^2}$",
      formula_latex: "S = \\sqrt{\\frac{1}{n} \\sum_{i=1}^n (x_i - \\bar{x})^2}",
      key_takeaway: "Simpangan baku mengukur seberapa jauh sebaran data dari nilai rata-ratanya dalam satuan asli data.",
    },
  ],
};
