// app.tsx
import React, { useState } from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';

type ScreenName = 'home' | 'capture';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {screen === 'home' ? (
        <HomeScreen onPressStartCapture={() => setScreen('capture')} />
      ) : (
        <CaptureScreen onPressBack={() => setScreen('home')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});