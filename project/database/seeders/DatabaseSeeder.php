<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Guest;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@asteria.test'],
            [
                'name' => 'Maya Perera',
                'role' => 'admin',
                'job_title' => 'Hotel Operations Director',
                'phone' => '+94 77 555 1010',
                'is_active' => true,
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );

        $staff = User::updateOrCreate(
            ['email' => 'desk@asteria.test'],
            [
                'name' => 'Ruwan Fernando',
                'role' => 'staff',
                'job_title' => 'Front Desk Supervisor',
                'phone' => '+94 77 555 2020',
                'is_active' => true,
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );

        $roomTypeBlueprints = [
            [
                'code' => 'DLX',
                'name' => 'Deluxe King',
                'base_rate' => 18500,
                'max_adults' => 2,
                'max_children' => 1,
                'bed_configuration' => '1 King Bed',
                'size_sqm' => 34,
                'amenities' => ['Sea-view balcony', 'Rain shower', 'Smart TV', 'Nespresso station'],
                'rooms' => ['DLX-01', 'DLX-02', 'DLX-03', 'DLX-04'],
            ],
            [
                'code' => 'FAM',
                'name' => 'Family Twin',
                'base_rate' => 24500,
                'max_adults' => 3,
                'max_children' => 2,
                'bed_configuration' => '2 Queen Beds',
                'size_sqm' => 42,
                'amenities' => ['Lounge nook', 'Kids welcome kit', 'Mini fridge', 'Fast Wi-Fi'],
                'rooms' => ['FAM-01', 'FAM-02', 'FAM-03'],
            ],
            [
                'code' => 'STE',
                'name' => 'Harbour Suite',
                'base_rate' => 42000,
                'max_adults' => 2,
                'max_children' => 2,
                'bed_configuration' => '1 King Bed + Lounge',
                'size_sqm' => 58,
                'amenities' => ['Private lounge', 'Butler pantry', 'Bathtub', 'Sunset terrace'],
                'rooms' => ['STE-01', 'STE-02'],
            ],
        ];

        foreach ($roomTypeBlueprints as $blueprint) {
            $roomType = RoomType::updateOrCreate(
                ['code' => $blueprint['code']],
                [
                    'name' => $blueprint['name'],
                    'slug' => Str::slug($blueprint['name']),
                    'description' => $blueprint['name'].' configured for a premium city-stay experience.',
                    'base_rate' => $blueprint['base_rate'],
                    'max_adults' => $blueprint['max_adults'],
                    'max_children' => $blueprint['max_children'],
                    'bed_configuration' => $blueprint['bed_configuration'],
                    'size_sqm' => $blueprint['size_sqm'],
                    'amenities' => $blueprint['amenities'],
                    'is_active' => true,
                ],
            );

            foreach ($blueprint['rooms'] as $index => $roomNumber) {
                Room::updateOrCreate(
                    ['room_number' => $roomNumber],
                    [
                        'room_type_id' => $roomType->id,
                        'floor' => $index < 2 ? 2 : 3,
                        'status' => match ($roomNumber) {
                            'DLX-04' => 'vacant_dirty',
                            'STE-02' => 'maintenance',
                            default => 'vacant_clean',
                        },
                        'rate_override' => null,
                        'notes' => $roomNumber === 'STE-02' ? 'Refreshing marble vanity before peak season.' : null,
                    ],
                );
            }
        }

        $demoBookings = [
            [
                'reference' => 'AST-2026-001',
                'guest' => [
                    'first_name' => 'Nimal',
                    'last_name' => 'Silva',
                    'email' => 'nimal.silva@example.com',
                    'phone' => '+94 71 555 7788',
                    'nationality' => 'Sri Lankan',
                ],
                'booked_by' => $staff->id,
                'check_in' => now()->addDays(1)->toDateString(),
                'check_out' => now()->addDays(4)->toDateString(),
                'arrival_time' => '14:00',
                'adults' => 2,
                'children' => 0,
                'status' => 'confirmed',
                'source' => 'direct',
                'special_requests' => 'Airport pickup required for a late-night arrival.',
                'internal_notes' => 'VIP repeat guest. Offer lounge access at check-in.',
                'items' => [
                    ['code' => 'DLX', 'quantity' => 1, 'guests' => 2],
                ],
            ],
            [
                'reference' => 'AST-2026-002',
                'guest' => [
                    'first_name' => 'Charlotte',
                    'last_name' => 'Weber',
                    'email' => 'charlotte.weber@example.com',
                    'phone' => '+49 170 555 3456',
                    'nationality' => 'German',
                ],
                'booked_by' => $admin->id,
                'check_in' => now()->toDateString(),
                'check_out' => now()->addDays(2)->toDateString(),
                'arrival_time' => '16:30',
                'adults' => 2,
                'children' => 1,
                'status' => 'checked_in',
                'source' => 'agency',
                'special_requests' => 'Feather-free pillows for the child.',
                'internal_notes' => 'Travelling with stroller. Reserve corner room near lift.',
                'items' => [
                    ['code' => 'FAM', 'quantity' => 1, 'guests' => 3],
                ],
            ],
            [
                'reference' => 'AST-2026-003',
                'guest' => [
                    'first_name' => 'Harini',
                    'last_name' => 'Jayasekara',
                    'email' => 'harini.jayasekara@example.com',
                    'phone' => '+94 76 555 1122',
                    'nationality' => 'Sri Lankan',
                ],
                'booked_by' => $staff->id,
                'check_in' => now()->addDays(6)->toDateString(),
                'check_out' => now()->addDays(9)->toDateString(),
                'arrival_time' => '12:00',
                'adults' => 2,
                'children' => 0,
                'status' => 'pending',
                'source' => 'corporate',
                'special_requests' => 'Boardroom access on arrival day.',
                'internal_notes' => 'Awaiting finance approval from corporate travel desk.',
                'items' => [
                    ['code' => 'STE', 'quantity' => 1, 'guests' => 2],
                ],
            ],
        ];

        foreach ($demoBookings as $blueprint) {
            $guest = Guest::updateOrCreate(
                ['email' => $blueprint['guest']['email']],
                $blueprint['guest'],
            );

            $checkIn = Carbon::parse($blueprint['check_in']);
            $checkOut = Carbon::parse($blueprint['check_out']);
            $nights = max(1, $checkIn->diffInDays($checkOut));
            $totalAmount = collect($blueprint['items'])->sum(function (array $item) use ($nights) {
                $roomType = RoomType::where('code', $item['code'])->first();

                return $roomType ? ((float) $roomType->base_rate * $item['quantity'] * $nights) : 0;
            });

            $booking = Booking::updateOrCreate(
                ['booking_reference' => $blueprint['reference']],
                [
                    'guest_id' => $guest->id,
                    'booked_by_id' => $blueprint['booked_by'],
                    'guest_name' => $guest->full_name,
                    'guest_email' => $guest->email,
                    'guest_phone' => $guest->phone,
                    'check_in' => $blueprint['check_in'],
                    'check_out' => $blueprint['check_out'],
                    'arrival_time' => $blueprint['arrival_time'],
                    'adults' => $blueprint['adults'],
                    'children' => $blueprint['children'],
                    'status' => $blueprint['status'],
                    'source' => $blueprint['source'],
                    'total_amount' => $totalAmount,
                    'special_requests' => $blueprint['special_requests'],
                    'internal_notes' => $blueprint['internal_notes'],
                ],
            );

            $booking->items()->delete();

            foreach ($blueprint['items'] as $item) {
                $roomType = RoomType::where('code', $item['code'])->first();

                if (! $roomType) {
                    continue;
                }

                BookingItem::create([
                    'booking_id' => $booking->id,
                    'room_type_id' => $roomType->id,
                    'quantity' => $item['quantity'],
                    'guests' => $item['guests'],
                    'nightly_rate' => $roomType->base_rate,
                    'notes' => 'Seeded demonstration reservation line.',
                ]);
            }
        }
    }
}
