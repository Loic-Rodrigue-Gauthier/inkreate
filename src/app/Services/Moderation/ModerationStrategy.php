<?php

namespace App\Services\Moderation;

interface ModerationStrategy
{
    /**
    * Analyze a text and return sanitized content plus a flag.
    *
    * @return array{text: string, flagged: bool}
    */
    public function filter(string $text): array;
}
