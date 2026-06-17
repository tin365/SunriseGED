import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const cards = [
  { href: '/admin/posts', title: 'Posts', desc: 'Write and publish multilingual news, activities, and announcements.', icon: 'M14 3v4a1 1 0 0 0 1 1h4M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM8 13h8M8 17h6' },
  { href: '/admin/enrollments', title: 'Enrollments', desc: 'Review student applications and update their status.', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 13l2 2 4-4' },
  { href: '/admin/media', title: 'Media', desc: 'Upload photos and documents, or add YouTube videos.', icon: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 16l5-5 4 4 3-3 6 6M8.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' },
  { href: '/admin/users', title: 'Users', desc: 'Manage admin accounts, roles, and access.', icon: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0a3 3 0 1 0 0-6M3 20a6 6 0 0 1 12 0M15 14.5a6 6 0 0 1 6 5.5' },
  { href: '/admin/settings', title: 'Settings', desc: 'Change your password, enable 2FA, and school info.', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4.6 15a1.65 1.65 0 0 1-.33-1.82A1.65 1.65 0 0 0 3 12a1.65 1.65 0 0 0 1.27-1.18A1.65 1.65 0 0 0 4.6 9M19.4 9a1.65 1.65 0 0 0 .33 1.82A1.65 1.65 0 0 1 21 12a1.65 1.65 0 0 1-1.27 1.18A1.65 1.65 0 0 0 19.4 15' }
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Welcome back 🌅</h2>
        <p className="mt-2 text-ink-soft">Manage content, applications, and your team from here.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link to={c.href} key={c.href} className="card card-hover group flex flex-col p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun/12 text-ember transition-colors duration-300 group-hover:bg-dawn group-hover:text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{c.desc}</p>
            <span className="link-underline mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ember">
              Open
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
