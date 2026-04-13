<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StaffUserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->orderByRaw("case when role = 'admin' then 0 else 1 end")
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'job_title' => $user->job_title,
                'phone' => $user->phone,
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at?->format('M d, Y H:i'),
            ]);

        return Inertia::render('staff/index', [
            'users' => $users,
            'summary' => [
                'active_staff' => $users->where('is_active', true)->count(),
                'admins' => $users->where('role', 'admin')->count(),
                'front_office' => $users->where('role', 'staff')->count(),
            ],
            'currentUserId' => $request->user()?->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('staff/form', [
            'mode' => 'create',
            'user' => $this->defaultPayload(),
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedPayload($request);

        User::create($data);

        return redirect()->route('staff.index')->with('message', 'Staff account created successfully.')->with('success', true);
    }

    public function edit(User $staff): Response
    {
        return Inertia::render('staff/form', [
            'mode' => 'edit',
            'user' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'email' => $staff->email,
                'phone' => $staff->phone ?? '',
                'job_title' => $staff->job_title ?? '',
                'role' => $staff->role,
                'is_active' => $staff->is_active,
                'password' => '',
                'password_confirmation' => '',
            ],
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    public function update(Request $request, User $staff): RedirectResponse
    {
        $data = $this->validatedPayload($request, $staff);
        $this->guardLastAdmin($staff, $data['role'], (bool) $data['is_active']);

        if (empty($data['password'])) {
            unset($data['password'], $data['password_confirmation']);
        }

        $staff->update($data);

        return redirect()->route('staff.index')->with('message', 'Staff account updated successfully.')->with('success', true);
    }

    public function destroy(Request $request, User $staff): RedirectResponse
    {
        if ($request->user()?->is($staff)) {
            throw ValidationException::withMessages([
                'user' => 'You cannot remove the account you are currently signed in with.',
            ]);
        }

        $this->guardLastAdmin($staff, 'staff', false);

        $staff->delete();

        return redirect()->route('staff.index')->with('message', 'Staff account removed successfully.')->with('success', true);
    }

    private function validatedPayload(Request $request, ?User $staff = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique(User::class, 'email')->ignore($staff?->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'is_active' => ['required', 'boolean'],
            'password' => [$staff ? 'nullable' : 'required', 'confirmed', 'min:8'],
        ]);
    }

    private function defaultPayload(): array
    {
        return [
            'name' => '',
            'email' => '',
            'phone' => '',
            'job_title' => '',
            'role' => 'staff',
            'is_active' => true,
            'password' => '',
            'password_confirmation' => '',
        ];
    }

    private function roleOptions()
    {
        return collect([
            ['value' => 'admin', 'label' => 'Administrator'],
            ['value' => 'staff', 'label' => 'Staff'],
        ]);
    }

    private function guardLastAdmin(User $staff, string $nextRole, bool $nextActive): void
    {
        if ($staff->role !== 'admin') {
            return;
        }

        $remainingAdmins = User::query()
            ->where('role', 'admin')
            ->where('is_active', true)
            ->whereKeyNot($staff->id)
            ->count();

        $willRemainActiveAdmin = $nextRole === 'admin' && $nextActive;

        if ($remainingAdmins === 0 && ! $willRemainActiveAdmin) {
            throw ValidationException::withMessages([
                'role' => 'At least one active administrator account must remain in the system.',
            ]);
        }
    }
}
