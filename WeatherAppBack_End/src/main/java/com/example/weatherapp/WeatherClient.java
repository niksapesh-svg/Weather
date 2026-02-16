package com.example.weatherapp;

import WeatherModel.ApiForecastResponse;
import WeatherModel.GeoResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class WeatherClient {
    private static final Logger log = LoggerFactory.getLogger(WeatherClient.class);

    private final RestClient restClient;
    private final String apiKey;

    public WeatherClient(
            @Value("${openweather.api.url}") String baseUrl,
            @Value("${openweather.api.key}") String apiKey
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.apiKey = apiKey;
        log.info("Weather client initialized with baseUrl={}", baseUrl);
    }

    public GeoResponse[] getCoordinates(String city) {
        log.info("Calling geocoding endpoint for city={}", city);
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/geo/1.0/direct")
                        .queryParam("q", city)
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .body(GeoResponse[].class);
    }

    public ApiForecastResponse getWeatherForecast(double lat, double lon) {
        log.info("Calling forecast endpoint for lat={} lon={}", lat, lon);
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/forecast")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .queryParam("units", "metric")
                        .queryParam("lang", "ru")
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .body(ApiForecastResponse.class);
    }
}
