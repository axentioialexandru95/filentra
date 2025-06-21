<?php

namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CRMController extends Controller
{
    /**
     * Display the module index page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('modules/crm/pages/index', [
            // Pass data to the frontend component
        ]);
    }
}
