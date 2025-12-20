<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Inkreate');
});

/**
 * Serve the Inertia SPA for any front-end route (React Router).
 * Excludes API and system paths.
 */
Route::get('/{view?}', function () {
    return Inertia::render('Inkreate');
})->where('view', '^(?!api|storage|vendor|_ignition).*$');
