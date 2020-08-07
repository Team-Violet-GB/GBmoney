<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TagFormRequest extends FormRequest
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
                Rule::unique('tags')
                    ->ignore($this->route('tag'), 'id')
                    ->where('user_id', Auth::id())
                    ->where('deleted', 0)
                    ->where('expense_id', $this->get('expense_id')),
            ],
            'expense_id' => 'required|int',
        ];
    }

    /**
     * Задаем сообщения об ошибке для заданных полей.
     * @return array|string[]
     */
    public function messages()
    {
        return [
            'name.unique' => ':attribute с таким именем уже существует.'
        ];
    }

    /**
     * Определяем названия заданных атрибутов.
     * @return array|string[]
     */
    public function  attributes()
    {
        return [
            'name' => 'Подкатегория'
        ];
    }
}
