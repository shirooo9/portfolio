# Product Requirements Document (PRD)

# Personal Portfolio + Built-in No-Code Admin CMS

**Versi dokumen:** 1.0  
**Status:** Implementation-ready specification  
**Target implementer:** Hermes Agent  
**Bahasa UI:** English by default, unless the owner’s existing portfolio content indicates otherwise. All portfolio content must be editable from Admin.  
**Platform:** Responsive web app, desktop-first but fully usable on mobile  
**Primary routes:** `/` (public portfolio), `/admin` (private CMS)

---

## 0. Instruksi Utama untuk Hermes Agent

Bangun aplikasi yang benar-benar berjalan, bukan hanya mockup, wireframe, atau rencana implementasi. Mulai dengan memeriksa repository, stack, scripts, struktur folder, dan dependency yang sudah ada. Pertahankan pola dan dependency proyek jika masih layak; jangan merombak atau menghapus fitur yang tidak terkait.

Jika repository kosong, gunakan **Next.js App Router + TypeScript + Tailwind CSS** sebagai baseline. Gunakan `framer-motion` untuk animasi bila kompatibel, dan gunakan icon library yang sudah ada (atau `lucide-react` jika belum ada). Untuk validasi data, gunakan Zod atau validator terstruktur setara. Hindari menambahkan dependency yang tidak diperlukan.

### Urutan kerja yang diwajibkan

1. Audit repository dan identifikasi batasan teknisnya.
2. Buat rencana implementasi singkat dan daftar file utama yang akan dibuat/diubah.
3. Implementasikan data layer, schema, dan autentikasi sebelum menghubungkannya ke UI.
4. Implementasikan Admin CMS dan seluruh operasi CRUD serta backup/restore.
5. Implementasikan public portfolio, drawer detail project, dan command palette.
6. Jalankan lint, type-check, build, dan test yang tersedia. Perbaiki error yang disebabkan implementasi.
7. Uji alur utama secara manual atau otomatis, lalu laporkan hasil sebenarnya.
8. Perbarui README dengan cara menjalankan aplikasi, konfigurasi environment, backup/restore, dan batasan deployment.

Jangan berhenti setelah membuat rencana. Teruskan sampai implementasi selesai semaksimal mungkin. Jika ada keputusan yang tidak ditentukan, ambil keputusan yang paling sederhana, aman, mudah dipelihara, dan konsisten dengan PRD ini. Dokumentasikan asumsi penting di README.

### Skill directives

Gunakan `taste-skill`, `impeccable`, dan `emilkowalski` jika skill tersebut memang tersedia di environment. Periksa instruksi skill yang benar-benar tersedia; jangan mengklaim telah menggunakannya jika file/instruksinya tidak ada. Bila tidak tersedia, terapkan prinsip desain di bagian 5 sebagai spesifikasi visual pengganti.

---

## 1. Ringkasan Produk

Aplikasi ini adalah personal portfolio profesional dengan **public portfolio** dan **built-in no-code CMS**. Pemilik dapat memperbarui konten melalui halaman Admin berbasis form tanpa mengedit source code atau file JSON secara manual.

Konten harus berasal dari satu sumber data yang sama. Perubahan yang disimpan di Admin harus tercermin di halaman publik setelah refresh atau revalidation tanpa perlu rebuild aplikasi.

### 1.1 Masalah yang ingin diselesaikan

- Pemilik membutuhkan portfolio yang terlihat profesional, berbeda dari template generik, dan tetap nyaman dibaca.
- Pemilik perlu mengubah profil, pengalaman, pendidikan, proyek, dan skills tanpa mengubah kode.
- Aplikasi perlu berjalan secara lokal atau pada server pribadi tanpa database eksternal yang perlu disiapkan.
- Data harus dapat diekspor dan dipulihkan melalui JSON agar mudah dicadangkan dan dipindahkan.

### 1.2 Tujuan utama

1. Menghasilkan portfolio responsif dengan kualitas visual tinggi.
2. Menyediakan CMS yang benar-benar berfungsi untuk seluruh konten portfolio.
3. Menggunakan local JSON storage dengan validasi dan penulisan file yang aman.
4. Membatasi akses Admin serta melindungi operasi tulis, export, dan import.
5. Membuat aplikasi mudah dijalankan dan dipelihara oleh satu pemilik.

### 1.3 Bukan tujuan MVP

- Multi-user, role/permission kompleks, atau workflow approval.
- Database eksternal, SaaS hosting khusus, atau sinkronisasi cloud.
- Blog/CMS artikel, komentar, analytics dashboard, visitor tracking, atau newsletter.
- Upload dan transformasi gambar ke cloud storage. MVP dapat menerima URL gambar; upload lokal dapat ditambahkan jika infrastrukturnya mendukung.
- Mengelola source code dari UI Admin.

---

## 2. Pengguna dan Skenario Utama

### 2.1 Pengunjung publik

Pengunjung membuka `/`, memahami siapa pemilik portfolio, melihat pengalaman dan proyek, membuka detail proyek, lalu menghubungi pemilik atau mengunduh CV.

### 2.2 Pemilik portfolio

Pemilik membuka `/admin`, login, mengubah profil atau konten lain melalui form, menyimpan perubahan, memeriksa hasilnya di public preview, lalu secara berkala mengunduh backup JSON.

### 2.3 Prinsip UX

