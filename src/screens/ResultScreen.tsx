// src/screens/ResultScreen.tsx
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { usePlateScore } from '../features/evaluation/hooks/usePlateScore';


type ResultScreenProps = {
  onPressBackToCapture: () => void;
  templateImageUri: string | null;
  capturedImageUri: string | null;
  onPressAddMenu: () => void;
  onPressChangeTemplate: () => void; 
  onPressChangeCapturedFromLibrary: () => void; 
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  onPressBackToCapture,
  templateImageUri,
  capturedImageUri, 
  onPressAddMenu,
  onPressChangeTemplate,
  onPressChangeCapturedFromLibrary,
}) => {
  const {
    score,
    loading,
    error,
    croppedTemplateUri,
    croppedCompareUri,
  } = usePlateScore(templateImageUri, capturedImageUri);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>撮影結果</Text>

      <View style={styles.row}>
        <View style={styles.imageBlock}>
          <Text style={styles.label}>お手本</Text>
          {croppedTemplateUri ? (
            <Image source={{ uri: croppedTemplateUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>メニューが選択されていません</Text>
          )}
        </View>

        <View style={styles.imageBlock}>
          <Text style={styles.label}>比較対象</Text>
          {croppedCompareUri ? (
            <Image source={{ uri: croppedCompareUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>画像がありません</Text>
          )}
        </View>
      </View>

      <View style={styles.scoreBlock}>
        <Text style={styles.scoreTitle}>暫定スコア（ダミー）</Text>
        <Text style={styles.scoreValue}>{score ?? '-'} 点</Text>
        <Text style={styles.scoreNote}>
          ここに将来、ヒストグラムやCNNによるスコアを表示します。
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onPressAddMenu}>
          <Text style={styles.actionButtonText}>お手本を追加する</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onPressChangeTemplate}>
          <Text style={styles.actionButtonText}>お手本を変更する（ライブラリ）</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onPressChangeCapturedFromLibrary}>
          <Text style={styles.actionButtonText}>比較画像を変更する（ライブラリ）</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onPressBackToCapture}>
          <Text style={[styles.actionButtonText, styles.primaryButtonText]}>カメラで撮影する</Text>
        </TouchableOpacity>
      </View>
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
  /* ボタン周りのスタイルを追加 */
  actions: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#111',
  },
  primaryButton: {
    backgroundColor: '#2f95dc',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});