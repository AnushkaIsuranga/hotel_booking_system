<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $now = now();

        $payload = [
            'name' => 'Admin',
            'password' => Hash::make('Admin@123'),
            'updated_at' => $now,
        ];

        if (Schema::hasColumn('users', 'email_verified_at')) {
            $payload['email_verified_at'] = $now;
        }

        if (Schema::hasColumn('users', 'role')) {
            $payload['role'] = 'admin';
        }

        if (Schema::hasColumn('users', 'job_title')) {
            $payload['job_title'] = 'System Administrator';
        }

        if (Schema::hasColumn('users', 'is_active')) {
            $payload['is_active'] = true;
        }

        DB::table('users')->updateOrInsert(
            ['email' => 'admin@123.com'],
            array_merge(['created_at' => $now], $payload)
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')
            ->where('email', 'admin@123.com')
            ->delete();
    }
};
