# InKreate

Plateforme collaborative de narration interactive. Le frontend est servi avec **Laravel + Inertia.js (React)** directement dans `backend/`.

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

## FAQ / Prépa présentation

### Architecture & stack
- Backend : Laravel 12 (PHP 8.3), Sanctum, Eloquent, PostgreSQL (ou SQLite pour dev rapide).
- Front : Inertia + React (Vite) servi depuis `backend/`.
- Fichiers : disque `public` (storage/app/public → public/storage), upload via `/api/uploads/images`.
- Auth : Sanctum, profils, follow/following, chat.

### Fonctionnalités clés
- Stories collaboratives, segments avec choix, navigation (Back/Next historique + branches).
- Favoris, read-later, ratings, commentaires.
- Chat limité aux followers/following, unread badge.
- Thèmes light/dark, i18n (en/fr) sur les pages principales.
- Activité : perso + réseau (onglet Network Activity avec toggle followers/following).

### Graphes narratifs
- Endpoint : `GET /api/stories/{story}/graph` (SegmentGraph) renvoie nodes/edges/indegrees pour visualiser/valider les branches.

### Images
- Upload : `/api/uploads/images` (auth) → URL absolue.
- Stockage local : `storage/app/public/uploads` (symlink `public/storage`).
- `.env` à vérifier : `APP_URL=http://127.0.0.1:8000`, `FILESYSTEM_DISK=public`.

### Plugins / libs utilisés (et pourquoi)
- **Inertia + React + Vite** : garde l’expérience SPA (routing client, hooks) tout en utilisant le routage Laravel côté serveur. Pas de CORS/API séparée pour les pages Inertia, session/CSRF partagés, build unifié dans `backend/`.
- **Laravel Sanctum** : auth simple pour SPA/HTTP-only cookies.
- CSS modules, hooks maison : pas de dépendances UI lourdes pour rester léger.

### Structures de données utilisées (et pourquoi)
- **Graphe orienté (SegmentGraph)** : modélise les segments et choix comme un graphe (listes d’adjacence). Permet de valider/visualiser les branches, et sert l’endpoint `/api/stories/{story}/graph` pour le front.
- **Listes chaînées** : sont utilisées pour contenir les noms de collaborateurs, les genres d'histoire et les choix ajoutés dans des "chips". Pratique pour pouvoir ajouter et enlever des éléments à n'importe quel endroit dans la liste.
- **Listes d’adjacence** (choices → next_segment_id) : sérialisables facilement, efficaces pour les parcours.
- **Caches/états locaux** : historique de navigation (Back/Next), sets des segments éditables pour afficher rapidement les actions sans re-fetch.

### Choix base de données (et pourquoi)
- **PostgreSQL** : robuste, types riches (JSON pour métadonnées), transactions fiables, aligné avec une cible prod réaliste.  
- **SQLite** : support dev/CI ultra rapide (zéro config). Abstraction via Eloquent pour rester agnostique.

### Questions fréquentes
- Pourquoi PostgreSQL ? Robustesse, JSON, cohérence avec prod. SQLite ok pour démo.
- Sécurité uploads ? Validation mimetype/taille dans UploadController, stockage public (contexte démo).
- Performance ? Pagination sur `/api/stories`, relations lazy, possibilité de cache LRU si besoin.
- Droits d’édition ? Auteur du segment ou propriétaire de l’histoire (vérifié côté front + API).
- Navigation segments ? Historique Back/Next et choix dirigent vers les branches.
- Chat ? Limité au réseau (followers/following) pour éviter le spam.
- i18n ? Clés dans `resources/js/inkreate/i18n/translations.js`, switch dans Settings.

### Scripts utiles
- Lancer API : `cd backend && php artisan serve`
- Front dev : `cd backend && npm run dev`
- Build : `cd backend && npm run build`
- Migrer/seed : `cd backend && php artisan migrate --seed` (adapter la BDD dans `.env`)

### Dépannage rapide
- Images cassées : `php artisan storage:link`, vérifier `APP_URL`, relancer le front.
- 500 favoris/read-later : vérifier token (login), voir console réseau.
- Profil vide : relancer front après build et vérifier erreurs JS.
- Graph vide : s’assurer que l’histoire a des segments/choices ; sinon la graph list sera minimale.

## Design patterns implémentés
- **Strategy (modération de texte)**  
  - Interface `App\Services\Moderation\ModerationStrategy` avec l’implémentation par défaut `BasicBlacklistStrategy`.  
  - Le service `App\Services\TextModerator` délègue désormais la modération à la stratégie injectée (bind dans `App\Providers\AppServiceProvider`).  
  ```php
  // app/Providers/AppServiceProvider.php
  $this->app->bind(ModerationStrategy::class, BasicBlacklistStrategy::class);

  // app/Services/TextModerator.php
  public function __construct(private ModerationStrategy $strategy) {}
  public function filter(string $text): array {
      return $this->strategy->filter($text);
  }
  ```

- **Repository / Query Object léger (stories/segments)**  
  - `App\Repositories\StoryRepository` encapsule pagination/filtrage (+ chargement des root segments).  
  - `App\Repositories\SegmentRepository` centralise les requêtes de segments (racine ou enfants) et le chargement complet d’un segment.  
  - Les contrôleurs utilisent les repositories pour alléger la logique :  
  ```php
  // app/Http/Controllers/API/StoryController.php
  public function __construct(private StoryRepository $stories) {}
  public function index(Request $request) {
      return StoryResource::collection(
          $this->stories->paginate($request->only([...]), $request->integer('per_page', 12), $request->boolean('with_root'))
      );
  }

  // app/Http/Controllers/API/SegmentController.php
  public function __construct(private SegmentRepository $segments) {}
  public function index(Request $request, Story $story) {
      return SegmentResource::collection($this->segments->listForStory($story, $request->integer('parent_segment_id')));
  }
  ```

- **Composite (hiérarchie de dossiers et fichiers du projet)**
