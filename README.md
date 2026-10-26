# Personal Portfolio CMS

Fondasi data menggunakan Next.js App Router, TypeScript, dan Zod. Runtime JSON berada di `data/portfolio-db.json`; jika belum ada, file dibuat dari `src/data/portfolio-db.seed.json`. File rusak tidak ditimpa seed.

Jalankan:

`npm install`
`npm run dev`
`npm run type-check`
`npm test`
`npm run lint`
`npm run build`

Salin `.env.example` ke `.env.local`. Production wajib mengisi `ADMIN_PASSWORD` dan `ADMIN_SESSION_SECRET`. Fallback `admin123` hanya tersedia bila `NODE_ENV` bukan production dan `ALLOW_DEFAULT_ADMIN_PASSWORD=true`.

Store server-only melakukan schema validation, UUID stabil, CRUD primitives, atomic rename, serialisasi write per path, dan backup sebelum restore. Restore mengganti seluruh dataset setelah validasi berhasil. Endpoint data publik: `GET /api/admin/data`; replace restore terlindungi session di `PUT`; export terlindungi session di `GET /api/admin/export`.

Untuk Docker, gunakan `docker compose up --build` dengan `docker-compose.yml`. Compose memasang volume `portfolio-data` ke `/app/data`, sehingga `PORTFOLIO_DB_PATH=/app/data/portfolio-db.json` tetap ada saat container dibuat ulang. Set `ADMIN_PASSWORD` dan buat secret acak untuk `ADMIN_SESSION_SECRET` (contoh: `openssl rand -base64 32`); jangan commit nilai secret. Backup retention default adalah 30 file (`PORTFOLIO_BACKUP_RETENTION`), dan login dibatasi 5 kegagalan per 15 menit per forwarded IP (`LOGIN_RATE_LIMIT_MAX`, `LOGIN_RATE_LIMIT_WINDOW_SECONDS`). JSON lokal tidak cocok untuk serverless/ephemeral filesystem tanpa persistent storage.

UI Admin belum dibuat sesuai scope tahap ini.
