"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Tabs(){
  const pathname = usePathname();
  const tabs = [
    { href: '/', label: 'Dashboard' },
    { href: '/students', label: 'Students' },
    { href: '/leaders', label: 'Leaders' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/attendance', label: 'Attendance' },
    { href: '/kiosk', label: 'Kiosk' },
    { href: '/reports', label: 'Reports' },
  ];
  return (
    <nav className="ml-auto flex gap-1 p-1 rounded-lg bg-white/70 dark:bg-gray-800/70 ring-1 ring-gray-200 dark:ring-gray-700 backdrop-blur">
      {tabs.map(t=> (
        <Link key={t.href} href={(t.href as any)} className={`nav-link ${pathname===t.href ? 'bg-brand-600 text-white' : ''}`}>{t.label}</Link>
      ))}
    </nav>
  );
} 