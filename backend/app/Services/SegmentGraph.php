<?php

namespace App\Services;

use Illuminate\Support\Collection;

/**
 * Simple directed graph helper tailored for story segments.
 * Nodes = segment ids, Edges = choices that lead to next_segment_id.
 */
class SegmentGraph
{
    /**
    * @var array<int, array<int>> adjacency list keyed by segment id
    */
    protected array $edges = [];

    /**
    * @var array<int, int> indegree count for each node
    */
    protected array $indegrees = [];

    /**
    * @var array<int, bool> marker for nodes
    */
    protected array $nodes = [];

    public function addNode(int $id): void
    {
        if (! isset($this->nodes[$id])) {
            $this->nodes[$id] = true;
            $this->edges[$id] = $this->edges[$id] ?? [];
            $this->indegrees[$id] = $this->indegrees[$id] ?? 0;
        }
    }

    public function addEdge(int $from, int $to): void
    {
        $this->addNode($from);
        $this->addNode($to);

        // Avoid duplicates
        if (! in_array($to, $this->edges[$from], true)) {
            $this->edges[$from][] = $to;
            $this->indegrees[$to] = ($this->indegrees[$to] ?? 0) + 1;
        }
    }

    public function neighbors(int $id): array
    {
        return $this->edges[$id] ?? [];
    }

    public function indegree(int $id): int
    {
        return $this->indegrees[$id] ?? 0;
    }

    public function nodes(): array
    {
        return array_keys($this->nodes);
    }

    /**
     * Build a graph from a collection of segments eager-loaded with `choices`.
     */
    public static function fromSegments(Collection $segments): self
    {
        $graph = new self();
        foreach ($segments as $segment) {
            $graph->addNode((int) $segment->id);
            foreach ($segment->choices ?? [] as $choice) {
                if ($choice->next_segment_id) {
                    $graph->addEdge((int) $segment->id, (int) $choice->next_segment_id);
                }
            }
        }

        return $graph;
    }

    /**
     * Return a serializable representation (nodes + edges) for API/JS consumption.
     */
    public function toArray(): array
    {
        return [
            'nodes' => $this->nodes(),
            'edges' => $this->edges,
            'indegrees' => $this->indegrees,
        ];
    }
}
