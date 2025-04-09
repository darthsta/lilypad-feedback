<?php

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;


Route::get('/feedback', function () {
    return response()->json(
        App\Models\Feedback::get()
    );
});

Route::post('/feedback', function (Request $request) {
    $validated = $request->validate([
        'customer_name' => 'required|string|max:255',
        'message' => 'required|string',
        'rating' => 'required|integer|between:1,5'
    ]);

    return response()->json(['message' => 'Feedback received'], 201);
});