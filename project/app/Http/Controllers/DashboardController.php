<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = today();
        $roomStatusCounts = Room::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $totalRooms = Room::query()->count();
        $occupiedRooms = (int) ($roomStatusCounts['occupied'] ?? 0);
        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;

        $arrivalsToday = Booking::query()
            ->whereDate('check_in', $today)
            ->whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->count();

        $departuresToday = Booking::query()
            ->whereDate('check_out', $today)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->count();

        $activeStays = Booking::query()
            ->where('status', 'checked_in')
            ->count();

        $monthlyRevenue = (float) Booking::query()
            ->whereBetween('check_in', [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()])
            ->whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        $upcomingArrivals = Booking::query()
            ->with(['items.roomType'])
            ->whereDate('check_in', '>=', $today)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('check_in')
            ->limit(5)
            ->get()
            ->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'guest_name' => $booking->guest_name,
                'check_in' => $booking->check_in?->format('M d, Y'),
                'status' => $booking->status,
                'arrival_time' => $booking->arrival_time,
                'room_summary' => $booking->items
                    ->map(fn ($item) => "{$item->quantity} x {$item->roomType?->name}")
                    ->implode(', '),
            ]);

        $recentBookings = Booking::query()
            ->with(['bookedBy', 'items.roomType'])
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'guest_name' => $booking->guest_name,
                'status' => $booking->status,
                'source' => $booking->source,
                'check_in' => $booking->check_in?->format('M d'),
                'check_out' => $booking->check_out?->format('M d'),
                'total_amount' => (float) $booking->total_amount,
                'booked_by' => $booking->bookedBy?->name,
            ]);

        $roomTypeSnapshot = RoomType::query()
            ->withCount('rooms')
            ->orderBy('base_rate')
            ->get()
            ->map(fn (RoomType $roomType) => [
                'id' => $roomType->id,
                'name' => $roomType->name,
                'code' => $roomType->code,
                'base_rate' => (float) $roomType->base_rate,
                'rooms_count' => $roomType->rooms_count,
                'reserved_rooms' => (int) $roomType->bookingItems()
                    ->whereHas('booking', function ($query) use ($today) {
                        $query
                            ->whereDate('check_in', '<=', $today)
                            ->whereDate('check_out', '>', $today)
                            ->whereIn('status', ['confirmed', 'checked_in']);
                    })
                    ->sum('quantity'),
            ]);

        return Inertia::render('dashboard', [
            'summary' => [
                'occupancy_rate' => $occupancyRate,
                'arrivals_today' => $arrivalsToday,
                'departures_today' => $departuresToday,
                'active_stays' => $activeStays,
                'monthly_revenue' => $monthlyRevenue,
                'total_rooms' => $totalRooms,
            ],
            'room_statuses' => [
                'vacant_clean' => (int) ($roomStatusCounts['vacant_clean'] ?? 0),
                'vacant_dirty' => (int) ($roomStatusCounts['vacant_dirty'] ?? 0),
                'occupied' => (int) ($roomStatusCounts['occupied'] ?? 0),
                'maintenance' => (int) ($roomStatusCounts['maintenance'] ?? 0),
                'out_of_service' => (int) ($roomStatusCounts['out_of_service'] ?? 0),
            ],
            'upcoming_arrivals' => $upcomingArrivals,
            'recent_bookings' => $recentBookings,
            'room_type_snapshot' => $roomTypeSnapshot,
        ]);
    }
}
