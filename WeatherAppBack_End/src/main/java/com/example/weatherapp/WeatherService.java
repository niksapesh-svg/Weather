package com.example.weatherapp;

import WeatherModel.GeoResponse;
import WeatherModel.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

@Service
public class WeatherService {
    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final WeatherClient client;

    public WeatherService(WeatherClient client) {
        this.client = client;
    }

    public WeatherResponse getWeatherForecast(String city) {
        try {
            log.info("Resolving coordinates for city={}", city);
            GeoResponse[] geo = client.getCoordinates(city);
            if (geo == null || geo.length == 0) {
                log.info("No coordinates found for city={}", city);
                throw new IllegalArgumentException("City not found: " + city);
            }

            double lat = geo[0].lat();
            double lon = geo[0].lon();
            log.info("Coordinates resolved for city={} lat={} lon={}", city, lat, lon);

            WeatherResponse response = WeatherMapper.build(
                    client.getWeatherForecast(lat, lon).list(),
                    city
            );
            log.info("Weather forecast prepared for city={}", city);
            return response;
        } catch (RestClientException e) {
            log.error("Weather API call failed for city={}", city, e);
            throw new RuntimeException("Failed to call weather API", e);
        }
    }
}
