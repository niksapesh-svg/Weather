package WeatherModel;

import java.time.LocalDateTime;

public record ForecastSlot(
        LocalDateTime dateTime,
        double temp,
        double feelsLike,
        int humidity,
        double windSpeed,
        String description,
        String icon
) {
}
