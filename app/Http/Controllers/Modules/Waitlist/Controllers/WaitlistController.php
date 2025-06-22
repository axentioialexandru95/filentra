<?php

namespace App\Http\Controllers\Modules\Waitlist\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Waitlist\Models\Waitlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WaitlistController extends Controller
{
    /**
     * Store a new waitlist entry
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'interests' => 'sometimes|string|max:100',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $email = $request->input('email');
        $interests = $request->input('interests', 'general');

        // Check if email already exists
        if (Waitlist::emailExists($email)) {
            return response()->json([
                'message' => 'You\'re already on our waitlist! We\'ll notify you when Filentra launches.',
                'already_exists' => true,
            ], 200);
        }

        // Create new waitlist entry
        $waitlistEntry = Waitlist::create([
            'email' => $email,
            'interests' => $interests,
            'joined_at' => now(),
        ]);

        return response()->json([
            'message' => 'Thank you for joining our waitlist! We\'ll notify you when Filentra launches.',
            'success' => true,
            'waitlist_count' => Waitlist::getCount(),
        ], 201);
    }

    /**
     * Display waitlist management page (for authenticated users)
     */
    public function index(): \Inertia\Response
    {
        $waitlist = Waitlist::orderBy('joined_at', 'desc')->paginate(50);
        $stats = [
            'total_count' => Waitlist::getCount(),
            'today_count' => Waitlist::whereDate('joined_at', today())->count(),
            'this_week_count' => Waitlist::whereBetween('joined_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        return Inertia::render('modules/waitlist/pages/index', [
            'waitlist' => $waitlist,
            'stats' => $stats,
        ]);
    }

    /**
     * Export waitlist as CSV
     */
    public function exportCsv(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $waitlist = Waitlist::getAll();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="filentra-waitlist-'.now()->format('Y-m-d').'.csv"',
        ];

        $callback = function () use ($waitlist) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Email', 'Interests', 'Joined At']);

            /** @var Waitlist $entry */
            foreach ($waitlist as $entry) {
                fputcsv($file, [
                    $entry->id,
                    $entry->email,
                    $entry->interests,
                    $entry->joined_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get waitlist statistics API
     */
    public function stats(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'total_count' => Waitlist::getCount(),
            'recent_signups' => Waitlist::orderBy('joined_at', 'desc')->take(10)->get(),
        ]);
    }
}
