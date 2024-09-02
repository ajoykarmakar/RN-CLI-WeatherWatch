import axios from 'axios';

const SearchAPI = async ({queryKey}: {queryKey: any}) => {
  try {
    return await axios.request({
      url: 'https://geocoding-api.open-meteo.com/v1/search?name=' + queryKey[1],
    });
  } catch (error) {
    console.error('Error fetching data from the API', error);
    throw error;
  }
};

export default SearchAPI;
