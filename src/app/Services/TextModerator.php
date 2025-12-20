<?php

namespace App\Services;

use App\Services\Moderation\ModerationStrategy;

class TextModerator
{
    public function __construct(private ModerationStrategy $strategy)
    {
    }

    /**
     * Filter the provided text and return both the sanitized string and whether it was flagged.
     *
     * @return array{text: string, flagged: bool}
     */
    public function filter(string $text): array
    {
        return $this->strategy->filter($text);
    }
}
