<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\KaizenFormController;
use App\Http\Controllers\KaizenListController;
use App\Http\Controllers\KaizenSysController;
use App\Http\Controllers\KaizenMasterCategory;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProxyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// header('Access-Control-Allow-Origin:  *');
// header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, DELETE');
// header(
//     'Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Origin, Authorization'
// );

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['throttle:common', 'xss.sanitizer'])->group(function () {
    Route::get('/fetchCategoryForm', [
        KaizenFormController::class,
        'fetchCategoryForm',
    ]);
    Route::post('/setKaizenForm', [
        KaizenFormController::class,
        'setKaizenForm',
    ]);
    Route::get('/getEmpno', [KaizenFormController::class, 'getEmpno']);
    Route::get('/fetchKaizenLocation', [
        KaizenSysController::class,
        'fetchKaizenLocation',
    ]);
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/logout', [LoginController::class, 'logout']);
});

Route::group(['middleware' => ['jwt', 'throttle:common']], function () {

    Route::get('/fetchKaizenCategory', [
        KaizenSysController::class,
        'fetchKaizenCategory',
    ]);
    Route::get('/fetchKaizenListData', [
        KaizenListController::class,
        'fetchKaizenListData',
    ]);
    Route::post('/kaizenSetStatus', [
        KaizenListController::class,
        'kaizenSetStatus',
    ]);
    Route::get('/fetchCategory', [
        KaizenMasterCategory::class,
        'fetchCategory',
    ]);
    Route::post('/setCategoryData', [
        KaizenMasterCategory::class,
        'setCategoryData',
    ]);

    Route::get('/fetchDashboardKaizen', [
        DashboardController::class,
        'fetchDashboardKaizen',
    ]);
});

Route::group(['middleware' => ['jwt', 'throttle:commonFile']], function () {
    Route::get('/fetchKaizenFile', [
        KaizenSysController::class,
        'fetchKaizenFile',
    ]);
    Route::get('/fetchDocumentDownload', [
        KaizenSysController::class,
        'fetchDocumentDownload',
    ]);
});

Route::post('/fetchKaizenFileBatch', [
    KaizenSysController::class,
    'fetchKaizenFileBatch',
]);

//Route::get('/proxy/image/{empid}', [ProxyController::class, 'profilePhoto']); 
Route::get('/proxy/file', [ProxyController::class, 'fetchByUrl']);
Route::get('/proxy/file-path', [ProxyController::class, 'fetchByPath']); 

Route::get('/fetchKaizenByCategory', [DashboardController::class, 'fetchKaizenByCategory']);

Route::get('/profile-photo/{empid}', [LoginController::class, 'showPhoto']);