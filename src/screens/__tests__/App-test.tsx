import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../../../App.tsx';

test('renders correctly', () => {
  const tree = render(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