- Pengunjung tidak perlu login untuk melihat portfolio.
- Pemilik tidak perlu memahami JSON, terminal, atau source code untuk mengelola konten normal.
- Form harus menjelaskan apa yang perlu diisi, memberi contoh seperlunya, menampilkan error dekat field yang bermasalah, dan mempertahankan input jika validasi gagal.
- Aksi destruktif harus eksplisit dan tidak mudah terpencet secara tidak sengaja.

---

## 3. Cakupan dan Prioritas Fitur

### P0 — Wajib untuk rilis MVP

- Public portfolio dengan Hero/Bio, Experience, Education, Projects, Skills, dan Contact.
- Admin login/logout dengan proteksi server-side.
- CRUD Profil, Experience, Education, Projects, dan Skills.
- Penyimpanan JSON lokal, seed data otomatis, schema validation, dan penulisan file atomik.
- Export backup JSON dan import/restore JSON yang tervalidasi.
- Responsif, keyboard accessible, state loading/error/empty, dan konfirmasi penghapusan.
- README dan instruksi konfigurasi.

### P1 — Wajib jika tidak menghambat stabilitas P0

- Command palette `Ctrl+K` / `Cmd+K`.
- Slide-over drawer untuk detail project.
- Reordering item melalui kontrol naik/turun atau drag-and-drop yang aksesibel.
- Live preview link dari Admin.
- Animasi halus dan micro-interactions.

### P2 — Di luar MVP, jangan implementasikan sebelum P0 stabil

- Upload gambar ke storage eksternal.
- Multi-account atau role admin.
- Revision history/undo lintas sesi.
- Analytics dan integrasi pihak ketiga.

---

## 4. Arsitektur dan Keputusan Teknis

### 4.1 Baseline stack

- **Framework:** Next.js App Router; gunakan versi yang sudah tersedia di repository jika kompatibel.
- **Bahasa:** TypeScript dengan strict mode jika memungkinkan.
- **Styling:** Tailwind CSS dan design tokens yang konsisten.
- **Animation:** `framer-motion` jika sudah ada atau dapat ditambahkan tanpa konflik.
- **Icons:** dependency yang sudah ada; jika tidak ada, `lucide-react`.
- **Validation:** Zod atau schema validator sekelasnya.
- **Persistence:** JSON file lokal yang dibaca/ditulis hanya di server menggunakan `node:fs/promises`.
- **Runtime:** Node.js runtime, bukan Edge Runtime, untuk operasi filesystem.

Jangan mengganti stack yang sudah berfungsi hanya untuk mengikuti baseline ini. Jangan menambahkan Prisma, ORM, database eksternal, atau state-management library besar untuk kebutuhan MVP.

### 4.2 Data storage

Pisahkan **seed data** dari **runtime data**:

- Seed data version-controlled: `src/data/portfolio-db.seed.json`.
- Runtime data yang dapat ditulis: `data/portfolio-db.json` secara default.
- Path runtime harus dapat diubah melalui `PORTFOLIO_DB_PATH`.
- Untuk kompatibilitas dengan requirement awal, pemilik boleh mengatur `PORTFOLIO_DB_PATH=./src/data/portfolio-db.json`, tetapi path default sebaiknya berada di luar `src` agar data runtime tidak bercampur dengan source code.

Saat runtime file belum ada, buat file dengan menyalin seed yang valid. Jika folder belum ada, buat folder tersebut. Jika runtime file ada tetapi JSON rusak atau schema tidak valid, **jangan menimpa data tersebut dengan seed secara diam-diam**. Tampilkan error yang jelas ke log/server dan dokumentasikan langkah pemulihannya. Seed otomatis hanya berlaku ketika file belum tersedia.

### 4.3 Batasan deployment yang wajib dijelaskan

Penyimpanan filesystem cocok untuk local development, PC pribadi, VPS, atau container dengan persistent writable volume. Ini **bukan** pilihan yang aman untuk platform serverless atau deployment dengan filesystem ephemeral/read-only.

Jika memakai Docker:

- Mount folder/path data sebagai persistent volume.
- Pastikan user di dalam container memiliki izin baca/tulis.
- Pastikan `PORTFOLIO_DB_PATH` menunjuk ke path di volume tersebut.

Jangan mengklaim data persisten setelah redeploy/restart sebelum konfigurasi volume benar-benar tersedia. Dokumentasikan backup rutin. Jangan merekomendasikan Vercel/serverless untuk JSON lokal tanpa menjelaskan batasan persistence.

### 4.4 Data access layer

Buat satu modul server-only sebagai satu-satunya akses filesystem, misalnya `src/lib/portfolio-store.ts`. Modul ini bertanggung jawab atas:

- Membaca dan memvalidasi data.
- Menyediakan seed jika runtime file belum ada.
- Menulis perubahan dengan pola atomic write: tulis ke file sementara di direktori yang sama, lalu rename ke file utama.
- Menserialisasi operasi tulis dalam satu proses menggunakan queue/mutex sederhana agar dua aksi hampir bersamaan tidak saling menimpa.
- Menyediakan fungsi typed untuk membaca, memperbarui, export, dan restore data.
- Mengembalikan error terstruktur tanpa membocorkan absolute path atau secret ke client.

Semua impor `fs/promises` wajib berada di modul server-only atau server actions/route handlers. Jangan pernah mengirim fungsi filesystem, environment secret, atau isi data privat yang tidak diperlukan ke client bundle.

### 4.5 Strategi cache dan konsistensi

