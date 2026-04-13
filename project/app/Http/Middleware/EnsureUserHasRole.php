<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_unless($user && $user->canAccessPanel(), 403);

        if ($roles !== [] && ! in_array($user->role, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
