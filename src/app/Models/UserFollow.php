<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFollow extends Model
{
    use HasFactory;

    protected $fillable = [
        'follower_id',
        'followed_id',
    ];

    protected static function booted(): void
    {
        static::created(function (UserFollow $follow): void {
            $follow->follower()->increment('following_count');
            $follow->followed()->increment('followers_count');
        });

        static::deleted(function (UserFollow $follow): void {
            $follow->follower()->decrement('following_count');
            $follow->followed()->decrement('followers_count');
        });
    }

    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function followed(): BelongsTo
    {
        return $this->belongsTo(User::class, 'followed_id');
    }
}