- Public portfolio harus membaca data terbaru dari server, bukan hanya hardcoded data atau salinan client state.
- Setelah perubahan Admin berhasil, invalidasi/revalidate route publik (`/`) serta halaman/route terkait jika diperlukan.
- Jangan cache data sedemikian rupa sampai perubahan tersimpan tidak tampak setelah refresh.
- Gunakan satu schema dan satu data layer untuk public reads, admin CRUD, export, dan restore.

---

## 5. Visual Design System — Tactile Technical Lab

### 5.1 Arah visual

Portfolio harus terasa seperti **precision engineering / technical lab notebook**: terukur, editorial, sistematis, tenang, dan percaya diri. Tampilan berfokus pada tipografi, grid, spacing, garis pembatas, metadata monospace, dan komposisi yang rapi—bukan dekorasi berlebihan.

### 5.2 Aturan visual wajib

- Basis warna netral: zinc/neutral, putih hangat, abu-abu, grafit, dan hampir hitam.
- Satu warna aksen utama: Emerald `#10B981` sebagai default; gunakan konsisten untuk status aktif, link penting, fokus, dan highlight kecil.
- Gunakan sans-serif untuk isi dan heading, monospace untuk label teknis, tanggal, nomor bagian, metadata, dan kode.
- Border tipis sekitar `1px solid`; gunakan divider untuk membangun struktur.
- Grid alignment harus konsisten. Hindari elemen yang tampak melayang tanpa alasan.
- Gunakan ruang kosong dengan sengaja; jangan memadatkan semua informasi dalam card kecil.
- Kontras teks harus cukup untuk dibaca dan memenuhi WCAG AA untuk teks normal sejauh dapat diukur.

### 5.3 Hindari

- Gradasi ungu/biru generik, glassmorphism berlebihan, neon glow, blob decoration, dan efek AI-template.
- Terlalu banyak rounded cards, shadow besar, pill untuk semua hal, atau animasi yang mengganggu.
- Angka statistik atau klaim pencapaian yang tidak berasal dari data pemilik.
- Placeholder dummy yang tampak seperti konten asli di production.

### 5.4 Token visual awal

Nilai ini boleh disesuaikan setelah audit UI, tetapi harus konsisten.

- Background: `#FAFAF9` atau neutral-50.
- Surface: `#FFFFFF`.
- Primary text: `#18181B`.
- Secondary text: `#52525B`.
- Muted text: `#71717A`.
- Border: `#E4E4E7`.
- Accent: `#10B981`.
- Danger: `#DC2626`.
- Sans: Geist / Inter / sans-serif existing project font.
- Mono: Geist Mono / JetBrains Mono / equivalent.

### 5.5 Motion & micro-interactions

- Gunakan spring motion yang cepat, lembut, dan tidak berlebihan pada drawer, menu, tab, tombol, dan elemen interaktif.
- Durasi transisi umum kira-kira 150–250 ms; gunakan spring untuk gerak yang memang terasa lebih natural.
- Drawer project harus masuk/keluar dari sisi layar dengan backdrop yang halus.
- Tombol memiliki hover, active, focus-visible, disabled, dan loading states yang konsisten.
- Ikuti `prefers-reduced-motion`; jangan memaksa animasi bagi pengguna yang memintanya dikurangi.
- Jangan menjadikan animasi sebagai syarat untuk memahami konten atau melakukan tindakan.

### 5.6 Responsivitas

- **Mobile:** satu kolom, navigasi yang jelas, tap target memadai, drawer hampir/full-screen bila dibutuhkan, form tidak overflow.
- **Tablet:** grid fleksibel, spacing menyesuaikan.
- **Desktop:** gunakan max-width konten yang terukur; manfaatkan ruang horizontal tanpa membuat baris teks terlalu panjang.
- Hindari horizontal overflow pada lebar 320 px dan seterusnya.

---

## 6. Public Portfolio — `/`

### 6.1 Global layout

- Satu halaman utama dengan navigasi anchor untuk section yang tersedia.
- Identitas visual konsisten: logo/monogram tipografi sederhana atau nama pemilik; jangan membuat logo kompleks tanpa kebutuhan.
- Tampilkan indikator tanggal/nomor bagian atau metadata monospace secara selektif sebagai aksen technical-lab.
- Semua section yang datanya kosong atau dinonaktifkan harus disembunyikan dengan graceful handling; jangan render judul section kosong.
- Footer berisi identitas singkat, tahun dinamis, dan link kontak yang tersedia.

### 6.2 Hero & Bio

Tampilkan:

- Nama.
- Headline/role utama.
- Bio singkat.
- Availability status pill (`Available`, `Open to opportunities`, `Not available`, atau label kustom dari data).
- Email/contact CTA.
- Link CV/resume bila URL tersedia.
- Social links yang tersedia, minimal GitHub dan LinkedIn jika diisi.

Perilaku:

- Tombol kontak menggunakan `mailto:` yang valid.
- Link eksternal aman (`rel="noopener noreferrer"` untuk tab baru).
- Jika resume URL kosong, sembunyikan tombol CV; jangan tampilkan link rusak.
- Status visual harus tetap dapat dipahami tanpa mengandalkan warna saja.

### 6.3 Experience timeline

Setiap item menampilkan:

- Role/position.
- Company/organization.
- Employment type opsional.
- Location opsional.
- Periode mulai–selesai atau label `Present` jika masih aktif.
- Ringkasan dan daftar kontribusi/highlights.
- Technology tags opsional.

