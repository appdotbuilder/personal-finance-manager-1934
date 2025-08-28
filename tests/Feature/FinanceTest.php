<?php

use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use App\Services\FinanceService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('user can access finance dashboard', function () {
    $response = $this->actingAs($this->user)
        ->get(route('finance.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => 
        $page->component('finance/dashboard')
    );
});

test('user accounts are initialized on first visit', function () {
    expect($this->user->accounts)->toHaveCount(0);

    $this->actingAs($this->user)
        ->get(route('finance.index'));

    $this->user->refresh();
    expect($this->user->accounts()->count())->toBeGreaterThan(0);
});

test('user can create account', function () {
    $response = $this->actingAs($this->user)
        ->post(route('finance.store'), [
            'name' => 'Test Savings',
            'type' => 'asset',
            'subtype' => 'bank',
            'balance' => 1000.00,
            'description' => 'Test savings account',
        ]);

    $response->assertRedirect(route('finance.index'));

    $this->assertDatabaseHas('accounts', [
        'user_id' => $this->user->id,
        'name' => 'Test Savings',
        'type' => 'asset',
        'subtype' => 'bank',
    ]);
});

test('user can create transaction', function () {
    $financeService = new FinanceService();
    $financeService->initializeUserAccounts($this->user->id);

    $fromAccount = $this->user->accounts()->where('name', 'Checking Account')->first();
    $toAccount = $this->user->accounts()->where('name', 'Groceries')->first();

    $response = $this->actingAs($this->user)
        ->patch(route('finance.update'), [
            'description' => 'Test grocery purchase',
            'amount' => 50.00,
            'transaction_date' => now()->format('Y-m-d'),
            'from_account_id' => $fromAccount->id,
            'to_account_id' => $toAccount->id,
            'reference' => 'TEST001',
            'notes' => 'Test transaction',
        ]);

    $response->assertRedirect(route('finance.index'));

    $this->assertDatabaseHas('transactions', [
        'user_id' => $this->user->id,
        'description' => 'Test grocery purchase',
        'amount' => 50.00,
    ]);

    // Check journal entries were created
    $transaction = Transaction::where('user_id', $this->user->id)->first();
    expect($transaction->journalEntries)->toHaveCount(2);

    // Check account balances were updated
    $fromAccount->refresh();
    $toAccount->refresh();
    expect($fromAccount->balance)->toBe('-50.00');
    expect($toAccount->balance)->toBe('50.00');
});

test('user can delete transaction', function () {
    $financeService = new FinanceService();
    $financeService->initializeUserAccounts($this->user->id);

    $fromAccount = $this->user->accounts()->where('name', 'Checking Account')->first();
    $toAccount = $this->user->accounts()->where('name', 'Groceries')->first();

    // Create a transaction
    $transaction = $financeService->createTransaction([
        'description' => 'Test deletion transaction',
        'amount' => 100.00,
        'transaction_date' => now()->format('Y-m-d'),
        'from_account_id' => $fromAccount->id,
        'to_account_id' => $toAccount->id,
    ], $this->user->id);

    $response = $this->actingAs($this->user)
        ->delete(route('transactions.destroy', $transaction));

    $response->assertRedirect(route('finance.index'));

    $this->assertDatabaseMissing('transactions', [
        'id' => $transaction->id,
    ]);

    // Check balances were reset
    $fromAccount->refresh();
    $toAccount->refresh();
    expect($fromAccount->balance)->toBe('0.00');
    expect($toAccount->balance)->toBe('0.00');
});

test('user cannot access other users transactions', function () {
    $otherUser = User::factory()->create();
    $financeService = new FinanceService();
    $financeService->initializeUserAccounts($otherUser->id);

    $fromAccount = $otherUser->accounts()->where('name', 'Checking Account')->first();
    $toAccount = $otherUser->accounts()->where('name', 'Groceries')->first();

    $transaction = $financeService->createTransaction([
        'description' => 'Other user transaction',
        'amount' => 50.00,
        'transaction_date' => now()->format('Y-m-d'),
        'from_account_id' => $fromAccount->id,
        'to_account_id' => $toAccount->id,
    ], $otherUser->id);

    $response = $this->actingAs($this->user)
        ->delete(route('transactions.destroy', $transaction));

    $response->assertForbidden();
});

test('double entry accounting validation', function () {
    $financeService = new FinanceService();
    $financeService->initializeUserAccounts($this->user->id);

    $fromAccount = $this->user->accounts()->where('name', 'Checking Account')->first();
    $toAccount = $this->user->accounts()->where('name', 'Groceries')->first();

    $transaction = $financeService->createTransaction([
        'description' => 'Double entry test',
        'amount' => 100.00,
        'transaction_date' => now()->format('Y-m-d'),
        'from_account_id' => $fromAccount->id,
        'to_account_id' => $toAccount->id,
    ], $this->user->id);

    // Verify double-entry: total debits should equal total credits
    $totalDebits = $transaction->journalEntries()->where('type', 'debit')->sum('amount');
    $totalCredits = $transaction->journalEntries()->where('type', 'credit')->sum('amount');

    expect((float) $totalDebits)->toBe((float) $totalCredits);
    expect((float) $totalDebits)->toBe(100.00);
    expect((float) $totalCredits)->toBe(100.00);
});