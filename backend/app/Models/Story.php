<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Story extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'owner_id',
        'title',
        'slug',
        'genre',
        'synopsis',
        'cover_image_url',
        'status',
        'is_public',
        'is_collaborative',
        'allow_forks',
        'min_age',
        'estimated_duration',
        'reading_count',
        'favorites_count',
        'segments_count',
        'rating_average',
        'rating_count',
        'tags',
        'content_warnings',
        'metadata',
        'published_at',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_collaborative' => 'boolean',
        'allow_forks' => 'boolean',
        'tags' => 'array',
        'content_warnings' => 'array',
        'metadata' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::created(function (Story $story): void {
            $story->owner()->increment('stories_count');
        });

        static::deleted(function (Story $story): void {
            if (! $story->isForceDeleting()) {
                return;
            }

            $story->owner()->decrement('stories_count');
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function segments(): HasMany
    {
        return $this->hasMany(Segment::class);
    }

    public function rootSegments(): HasMany
    {
        return $this->segments()->whereNull('parent_segment_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(StoryFavorite::class);
    }

    public function readingListItems(): HasMany
    {
        return $this->hasMany(ReadingListItem::class);
    }

    public function reads(): HasMany
    {
        return $this->hasMany(StoryRead::class);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['genre'] ?? null, fn (Builder $builder, string $genre) => $builder->where('genre', $genre))
            ->when($filters['status'] ?? null, fn (Builder $builder, string $status) => $builder->where('status', $status))
            ->when($filters['owner'] ?? null, fn (Builder $builder, int $ownerId) => $builder->where('owner_id', $ownerId))
            ->when($filters['min_rating'] ?? null, fn (Builder $builder, float $rating) => $builder->where('rating_average', '>=', $rating))
            ->when($filters['search'] ?? null, function (Builder $builder, string $term): Builder {
                $term = "%{$term}%";

                return $builder->where(function (Builder $inner) use ($term): void {
                    $inner->where('title', 'like', $term)
                        ->orWhere('synopsis', 'like', $term)
                        ->orWhereJsonContains('tags', str_replace('%', '', $term));
                });
            })
            ->when($filters['published_after'] ?? null, fn (Builder $builder, string $date) => $builder->whereDate('published_at', '>=', $date))
            ->when($filters['sort'] ?? null, function (Builder $builder, string $sort): Builder {
                return match ($sort) {
                    'popular' => $builder->orderByDesc('reading_count'),
                    'rated' => $builder->orderByDesc('rating_average'),
                    'favorites' => $builder->orderByDesc('favorites_count'),
                    'recent' => $builder->orderByDesc('published_at'),
                    default => $builder->orderByDesc('created_at'),
                };
            }, fn (Builder $builder) => $builder->latest());
    }
}
