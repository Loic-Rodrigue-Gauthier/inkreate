# InKreate

Plateforme collaborative de narration interactive. Le frontend est maintenant servi avec **Laravel + Inertia.js (React)** directement dans `backend/` (plus de SPA séparée dans `src/inkreate`).

## Stack rapide
- Backend : Laravel 12, Sanctum, Eloquent, SQLite par défaut.
- Frontend : Inertia + React via Vite (entrée `resources/js/app.jsx`).
- Docs métier : voir `doc/`.

## Prérequis
- PHP 8.2+ avec extensions `openssl`, `fileinfo`, `pdo_sqlite`.
- Node 18+ / npm.
- SQLite activé (ou configurez une autre base dans `.env`).

## Mise en route
```bash
cd backend
php ../composer install          # utilise le binaire composer fourni à la racine
cp .env.example .env             # déjà présent avec APP_KEY, vérifiez DB_DATABASE=database/database.sqlite
php artisan migrate --seed       # crée les tables + admin de démo admin@example.com / password
npm install
npm run dev                      # Vite (Inertia)
php artisan serve                # Laravel
```
Ouvrez http://127.0.0.1:8000 : la page est rendue via Inertia/React.

## Ajouter des pages Inertia
- Créez vos pages dans `backend/resources/js/Pages/*.jsx`.
- Mappez-les dans `backend/routes/web.php` avec `Inertia::render('NomDePage')`.
- Les props partagées (auth, flash) sont configurées dans `app/Http/Middleware/HandleInertiaRequests.php`.

## API
Les routes REST restent dans `backend/routes/api.php` (auth, stories, segments, interactions sociales, chat). Configurez `VITE_API_URL` si vous appelez l’API depuis vos pages Inertia.

## Tests
```bash
cd backend
php artisan test
```

## Ressources utiles
- Documents : `doc/Document de definition.docx`, `doc/Document de conception.docx`
- Contrôleurs API : `backend/app/Http/Controllers/API/*`
- Modèles/migrations : `backend/app/Models`, `backend/database/migrations`
