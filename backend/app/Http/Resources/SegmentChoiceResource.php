<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SegmentChoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'segment_id' => $this->segment_id,
            'label' => $this->label,
            'position' => $this->position,
            'is_locked' => $this->is_locked,
            'next_segment_id' => $this->next_segment_id,
            'has_next_segment' => (bool) $this->next_segment_id,
        ];
    }
}
