<?php

namespace App\Http\Controllers;

use App\Modules\Users\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a user
     */
    public function start(Request $request, User $user): RedirectResponse
    {
        $impersonator = Auth::user();

        // Check if the user can be impersonated
        if (! $user->canBeImpersonated($impersonator)) {
            return back()->with('error', 'You cannot impersonate this user.');
        }

        // Store the original user ID in session
        Session::put('impersonator_id', $impersonator->id);

        // Login as the target user
        Auth::login($user);

        return redirect()->route('dashboard')
            ->with('success', "You are now impersonating {$user->name}. Click 'Stop Impersonation' to return to your account.");
    }

    /**
     * Stop impersonating and return to original user
     */
    public function stop(Request $request): RedirectResponse
    {
        if (! Session::has('impersonator_id')) {
            return redirect()->route('dashboard')
                ->with('error', 'You are not currently impersonating anyone.');
        }

        $originalUserId = Session::get('impersonator_id');
        $originalUser = User::find($originalUserId);

        if (! $originalUser) {
            Session::forget('impersonator_id');

            return redirect()->route('login')
                ->with('error', 'Original user not found. Please log in again.');
        }

        Session::forget('impersonator_id');
        Auth::login($originalUser);

        return redirect()->route('dashboard')
            ->with('success', 'Impersonation stopped. You are back to your original account.');
    }

    /**
     * Get current impersonation status
     */
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'impersonating' => Session::has('impersonator_id'),
            'impersonator' => Session::has('impersonator_id')
                ? User::find(Session::get('impersonator_id'))?->only(['id', 'name', 'email'])
                : null,
            'current_user' => Auth::user()?->only(['id', 'name', 'email']),
        ]);
    }
}