Urutan default berdasarkan field `order` yang disimpan Admin; jika belum ada, fallback ke tanggal mulai paling baru. Format tanggal harus konsisten. Validasi mencegah end date lebih awal daripada start date.

### 6.4 Education & Certifications

Setiap item menampilkan:

- Institusi.
- Degree/qualification.
- Field of study/jurusan.
- Tahun/periode.
- Grade/IPK opsional dan hanya tampil jika diisi pemilik.
- Achievements/certifications opsional.
- Location opsional.

Jangan menyamakan semua item menjadi kartu yang sama bila timeline/list editorial lebih cocok. Certification dapat disimpan sebagai education entry berjenis `certification` atau menggunakan label type, tetapi bentuk data harus konsisten.

### 6.5 Projects showcase

Setiap project dapat memiliki:

- Judul dan slug.
- Ringkasan pendek.
- Deskripsi lengkap.
- Kategori.
- Status (mis. `Completed`, `In progress`, `Archived`).
- Periode proyek opsional.
- Role/kontribusi.
- Daftar teknologi.
- Highlights/fitur utama.
- Cover image URL opsional.
- Repository URL dan live demo URL opsional.
- Data architecture/detail flow opsional.
- Status featured dan urutan.

Perilaku list:

- Project featured dapat tampil lebih menonjol tetapi tidak merusak grid.
- Jangan tampilkan tombol repository/demo kalau URL kosong.
- Buka detail saat item/card/tautan detail diaktivasi; jangan membuat seluruh item tidak aksesibel bagi keyboard.
- Pengguna tetap dapat membuka link eksternal tanpa harus membuka drawer.

#### Project detail drawer / slide-over

Drawer dapat menampilkan:

- Judul, ringkasan, status, dan metadata.
- Problem/context dan deskripsi solusi.
- Role dan kontribusi pemilik.
- Architecture overview.
- Flow langkah demi langkah.
- Daftar komponen/subsystem beserta deskripsi.
- Teknologi yang digunakan.
- Link repository/demo.

Interaksi yang wajib:

- Animasi masuk/keluar yang halus.
- Tutup via tombol close, `Escape`, dan backdrop click bila sesuai.
- Focus trap saat modal/drawer terbuka; fokus kembali ke trigger saat ditutup.
- Dialog memiliki label aksesibel dan tidak menutupi konten penting secara tak terduga.
- Di mobile, gunakan panel hampir full-screen.
- Jangan tampilkan section architecture yang kosong.

### 6.6 Skills & tech stack

- Skills dikelompokkan berdasarkan kategori, contoh `Hardware / IoT`, `Backend / Data`, `Frontend`, `Tools`, dan `Industrial Systems`.
- Kategori dapat dibuat/diubah melalui Admin atau ditentukan per skill; pilih model paling sederhana dan konsisten.
- Proficiency/rating bersifat opsional. Jangan menampilkan skor palsu atau progress bar tanpa makna yang jelas.
- Skill dapat memiliki urutan dan flag visible.
- Jika suatu kategori tidak memiliki skill yang visible, kategori tersebut tidak dirender.

### 6.7 Contact & footer

- Email dan social links berasal dari data profil.
- Jangan hardcode kontak palsu.
- Bila tidak ada informasi kontak, sembunyikan CTA kontak dan tampilkan fallback yang wajar.

### 6.8 Command palette — `Ctrl+K` / `Cmd+K`

Command palette harus:

- Dibuka lewat `Ctrl+K` di Windows/Linux dan `Cmd+K` di macOS.
- Ditutup lewat `Escape` dan tombol close.
- Memiliki input pencarian dan navigasi keyboard: panah atas/bawah, Enter, Escape.
- Mendukung navigasi ke section publik (About, Experience, Education, Projects, Skills, Contact) yang benar-benar ada.
- Mendukung aksi utama seperti membuka email atau menuju Admin hanya jika sesuai; jangan memuat command yang tidak berfungsi.
- Tidak mengganggu shortcut browser/input teks saat fokus berada di field yang sedang diketik.
- Mengelola fokus secara benar dan mendukung reduced motion.

---

## 7. Admin CMS — `/admin`

### 7.1 Prinsip umum

Admin adalah antarmuka pemilik untuk melakukan perubahan tanpa coding. Prioritaskan keterbacaan, kejelasan label, status simpan, dan pencegahan kehilangan data dibanding dekorasi.

Layout yang direkomendasikan:

- Sidebar atau tab navigation dengan bagian `Profile`, `Experience`, `Education`, `Projects`, `Skills`, `Data & Backup`.
- Header dengan status login dan tombol logout.
- Tombol `View Public Site` yang membuka `/` di tab baru.
- Content area memiliki judul, penjelasan ringkas, dan tombol aksi utama yang konsisten.

Setiap halaman/section Admin harus punya loading, success, error, dan empty states. Setelah save sukses, berikan konfirmasi yang jelas. Jika save gagal, jangan mengosongkan form atau menyatakan data sudah tersimpan.

### 7.2 Login & session

