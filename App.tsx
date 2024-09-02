import React from 'react';
import {PaperProvider} from 'react-native-paper';
import Home from './src/screens/Home';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SafeAreaProvider>
          <Home />
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
