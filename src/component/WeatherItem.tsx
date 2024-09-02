import React from "react";
import {getHours} from 'date-fns';
import {Avatar, List} from 'react-native-paper';
import {WeatherImage} from '../helpers/getWeatherImage.ts';
interface WeatherEntry {
  element: {
    time: string;
    weather_code: WeatherImage;
  },
  key: string;
}

const WeatherItem = ({element, key}: WeatherEntry) => {
  const hour = getHours(element.time);
  const isDayOrNight = hour >= 6 && hour < 18 ? 'day' : 'night';

  return (
    <List.Item
      key={key}
      style={{marginLeft: 32}}
      left={(props) => (
        <Avatar.Image
          {...props}
          source={{
            uri: element.weather_code[isDayOrNight].image,
          }}
          size={40}
          style={{backgroundColor: '#c9c9c9'}}
        />
      )}
      title={element.time}
      description={element.weather_code[isDayOrNight].description}
    />
  );
};

export default React.memo(WeatherItem);
