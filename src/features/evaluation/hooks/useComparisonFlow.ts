// src/features/evaluation/hooks/useComparisonFlow.ts

import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export type ScreenName = 'home' | 'capture' | 'result';

export function useComparisonFlow() {
  // 画面遷移の状態をここで管理
  const [screen, setScreen] = useState<ScreenName>('home');

  // 比較用画像（カメラ or ライブラリ）のURI
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  // --- ナビゲーション系 ---
  const goHome = () => {
    // home に戻るときに画像をリセットしたいならここで null にする
    setCapturedImageUri(capturedImageUri);
    setScreen('home');
  };

  const goCapture = () => {
    setScreen('capture');
  };

  const goResult = () => {
    setScreen('result');
  };

  // --- カメラ撮影後に呼ぶ処理 ---
  const handleCapturedFromCamera = (uri: string, navigateToResult: boolean = true) => {
    setCapturedImageUri(uri);
    if (navigateToResult) {
      goResult();
    } else {
      setScreen('home');
    }
  };

  // --- ライブラリから比較用画像を選んで Result に行く処理 ---
  const pickCompareImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '権限が必要です',
        'ギャラリーから画像を選ぶには権限が必要です。'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    setCapturedImageUri(asset.uri);
    setScreen('home');
  };

  return {
    // 状態
    screen,
    capturedImageUri,

    // 画面遷移用
    goHome,
    goCapture,
    goResult,

    // カメラ撮影完了時に使う
    handleCapturedFromCamera,

    // 手持ち画像で比較するときに使う
    pickCompareImageFromLibrary,
  };
}
