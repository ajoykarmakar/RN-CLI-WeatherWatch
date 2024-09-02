import axios from 'axios';

const ForecastAPI = async ({queryKey}: {queryKey: any}) => {
  try {
    return await axios.request({
      url: `https://api.open-meteo.com/v1/forecast?latitude=${queryKey[1]}&longitude=${queryKey[2]}&current=temperature_2m&hourly=temperature_2m,weather_code`,
    });
  } catch (error) {
    console.error('Error fetching data from the API', error);
    throw error;
  }
};

export default ForecastAPI;
