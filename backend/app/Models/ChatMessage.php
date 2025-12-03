<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'user_id',
        'body',
        'attachments',
        'is_system',
    ];

    protected $casts = [
        'attachments' => 'array',
        'is_system' => 'boolean',
    ];

    public function thread(): BelongsTo
    {
        return $this->belongsTo(ChatThread::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
