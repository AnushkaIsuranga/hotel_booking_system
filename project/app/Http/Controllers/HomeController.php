<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $upcomingReservations = Booking::query()
            ->whereDate('check_in', '>=', today())
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        $roomStatusCounts = Room::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('welcome', [
            'heroStats' => [
                'room_types' => RoomType::query()->count(),
                'rooms' => Room::query()->count(),
                'upcoming_reservations' => $upcomingReservations,
                'rooms_ready' => (int) ($roomStatusCounts['vacant_clean'] ?? 0),
            ],
        ]);
    }
}
