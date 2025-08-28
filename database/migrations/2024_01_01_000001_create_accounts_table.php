<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->comment('Account name (e.g., Cash, Bank Account, Savings)');
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense'])->comment('Account type for double-entry bookkeeping');
            $table->enum('subtype', ['cash', 'bank', 'ewallet', 'credit_card', 'income', 'expense_category'])->comment('Account subtype for UI categorization');
            $table->decimal('balance', 15, 2)->default(0)->comment('Current account balance');
            $table->text('description')->nullable()->comment('Account description');
            $table->boolean('is_active')->default(true)->comment('Whether the account is active');
            $table->timestamps();
            
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'subtype']);
            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};