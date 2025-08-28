<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
            'subtype' => 'required|in:cash,bank,ewallet,credit_card,income,expense_category',
            'balance' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
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
            'name.required' => 'Account name is required.',
            'type.required' => 'Account type is required.',
            'type.in' => 'Invalid account type selected.',
            'subtype.required' => 'Account subtype is required.',
            'subtype.in' => 'Invalid account subtype selected.',
            'balance.numeric' => 'Balance must be a valid number.',
            'balance.min' => 'Balance cannot be negative.',
        ];
    }
}