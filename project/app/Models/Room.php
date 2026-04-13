<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUSES = [
        'vacant_clean',
        'vacant_dirty',
        'occupied',
        'maintenance',
        'out_of_service',
    ];

    protected $fillable = [
        'room_type_id',
        'room_number',
        'floor',
        'status',
        'rate_override',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'rate_override' => 'decimal:2',
        ];
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function bookingItems(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }
}
