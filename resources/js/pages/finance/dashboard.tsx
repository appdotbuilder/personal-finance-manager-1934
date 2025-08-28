import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Account {
    id: number;
    name: string;
    type: string;
    subtype: string;
    balance: string;
    description?: string;
    is_active: boolean;
}

interface Transaction {
    id: number;
    description: string;
    amount: string;
    transaction_date: string;
    reference?: string;
    notes?: string;
    journal_entries: Array<{
        account: Account;
        type: 'debit' | 'credit';
        amount: string;
    }>;
}

interface Props {
    accounts: Account[];
    recentTransactions: Transaction[];
    totalAssets: number;
    totalExpenses: number;
    totalIncome: number;
    [key: string]: unknown;
}

export default function FinanceDashboard({ accounts, recentTransactions, totalAssets, totalExpenses, totalIncome }: Props) {
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [showTransactionForm, setShowTransactionForm] = useState(false);

    const handleCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        router.post(route('finance.store'), {
            name: formData.get('name'),
            type: formData.get('type'),
            subtype: formData.get('subtype'),
            balance: formData.get('balance') || '0',
            description: formData.get('description'),
        }, {
            onSuccess: () => setShowAccountForm(false),
        });
    };

    const handleCreateTransaction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        router.patch(route('finance.update'), {
            description: formData.get('description'),
            amount: formData.get('amount'),
            transaction_date: formData.get('transaction_date'),
            from_account_id: formData.get('from_account_id'),
            to_account_id: formData.get('to_account_id'),
            reference: formData.get('reference'),
            notes: formData.get('notes'),
        }, {
            onSuccess: () => setShowTransactionForm(false),
        });
    };

    const getAccountTypeIcon = (type: string, subtype: string) => {
        if (subtype === 'cash') return '💵';
        if (subtype === 'bank') return '🏦';
        if (subtype === 'ewallet') return '📱';
        if (subtype === 'credit_card') return '💳';
        if (type === 'revenue') return '💰';
        if (type === 'expense') return '💸';
        return '📊';
    };

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(amount));
    };

    const assetAccounts = accounts.filter(acc => acc.type === 'asset');
    const incomeAccounts = accounts.filter(acc => acc.type === 'revenue');
    const expenseAccounts = accounts.filter(acc => acc.type === 'expense');

    return (
        <AppShell>
            <Head title="Finance Dashboard" />
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">💰 Finance Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your personal finances with professional double-entry accounting
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={showAccountForm} onOpenChange={setShowAccountForm}>
                        <DialogTrigger asChild>
                            <Button variant="outline">+ Add Account</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Account</DialogTitle>
                                <DialogDescription>
                                    Add a new financial account to track your money.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateAccount} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Account Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="e.g., My Savings Account"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select name="type" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="asset">Asset</SelectItem>
                                                <SelectItem value="revenue">Income</SelectItem>
                                                <SelectItem value="expense">Expense</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="subtype">Category</Label>
                                        <Select name="subtype" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="bank">Bank Account</SelectItem>
                                                <SelectItem value="ewallet">E-Wallet</SelectItem>
                                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                                <SelectItem value="income">Income Source</SelectItem>
                                                <SelectItem value="expense_category">Expense Category</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="balance">Initial Balance</Label>
                                    <Input
                                        id="balance"
                                        name="balance"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Optional description"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowAccountForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Account</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showTransactionForm} onOpenChange={setShowTransactionForm}>
                        <DialogTrigger asChild>
                            <Button>+ New Transaction</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Transaction</DialogTitle>
                                <DialogDescription>
                                    Record a new financial transaction between accounts.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTransaction} className="space-y-4">
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        required
                                        placeholder="e.g., Grocery shopping"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="transaction_date">Date</Label>
                                        <Input
                                            id="transaction_date"
                                            name="transaction_date"
                                            type="date"
                                            required
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="from_account_id">From Account</Label>
                                    <Select name="from_account_id" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select source account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {getAccountTypeIcon(account.type, account.subtype)} {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="to_account_id">To Account</Label>
                                    <Select name="to_account_id" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select destination account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {getAccountTypeIcon(account.type, account.subtype)} {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="reference">Reference (Optional)</Label>
                                    <Input
                                        id="reference"
                                        name="reference"
                                        placeholder="Transaction reference"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        placeholder="Additional notes"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowTransactionForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Transaction</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                        <span className="text-2xl">🏦</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</div>
                        <p className="text-xs text-muted-foreground">
                            Cash, bank accounts, and other assets
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <span className="text-2xl">💰</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalIncome)}</div>
                        <p className="text-xs text-muted-foreground">
                            Revenue from all income sources
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <span className="text-2xl">💸</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
                        <p className="text-xs text-muted-foreground">
                            Spending across all categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Accounts Overview */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">💳 Asset Accounts</h2>
                        <div className="space-y-3">
                            {assetAccounts.map((account) => (
                                <Card key={account.id}>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">
                                                    {getAccountTypeIcon(account.type, account.subtype)}
                                                </span>
                                                <div>
                                                    <p className="font-medium">{account.name}</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {account.subtype.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-green-600">
                                                    {formatCurrency(account.balance)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {assetAccounts.length === 0 && (
                                <p className="text-muted-foreground text-center py-4">No asset accounts found</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">📊 Categories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[...incomeAccounts, ...expenseAccounts].map((account) => (
                                <Card key={account.id} className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span>{getAccountTypeIcon(account.type, account.subtype)}</span>
                                            <span className="text-sm font-medium">{account.name}</span>
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            account.type === 'revenue' ? 'text-blue-600' : 'text-red-600'
                                        }`}>
                                            {formatCurrency(Math.abs(Number(account.balance)))}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">📝 Recent Transactions</h2>
                        <Button variant="outline" size="sm" onClick={() => router.get(route('finance.show'))}>
                            View All
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => {
                            const fromEntry = transaction.journal_entries.find(entry => entry.type === 'credit');
                            const toEntry = transaction.journal_entries.find(entry => entry.type === 'debit');
                            
                            return (
                                <Card key={transaction.id}>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-medium">{transaction.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {fromEntry?.account.name} → {toEntry?.account.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(transaction.transaction_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {transaction.reference && (
                                            <Badge variant="outline" className="text-xs">
                                                Ref: {transaction.reference}
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                        {recentTransactions.length === 0 && (
                            <Card>
                                <CardContent className="pt-8 pb-8 text-center">
                                    <p className="text-muted-foreground">No transactions yet</p>
                                    <p className="text-sm text-muted-foreground">Create your first transaction to get started</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}