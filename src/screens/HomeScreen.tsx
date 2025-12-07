// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type HomeScreenProps = {
    onPressStartCapture: () => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onPressStartCapture }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Food Trainer</Text>
            <Text style={styles.subtitle}>盛り付けチェックアプリ </Text>
            <View style={styles.buttonWrapper}>
                <Button title="Start Capture" onPress={onPressStartCapture} />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonWrapper: {
    marginTop: 8,
    width: '60%',
  },
});