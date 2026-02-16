package com.example.weatherapp;

import WeatherModel.ApiForecastItem;
import WeatherModel.DailyForecast;
import WeatherModel.ForecastSlot;
import WeatherModel.WeatherResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

public final class WeatherMapper {
    private static final Set<Integer> TARGET_HOURS = Set.of(0, 6, 12, 18);

    private WeatherMapper() {
    }

    public static WeatherResponse build(List<ApiForecastItem> items, String city) {
        Map<LocalDate, List<ApiForecastItem>> byDate = items.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getDateTime().toLocalDate(),
                        TreeMap::new,
                        Collectors.toList()
                ));

        LocalDate today = LocalDate.now();
        List<ForecastSlot> todaySlots = toSlots(byDate.getOrDefault(today, List.of()));

        List<DailyForecast> days = new ArrayList<>();
        for (Map.Entry<LocalDate, List<ApiForecastItem>> entry : byDate.entrySet()) {
            if (entry.getKey().equals(today)) {
                continue;
            }
            if (days.size() >= 5) {
                break;
            }
            List<ForecastSlot> slots = toSlots(entry.getValue());
            days.add(new DailyForecast(entry.getKey(), slots));
        }

        return new WeatherResponse(city, todaySlots, days);
    }

    private static List<ForecastSlot> toSlots(List<ApiForecastItem> items) {
        return items.stream()
                .filter(item -> TARGET_HOURS.contains(item.getDateTime().getHour()))
                .map(item -> new ForecastSlot(
                        item.getDateTime(),
                        item.getTemp(),
                        item.getFeelsLike(),
                        item.getHumidity(),
                        item.getWindSpeed(),
                        item.getDescription(),
                        item.getIcon()
                ))
                .toList();
    }
}
