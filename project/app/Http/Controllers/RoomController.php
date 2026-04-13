<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        $rooms = Room::query()
            ->with('roomType')
            ->orderBy('room_number')
            ->get()
            ->map(fn (Room $room) => [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'floor' => $room->floor,
                'status' => $room->status,
                'rate_override' => $room->rate_override ? (float) $room->rate_override : null,
                'notes' => $room->notes,
                'room_type' => $room->roomType?->name,
                'room_type_id' => $room->room_type_id,
            ]);

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            'summary' => [
                'inventory' => $rooms->count(),
                'vacant_clean' => $rooms->where('status', 'vacant_clean')->count(),
                'occupied' => $rooms->where('status', 'occupied')->count(),
                'maintenance' => $rooms->where('status', 'maintenance')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('rooms/form', [
            'mode' => 'create',
            'room' => $this->defaultPayload(),
            ...$this->formDependencies(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Room::create($this->validatedPayload($request));

        return redirect()->route('rooms.index')->with('message', 'Room added successfully.')->with('success', true);
    }

    public function edit(Room $room): Response
    {
        return Inertia::render('rooms/form', [
            'mode' => 'edit',
            'room' => [
                'id' => $room->id,
                'room_type_id' => (string) $room->room_type_id,
                'room_number' => $room->room_number,
                'floor' => $room->floor ? (string) $room->floor : '',
                'status' => $room->status,
                'rate_override' => $room->rate_override ? (string) $room->rate_override : '',
                'notes' => $room->notes ?? '',
            ],
            ...$this->formDependencies(),
        ]);
    }

    public function update(Request $request, Room $room): RedirectResponse
    {
        $room->update($this->validatedPayload($request, $room));

        return redirect()->route('rooms.index')->with('message', 'Room updated successfully.')->with('success', true);
    }

    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return redirect()->route('rooms.index')->with('message', 'Room archived successfully.')->with('success', true);
    }

    private function validatedPayload(Request $request, ?Room $room = null): array
    {
        return $request->validate([
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'room_number' => ['required', 'string', 'max:20', Rule::unique(Room::class, 'room_number')->ignore($room?->id)],
            'floor' => ['nullable', 'integer', 'min:1', 'max:50'],
            'status' => ['required', Rule::in(Room::STATUSES)],
            'rate_override' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    private function defaultPayload(): array
    {
        return [
            'room_type_id' => '',
            'room_number' => '',
            'floor' => '',
            'status' => 'vacant_clean',
            'rate_override' => '',
            'notes' => '',
        ];
    }

    private function formDependencies(): array
    {
        return [
            'roomTypes' => RoomType::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'code'])
                ->map(fn (RoomType $roomType) => [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'code' => $roomType->code,
                ]),
            'statusOptions' => collect(Room::STATUSES)->map(fn ($status) => [
                'value' => $status,
                'label' => str($status)->replace('_', ' ')->headline()->value(),
            ]),
        ];
    }
}
