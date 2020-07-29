<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class WalletFormRequest extends FormRequest
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
                Rule::unique('wallets')->ignore($this->route('wallet'), 'id')->where('user_id', Auth::id()),
            ],
            'amount' => 'required|numeric',
            'include' => 'required|boolean',
            'icon_id' => 'required|int'
        ];
    }
}
