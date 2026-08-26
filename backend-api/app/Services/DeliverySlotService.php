<?php

namespace App\Services;

use App\Models\Setting;
use Carbon\Carbon;

class DeliverySlotService
{
    /**
     * Verifica si una fecha dada está marcada como feriado
     * en el campo de texto `holiday_dates` de Setting (fechas separadas por coma, formato YYYY-MM-DD).
     */
    public function isHoliday(Setting $settings, Carbon $date): bool
    {
        $holidays = collect(explode(',', $settings->holiday_dates ?? ''))
            ->map(fn ($d) => trim($d))
            ->filter();

        return $holidays->contains($date->toDateString());
    }

    /**
     * Devuelve el horario aplicable para una fecha dada, según sea:
     * - feriado o domingo -> horario único (sunday_open/close)
     * - sábado            -> horario único (saturday_open/close)
     * - día de semana     -> horario partido (mañana/tarde)
     */
    public function getScheduleForDate(Setting $settings, Carbon $date): array
    {
        $isHoliday = $this->isHoliday($settings, $date);
        $dayOfWeek = $date->dayOfWeek; // 0 = domingo, 6 = sábado

        // Domingo: nunca hay entregas, sin excepción.
        if ($dayOfWeek === 0 && !$isHoliday) {
            return [
                'type' => 'closed',
            ];
        }

        // Feriado: SÍ hay entregas, usando el mismo horario ya establecido para domingo.
        if ($isHoliday) {
            return [
                'type'  => 'single',
                'open'  => $settings->sunday_open,
                'close' => $settings->sunday_close,
            ];
        }

        if ($dayOfWeek === 6) {
            return [
                'type'  => 'single',
                'open'  => $settings->saturday_open,
                'close' => $settings->saturday_close,
            ];
        }

        return [
            'type'            => 'split',
            'open_morning'    => $settings->weekday_open_morning,
            'close_morning'   => $settings->weekday_close_morning,
            'open_afternoon'  => $settings->weekday_open_afternoon,
            'close_afternoon' => $settings->weekday_close_afternoon,
        ];
    }

    /**
     * Determina si el negocio abre ese día (tiene al menos un horario configurado).
     */
    public function isDayOpen(Setting $settings, Carbon $date): bool
    {
        $schedule = $this->getScheduleForDate($settings, $date);

        if ($schedule['type'] === 'closed') {
            return false;
        }

        if ($schedule['type'] === 'single') {
            return !empty($schedule['open']) && !empty($schedule['close']);
        }

        return !empty($schedule['open_morning']) && !empty($schedule['close_morning']);
    }

    /**
     * Busca el próximo día en que el negocio abre, a partir del día siguiente a $date.
     */
    public function nextOpenDay(Setting $settings, Carbon $date): Carbon
    {
        $date = $date->copy()->addDay();

        for ($i = 0; $i < 14; $i++) {
            if ($this->isDayOpen($settings, $date)) {
                return $date;
            }
            $date->addDay();
        }

        return $date; // fallback de seguridad si algo está mal configurado
    }

    /**
     * Resuelve en qué fecha y turno cae un pedido, según la hora actual/solicitada.
     * Si el negocio está cerrado en ese momento, reubica el pedido en el próximo
     * turno/día disponible (ver reglas en los comentarios inline).
     *
     * Devuelve:
     * [
     *   'date'         => 'YYYY-MM-DD',
     *   'shift'        => 'morning' | 'afternoon' | 'single',
     *   'slotsField'   => columna en order_capacities,
     *   'settingField' => columna en settings (default de cupo),
     * ]
     */
    public function resolveOrderSlot(Setting $settings, string $orderDate, int $hour, int $minute): array
    {
        $date = Carbon::parse($orderDate);
       // dd($date);
        $currentTime = sprintf('%02d:%02d', $hour, $minute);
        $schedule = $this->getScheduleForDate($settings, $date);
        //dd($schedule);

        if ($schedule['type'] === 'closed') {
            // domingo: nunca hay entregas, se va directo al próximo día hábil
            $nextDay = $this->nextOpenDay($settings, $date);
            return $this->resolveOrderSlot($settings, $nextDay->toDateString(), 0, 0);
        }

        if ($schedule['type'] === 'single') {
            // sábado, domingo o feriado
            $isOpenNow = !empty($schedule['open']) && !empty($schedule['close'])
                && $currentTime >= $schedule['open'] && $currentTime < $schedule['close'];

            $isBeforeOpen = !empty($schedule['open']) && $currentTime < $schedule['open'];

            if ($isOpenNow || $isBeforeOpen) {
                // dentro del horario, o todavía no abrió pero es el mismo día -> cuenta para hoy
                $isHoliday = $this->isHoliday($settings, $date);
                $isSunday = $isHoliday || $date->dayOfWeek === 0;

                return [
                    'date'         => $date->toDateString(),
                    'shift'        => 'single',
                    'slotsField'   => $isSunday ? 'sunday_slots' : 'saturday_slots',
                    'settingField' => $isSunday ? 'delivery_sunday' : 'delivery_saturday',
                ];
            }

            // ya cerró -> próximo día hábil
            $nextDay = $this->nextOpenDay($settings, $date);
            return $this->resolveOrderSlot($settings, $nextDay->toDateString(), 0, 0);
        }

        // día de semana (con mañana/tarde)
        $isMorningShift   = $currentTime >= $schedule['open_morning'] && $currentTime < $schedule['close_morning'];
        $isAfternoonShift = $currentTime >= $schedule['open_afternoon'] && $currentTime < $schedule['close_afternoon'];

        if ($isMorningShift) {
            return [
                'date'         => $date->toDateString(),
                'shift'        => 'morning',
                'slotsField'   => 'morning_slots',
                'settingField' => 'delivery_morning',
            ];
        }

        if ($isAfternoonShift) {
            return [
                'date'         => $date->toDateString(),
                'shift'        => 'afternoon',
                'slotsField'   => 'afternoon_slots',
                'settingField' => 'delivery_afternoon',
            ];
        }

        if ($currentTime < $schedule['open_afternoon']) {
            // hueco del mediodía -> cuenta como turno tarde de hoy
            return [
                'date'         => $date->toDateString(),
                'shift'        => 'afternoon',
                'slotsField'   => 'afternoon_slots',
                'settingField' => 'delivery_afternoon',
            ];
        }

        // ya cerró la tarde -> próximo día hábil
        $nextDay = $this->nextOpenDay($settings, $date);
        return $this->resolveOrderSlot($settings, $nextDay->toDateString(), 0, 0);
    }
}