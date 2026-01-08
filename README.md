# InKreate
InKreate est un réseau social où les utilisateurs créer et contribuent à des histoires non-linéaires ensemble. Chaque bout d'histoire peut se continuer dans une multitude de directions dont l'une sera choisie par le lecteur.    
**Note: La version actuelle du projet est un produit minimum viable (MVP)**

## Contributions
Développé en tant que projet synthèse pour le DEC intensif en Techniques de l'informatique du CVM par Azeddine Zidi et Loïc Rodrigue-Gauthier.
- Laravel : Azeddine Zidi
- React : Loïc Rodrigue-Gauthier
- CSS : Azeddine Zidi et Loïc Rodrigue-Gauthier

## Stack rapide
- Back-end : Laravel 12, Sanctum, Eloquent, SQLite par défaut.
- Front-end : Inertia + React via Vite 
- Docs métier : voir `doc/`.

## Guide de demarrage complet (back-end + front-end)

Cette section liste les etapes pour installer et lancer le projet de A a Z, base de donnees incluse.

### Prerequis
- PHP 8.2+ avec les extensions `zip`, `openssl`, `pdo_sqlite` (ou `pdo_mysql` si vous utilisez MySQL), `fileinfo` et `mbstring`.
- Composer global, ou utiliser le binaire local `php backend/composer.phar`.
- Node.js 20+ et npm.
- SQLite activé 
- Git.

### Installation
1. Cloner le depot :
   ```bash
   git clone <url-du-repo> && cd .\backend\
   ```
2. Installer les dependances PHP :
   ```bash
   composer install
   # ou si Composer n'est pas global :
   php composer.phar install
   ```
3. Installer les dependances JS :
   ```bash
   npm install
   ```

### Configuration de l'environnement
1. Copier le fichier d'exemple :
   ```bash
   cp .env.example .env
   # Sous PowerShell : Copy-Item .env.example .env
   ```
2. Generer la cle applicative :
   ```bash
   php artisan key:generate
   ```

### Base de donnees
- Par defaut, `.env` est configure pour SQLite :
  - Creez le fichier : `database.sqlite` dans `database/`.
  - Verifiez que `.env` contient :
    ```
    DB_CONNECTION=sqlite
    DB_DATABASE=database/database.sqlite
    DB_FOREIGN_KEYS=true
    ```
- Si vous preferez MySQL/PostgreSQL, ajustez les variables `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` dans `.env`, puis commentez/supprimez les lignes SQLite.
- Appliquer les migrations :
  ```bash
  php artisan migrate
  ```

### Build de production
- Generer les assets :
  ```bash
  npm run build
  ```
- Les assets sont ecrits dans `public/build` (deja ignore par git).

### Lancer le projet en developpement
Dans deux terminaux separes :
1. Back-end API :
   ```bash
   php artisan serve
   # ou specifier un port : php artisan serve --port=8000
   ```
2. Front-end Vite/React :
   ```bash
   npm run dev
   ```
   L'UI est servie par Vite (hot reload). Par defaut, Vite proxy l'API Laravel.

## Mise en route (résumé)
```bash
cd backend
php ../composer install          # utilise le binaire composer fourni à la racine
npm install
npm run dev                      # Vite (Inertia)
php artisan serve                # Laravel
```
Ouvrez http://127.0.0.1:8000 : la page est rendue via Inertia/React.

## Ressources utiles
- Documents : `doc/Document de definition.docx`, `doc/Document de conception.docx`
- Contrôleurs API : `backend/app/Http/Controllers/API/*`
- Modèles/migrations : `backend/app/Models`, `backend/database/migrations`

## FAQ

### Architecture & stack
- Back-end : Laravel 12 (PHP 8.3), Sanctum, Eloquent, PostgreSQL (ou SQLite pour dev rapide).
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


### Scripts utiles
- Lancer API : `cd backend && php artisan serve`
- Front dev : `cd backend && npm run dev`
- Build : `cd backend && npm run build`
- Migrer/seed : `cd backend && php artisan migrate --seed` (adapter la BDD dans `.env`)


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


### Notes utiles
- Si l'extension `zip` n'est pas activee, ajoutez `extension=zip` dans votre `php.ini`.
- Les assets et le code React se trouvent dans `resources/js/inkreate`.
- Si vous utilisez le binaire local, remplacez `composer` par `php composer.phar` dans les commandes.
- En cas de changement de base de donnees, executez a nouveau `php artisan migrate` (et supprimez/vidangez l'ancienne base si necessaire).
