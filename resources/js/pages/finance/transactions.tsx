import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Account {
    id: number;
    name: string;
    type: string;
    subtype: string;
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

interface PaginationData {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    transactions: PaginationData;
    [key: string]: unknown;
}

export default function Transactions({ transactions }: Props) {
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

    const handleDelete = (transactionId: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            router.delete(route('transactions.destroy', transactionId));
        }
    };

    return (
        <AppShell>
            <Head title="Transactions" />
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">📝 All Transactions</h1>
                    <p className="text-muted-foreground mt-2">
                        Complete history of all financial transactions
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

            <div className="space-y-4">
                {transactions.data.map((transaction) => {
                    const fromEntry = transaction.journal_entries.find(entry => entry.type === 'credit');
                    const toEntry = transaction.journal_entries.find(entry => entry.type === 'debit');
                    
                    return (
                        <Card key={transaction.id}>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="font-semibold text-lg">{transaction.description}</h3>
                                            <div className="text-xl font-bold text-green-600">
                                                {formatCurrency(transaction.amount)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                            <span>📅 {new Date(transaction.transaction_date).toLocaleDateString()}</span>
                                            {transaction.reference && (
                                                <Badge variant="outline" className="text-xs">
                                                    Ref: {transaction.reference}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span>{fromEntry ? getAccountTypeIcon(fromEntry.account.type, fromEntry.account.subtype) : '❓'}</span>
                                                <span className="font-medium">{fromEntry?.account.name}</span>
                                            </div>
                                            <span className="text-muted-foreground">→</span>
                                            <div className="flex items-center gap-1">
                                                <span>{toEntry ? getAccountTypeIcon(toEntry.account.type, toEntry.account.subtype) : '❓'}</span>
                                                <span className="font-medium">{toEntry?.account.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(transaction.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                
                                {transaction.notes && (
                                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Notes:</span> {transaction.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Journal Entries:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {transaction.journal_entries.map((entry, index) => (
                                            <div key={index} className={`flex items-center justify-between p-2 rounded ${
                                                entry.type === 'debit' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                            } border`}>
                                                <div className="flex items-center gap-2">
                                                    <span>{getAccountTypeIcon(entry.account.type, entry.account.subtype)}</span>
                                                    <span className="font-medium">{entry.account.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        entry.type === 'debit' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {entry.type.toUpperCase()}
                                                    </span>
                                                    <span className="font-semibold">{formatCurrency(entry.amount)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {transactions.data.length === 0 && (
                    <Card>
                        <CardContent className="pt-8 pb-8 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                            <p className="text-muted-foreground mb-4">You haven't created any transactions yet.</p>
                            <Button asChild>
                                <Link href={route('finance.index')}>
                                    Create Your First Transaction
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {transactions.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                    {transactions.links.map((link, index) => {
                        if (!link.url) {
                            return (
                                <span
                                    key={index}
                                    className="px-3 py-2 text-gray-400"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }
                        
                        return (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                onClick={() => router.get(link.url!)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            )}
        </AppShell>
    );
}