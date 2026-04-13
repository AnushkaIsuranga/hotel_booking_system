<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Guest;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $bookings = Booking::query()
            ->with(['items.roomType', 'bookedBy'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($bookingQuery) use ($search) {
                    $bookingQuery
                        ->where('booking_reference', 'like', "%{$search}%")
                        ->orWhere('guest_name', 'like', "%{$search}%")
                        ->orWhere('guest_email', 'like', "%{$search}%")
                        ->orWhere('guest_phone', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->orderByDesc('check_in')
            ->get()
            ->map(fn (Booking $booking) => $this->transformBooking($booking));

        $statusCounts = Booking::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'filters' => $filters,
            'statusOptions' => $this->statusOptions(),
            'summary' => [
                'total' => $bookings->count(),
                'pending' => (int) ($statusCounts['pending'] ?? 0),
                'confirmed' => (int) ($statusCounts['confirmed'] ?? 0),
                'checked_in' => (int) ($statusCounts['checked_in'] ?? 0),
                'checked_out' => (int) ($statusCounts['checked_out'] ?? 0),
            ],
            'canDelete' => $request->user()?->isAdmin() ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('bookings/form', [
            'mode' => 'create',
            'booking' => $this->defaultBookingPayload(),
            ...$this->formDependencies(),
            'canDelete' => false,
            'canEditStatus' => true,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateBooking($request);
        $normalized = $this->normalizeBookingPayload($data);

        $this->ensureAvailability($normalized['items'], $normalized['check_in'], $normalized['check_out']);

        DB::transaction(function () use ($normalized, $request) {
            $guest = $this->upsertGuest($normalized['guest']);

            $booking = Booking::create([
                'booking_reference' => $this->generateBookingReference(),
                'guest_id' => $guest->id,
                'booked_by_id' => $request->user()?->id,
                'guest_name' => $guest->full_name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'check_in' => $normalized['check_in'],
                'check_out' => $normalized['check_out'],
                'arrival_time' => $normalized['arrival_time'],
                'adults' => $normalized['adults'],
                'children' => $normalized['children'],
                'status' => $normalized['status'],
                'source' => $normalized['source'],
                'total_amount' => $normalized['total_amount'],
                'special_requests' => $normalized['special_requests'],
                'internal_notes' => $normalized['internal_notes'],
            ]);

            foreach ($normalized['items'] as $item) {
                $booking->items()->create($item);
            }
        });

        return redirect()->route('bookings.index')->with('message', 'Reservation created successfully.')->with('success', true);
    }

    public function edit(Request $request, Booking $booking): Response
    {
        $booking->load(['guest', 'items.roomType']);

        return Inertia::render('bookings/form', [
            'mode' => 'edit',
            'booking' => [
                'id' => $booking->id,
                'booking_reference' => $booking->booking_reference,
                'guest' => [
                    'first_name' => $booking->guest?->first_name ?? Str::of($booking->guest_name)->before(' ')->value(),
                    'last_name' => $booking->guest?->last_name ?? Str::of($booking->guest_name)->after(' ')->value(),
                    'email' => $booking->guest_email ?? '',
                    'phone' => $booking->guest_phone ?? '',
                    'nationality' => $booking->guest?->nationality ?? '',
                ],
                'check_in' => $booking->check_in?->format('Y-m-d'),
                'check_out' => $booking->check_out?->format('Y-m-d'),
                'arrival_time' => $booking->arrival_time ?? '',
                'adults' => (string) $booking->adults,
                'children' => (string) $booking->children,
                'status' => $booking->status,
                'source' => $booking->source,
                'total_amount' => (string) $booking->total_amount,
                'special_requests' => $booking->special_requests ?? '',
                'internal_notes' => $booking->internal_notes ?? '',
                'items' => $booking->items->map(fn (BookingItem $item) => [
                    'room_type_id' => (string) $item->room_type_id,
                    'quantity' => (string) $item->quantity,
                    'nightly_rate' => (string) $item->nightly_rate,
                    'guests' => (string) $item->guests,
                    'notes' => $item->notes ?? '',
                ])->values(),
            ],
            ...$this->formDependencies(),
            'canDelete' => $request->user()?->isAdmin() ?? false,
            'canEditStatus' => true,
        ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $data = $this->validateBooking($request);
        $normalized = $this->normalizeBookingPayload($data);

        $this->ensureAvailability($normalized['items'], $normalized['check_in'], $normalized['check_out'], $booking);

        DB::transaction(function () use ($booking, $normalized) {
            $guest = $this->upsertGuest($normalized['guest']);

            $booking->update([
                'guest_id' => $guest->id,
                'guest_name' => $guest->full_name,
                'guest_email' => $guest->email,
                'guest_phone' => $guest->phone,
                'check_in' => $normalized['check_in'],
                'check_out' => $normalized['check_out'],
                'arrival_time' => $normalized['arrival_time'],
                'adults' => $normalized['adults'],
                'children' => $normalized['children'],
                'status' => $normalized['status'],
                'source' => $normalized['source'],
                'total_amount' => $normalized['total_amount'],
                'special_requests' => $normalized['special_requests'],
                'internal_notes' => $normalized['internal_notes'],
            ]);

            $booking->items()->delete();

            foreach ($normalized['items'] as $item) {
                $booking->items()->create($item);
            }
        });

        return redirect()->route('bookings.index')->with('message', 'Reservation updated successfully.')->with('success', true);
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->update([
            'status' => 'cancelled',
        ]);

        $booking->delete();

        return redirect()->route('bookings.index')->with('message', 'Reservation archived successfully.')->with('success', true);
    }

    private function validateBooking(Request $request): array
    {
        return $request->validate([
            'guest.first_name' => ['required', 'string', 'max:100'],
            'guest.last_name' => ['nullable', 'string', 'max:100'],
            'guest.email' => ['nullable', 'email', 'max:255'],
            'guest.phone' => ['required', 'string', 'max:30'],
            'guest.nationality' => ['nullable', 'string', 'max:100'],
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'arrival_time' => ['nullable', 'date_format:H:i'],
            'adults' => ['required', 'integer', 'min:1', 'max:10'],
            'children' => ['required', 'integer', 'min:0', 'max:10'],
            'status' => ['required', Rule::in(Booking::STATUSES)],
            'source' => ['required', Rule::in(Booking::SOURCES)],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'special_requests' => ['nullable', 'string', 'max:2000'],
            'internal_notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:10'],
            'items.*.nightly_rate' => ['nullable', 'numeric', 'min:0'],
            'items.*.guests' => ['required', 'integer', 'min:1', 'max:10'],
            'items.*.notes' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function normalizeBookingPayload(array $data): array
    {
        $roomTypes = RoomType::query()
            ->whereIn('id', collect($data['items'])->pluck('room_type_id'))
            ->get()
            ->keyBy('id');

        $items = collect($data['items'])
            ->filter(fn ($item) => filled($item['room_type_id'] ?? null))
            ->map(function ($item) use ($roomTypes) {
                $roomType = $roomTypes[(int) $item['room_type_id']] ?? null;

                return [
                    'room_type_id' => (int) $item['room_type_id'],
                    'quantity' => (int) $item['quantity'],
                    'guests' => (int) $item['guests'],
                    'nightly_rate' => (float) (($item['nightly_rate'] ?? '') !== '' ? $item['nightly_rate'] : ($roomType?->base_rate ?? 0)),
                    'notes' => $item['notes'] ?: null,
                ];
            })
            ->values()
            ->all();

        $nights = max(1, Carbon::parse($data['check_in'])->diffInDays(Carbon::parse($data['check_out'])));
        $calculatedTotal = collect($items)->sum(fn ($item) => $item['quantity'] * $item['nightly_rate'] * $nights);

        return [
            'guest' => $data['guest'],
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'arrival_time' => $data['arrival_time'] ?: null,
            'adults' => (int) $data['adults'],
            'children' => (int) $data['children'],
            'status' => $data['status'],
            'source' => $data['source'],
            'total_amount' => (float) (($data['total_amount'] ?? '') !== '' ? $data['total_amount'] : $calculatedTotal),
            'special_requests' => $data['special_requests'] ?: null,
            'internal_notes' => $data['internal_notes'] ?: null,
            'items' => $items,
        ];
    }

    private function ensureAvailability(array $items, string $checkIn, string $checkOut, ?Booking $ignoreBooking = null): void
    {
        $messages = [];

        foreach ($items as $index => $item) {
            $inventory = Room::query()
                ->where('room_type_id', $item['room_type_id'])
                ->count();

            $reserved = BookingItem::query()
                ->where('room_type_id', $item['room_type_id'])
                ->whereHas('booking', function ($query) use ($checkIn, $checkOut, $ignoreBooking) {
                    $query
                        ->whereNull('deleted_at')
                        ->whereNotIn('status', ['cancelled', 'checked_out'])
                        ->where('check_in', '<', $checkOut)
                        ->where('check_out', '>', $checkIn);

                    if ($ignoreBooking) {
                        $query->whereKeyNot($ignoreBooking->id);
                    }
                })
                ->sum('quantity');

            $available = max($inventory - $reserved, 0);

            if ($item['quantity'] > $available) {
                $roomType = RoomType::find($item['room_type_id']);
                $messages["items.{$index}.quantity"] = "Only {$available} {$roomType?->name} room(s) are available for the selected dates.";
            }
        }

        if ($messages !== []) {
            throw ValidationException::withMessages($messages);
        }
    }

    private function upsertGuest(array $data): Guest
    {
        $guest = null;

        if (! empty($data['email'])) {
            $guest = Guest::query()->where('email', $data['email'])->first();
        }

        if (! $guest && ! empty($data['phone'])) {
            $guest = Guest::query()->where('phone', $data['phone'])->first();
        }

        if ($guest) {
            $guest->update($data);

            return $guest;
        }

        return Guest::create($data);
    }

    private function generateBookingReference(): string
    {
        do {
            $reference = 'AST-'.now()->format('ymd').'-'.Str::upper(Str::random(4));
        } while (Booking::withTrashed()->where('booking_reference', $reference)->exists());

        return $reference;
    }

    private function formDependencies(): array
    {
        return [
            'roomTypes' => RoomType::query()
                ->withCount('rooms')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn (RoomType $roomType) => [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'code' => $roomType->code,
                    'base_rate' => (float) $roomType->base_rate,
                    'max_adults' => $roomType->max_adults,
                    'max_children' => $roomType->max_children,
                    'rooms_count' => $roomType->rooms_count,
                ]),
            'statusOptions' => $this->statusOptions(),
            'sourceOptions' => collect(Booking::SOURCES)->map(fn ($source) => [
                'value' => $source,
                'label' => Str::headline(str_replace('_', ' ', $source)),
            ]),
        ];
    }

    private function defaultBookingPayload(): array
    {
        return [
            'guest' => [
                'first_name' => '',
                'last_name' => '',
                'email' => '',
                'phone' => '',
                'nationality' => '',
            ],
            'check_in' => now()->addDay()->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'arrival_time' => '14:00',
            'adults' => '2',
            'children' => '0',
            'status' => 'confirmed',
            'source' => 'direct',
            'total_amount' => '',
            'special_requests' => '',
            'internal_notes' => '',
            'items' => [
                [
                    'room_type_id' => '',
                    'quantity' => '1',
                    'nightly_rate' => '',
                    'guests' => '2',
                    'notes' => '',
                ],
            ],
        ];
    }

    private function transformBooking(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'guest_name' => $booking->guest_name,
            'guest_email' => $booking->guest_email,
            'guest_phone' => $booking->guest_phone,
            'check_in' => $booking->check_in?->format('M d, Y'),
            'check_out' => $booking->check_out?->format('M d, Y'),
            'arrival_time' => $booking->arrival_time,
            'status' => $booking->status,
            'source' => $booking->source,
            'total_amount' => (float) $booking->total_amount,
            'nights' => max(1, $booking->check_in?->diffInDays($booking->check_out) ?? 1),
            'booked_by' => $booking->bookedBy?->name,
            'items_summary' => $booking->items
                ->map(fn (BookingItem $item) => "{$item->quantity} x {$item->roomType?->name}")
                ->implode(', '),
        ];
    }

    private function statusOptions()
    {
        return collect(Booking::STATUSES)->map(fn ($status) => [
            'value' => $status,
            'label' => Str::headline(str_replace('_', ' ', $status)),
        ]);
    }
}
