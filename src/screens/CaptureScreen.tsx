// src/screens/CaptureScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type CaptureScreenProps = {
    onPressBack: () => void;
};

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onPressBack }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>撮影画面</Text>
            <Text style={styles.subtitle}>ここでカメラプレビューを表示します</Text>

            <View style={styles.buttonWrapper}>
                <Button title="ホームに戻る" onPress={onPressBack} />
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
    fontSize: 22,
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

    