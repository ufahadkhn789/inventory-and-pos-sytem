<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ims.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@ims.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
                'role' => 'manager',
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@ims.com'],
            [
                'name' => 'Staff User',
                'password' => Hash::make('password'),
                'role' => 'staff',
            ]
        );
    }
}
