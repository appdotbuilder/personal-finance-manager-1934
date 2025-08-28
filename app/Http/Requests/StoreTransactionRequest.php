<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'transaction_date' => 'required|date',
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required|exists:accounts,id|different:from_account_id',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.required' => 'Transaction description is required.',
            'amount.required' => 'Transaction amount is required.',
            'amount.numeric' => 'Amount must be a valid number.',
            'amount.min' => 'Amount must be greater than zero.',
            'transaction_date.required' => 'Transaction date is required.',
            'transaction_date.date' => 'Please provide a valid date.',
            'from_account_id.required' => 'Source account is required.',
            'from_account_id.exists' => 'Selected source account does not exist.',
            'to_account_id.required' => 'Destination account is required.',
            'to_account_id.exists' => 'Selected destination account does not exist.',
            'to_account_id.different' => 'Source and destination accounts must be different.',
        ];
    }
}