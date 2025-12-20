<?php

namespace App\Services\Moderation;

class BasicBlacklistStrategy implements ModerationStrategy
{
    /**
     * A minimal bilingual blacklist to honour the definition document.
     *
     * @var list<string>
     */
    private array $blockedPhrases = [
        'idiot',
        'stupid',
        'noob',
        'bête',
        'gros mot',
        'maudit',
    ];

    public function filter(string $text): array
    {
        $patterns = array_map(
            fn (string $phrase) => '/' . preg_quote($phrase, '/') . '/i',
            $this->blockedPhrases,
        );

        $flagged = false;
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text)) {
                $flagged = true;
                break;
            }
        }

        $cleanText = preg_replace($patterns, '***', $text);

        return [
            'text' => $cleanText ?? $text,
            'flagged' => $flagged,
        ];
    }
}
