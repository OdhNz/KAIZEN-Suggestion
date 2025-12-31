<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MainController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::group(['middleware' => ['throttle:web']], function () {
    Route::get('/', [MainController::class, 'index']);

    Route::any('{catchall}', [MainController::class, 'index'])->where(
        'catchall',
        '.*'
    );
});
// Route::any('{catchall}', [MainController::class, 'index']);

Route::get('/clear-cache', function () {
    $exitCode = Artisan::call('optimize:clear');
    return $exitCode;
});
