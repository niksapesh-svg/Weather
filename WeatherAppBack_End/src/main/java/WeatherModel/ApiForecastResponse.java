package WeatherModel;

import java.util.List;

public record ApiForecastResponse(List<ApiForecastItem> list) {
}