- Route `/admin` menampilkan login jika belum terautentikasi; bila sudah login, tampilkan dashboard.
- Password default `admin123` hanya boleh menjadi fallback **development lokal**, bukan default production.
- Untuk production, aplikasi harus menolak start atau menolak login dengan pesan konfigurasi yang jelas jika secret wajib belum diset.
- Gunakan environment variables, minimal `ADMIN_PASSWORD` dan `ADMIN_SESSION_SECRET`.
- Password tidak boleh ada di source code, JSON portfolio, client bundle, HTML, atau log.
- Setelah login berhasil, buat session cookie yang signed, `HttpOnly`, `SameSite=Lax`, dan `Secure` di production; sertakan masa berlaku (default 8 jam).
- Gunakan validasi session di server untuk semua halaman Admin terlindungi dan semua operasi write/export/import. Proteksi client-side redirect saja tidak cukup.
- Jangan menyimpan password atau token autentikasi di `localStorage`/`sessionStorage`.
- Terapkan pembatasan login sederhana terhadap percobaan berulang (mis. jeda/lockout setelah 5 kegagalan dalam jendela 15 menit) dan pesan error generik agar tidak membantu enumerasi kredensial.
- Logout harus menghapus/invalidate cookie.
- Validasi origin/CSRF yang layak pada operasi yang mengubah data.

Catatan keamanan: sistem password sederhana ini dirancang untuk single-owner/private deployment. Jangan mengekspos Admin ke internet publik tanpa HTTPS, secret production yang kuat, rate limiting yang memadai, dan hardening tambahan.

### 7.3 Profile editor

Editable fields:

- `name` (required).
- `headline` / role (required).
- `bio` (required, panjang maksimum jelas).
- `email` (opsional tetapi harus valid jika diisi).
- `location` (opsional).
- `githubUrl` (opsional, valid URL).
- `linkedInUrl` (opsional, valid URL).
- `websiteUrl` (opsional, valid URL).
- `resumeUrl` (opsional, valid URL atau path lokal yang diizinkan).
- `availability` (`available`, `open_to_opportunities`, `not_available`, atau label kustom yang divalidasi).
- `availabilityLabel` (opsional).
- `showContact` / flag visibilitas jika dibutuhkan.

Acceptance criteria:

- Edit dan Save memperbarui public portfolio tanpa build ulang.
- Field optional boleh kosong dan tidak menghasilkan link kosong.
- URL invalid ditandai jelas sebelum penyimpanan.

### 7.4 Experience CRUD

Fields:

- `id` (unik, dibuat otomatis).
- `role` (required).
- `company` (required).
- `employmentType` (optional: full-time, part-time, internship, contract, freelance, other).
- `location` (optional).
- `startDate` (required, format `YYYY-MM`).
- `endDate` (optional; null jika ongoing).
- `current` (boolean).
- `summary` (optional).
- `highlights` (list teks, tambah/hapus/reorder).
- `technologies` (list string/tag, tambah/hapus).
- `order` (integer).

Fitur:

- Create, read/list, edit, delete.
- Ubah urutan melalui tombol move up/down atau drag-and-drop aksesibel.
- Validasi `endDate >= startDate`; jika `current=true`, `endDate` harus null.
- Konfirmasi sebelum delete.
- Empty state dengan CTA `Add experience`.

### 7.5 Education CRUD

Fields:

- `id` unik.
- `institution` (required).
- `degree` / `qualification` (required).
- `fieldOfStudy` (optional).
- `type` (education/certification/other; default education).
- `location` (optional).
- `startDate` (optional, format `YYYY-MM` atau tahun sesuai schema yang dipilih).
- `endDate` (optional).
- `grade` (optional).
- `achievements` (list teks).
- `order` (integer).

Fitur sama seperti Experience CRUD. Jangan tampilkan grade, tanggal, atau achievements jika tidak tersedia.

### 7.6 Projects CRUD

Fields:

- `id` unik.
- `title` (required).
- `slug` (required/auto-generated, unik).
- `tagline` (required; deskripsi satu baris).
- `description` (required).
- `category` atau `categories`.
- `status` (`completed`, `in_progress`, `archived`, atau opsi terkelola).
- `role` (optional).
- `startDate` / `endDate` (optional).
- `featured` (boolean).
- `coverImageUrl` (optional URL).
- `repositoryUrl` (optional URL).
- `liveUrl` (optional URL).
- `technologies` (list string).
- `highlights` (list teks).
- `architectureOverview` (optional multiline text).
- `architectureComponents` (list object: `name`, `description`).
- `architectureFlow` (ordered list object: `title`, `description`).
- `order` (integer).

Fitur:

- Create, edit, delete, reorder, mark/unmark featured.
- Preview ringkasan sebelum simpan jika mudah dilakukan.
- Validasi URL dan slug; cegah duplikasi slug.
- Konfirmasi delete; jika project sedang dibuka di public page, setelah reload project tersebut hilang.
- Semua input architecture dapat dikelola tanpa menulis JSON. Gunakan repeatable form fields, bukan satu input JSON mentah.

### 7.7 Skills CRUD

Model paling sederhana: setiap skill menyimpan kategorinya sendiri.

Fields:

- `id` unik.
- `name` (required).
- `category` (required).
- `level` (optional; jangan ditampilkan sebagai skor jika tidak diisi).
- `visible` (boolean, default true).
- `order` (integer).

Fitur:

- Tambah, edit, hapus, dan reorder skill.
- Filter/list per kategori jika membuat form lebih mudah digunakan.
- Input nama kategori konsisten; hindari kategori duplikat hanya karena beda kapitalisasi/spasi.
- Skill `visible=false` tidak tampil di public portfolio, tetapi tidak dihapus dari data.

### 7.8 Data & Backup

Sediakan area khusus untuk export/import JSON dengan penjelasan yang mudah dipahami.

#### Export

