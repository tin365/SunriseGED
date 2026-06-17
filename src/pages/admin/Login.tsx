import LoginForm from '../../components/admin/LoginForm';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';

export default function Login() {
  useDocumentMeta('Login | Sunrise Admin', undefined, true);
  return (
    <div
      className="grid min-h-screen place-items-center px-4 font-sans text-ink antialiased"
      style={{ background: 'radial-gradient(120% 90% at 50% -10%, #FCE8CD 0%, #FBF6EE 55%, #F2E7D5 100%)' }}
    >
      <main className="w-full max-w-sm py-10">
        <div className="flex flex-col items-center text-center">
          <img src="/Sunrise_logo.jpg" alt="Sunrise" className="h-20 w-20 rounded-full shadow-lift ring-1 ring-line-strong" />
          <p className="eyebrow is-centered mt-6">Admin Console</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-soft">Sign in to manage Sunrise GED.</p>
        </div>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-muted">Protected area · Sunrise Trauma Healing Education</p>
      </main>
    </div>
  );
}
