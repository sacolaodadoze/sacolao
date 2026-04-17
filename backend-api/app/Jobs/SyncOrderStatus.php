<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;   
use Illuminate\Queue\SerializesModels;  
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncOrderStatus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        \Log::info('SyncOrderStatus ejecutado', [
            'time' => now()
        ]);
        $orders = Order::where('status_id', '!=', 6) //6-fechado
            ->whereBetween('created_at', [   //Solo las orders del dia
                now()->startOfDay(),
                now()->endOfDay()
            ])

            ->chunk(50, function ($orders) {
                // dd($orders);
                foreach ($orders as $order) {
                    if (!empty($order->code_vuupt)) {

                        $response = Http::withToken(env('VUUPT_TOKEN'))
                            ->get('https://api.vuupt.com/api/v1/services', [
                                'fields' => 'id,title,status,code',
                                'filter[0][field]' => 'code',
                                'filter[0][operator]' => 'eq',
                                'filter[0][value]' => $order->code_vuupt
                            ]);

                        //  dd($response);
                        if ($response->ok()) {
                            $data = $response->json();
                           // dd($data);

                            //if ($data['data'][0]['status'] === 'done') {   
                            if (!empty($data['data'][0]['status']) && $data['data'][0]['status'] === 'done') {
                                // dd($data[0]['status']);
                                $order->update([
                                    'status_id' => 6
                                ]);
                            }
                        }
                    }
                }
            });
    }
}
