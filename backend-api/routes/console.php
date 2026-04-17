<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\SyncOrderStatus;
use Illuminate\Support\Facades\Schedule;
use App\Models\Order;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new SyncOrderStatus)
    ->everyThirtyMinutes()  
    ->withoutOverlapping()
    ->when(function () {
        return Order::where('status_id', '!=', 6)
            ->whereBetween('created_at', [   //Solo las orders del dia
                now()->startOfDay(),
                now()->endOfDay()
            ])->exists();
    });
