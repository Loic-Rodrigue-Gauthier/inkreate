<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload an image to the public disk and return its URL.
     */
    public function storeImage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'image', 'max:4096'],
        ]);

        $file = $data['file'];
        $path = $file->storeAs(
            'uploads',
            Str::uuid() . '.' . $file->getClientOriginalExtension(),
            'public',
        );

        $relativeUrl = Storage::disk('public')->url($path);
        $absoluteUrl = rtrim(config('app.url') ?: url('/'), '/') . $relativeUrl;

        return response()->json([
            'url' => $absoluteUrl,
            'path' => $path,
        ], 201);
    }
}
