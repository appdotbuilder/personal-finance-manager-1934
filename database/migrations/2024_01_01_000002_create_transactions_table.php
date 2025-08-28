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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('description')->comment('Transaction description');
            $table->decimal('amount', 15, 2)->comment('Transaction amount (always positive)');
            $table->date('transaction_date')->comment('Date of the transaction');
            $table->string('reference')->nullable()->comment('Transaction reference number');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            $table->index(['user_id', 'transaction_date']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};