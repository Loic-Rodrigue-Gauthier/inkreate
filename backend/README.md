InKreate - Guide de démarrage complet
=====================================

Ce dépôt contient le backend Laravel + frontend Vite/React de l’application InKreate. Ce guide explique comment cloner, configurer l’environnement, préparer la base de données et lancer le projet de A à Z.

Prérequis
---------
- PHP 8.2+ avec les extensions `zip`, `openssl`, `pdo_sqlite` (ou `pdo_mysql` si vous utilisez MySQL) et `mbstring`.
- Composer (global) ou, à défaut, utilisez le binaire local `php composer.phar`.
- Node.js 20+ et npm.
- Git.

Installation
------------
1. Cloner le dépôt :
   ```bash
   git clone <url-du-repo> && cd InKreate/backend
   ```
2. Installer les dépendances PHP :
   ```bash
   composer install
   # ou si Composer n'est pas global :
   php composer.phar install
   ```
3. Installer les dépendances JS :
   ```bash
   npm install
   ```

Configuration de l’environnement
--------------------------------
1. Copier le fichier d’exemple :
   ```bash
   cp .env.example .env
   # Sous PowerShell : Copy-Item .env.example .env
   ```
2. Générer la clé applicative :
   ```bash
   php artisan key:generate
   ```

Base de données
---------------
- Par défaut, `.env` est configuré pour SQLite :
  - Créez le fichier : `database/database.sqlite`.
  - Vérifiez que `.env` contient :
    ```
    DB_CONNECTION=sqlite
    DB_DATABASE=database/database.sqlite
    DB_FOREIGN_KEYS=true
    ```
- Si vous préférez MySQL/PostgreSQL, ajustez les variables `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` dans `.env` puis commentez/supprimez les lignes SQLite.
- Appliquer les migrations :
  ```bash
  php artisan migrate
  ```

Lancer le projet en développement
---------------------------------
Dans deux terminaux séparés :
1. Backend API :
   ```bash
   php artisan serve
   # ou spécifier un port : php artisan serve --port=8000
   ```
2. Frontend Vite/React :
   ```bash
   npm run dev
   ```
   L’UI est servie par Vite (hot reload). Par défaut, Vite proxy l’API Laravel.

Build de production
-------------------
- Générer les assets :
  ```bash
  npm run build
  ```
- Les assets sont écrits dans `public/build` (déjà ignoré par git).

Notes utiles
------------
- Si l’extension `zip` n’est pas activée, ajoutez `extension=zip` dans votre `php.ini`.
- Les assets et le code React se trouvent dans `resources/js/inkreate`.
- Si vous utilisez le binaire local, remplacez `composer` par `php composer.phar` dans les commandes.
- En cas de changement de base de données, exécutez à nouveau `php artisan migrate` (et supprimez/vidangez l’ancienne base si nécessaire).