- Tombol `Download backup (.json)` menghasilkan snapshot penuh yang valid, mencakup seluruh data portfolio dan `schemaVersion`.
- Nama file memuat timestamp, misalnya `portfolio-backup-YYYY-MM-DD-HHmmss.json`.
- Response menetapkan content type JSON dan attachment filename.
- Jangan sertakan password, session token, atau secret apa pun.

#### Import / Restore

- User memilih file `.json` melalui file picker.
- Validasi ukuran file (default maksimum 5 MB), parse JSON, validasi schema, dan validasi keunikan ID/slug sebelum melakukan perubahan.
- Tampilkan ringkasan hasil validasi sebelum commit: jumlah profile/experience/education/projects/skills dan error yang ditemukan.
- Restore MVP menggunakan mode **replace seluruh dataset**, bukan merge diam-diam.
- Sebelum restore, buat backup otomatis dari data saat ini.
- Commit data baru secara atomik hanya jika semua validasi lolos.
- Jika file invalid atau proses gagal, data lama tetap utuh.
- Tampilkan konfirmasi eksplisit bahwa restore akan mengganti seluruh data portfolio.
- Jangan menerima input path filesystem dari pengguna; hanya file yang diunggah.
- Jangan menampilkan stack trace/path lokal kepada browser.

#### Ketahanan data

- Jika penulisan gagal, Admin harus menampilkan error dan tidak memberikan pesan sukses.
- Simpan file backup otomatis restore di folder backup yang terdokumentasi jika implementasi mendukungnya; jika tidak, minimal buat salinan sementara yang aman sebelum replace.
- Dokumentasikan bahwa backup JSON harus disimpan di lokasi terpisah dari server untuk mengurangi risiko kehilangan data.

---

## 8. Data Schema dan Aturan Validasi

Gunakan TypeScript types dan schema validation dari satu definisi canonical. Contoh struktur konseptual berikut menjadi kontrak data; field boleh disesuaikan selama seluruh fitur di PRD tetap terpenuhi.

```ts
type PortfolioDB = {
  schemaVersion: 1;
  updatedAt: string; // ISO 8601
  profile: {
    name: string;
    headline: string;
    bio: string;
    email?: string;
    location?: string;
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
    resumeUrl?: string;
    availability:
      | "available"
      | "open_to_opportunities"
      | "not_available"
      | "custom";
    availabilityLabel?: string;
  };
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
};
```

Prinsip schema:

- Semua record memiliki `id` unik yang dibuat di server.
- `schemaVersion` wajib ada untuk mendukung validasi dan migrasi ke depan.
- `updatedAt` diperbarui setiap kali perubahan berhasil disimpan.
- List dapat kosong tanpa membuat aplikasi crash.
- Field optional tidak perlu dipaksakan memiliki placeholder palsu.
- Validasi baik di client untuk UX maupun di server sebagai sumber kebenaran.
- Server tetap memvalidasi semua input walaupun client sudah memvalidasi.
- Batasi panjang field dan jumlah item repeatable agar file tidak membengkak secara tidak sengaja.
- Normalisasi whitespace untuk field teks pendek; jangan merusak line breaks pada deskripsi panjang.
- Tolak unknown/invalid shape pada restore atau tangani dengan aturan schema yang jelas; jangan silently menghapus field yang tidak dikenali.
- Gunakan ID random/UUID, bukan index array sebagai identitas.

Batas awal yang dapat digunakan (sesuaikan secara konsisten): nama 120 karakter, headline 180, bio 3.000, item highlights 30 per record, technologies 40 per record, project description 10.000, import JSON 5 MB. Tampilkan pesan validasi yang manusiawi.

### 8.1 Seed data

- Sertakan seed data yang cukup untuk menunjukkan tampilan dan menguji semua section, tetapi gunakan konten placeholder yang jelas ditandai sebagai contoh.
- Jangan mengasumsikan nama, email, pengalaman, atau pencapaian pemilik.
- Beri penjelasan di README cara mengganti seed.
- Di Admin, pemilik bisa mengganti atau menghapus seed tersebut sepenuhnya.

---

## 9. Routes, Server Actions, dan API Contract

Gunakan implementasi yang selaras dengan pola repository. Jika tidak ada pola existing, gunakan Next.js App Router.

### 9.1 Page routes

- `GET /` — public portfolio.
- `GET /admin` — login atau dashboard bergantung session.
- Optional subroutes/query states untuk tab Admin, selama UX tidak membingungkan.

### 9.2 Server-side mutations

Pilih satu pola utama agar operasi tidak terduplikasi:

- Server Actions untuk CRUD dan login/logout; serta
- Route Handler untuk download export dan upload restore jika lebih sesuai dengan streaming/file upload.

Alternatif Route Handler dapat dipakai untuk seluruh mutasi jika lebih cocok dengan repository. Dalam kedua kasus, semua operasi write harus melewati autentikasi server, validasi schema, error handling, dan invalidasi cache yang sama.

Operasi minimum:

- Login, logout, check session.
- Update profile.
- Create/update/delete/reorder experience.
- Create/update/delete/reorder education.
- Create/update/delete/reorder project.
- Create/update/delete/reorder skill.
- Export full database JSON.
- Validate and restore full database JSON.

Semua mutasi menghasilkan status/response terstruktur. Jangan bocorkan credentials, file path, stack trace, atau internal server details.

---

## 10. Aksesibilitas, Reliability, dan Performance

### Accessibility

