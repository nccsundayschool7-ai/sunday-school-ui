import "./../styles/globals.css";
import Link from "next/link";

export const metadata = { title: "Sunday School UI Preview" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="container flex items-center gap-4 py-3">
            <img src="/logo.png" className="logo" alt="Logo" />
            <h1 className="font-bold text-lg">Sunday School — UI Preview</h1>
            <nav className="ml-auto flex gap-1">
              <Link href="/" className="nav-link">Dashboard</Link>
              <Link href="/students" className="nav-link">Students</Link>
              <Link href="/leaders" className="nav-link">Leaders</Link>
              <Link href="/lessons" className="nav-link">Lessons</Link>
              <Link href="/attendance" className="nav-link">Attendance</Link>
              <Link href="/kiosk" className="nav-link">Kiosk</Link>
              <Link href="/reports" className="nav-link">Reports</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}