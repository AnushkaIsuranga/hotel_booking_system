<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $legacyRoomInventories = Schema::hasTable('rooms') ? DB::table('rooms')->get() : collect();
        $legacyBookings = Schema::hasTable('bookings') ? DB::table('bookings')->get() : collect();

        $this->upgradeUsersTable();
        $this->createGuestsTable();
        $roomTypeMap = $this->rebuildRoomInventory($legacyRoomInventories);
        $this->rebuildBookings($legacyBookings, $roomTypeMap);
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_items');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('room_types');
        Schema::dropIfExists('guests');

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('number_of_guests');
            $table->integer('single_count')->default(0);
            $table->integer('double_count')->default(0);
            $table->integer('suite_count')->default(0);
            $table->time('arival_time');
            $table->text('special_requests')->nullable();
            $table->boolean('isDeleted')->default(false);
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_id')->unique();
            $table->decimal('price', 10, 2);
            $table->integer('initial_count');
            $table->integer('available_count');
            $table->integer('capacity')->default(1);
            $table->boolean('isDeleted')->default(false);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            foreach (['role', 'job_title', 'phone', 'is_active', 'last_login_at'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    private function upgradeUsersTable(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('staff')->after('email');
            }

            if (! Schema::hasColumn('users', 'job_title')) {
                $table->string('job_title')->nullable()->after('role');
            }

            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('job_title');
            }

            if (! Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('phone');
            }

            if (! Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('is_active');
            }
        });

        $users = DB::table('users')->orderBy('id')->get();

        foreach ($users as $index => $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'role' => $index === 0 ? 'admin' : 'staff',
                    'job_title' => $index === 0 ? 'General Manager' : 'Front Desk Associate',
                    'is_active' => true,
                ]);
        }
    }

    private function createGuestsTable(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable()->index();
            $table->string('nationality')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    private function rebuildRoomInventory(Collection $legacyRoomInventories): array
    {
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->decimal('base_rate', 10, 2)->default(0);
            $table->unsignedTinyInteger('max_adults')->default(2);
            $table->unsignedTinyInteger('max_children')->default(0);
            $table->string('bed_configuration')->nullable();
            $table->unsignedSmallInteger('size_sqm')->nullable();
            $table->json('amenities')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        if (Schema::hasTable('rooms')) {
            Schema::drop('rooms');
        }

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained('room_types')->restrictOnDelete();
            $table->string('room_number')->unique();
            $table->unsignedSmallInteger('floor')->nullable();
            $table->string('status')->default('vacant_clean');
            $table->decimal('rate_override', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        $roomTypeMap = [];

        foreach ($legacyRoomInventories as $legacyRoom) {
            $name = trim((string) $legacyRoom->room_id) ?: 'Room';
            $slug = Str::slug($name);
            $code = $this->deriveRoomTypeCode($name);
            $rate = (float) ($legacyRoom->price ?? 0);
            $maxAdults = max(1, min((int) ($legacyRoom->capacity ?? 2), 6));
            $totalRooms = max(1, (int) ($legacyRoom->initial_count ?? 1));
            $availableRooms = max(0, min($totalRooms, (int) ($legacyRoom->available_count ?? $totalRooms)));
            $occupiedRooms = $totalRooms - $availableRooms;

            $roomTypeId = DB::table('room_types')->insertGetId([
                'name' => Str::headline($name),
                'slug' => $slug,
                'code' => $this->ensureUniqueCode($code),
                'description' => sprintf('%s inventory imported from the original CRUD prototype.', Str::headline($name)),
                'base_rate' => $rate,
                'max_adults' => $maxAdults,
                'max_children' => 0,
                'bed_configuration' => $this->inferBedConfiguration($name),
                'size_sqm' => $this->inferRoomSize($name),
                'amenities' => json_encode($this->defaultAmenitiesFor($name)),
                'is_active' => ! ((bool) ($legacyRoom->isDeleted ?? false)),
                'created_at' => $legacyRoom->created_at ?? now(),
                'updated_at' => $legacyRoom->updated_at ?? now(),
            ]);

            $lookupKeys = array_unique(array_filter([
                Str::lower($name),
                $slug,
                $this->canonicalRoomLabel($name),
            ]));

            foreach ($lookupKeys as $lookupKey) {
                $roomTypeMap[$lookupKey] = [
                    'id' => $roomTypeId,
                    'rate' => $rate,
                    'code' => $code,
                ];
            }

            for ($index = 1; $index <= $totalRooms; $index++) {
                DB::table('rooms')->insert([
                    'room_type_id' => $roomTypeId,
                    'room_number' => sprintf('%s-%02d', $code, $index),
                    'floor' => (int) ceil($index / 10),
                    'status' => $index <= $occupiedRooms ? 'occupied' : 'vacant_clean',
                    'created_at' => $legacyRoom->created_at ?? now(),
                    'updated_at' => $legacyRoom->updated_at ?? now(),
                ]);
            }
        }

        return $roomTypeMap;
    }

    private function rebuildBookings(Collection $legacyBookings, array $roomTypeMap): void
    {
        if (Schema::hasTable('bookings')) {
            Schema::drop('bookings');
        }

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            $table->foreignId('guest_id')->constrained('guests')->restrictOnDelete();
            $table->foreignId('booked_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('guest_name');
            $table->string('guest_email')->nullable();
            $table->string('guest_phone')->nullable();
            $table->date('check_in');
            $table->date('check_out');
            $table->time('arrival_time')->nullable();
            $table->unsignedTinyInteger('adults')->default(1);
            $table->unsignedTinyInteger('children')->default(0);
            $table->string('status')->default('confirmed');
            $table->string('source')->default('direct');
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->text('special_requests')->nullable();
            $table->text('internal_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('room_type_id')->constrained('room_types')->restrictOnDelete();
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedTinyInteger('guests')->default(1);
            $table->decimal('nightly_rate', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        $defaultBookerId = DB::table('users')->orderBy('id')->value('id');
        $fallbackRoomType = DB::table('room_types')->orderBy('id')->first();

        foreach ($legacyBookings as $legacyBooking) {
            $checkIn = Carbon::parse($legacyBooking->check_in_date);
            $checkOut = Carbon::parse($legacyBooking->check_out_date);
            $nights = max(1, $checkIn->diffInDays($checkOut));
            $guestId = $this->resolveGuestId($legacyBooking);
            $status = (bool) ($legacyBooking->isDeleted ?? false)
                ? 'cancelled'
                : $this->inferBookingStatus($checkIn, $checkOut);

            $bookingId = DB::table('bookings')->insertGetId([
                'booking_reference' => sprintf('HTL-%05d', $legacyBooking->id),
                'guest_id' => $guestId,
                'booked_by_id' => $defaultBookerId,
                'guest_name' => trim((string) $legacyBooking->name) ?: 'Walk-in Guest',
                'guest_email' => $legacyBooking->email ?: null,
                'guest_phone' => $legacyBooking->phone ?: null,
                'check_in' => $checkIn->toDateString(),
                'check_out' => $checkOut->toDateString(),
                'arrival_time' => $legacyBooking->arival_time ?: null,
                'adults' => max(1, min((int) ($legacyBooking->number_of_guests ?? 1), 6)),
                'children' => 0,
                'status' => $status,
                'source' => 'phone',
                'total_amount' => 0,
                'special_requests' => $legacyBooking->special_requests ?: null,
                'internal_notes' => (bool) ($legacyBooking->isDeleted ?? false) ? 'Migrated from archived prototype booking.' : null,
                'created_at' => $legacyBooking->created_at ?? now(),
                'updated_at' => $legacyBooking->updated_at ?? now(),
                'deleted_at' => (bool) ($legacyBooking->isDeleted ?? false) ? ($legacyBooking->updated_at ?? now()) : null,
            ]);

            $bookingTotal = 0;
            $lines = [
                'single' => (int) ($legacyBooking->single_count ?? 0),
                'double' => (int) ($legacyBooking->double_count ?? 0),
                'suite' => (int) ($legacyBooking->suite_count ?? 0),
            ];

            foreach ($lines as $label => $quantity) {
                if ($quantity < 1) {
                    continue;
                }

                $roomType = $roomTypeMap[$label] ?? ($fallbackRoomType ? [
                    'id' => $fallbackRoomType->id,
                    'rate' => (float) $fallbackRoomType->base_rate,
                ] : null);

                if (! $roomType) {
                    continue;
                }

                $lineRate = (float) ($roomType['rate'] ?? 0);
                $lineTotal = $lineRate * $quantity * $nights;
                $bookingTotal += $lineTotal;

                DB::table('booking_items')->insert([
                    'booking_id' => $bookingId,
                    'room_type_id' => $roomType['id'],
                    'quantity' => $quantity,
                    'guests' => max(1, min((int) ($legacyBooking->number_of_guests ?? 1), 6)),
                    'nightly_rate' => $lineRate,
                    'notes' => sprintf('Imported %s allocation from the legacy room-count booking.', $label),
                    'created_at' => $legacyBooking->created_at ?? now(),
                    'updated_at' => $legacyBooking->updated_at ?? now(),
                ]);
            }

            if ($bookingTotal === 0 && $fallbackRoomType) {
                $fallbackRate = (float) $fallbackRoomType->base_rate;
                $bookingTotal = $fallbackRate * $nights;

                DB::table('booking_items')->insert([
                    'booking_id' => $bookingId,
                    'room_type_id' => $fallbackRoomType->id,
                    'quantity' => 1,
                    'guests' => max(1, min((int) ($legacyBooking->number_of_guests ?? 1), 6)),
                    'nightly_rate' => $fallbackRate,
                    'notes' => 'Fallback room allocation created during migration.',
                    'created_at' => $legacyBooking->created_at ?? now(),
                    'updated_at' => $legacyBooking->updated_at ?? now(),
                ]);
            }

            DB::table('bookings')->where('id', $bookingId)->update([
                'total_amount' => $bookingTotal,
            ]);
        }
    }

    private function resolveGuestId(object $legacyBooking): int
    {
        $name = trim((string) ($legacyBooking->name ?? 'Guest')) ?: 'Guest';
        $email = $legacyBooking->email ? Str::lower(trim((string) $legacyBooking->email)) : null;
        $phone = $legacyBooking->phone ? preg_replace('/\s+/', '', (string) $legacyBooking->phone) : null;
        $firstName = Str::of($name)->before(' ')->trim()->value() ?: 'Guest';
        $lastName = Str::of($name)->after(' ')->trim()->value();
        $lastName = $lastName === $name ? null : ($lastName ?: null);

        $existingGuest = null;

        if ($email) {
            $existingGuest = DB::table('guests')->where('email', $email)->first();
        }

        if (! $existingGuest && $phone) {
            $existingGuest = DB::table('guests')->where('phone', $phone)->first();
        }

        if ($existingGuest) {
            DB::table('guests')
                ->where('id', $existingGuest->id)
                ->update([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'phone' => $phone,
                    'updated_at' => now(),
                ]);

            return $existingGuest->id;
        }

        return DB::table('guests')->insertGetId([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'phone' => $phone,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function inferBookingStatus(Carbon $checkIn, Carbon $checkOut): string
    {
        $today = today();

        if ($checkOut->lt($today)) {
            return 'checked_out';
        }

        if ($checkIn->lte($today) && $checkOut->gt($today)) {
            return 'checked_in';
        }

        return 'confirmed';
    }

    private function canonicalRoomLabel(string $name): ?string
    {
        $slug = Str::slug($name);

        return match (true) {
            Str::contains($slug, 'single') => 'single',
            Str::contains($slug, 'double') => 'double',
            Str::contains($slug, 'suite') => 'suite',
            default => null,
        };
    }

    private function deriveRoomTypeCode(string $name): string
    {
        return match ($this->canonicalRoomLabel($name)) {
            'single' => 'SGL',
            'double' => 'DBL',
            'suite' => 'STE',
            default => Str::upper(Str::substr(preg_replace('/[^A-Za-z0-9]/', '', $name) ?: 'RM', 0, 3)),
        };
    }

    private function ensureUniqueCode(string $code): string
    {
        $candidate = $code;
        $suffix = 1;

        while (DB::table('room_types')->where('code', $candidate)->exists()) {
            $candidate = sprintf('%s%d', $code, $suffix);
            $suffix++;
        }

        return $candidate;
    }

    private function inferBedConfiguration(string $name): string
    {
        return match ($this->canonicalRoomLabel($name)) {
            'single' => '1 Twin Bed',
            'double' => '1 Queen Bed',
            'suite' => '1 King Bed + Lounge',
            default => '1 Queen Bed',
        };
    }

    private function inferRoomSize(string $name): int
    {
        return match ($this->canonicalRoomLabel($name)) {
            'single' => 24,
            'double' => 32,
            'suite' => 48,
            default => 30,
        };
    }

    private function defaultAmenitiesFor(string $name): array
    {
        return match ($this->canonicalRoomLabel($name)) {
            'suite' => ['Private lounge', 'Bathtub', 'Premium minibar', 'Balcony'],
            default => ['Smart TV', 'Rain shower', 'High-speed Wi-Fi', 'Workspace'],
        };
    }
};
