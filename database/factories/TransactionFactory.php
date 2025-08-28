<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'description' => $this->faker->sentence(3),
            'amount' => $this->faker->randomFloat(2, 5, 500),
            'transaction_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'reference' => $this->faker->optional()->regexify('[A-Z0-9]{8}'),
            'notes' => $this->faker->optional()->paragraph(),
        ];
    }
}