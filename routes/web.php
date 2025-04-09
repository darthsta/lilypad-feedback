<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'feedback')->where('any', '^(?!api).*');
