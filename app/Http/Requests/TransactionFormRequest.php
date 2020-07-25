<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionFormRequest extends FormRequest
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
            'from_id' => 'required|int',
            'to_id' => 'required|int',
            'type' => 'required|in:1,2,3',
            'amount' => 'required|numeric',
            'date' => 'nullable|date',
            'comment' => 'nullable',
            'tag_id' => 'nullable|int',
        ];
    }
}
