<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            ['type' => 'asset', 'subtype' => 'cash', 'name' => 'Cash'],
            ['type' => 'asset', 'subtype' => 'bank', 'name' => 'Checking Account'],
            ['type' => 'asset', 'subtype' => 'bank', 'name' => 'Savings Account'],
            ['type' => 'asset', 'subtype' => 'ewallet', 'name' => 'PayPal'],
            ['type' => 'revenue', 'subtype' => 'income', 'name' => 'Salary'],
            ['type' => 'expense', 'subtype' => 'expense_category', 'name' => 'Groceries'],
            ['type' => 'expense', 'subtype' => 'expense_category', 'name' => 'Transportation'],
            ['type' => 'expense', 'subtype' => 'expense_category', 'name' => 'Utilities'],
        ];

        $accountType = $this->faker->randomElement($types);

        return [
            'user_id' => User::factory(),
            'name' => $accountType['name'],
            'type' => $accountType['type'],
            'subtype' => $accountType['subtype'],
            'balance' => $this->faker->randomFloat(2, 0, 10000),
            'description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}