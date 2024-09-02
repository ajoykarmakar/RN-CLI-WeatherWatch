import React, {FC, ReactElement, useMemo} from 'react';
import {ForecastAPI} from '../APIs';
import {LocationResult} from './Search';
import {useQuery} from '@tanstack/react-query';
import {AxiosResponse} from 'axios';
import {ActivityIndicator, List, Text} from 'react-native-paper';
import getWeatherImage, {
  WeatherCode,
  WeatherImage,
} from '../helpers/getWeatherImage';
import { ScrollView, View } from "react-native";
import {format, parseISO} from 'date-fns';
import WeatherItem from '../component/WeatherItem.tsx';

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: CurrentWeather;
  hourly_units: HourlyUnits;
  hourly: HourlyWeather;
}

interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
}

interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
}

interface HourlyUnits {
  time: string;
  temperature_2m: string;
  weather_code: string;
}

interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}
interface Hourly {
  time: string[];
  weather_code: string;
}

const Weather: FC<LocationResult> = ({latitude, longitude}): ReactElement => {
  const {
    isPending,
    error,
    data: forecast,
  } = useQuery<AxiosResponse<WeatherData>>({
    queryKey: ['forecastQuery', latitude, longitude],
    queryFn: ForecastAPI,
    enabled: !!(latitude && longitude),
  });

  const groupedWeatherData = useMemo(
    () => transformWeatherData(forecast?.data.hourly as unknown as Hourly),
    [forecast?.data],
  );

  if (error) {
    return <Text>An error has occurred: {error.message} </Text>;
  }

  function transformWeatherData(hourly: Hourly) {
    const result: Array<{
      [key: string]: {time: string; weather_code: WeatherImage}[];
    }> = [];

    // Loop through each entry in the hourly data
    hourly?.time.forEach((isoTime, index) => {
      const date = format(parseISO(isoTime), 'dd-MMMM'); // Extract date in "yyyy-MM-dd" format
      const timeFormatted = format(parseISO(isoTime), 'hh:mm a'); // Format time to "12:00 AM"

      // Check if the date already exists in the result
      let dateEntry = result.find(entry => entry[date]);

      // If the date entry doesn't exist, create it
      if (!dateEntry) {
        dateEntry = {
          [date]: [],
        };
        result.push(dateEntry);
      }
      const weatherCode: WeatherCode = hourly.weather_code[
        index
      ] as WeatherCode;
      // Add the time and weather code to the respective date entry
      dateEntry[date].push({
        time: timeFormatted,
        weather_code: getWeatherImage(weatherCode),
      });
    });

    return result;
  }

  return (
    <ScrollView>
      {isPending && <ActivityIndicator animating={true} style={{flex: 1}} />}

      {groupedWeatherData.map((v, index: number) => {
        // Expand today's data in Accordion
        const firstIndexProps =
          index === 0 ? {expanded: true, right: () => null} : {};

        return (
          <View key={index}>
            {Object.keys(v).map((e: string, i) => (
              <List.Accordion
                key={i}
                title={e}
                left={props => <List.Icon {...props} icon="calendar" />}
                {...firstIndexProps}>
                {v[e].map((element, innerIndex) => {
                  return <WeatherItem element={element} key={innerIndex.toString()} />;
                })}
              </List.Accordion>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Weather;
