<?php

use App\Http\Controllers\FinanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('finance.index');
    })->name('dashboard');

    // Finance routes
    Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
    Route::post('/finance', [FinanceController::class, 'store'])->name('finance.store');
    Route::get('/finance/transactions', [FinanceController::class, 'show'])->name('finance.show');
    Route::get('/finance/accounts', [FinanceController::class, 'edit'])->name('finance.edit');
    Route::patch('/finance', [FinanceController::class, 'update'])->name('finance.update');
    Route::delete('/transactions/{transaction}', [FinanceController::class, 'destroy'])->name('transactions.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
