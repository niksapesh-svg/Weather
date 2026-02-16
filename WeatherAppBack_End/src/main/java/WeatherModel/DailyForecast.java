package WeatherModel;

import java.time.LocalDate;
import java.util.List;

public record DailyForecast(
        LocalDate date,
        List<ForecastSlot> slots
) {
}
