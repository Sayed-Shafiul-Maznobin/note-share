# NoteShare

A simple, elegant note-sharing platform. Admins upload files (images, PDFs, documents); clients browse, preview, and download them.

## Features

- **Authentication** — Register, login, JWT session cookies
- **Role-based access** — Admin (upload/delete) and Client (view/download)
- **File support** — Images, PDFs, Word, Excel, PowerPoint, text, ZIP
- **Preview** — In-browser preview for images and PDFs
- **Download** — One-click file downloads

## Quick Start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Admin Account

- **Email:** `admin@notes.com`
- **Password:** `admin123`

New registrations create **Client** accounts. Only admins can upload and delete files.

## Environment

Copy `.env` and set:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-random-secret-here"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Sync database schema |
| `npm run db:seed` | Seed admin user |
"# note-share" 
