<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\StoreTransactionRequest;
use App\Models\Account;
use App\Models\Transaction;
use App\Services\FinanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * App\Http\Controllers\FinanceController
 *
 * @property \App\Services\FinanceService $financeService
 */
class FinanceController extends Controller
{
    /**
     * The finance service instance.
     *
     * @var \App\Services\FinanceService
     */
    protected FinanceService $financeService;

    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\FinanceService  $financeService
     * @return void
     */
    public function __construct(FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    /**
     * Display the main finance dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = auth()->user();
        
        // Initialize accounts if user has none
        if ($user->accounts()->count() === 0) {
            $this->financeService->initializeUserAccounts($user->id);
        }

        $accounts = $user->accounts()
            ->where('is_active', true)
            ->orderBy('subtype')
            ->orderBy('name')
            ->get();

        $recentTransactions = $user->transactions()
            ->with(['journalEntries.account'])
            ->latest()
            ->limit(5)
            ->get();

        // Calculate totals
        $totalAssets = $accounts->where('type', 'asset')->sum('balance');
        $totalExpenses = abs($accounts->where('type', 'expense')->sum('balance'));
        $totalIncome = abs($accounts->where('type', 'revenue')->sum('balance'));

        return Inertia::render('finance/dashboard', [
            'accounts' => $accounts,
            'recentTransactions' => $recentTransactions,
            'totalAssets' => $totalAssets,
            'totalExpenses' => $totalExpenses,
            'totalIncome' => $totalIncome,
        ]);
    }

    /**
     * Store a newly created account in storage.
     *
     * @param  \App\Http\Requests\StoreAccountRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreAccountRequest $request)
    {
        $account = Account::create([
            'user_id' => auth()->id(),
            ...$request->validated(),
        ]);

        return redirect()->route('finance.index')
            ->with('success', 'Account created successfully.');
    }

    /**
     * Display transactions page.
     *
     * @return \Inertia\Response
     */
    public function show()
    {
        $transactions = auth()->user()->transactions()
            ->with(['journalEntries.account'])
            ->latest()
            ->paginate(20);

        return Inertia::render('finance/transactions', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Display accounts page.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        $accounts = auth()->user()->accounts()
            ->where('is_active', true)
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->groupBy('type');

        return Inertia::render('finance/accounts', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     *
     * @param  \App\Http\Requests\StoreTransactionRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StoreTransactionRequest $request)
    {
        $this->financeService->createTransaction($request->validated());

        return redirect()->route('finance.index')
            ->with('success', 'Transaction created successfully.');
    }

    /**
     * Remove the specified transaction from storage.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Transaction $transaction)
    {
        // Ensure the transaction belongs to the authenticated user
        if ($transaction->user_id !== auth()->id()) {
            abort(403);
        }

        $this->financeService->deleteTransaction($transaction);

        return redirect()->route('finance.index')
            ->with('success', 'Transaction deleted successfully.');
    }
}