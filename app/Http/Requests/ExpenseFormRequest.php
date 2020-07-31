<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ExpenseFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => [
                'required',
                'max:45',
                Rule::unique('expenses')->ignore($this->route('expense'), 'id')->where('user_id', Auth::id()),
            ],
            'amount' => 'numeric',
            'max_limit' => 'required|numeric',
            'icon_id' => 'required|int',
        ];
    }
}
