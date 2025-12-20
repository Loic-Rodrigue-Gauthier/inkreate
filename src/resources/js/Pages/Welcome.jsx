import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
  return (
    <>
      <Head title="Accueil" />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-slate-100">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <header className="flex items-center justify-between border-b border-white/10 pb-6">
            <h1 className="text-2xl font-semibold tracking-tight">InKreate (Inertia + Laravel + React)</h1>
            {auth?.user ? (
              <div className="text-sm text-emerald-200">
                Connecté en tant que <span className="font-semibold">{auth.user.display_name ?? auth.user.username}</span>
              </div>
            ) : null}
          </header>

          <div className="mt-10 grid gap-6 rounded-2xl bg-white/5 p-8 backdrop-blur">
            <p className="text-lg text-slate-200">
              Frontend rendu via Inertia.js. Utilise les routes Laravel pour servir les pages React.
            </p>
            <div className="grid gap-3 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                  1
                </span>
                <span>Lance Vite : <code className="font-mono">npm run dev</code> (dans <code className="font-mono">backend/</code>).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                  2
                </span>
                <span>Lance Laravel : <code className="font-mono">php artisan serve</code> puis ouvre <code className="font-mono">http://127.0.0.1:8000</code>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                  3
                </span>
                <span>Ajoute des pages React dans <code className="font-mono">resources/js/Pages</code> et mappe-les via <code className="font-mono">routes/web.php</code>.</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-emerald-400"
              >
                Page d&apos;accueil
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-white/40"
              >
                Ajouter vos routes ici
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
