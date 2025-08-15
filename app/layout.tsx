import "./../styles/globals.css";
import { Tabs } from "./components/Tabs";

export const metadata = { title: "Sunday School UI Preview" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700" />
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="container flex items-center gap-4 py-4">
            <img src="/logo.png" className="logo" alt="Logo" style={{ height: 56 }} />
            <div>
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">Welcome to New City Sunday School</h1>
              <p className="text-sm opacity-70 -mt-1">Dashboard overview — verify attendance, track new visitors, and celebrate growth</p>
            </div>
            <Tabs />
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}