// app.tsx
import React, { useState } from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Alert} from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import * as ImagePicker from 'expo-image-picker';

type ScreenName = 'home' | 'capture';

type Menu = {
  id: string;
  name: string;
  imageUri: string;
};

export default function App() {
  // スクリーンの状態
  const [screen, setScreen] = useState<ScreenName>('home');

  // メニューリストの状態
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const selectedMenu = menus.find((menu) => menu.id === selectedMenuId) ?? null;

  
  // 新規メニュー登録（ギャラリーからお手本画像を選ぶ）
  const handleAddMenu = async () => {
    //ギャラリーへのアクセス権限をリクエスト
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status != 'granted'){
      Alert.alert('権限が必要です','ギャラリーから画像を選ぶには権限が必要です');
      return;
    }
  
  // 画像を１枚選択
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (result.canceled) {
    return;
  }
  

  const asset = result.assets[0];
  const newMenu: Menu = {
    id: String(Date.now()),
    name: `メニュー${menus.length + 1}`,
    imageUri: asset.uri,
  };

  setMenus((prev) => [...prev, newMenu]);
  setSelectedMenuId(newMenu.id);
  };



  // 次のメニューに切り替え（簡易メニュー選択）
  const handleSelectNextMenu = () => {
    if (menus.length === 0){
      Alert.alert('メニューがありません', 'まずは「新規メニュー登録」でお手本を追加してください');
      return;
    }

    if(!selectedMenuId) {
      setSelectedMenuId(menus[0].id);
      return;
    }

    const currentIndex = menus.findIndex((menu) => menu.id === selectedMenuId);
    const nextIndex = (currentIndex + 1) % menus.length;
    setSelectedMenuId(menus[nextIndex].id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {screen === 'home' ? (
        <HomeScreen 
        onPressStartCapture={() => setScreen('capture')}
        onPressAddMenu={handleAddMenu}
        onPressNextMenu={handleSelectNextMenu}
        selectedMenuName={selectedMenu?.name} 
        />
      ) : (
        <CaptureScreen 
        onPressBack={() => setScreen('home')} 
        onPressAddMenu={handleAddMenu}
        onPressNextMenu={handleSelectNextMenu}
        selectedMenuImageUri={selectedMenu?.imageUri}
        selectedMenuName={selectedMenu?.name}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});