<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\StaffUserController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth', 'role:admin,staff'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('bookings', BookingController::class)->except(['show']);

    Route::middleware('role:admin')->group(function () {
        Route::resource('room-types', RoomTypeController::class)->except(['show']);
        Route::resource('rooms', RoomController::class)->except(['show']);
        Route::resource('staff', StaffUserController::class)->parameters([
            'staff' => 'staff',
        ])->except(['show']);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
