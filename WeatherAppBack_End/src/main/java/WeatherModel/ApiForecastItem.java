package WeatherModel;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiForecastItem {
    private Main main;
    private List<Weather> weather;
    private Wind wind;

    @JsonProperty("dt_txt")
    private String dateTimeText;

    public void setMain(Main main) {
        this.main = main;
    }

    public void setWeather(List<Weather> weather) {
        this.weather = weather;
    }

    public void setWind(Wind wind) {
        this.wind = wind;
    }

    public void setDateTimeText(String dateTimeText) {
        this.dateTimeText = dateTimeText;
    }

    public LocalDateTime getDateTime() {
        return LocalDateTime.parse(
                dateTimeText,
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        );
    }

    public double getTemp() {
        return main.temp;
    }

    public double getFeelsLike() {
        return main.feelsLike;
    }

    public int getHumidity() {
        return main.humidity;
    }

    public String getDescription() {
        return weather.get(0).description;
    }

    public String getIcon() {
        return weather.get(0).icon;
    }

    public double getWindSpeed() {
        return wind.speed;
    }

    public static class Main {
        public double temp;

        @JsonProperty("feels_like")
        public double feelsLike;

        public int humidity;
    }

    public static class Weather {
        public String description;
        public String icon;
    }

    public static class Wind {
        public double speed;
    }
}
