<?php

namespace App\Modules\RBAC\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string|Rule>|string>
     */
    public function rules(): array
    {
        $role = $this->route('role');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role->id)],
            'slug' => ['required', 'string', 'max:255', Rule::unique('roles', 'slug')->ignore($role->id), 'regex:/^[a-z0-9_-]+$/'],
            'description' => ['nullable', 'string', 'max:1000'],
            'level' => ['required', 'integer', 'min:1', 'max:99'], // Superadmin is level 100
            'is_active' => ['boolean'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'role name',
            'slug' => 'role slug',
            'level' => 'role level',
            'permissions.*' => 'permission',
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.regex' => 'The role slug may only contain lowercase letters, numbers, underscores, and hyphens.',
            'level.max' => 'Role level cannot exceed 99 (100 is reserved for superadmin).',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ];
    }
}
