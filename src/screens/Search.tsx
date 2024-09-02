import * as React from 'react';
import {useQuery} from '@tanstack/react-query';
import {ActivityIndicator, IconButton, List, Text} from 'react-native-paper';
import {SearchAPI} from '../APIs';
import {AxiosResponse} from 'axios';
import {FlatList, StyleSheet, TextInput, View} from 'react-native';

export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
}

interface LocationResponse {
  results: LocationResult[];
}

interface SearchI {
  selectedCity: React.Dispatch<
    React.SetStateAction<LocationResult | undefined>
  >;
}

const Search = (props: SearchI) => {
  const [searchQuery, setSearchQuery] = React.useState<string>();

  const {
    isPending,
    error,
    data: Addresses,
  } = useQuery<AxiosResponse<LocationResponse>>({
    queryKey: ['searchQuery', searchQuery],
    queryFn: SearchAPI,
    enabled: !!searchQuery,
  });

  const CityItem = React.useCallback(
    (item: LocationResult) => (
      <List.Item
        style={{flex: 1}}
        contentStyle={{width: '100%'}}
        title={item.name}
        description={`${item.admin1} | ${item.country}`}
        left={props => <List.Icon {...props} icon="google-maps" />}
        onPress={() => props.selectedCity(item)}
      />
    ),
    [props],
  );

  if (error) {
    return <Text>An error has occurred: {error.message} </Text>;
  }

  let timer: NodeJS.Timeout;

  const debounce = (fn: any, time: number) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, time);
  };

  const handleSearch = (e: string) => {
    debounce(() => setSearchQuery(e), 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <IconButton
          icon="magnify"
          size={20}
          onPress={() => console.log('Pressed')}
          disabled
        />
        <TextInput
          style={styles.searchInput}
          onChangeText={handleSearch}
          placeholder="Search the city name"
        />
      </View>

      <View style={{flex: 1}}>
        {Addresses && (
          <View style={{flex: 1}}>
            {!Addresses.data.results && (
              <View style={styles.noCity}>
                <Text variant="labelLarge">No City Found{'\n'} </Text>
                <Text variant="labelSmall">Try Another city name</Text>
              </View>
            )}

            {isPending && (
              <ActivityIndicator animating={true} style={{flex: 1}} />
            )}

            {Addresses.data.results && (
              <FlatList
                data={Addresses.data.results}
                renderItem={({item}) => <CityItem {...item} />}
                keyExtractor={item => item.id.toString()}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: 16,
    flexDirection: 'row',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  noCity: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default Search;