- Semua kontrol dapat dipakai melalui keyboard.
- Setiap input memiliki label yang jelas; placeholder bukan pengganti label.
- Gunakan focus-visible state yang terlihat.
- Error dihubungkan dengan field terkait menggunakan atribut aksesibilitas yang sesuai.
- Dialog/drawer memiliki role, label, fokus, dan Escape behavior yang benar.
- Status sukses/gagal dapat dibaca screen reader melalui live region/toast yang aksesibel.
- Jangan mengandalkan warna saja untuk status.
- Hormati `prefers-reduced-motion`.

### Reliability

- Kegagalan baca/tulis file harus ditangani dengan pesan yang dapat ditindaklanjuti.
- File rusak tidak boleh otomatis ditimpa seed.
- Write harus atomik untuk mengurangi risiko JSON setengah tertulis.
- Operasi bersamaan tidak boleh menyebabkan perubahan yang lebih baru hilang pada operasi normal dalam satu process.
- Restore tidak boleh commit partial data.
- Semua bentuk output harus di-escape/render sebagai teks biasa; jangan menyuntikkan deskripsi portfolio sebagai HTML mentah.

### Performance

- Hindari client-side JavaScript yang berlebihan untuk konten statis.
- Gunakan Server Components untuk public content jika sesuai.
- Lazy-load gambar cover dan batasi dimensinya.
- Animasi hanya untuk state yang perlu dianimasikan.
- Jangan menambahkan visualisasi berat atau dependency besar tanpa manfaat yang jelas.

---

## 11. Error States dan Empty States

Terapkan pesan yang menjelaskan kondisi dan tindakan berikutnya:

- Database belum ada: buat dari seed secara otomatis.
- Database JSON invalid: beri error server yang jelas; jangan overwrite otomatis.
- Tidak ada experience/education/projects/skills: tampilkan empty state yang baik di Admin dan sembunyikan section publik terkait jika kosong.
- Form tidak valid: tandai field yang perlu diperbaiki; pertahankan input.
- Session expired: arahkan ke login dengan pesan yang jelas.
- Save gagal: data di form tetap ada, tampilkan error, jangan revalidate seolah berhasil.
- Restore invalid: tunjukkan error validasi dan jangan mengganti data saat ini.
- URL opsional kosong: sembunyikan link terkait di public page.
- Gambar cover gagal dimuat: gunakan fallback visual netral.

---

## 12. Acceptance Criteria (Definition of Done)

Aplikasi dinyatakan memenuhi MVP jika semua kriteria berikut lolos:

### Public

- [ ] `/` dapat diakses tanpa login dan tidak error saat dataset kosong atau sebagian data belum diisi.
- [ ] Profile, experience, education, projects, dan skills berasal dari JSON runtime, bukan konten hardcoded.
- [ ] Update di Admin terlihat di public page setelah save dan refresh tanpa rebuild.
- [ ] URL optional yang kosong tidak menampilkan link rusak.
- [ ] Detail project terbuka/tertutup melalui keyboard dan mouse; Escape menutupnya dan fokus kembali ke trigger.
- [ ] Command palette bekerja dengan `Ctrl+K` dan `Cmd+K`, pencarian, keyboard navigation, dan Escape.
- [ ] Tidak ada horizontal overflow pada viewport mobile umum.
- [ ] Reduced-motion setting dihormati.

### Admin CRUD

- [ ] Admin tidak dapat mengakses dashboard atau mutasi data tanpa session valid.
- [ ] Login/logout berfungsi dan session cookie mengikuti atribut keamanan yang ditentukan.
- [ ] Pemilik dapat create, edit, delete, dan reorder semua tipe data yang didukung.
- [ ] Semua input tervalidasi di server.
- [ ] Delete membutuhkan konfirmasi.
- [ ] Error save tidak menghilangkan input atau menampilkan sukses palsu.
- [ ] Tombol preview membuka public page.

### Storage & backup

- [ ] File runtime otomatis dibuat dari seed saat pertama dijalankan.
- [ ] Perubahan bertahan setelah restart pada environment dengan persistent filesystem.
- [ ] File invalid tidak ditimpa seed secara diam-diam.
- [ ] Export menghasilkan JSON yang dapat di-parse dan tidak memuat credential/session.
- [ ] Restore valid mengganti dataset secara atomik setelah backup otomatis dibuat.
- [ ] Restore invalid atau write failure tidak merusak data lama.
- [ ] Aplikasi menjelaskan persistence volume yang dibutuhkan untuk Docker.

### Quality gate

- [ ] Type-check, lint, dan production build berhasil atau setiap kegagalan yang sudah ada sebelumnya didokumentasikan dengan bukti.
- [ ] Unit/integration tests mencakup schema, storage, auth, CRUD minimal, export, dan restore jika test framework tersedia atau dapat dipasang tanpa konflik.
- [ ] README mencakup instalasi, dev, build/start, env variables, data path, seed, backup/restore, dan deployment limitation.
- [ ] Tidak ada secret hardcoded untuk production dan tidak ada error console yang jelas berasal dari implementasi baru.

---

## 13. Strategi Testing

### Unit tests

- Schema menerima dataset valid dan menolak data invalid.
- Slug/ID unik divalidasi.
- Date range divalidasi.
- Seed digunakan hanya saat runtime file tidak ada.
- JSON rusak menghasilkan error tanpa overwrite.
- Atomic write dan serialisasi write bekerja sebagaimana yang dapat diuji.
- Auth token ditolak bila signature invalid atau expired.
- Import invalid tidak mengganti database.

### Integration tests

