
# Sunday School UI Preview (No Backend)

This is a **static UI prototype** for your Sunday School app. It uses **Next.js 14 + Tailwind** and loads **dummy data** from `/data/*.json` so you can approve the look & flow before we wire it to Supabase.

## Run Locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## What’s Included
- Dashboard with KPIs and group breakdown
- Students list + detail page
- Leaders list
- Lessons preview
- Attendance page (toggle present)
- Kiosk mode with graceful fullscreen (no camera in preview)
- Reports placeholder

## Next Steps (after UI approval)
- Connect to Supabase (schema + auth + storage)
- Enable camera QR scanner in Kiosk
- Implement Sunday-to-Sunday lock and edit logs
- Exports (Excel), Push/Email notifications, Offline sync

