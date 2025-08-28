<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    /**
     * Create a new transaction with double-entry bookkeeping.
     */
    public function createTransaction(array $data, ?int $userId = null): Transaction
    {
        return DB::transaction(function () use ($data, $userId) {
            // Create the transaction
            $transaction = Transaction::create([
                'user_id' => $userId ?? auth()->id(),
                'description' => $data['description'],
                'amount' => $data['amount'],
                'transaction_date' => $data['transaction_date'],
                'reference' => $data['reference'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Get the accounts
            $fromAccount = Account::find($data['from_account_id']);
            $toAccount = Account::find($data['to_account_id']);

            // Create journal entries (double-entry bookkeeping)
            // Credit the source account (money going out)
            JournalEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $fromAccount->id,
                'type' => 'credit',
                'amount' => $data['amount'],
            ]);

            // Debit the destination account (money coming in)
            JournalEntry::create([
                'transaction_id' => $transaction->id,
                'account_id' => $toAccount->id,
                'type' => 'debit',
                'amount' => $data['amount'],
            ]);

            // Update account balances
            $fromAccount->updateBalance();
            $toAccount->updateBalance();

            return $transaction->load('journalEntries.account');
        });
    }

    /**
     * Delete a transaction and update account balances.
     */
    public function deleteTransaction(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            // Get affected accounts before deleting
            $accountIds = $transaction->journalEntries->pluck('account_id')->unique();
            
            // Delete the transaction (journal entries will be cascade deleted)
            $transaction->delete();
            
            // Update balances for affected accounts
            Account::whereIn('id', $accountIds)->get()->each(function ($account) {
                $account->updateBalance();
            });
        });
    }

    /**
     * Get default accounts for a user.
     */
    public function getDefaultAccounts(int $userId): array
    {
        return [
            // Asset accounts
            [
                'user_id' => $userId,
                'name' => 'Cash',
                'type' => 'asset',
                'subtype' => 'cash',
                'balance' => 0,
                'description' => 'Cash on hand',
            ],
            [
                'user_id' => $userId,
                'name' => 'Checking Account',
                'type' => 'asset',
                'subtype' => 'bank',
                'balance' => 0,
                'description' => 'Primary bank checking account',
            ],
            [
                'user_id' => $userId,
                'name' => 'Savings Account',
                'type' => 'asset',
                'subtype' => 'bank',
                'balance' => 0,
                'description' => 'Savings bank account',
            ],
            // Income accounts
            [
                'user_id' => $userId,
                'name' => 'Salary',
                'type' => 'revenue',
                'subtype' => 'income',
                'balance' => 0,
                'description' => 'Employment income',
            ],
            // Expense accounts
            [
                'user_id' => $userId,
                'name' => 'Groceries',
                'type' => 'expense',
                'subtype' => 'expense_category',
                'balance' => 0,
                'description' => 'Food and grocery expenses',
            ],
            [
                'user_id' => $userId,
                'name' => 'Transportation',
                'type' => 'expense',
                'subtype' => 'expense_category',
                'balance' => 0,
                'description' => 'Transportation and fuel expenses',
            ],
            [
                'user_id' => $userId,
                'name' => 'Utilities',
                'type' => 'expense',
                'subtype' => 'expense_category',
                'balance' => 0,
                'description' => 'Utility bills and services',
            ],
        ];
    }

    /**
     * Initialize default accounts for a user.
     */
    public function initializeUserAccounts(int $userId): void
    {
        $defaultAccounts = $this->getDefaultAccounts($userId);
        
        foreach ($defaultAccounts as $accountData) {
            Account::create($accountData);
        }
    }
}