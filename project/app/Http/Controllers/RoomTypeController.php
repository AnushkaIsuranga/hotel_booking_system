<?php

namespace App\Http\Controllers;

use App\Models\BookingItem;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoomTypeController extends Controller
{
    public function index(): Response
    {
        $roomTypes = RoomType::query()
            ->withCount('rooms')
            ->orderBy('name')
            ->get()
            ->map(function (RoomType $roomType) {
                $futureReservations = BookingItem::query()
                    ->where('room_type_id', $roomType->id)
                    ->whereHas('booking', function ($query) {
                        $query
                            ->whereNull('deleted_at')
                            ->whereDate('check_out', '>=', today())
                            ->whereNotIn('status', ['cancelled', 'checked_out']);
                    })
                    ->sum('quantity');

                return [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'code' => $roomType->code,
                    'base_rate' => (float) $roomType->base_rate,
                    'max_adults' => $roomType->max_adults,
                    'max_children' => $roomType->max_children,
                    'bed_configuration' => $roomType->bed_configuration,
                    'size_sqm' => $roomType->size_sqm,
                    'rooms_count' => $roomType->rooms_count,
                    'future_reservations' => (int) $futureReservations,
                    'is_active' => $roomType->is_active,
                    'amenities' => $roomType->amenities ?? [],
                ];
            });

        return Inertia::render('room-types/index', [
            'roomTypes' => $roomTypes,
            'summary' => [
                'active_types' => $roomTypes->where('is_active', true)->count(),
                'inventory' => $roomTypes->sum('rooms_count'),
                'average_rate' => round($roomTypes->avg('base_rate') ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('room-types/form', [
            'mode' => 'create',
            'roomType' => $this->defaultPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        RoomType::create($this->validatedPayload($request));

        return redirect()->route('room-types.index')->with('message', 'Room type created successfully.')->with('success', true);
    }

    public function edit(RoomType $roomType): Response
    {
        return Inertia::render('room-types/form', [
            'mode' => 'edit',
            'roomType' => [
                'id' => $roomType->id,
                'name' => $roomType->name,
                'code' => $roomType->code,
                'base_rate' => (string) $roomType->base_rate,
                'max_adults' => (string) $roomType->max_adults,
                'max_children' => (string) $roomType->max_children,
                'bed_configuration' => $roomType->bed_configuration ?? '',
                'size_sqm' => $roomType->size_sqm ? (string) $roomType->size_sqm : '',
                'description' => $roomType->description ?? '',
                'amenities' => implode(', ', $roomType->amenities ?? []),
                'is_active' => $roomType->is_active,
            ],
        ]);
    }

    public function update(Request $request, RoomType $roomType): RedirectResponse
    {
        $roomType->update($this->validatedPayload($request, $roomType));

        return redirect()->route('room-types.index')->with('message', 'Room type updated successfully.')->with('success', true);
    }

    public function destroy(RoomType $roomType): RedirectResponse
    {
        $roomType->delete();

        return redirect()->route('room-types.index')->with('message', 'Room type archived successfully.')->with('success', true);
    }

    private function validatedPayload(Request $request, ?RoomType $roomType = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'max:10', Rule::unique(RoomType::class, 'code')->ignore($roomType?->id)],
            'base_rate' => ['required', 'numeric', 'min:0'],
            'max_adults' => ['required', 'integer', 'min:1', 'max:8'],
            'max_children' => ['required', 'integer', 'min:0', 'max:8'],
            'bed_configuration' => ['nullable', 'string', 'max:120'],
            'size_sqm' => ['nullable', 'integer', 'min:10', 'max:300'],
            'description' => ['nullable', 'string', 'max:2000'],
            'amenities' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['required', 'boolean'],
        ]);

        $slug = Str::slug($data['name']);

        if (RoomType::query()->where('slug', $slug)->when($roomType, fn ($query) => $query->whereKeyNot($roomType->id))->exists()) {
            $slug = Str::slug($data['name'].' '.$data['code']);
        }

        return [
            'name' => $data['name'],
            'slug' => $slug,
            'code' => Str::upper($data['code']),
            'base_rate' => $data['base_rate'],
            'max_adults' => $data['max_adults'],
            'max_children' => $data['max_children'],
            'bed_configuration' => $data['bed_configuration'] ?: null,
            'size_sqm' => $data['size_sqm'] ?: null,
            'description' => $data['description'] ?: null,
            'amenities' => collect(explode(',', (string) ($data['amenities'] ?? '')))
                ->map(fn ($item) => trim($item))
                ->filter()
                ->values()
                ->all(),
            'is_active' => $data['is_active'],
        ];
    }

    private function defaultPayload(): array
    {
        return [
            'name' => '',
            'code' => '',
            'base_rate' => '',
            'max_adults' => '2',
            'max_children' => '0',
            'bed_configuration' => '',
            'size_sqm' => '',
            'description' => '',
            'amenities' => '',
            'is_active' => true,
        ];
    }
}
