<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\JournalEntry;
use App\Services\FinanceService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Demo User',
                'email' => 'demo@example.com',
            ]);
        }

        $financeService = new FinanceService();

        // Initialize default accounts
        $financeService->initializeUserAccounts($user->id);

        // Get the created accounts
        /** @var Account|null $cash */
        $cash = $user->accounts()->where('name', 'Cash')->first();
        /** @var Account|null $checking */
        $checking = $user->accounts()->where('name', 'Checking Account')->first();
        /** @var Account|null $salary */
        $salary = $user->accounts()->where('name', 'Salary')->first();
        /** @var Account|null $groceries */
        $groceries = $user->accounts()->where('name', 'Groceries')->first();
        /** @var Account|null $transportation */
        $transportation = $user->accounts()->where('name', 'Transportation')->first();

        // Skip if accounts not found
        if (!$cash || !$checking || !$salary || !$groceries || !$transportation) {
            return;
        }

        // Create some sample transactions
        $transactions = [
            [
                'description' => 'Monthly Salary',
                'amount' => 5000.00,
                'transaction_date' => now()->subDays(15)->format('Y-m-d'),
                'from_account_id' => $salary->id,
                'to_account_id' => $checking->id,
                'reference' => 'SAL001',
                'notes' => 'Monthly salary deposit',
            ],
            [
                'description' => 'ATM Withdrawal',
                'amount' => 200.00,
                'transaction_date' => now()->subDays(10)->format('Y-m-d'),
                'from_account_id' => $checking->id,
                'to_account_id' => $cash->id,
                'reference' => 'ATM001',
            ],
            [
                'description' => 'Grocery Shopping',
                'amount' => 85.50,
                'transaction_date' => now()->subDays(8)->format('Y-m-d'),
                'from_account_id' => $cash->id,
                'to_account_id' => $groceries->id,
                'notes' => 'Weekly grocery shopping at SuperMarket',
            ],
            [
                'description' => 'Gas Station',
                'amount' => 45.00,
                'transaction_date' => now()->subDays(5)->format('Y-m-d'),
                'from_account_id' => $checking->id,
                'to_account_id' => $transportation->id,
                'reference' => 'GAS001',
            ],
            [
                'description' => 'Online Grocery Order',
                'amount' => 120.75,
                'transaction_date' => now()->subDays(3)->format('Y-m-d'),
                'from_account_id' => $checking->id,
                'to_account_id' => $groceries->id,
                'notes' => 'Grocery delivery order',
            ],
            [
                'description' => 'Public Transit',
                'amount' => 25.00,
                'transaction_date' => now()->subDays(2)->format('Y-m-d'),
                'from_account_id' => $cash->id,
                'to_account_id' => $transportation->id,
                'notes' => 'Metro card reload',
            ],
        ];

        foreach ($transactions as $transactionData) {
            $financeService->createTransaction($transactionData);
        }
    }
}