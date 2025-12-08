// src/screens/ResultScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';

type ResultScreenProps = {
  onPressBackToCapture: () => void;
  templateImageUri: string | null;
  capturedImageUri: string | null;
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  onPressBackToCapture,
  templateImageUri,
  capturedImageUri,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>撮影結果</Text>

      <View style={styles.row}>
        <View style={styles.imageBlock}>
          <Text style={styles.label}>お手本</Text>
          {templateImageUri ? (
            <Image source={{ uri: templateImageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>メニューが選択されていません</Text>
          )}
        </View>

        <View style={styles.imageBlock}>
          <Text style={styles.label}>撮影した写真</Text>
          {capturedImageUri ? (
            <Image source={{ uri: capturedImageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>写真がありません</Text>
          )}
        </View>
      </View>

      <View style={styles.scoreBlock}>
        <Text style={styles.scoreTitle}>暫定スコア（ダミー）</Text>
        <Text style={styles.scoreValue}>100 点</Text>
        <Text style={styles.scoreNote}>
          ここに将来、ヒストグラムやCNNによるスコアを表示します。
        </Text>
      </View>

      <Button title="もう一度撮影する" onPress={onPressBackToCapture} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  imageBlock: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  image: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  placeholder: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  scoreBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});