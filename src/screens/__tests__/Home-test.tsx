import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Home from '../Home';
import {SafeAreaProvider} from 'react-native-safe-area-context'; // Import the Home component

describe('Home Component', () => {
  it('renders the city name correctly', () => {
    const {getByTestId} = render(
      <SafeAreaProvider>
        <Home />
      </SafeAreaProvider>,
    );
    expect(getByTestId('cityName').props.title).toBe('Durgapur');
  });

  it('opens and closes the search modal on magnify icon press', async () => {
    const {getByTestId, queryByTestId} = render(<Home />);

    // Check that modal is initially not visible
    expect(queryByTestId('searchModal')).toBeNull();

    // Press the magnify icon to open the modal
    fireEvent.press(getByTestId('magnifyIcon'));

    // Wait for the modal to appear
    await waitFor(() => expect(getByTestId('searchModal')).toBeTruthy());

    // Close the modal by pressing again
    fireEvent.press(getByTestId('magnifyIcon'));

    // Wait for the modal to disappear
    await waitFor(() => expect(queryByTestId('searchModal')).toBeNull());
  });

  it('updates the selected city when a new city is selected', async () => {
    const {getByTestId, getByText} = render(<Home />);

    // Open the search modal
    fireEvent.press(getByTestId('magnifyIcon'));

    // Simulate selecting a city (mocked interaction)
    const newCity = {name: 'Kolkata'};
    fireEvent.press(getByText('Kolkata')); // Assuming city name appears in the search

    // Wait for the modal to close and the city name to update
    await waitFor(() =>
      expect(getByTestId('cityName').props.title).toBe('Kolkata'),
    );
  });
});