- Login berhasil dan gagal sesuai konfigurasi.
- Request tanpa session ditolak pada semua operasi Admin sensitif.
- CRUD record mengubah JSON runtime dengan benar.
- Export dapat diparse sebagai JSON valid.
- Restore file valid mengganti dataset dan menyimpan backup lama.
- Restore file invalid mempertahankan data sebelumnya.
- Cache/revalidation membuat data baru tampil di halaman publik.

### Manual smoke test

1. Jalankan aplikasi dari kondisi belum punya runtime JSON.
2. Login ke Admin menggunakan environment lokal.
3. Ubah nama/headline profil dan verifikasi di `/`.
4. Tambah, edit, reorder, dan hapus satu experience.
5. Tambah project dengan architecture flow dan buka drawer publiknya.
6. Export backup, ubah data, lalu restore backup dan cek hasilnya.
7. Coba restore JSON invalid dan pastikan data saat ini tetap utuh.
8. Logout lalu pastikan halaman/mutasi Admin tidak bisa dipakai tanpa login.
9. Periksa layout mobile, keyboard navigation, Escape, dan reduced motion.
10. Restart aplikasi dan pastikan data tetap tersedia pada storage persisten.

---

## 14. Environment Variables

Sediakan `.env.example` tanpa secret asli dengan variabel yang relevan, minimal:

```dotenv
# Required for production. In local development only, a documented fallback may be allowed.
ADMIN_PASSWORD=
# Long, random secret used to sign the admin session cookie.
ADMIN_SESSION_SECRET=
# Optional; defaults to ./data/portfolio-db.json relative to process.cwd().
PORTFOLIO_DB_PATH=./data/portfolio-db.json
# Optional; enable explicit dev-only fallback for admin password if desired.
ALLOW_DEFAULT_ADMIN_PASSWORD=false
```

Aturan:

- Jangan commit `.env.local` atau secret.
- `.env.example` hanya berisi placeholder.
- `admin123` hanya dapat digunakan jika aplikasi secara eksplisit berada di development dan fallback diizinkan; tidak boleh diam-diam menjadi kredensial production.
- Validasi environment saat startup atau pada auth initialization dan berikan error yang aman serta jelas.

---

## 15. Rekomendasi Struktur Folder

Sesuaikan dengan struktur repository saat ini, tetapi pisahkan concern secara jelas. Contoh:

```text
src/
  app/
    page.tsx
    admin/
      page.tsx
    api/
      admin/
        login/route.ts        # jika memilih Route Handler untuk auth
        logout/route.ts       # jika diperlukan
        export/route.ts
        restore/route.ts
  components/
    portfolio/
    admin/
    ui/
  data/
    portfolio-db.seed.json
  lib/
    portfolio-schema.ts
    portfolio-store.ts       # server-only
    auth.ts                  # server-only
    validation.ts
    utils.ts
data/
  portfolio-db.json          # runtime; jangan dijadikan seed
  backups/                   # opsional; backup runtime restore
```

Folder dan route dapat berubah sesuai konvensi Next.js yang digunakan. Prioritasnya adalah pemisahan yang jelas antara public UI, admin UI, schema, auth, data store, dan runtime persistence.

---

## 16. README dan Handover

README minimal harus menjelaskan:

1. Prasyarat dan cara install dependency.
2. Cara menjalankan development server dan production build/start.
3. Cara mengatur `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, dan `PORTFOLIO_DB_PATH`.
4. Perilaku seed data dan lokasi JSON runtime.
5. Cara login pertama kali dan logout.
6. Cara melakukan export dan restore dari halaman Admin.
7. Cara backup file secara manual.
8. Cara mount persistent volume bila menggunakan Docker.
9. Batasan bahwa filesystem JSON tidak cocok untuk serverless/ephemeral storage.
10. Perintah lint, type-check, test, dan build yang benar-benar tersedia.
11. Known limitations yang belum diselesaikan—jangan menyembunyikan fitur yang belum jadi.

---

## 17. Final Handover dari Hermes Agent

Setelah implementasi, laporkan secara ringkas namun konkret:

- Fitur yang telah selesai.
- File/area utama yang dibuat atau diubah.
- Perintah yang dijalankan untuk lint, test, type-check, dan build beserta hasil aktual.
- Cara menjalankan aplikasi dan mengatur login Admin.
- Lokasi database JSON runtime dan cara memastikan datanya persisten.
- Batasan atau pekerjaan yang belum selesai.

Jangan mengklaim test berhasil jika tidak dijalankan. Jangan meninggalkan tombol yang terlihat aktif tetapi tidak melakukan apa-apa. Jika ada bagian yang belum dapat dituntaskan, selesaikan sebanyak mungkin bagian independen dan tandai sisanya secara jujur.

---

## 18. Ringkasan Prioritas Implementasi

Urutan praktis yang disarankan:

1. **Repository audit + application shell.**
2. **Canonical schema + seed + JSON store + atomic persistence.**
3. **Admin auth + server-side route protection.**
4. **Admin Profile + CRUD Experience/Education/Projects/Skills.**
5. **Backup export + validated restore + automatic pre-restore backup.**
6. **Public sections driven by real runtime data.**
7. **Project drawer + command palette + motion/accessibility.**
8. **Responsive polish, error/empty states, documentation.**
9. **Automated/manual testing, production build, final report.**

**Prinsip keputusan akhir:** fitur yang benar-benar berfungsi, data yang tidak mudah rusak, admin yang terlindungi, dan UI yang matang lebih penting daripada efek visual atau abstraksi berlebihan.
