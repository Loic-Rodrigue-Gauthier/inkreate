<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Moderation\BasicBlacklistStrategy;
use App\Services\Moderation\ModerationStrategy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ModerationStrategy::class, BasicBlacklistStrategy::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
