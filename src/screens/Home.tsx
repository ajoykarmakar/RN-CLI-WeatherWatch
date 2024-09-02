import React, {FC, ReactElement, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Appbar, Modal, Portal} from 'react-native-paper';
import Search, {LocationResult} from './Search';
import Weather from './Weather';

const Home: FC = (): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<LocationResult>({
    id: 1272175,
    name: 'Durgapur',
    latitude: 23.51583,
    longitude: 87.30801,
    elevation: 100,
    feature_code: 'PPL',
    country_code: 'IN',
    admin1_id: 1252881,
    timezone: 'Asia/Kolkata',
    population: 518872,
    country_id: 1269750,
    country: 'India',
    admin1: 'West Bengal',
  });

  const showHideSearchModal = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={selectedCity.name} />
        <Appbar.Action icon="magnify" onPress={showHideSearchModal} />
      </Appbar.Header>

      <Weather {...selectedCity} />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={showHideSearchModal}
          contentContainerStyle={styles.container}>
          <Search
            selectedCity={e => {
              if (e !== undefined) {
                setSelectedCity(e);
                showHideSearchModal();
              }
            }}
          />
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default Home;
