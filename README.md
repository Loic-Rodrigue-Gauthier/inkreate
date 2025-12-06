# InKreate

Plateforme collaborative de narration interactive. Le frontend est maintenant servi avec **Laravel + Inertia.js (React)** directement dans `backend/` (plus de SPA séparée dans `src/inkreate`).

## Stack rapide
- Backend : Laravel 12, Sanctum, Eloquent, SQLite par défaut.
- Frontend : Inertia + React via Vite 
- Docs métier : voir `doc/`.

## Prérequis
- PHP 8.2+ 
- Node 18+ / npm.
- SQLite activé 

## Mise en route
```bash
cd backend
php ../composer install          # utilise le binaire composer fourni à la racine
npm install
npm run dev                      # Vite (Inertia)
php artisan serve                # Laravel
```
Ouvrez http://127.0.0.1:8000 : la page est rendue via Inertia/React.

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
