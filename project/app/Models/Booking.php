<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUSES = [
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
    ];

    public const SOURCES = [
        'direct',
        'phone',
        'walk_in',
        'agency',
        'corporate',
    ];

    protected $fillable = [
        'booking_reference',
        'guest_id',
        'booked_by_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'check_in',
        'check_out',
        'arrival_time',
        'adults',
        'children',
        'status',
        'source',
        'total_amount',
        'special_requests',
        'internal_notes',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'date:Y-m-d',
            'check_out' => 'date:Y-m-d',
            'total_amount' => 'decimal:2',
        ];
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function bookedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'booked_by_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }
}
