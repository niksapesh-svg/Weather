package WeatherModel;

import java.util.List;

public record WeatherResponse(
        String city,
        List<ForecastSlot> today,
        List<DailyForecast> days
) {
}
