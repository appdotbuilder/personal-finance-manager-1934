import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Account {
    id: number;
    name: string;
    type: string;
    subtype: string;
    balance: string;
    description?: string;
    is_active: boolean;
}

interface Props {
    accounts: Record<string, Account[]>;
    [key: string]: unknown;
}

export default function Accounts({ accounts }: Props) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(amount));
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

    const getAccountTypeName = (type: string) => {
        switch (type) {
            case 'asset': return 'Asset Accounts';
            case 'revenue': return 'Income Sources';
            case 'expense': return 'Expense Categories';
            case 'liability': return 'Liabilities';
            case 'equity': return 'Equity';
            default: return 'Other Accounts';
        }
    };

    const getAccountTypeDescription = (type: string) => {
        switch (type) {
            case 'asset': return 'Money you own - cash, bank accounts, investments';
            case 'revenue': return 'Sources of income - salary, freelance, investments';
            case 'expense': return 'Spending categories - groceries, rent, utilities';
            case 'liability': return 'Money you owe - loans, credit cards';
            case 'equity': return 'Your net worth - assets minus liabilities';
            default: return 'Other financial accounts';
        }
    };

    const getBalanceColor = (type: string, balance: string) => {
        const amount = Number(balance);
        if (type === 'asset') {
            return amount >= 0 ? 'text-green-600' : 'text-red-600';
        }
        if (type === 'expense') {
            return 'text-red-600'; // Expenses are typically shown as positive but represent money going out
        }
        if (type === 'revenue') {
            return 'text-blue-600'; // Income is positive
        }
        return 'text-gray-700';
    };

    return (
        <AppShell>
            <Head title="Accounts" />
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">💳 All Accounts</h1>
                    <p className="text-muted-foreground mt-2">
                        Overview of all your financial accounts and categories
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route('finance.index')}>
                            ← Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {Object.entries(accounts).map(([accountType, accountList]) => (
                    <div key={accountType}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-2xl">
                                        {accountType === 'asset' ? '🏦' : 
                                         accountType === 'revenue' ? '💰' : 
                                         accountType === 'expense' ? '💸' : '📊'}
                                    </span>
                                    {getAccountTypeName(accountType)}
                                </CardTitle>
                                <CardDescription>
                                    {getAccountTypeDescription(accountType)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {accountList.map((account) => (
                                        <Card key={account.id} className="border border-gray-200">
                                            <CardContent className="pt-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">
                                                            {getAccountTypeIcon(account.type, account.subtype)}
                                                        </span>
                                                        <div>
                                                            <h3 className="font-semibold">{account.name}</h3>
                                                            <p className="text-sm text-muted-foreground capitalize">
                                                                {account.subtype.replace('_', ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${getBalanceColor(account.type, account.balance)}`}>
                                                            {formatCurrency(Math.abs(Number(account.balance)))}
                                                        </div>
                                                        {account.is_active ? (
                                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                                                Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-red-600 border-red-600">
                                                                Inactive
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {account.description && (
                                                    <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                                                        {account.description}
                                                    </p>
                                                )}
                                                
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>Account ID: {account.id}</span>
                                                        <span className="capitalize">
                                                            {account.type} • {account.subtype.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                
                                {accountList.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No {getAccountTypeName(accountType).toLowerCase()} found</p>
                                    </div>
                                )}
                                
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            Total {getAccountTypeName(accountType)}:
                                        </span>
                                        <span className={`text-xl font-bold ${getBalanceColor(accountType, '0')}`}>
                                            {formatCurrency(
                                                accountList.reduce((sum, account) => sum + Math.abs(Number(account.balance)), 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
                
                {Object.keys(accounts).length === 0 && (
                    <Card>
                        <CardContent className="pt-8 pb-8 text-center">
                            <div className="text-6xl mb-4">💳</div>
                            <h3 className="text-lg font-semibold mb-2">No Accounts Found</h3>
                            <p className="text-muted-foreground mb-4">You haven't created any accounts yet.</p>
                            <Button asChild>
                                <Link href={route('finance.index')}>
                                    Create Your First Account
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppShell>
    );
}