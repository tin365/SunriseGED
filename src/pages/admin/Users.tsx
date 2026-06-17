import AdminLayout from '../../layouts/AdminLayout';

const roleBadge: Record<string, string> = {
  super_admin: 'bg-sun/15 text-sun-deep border-sun/30',
  editor: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  viewer: 'bg-ink/8 text-ink-soft border-line-strong'
};

const team = [{ name: 'Sunrise Administrator', email: 'admin@sunrisegeded.org', role: 'super_admin', status: 'Active' }];

export default function AdminUsers() {
  return (
    <AdminLayout title="Users" description="Admin accounts and their roles. Super admins can invite users, change roles, and reset 2FA.">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {team.map((u) => (
                <tr className="border-b border-line/70 last:border-0" key={u.email}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-dawn text-sm font-bold text-white">{u.name.charAt(0)}</span>
                      <span className="font-semibold text-ink">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={['inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', roleBadge[u.role] || roleBadge.viewer].join(' ')}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-ink-soft"><span className="h-2 w-2 rounded-full bg-emerald-500" />{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        Roles: <strong className="font-semibold text-ink-soft">super_admin</strong> (full access) · <strong className="font-semibold text-ink-soft">editor</strong> (content) · <strong className="font-semibold text-ink-soft">viewer</strong> (read-only).
      </p>
    </AdminLayout>
  );
}
