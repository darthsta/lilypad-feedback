<?php

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/feedback', function (Request $request) {
    $query = Feedback::query();

    // Check if a 'rating' query parameter is provided
    if ($request->has('rating')) {
        $query->where('rating', $request->input('rating'));
    }

    return response()->json(
        $query->orderBy('created_at', 'desc')->take(10)->get()
    );
});

Route::post('/feedback', function (Request $request) {
    $validated = $request->validate([
        'customer_name' => 'required|string|max:255',
        'message' => 'required|string',
        'rating' => 'required|integer|between:1,5'
    ]);
    $feedback = Feedback::create($validated);
    if ($feedback) {
        return response()->json(['message' => 'Feedback received'], 201);
    } else {
        return response()->json(['message' => 'Failed to save feedback'], 501);
    }
});

