// app.tsx
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useMenuManager } from './src/features/menu/hooks/useMenuManager';
import { MenuModals } from './src/features/menu/components/MenuModals';
import { useComparisonFlow } from './src/features/evaluation/hooks/useComparisonFlow';

type ScreenName = 'home' | 'capture' | 'result';

export default function App() {
  const {
    menus,
    selectedMenu,
    selectedMenuId,
    isNameModalVisible,
    newMenuName,
    isMenuPickerVisible,
    setNewMenuName,
    setIsMenuPickerVisible,
    handleAddMenu,
    handleConfirmAddMenu,
    handleCancelAddMenu,
    handleOpenMenuPicker,
    handleSelectMenu,
    handleDeleteMenu,
  } = useMenuManager();

  const {
    screen,
    capturedImageUri,
    goHome,
    goCapture,
    goResult, // （今は直接使わなくてもOK）
    handleCapturedFromCamera,
    pickCompareImageFromLibrary,
  } = useComparisonFlow();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {screen === 'home' ? (
        <HomeScreen
          onPressStartCapture={goCapture}
          onPressAddMenu={handleAddMenu}
          onPressNextMenu={handleOpenMenuPicker}
          onPressPickCompareImage={pickCompareImageFromLibrary}
          selectedMenuImageUri={selectedMenu?.imageUri}
          selectedMenuName={selectedMenu?.name}
        />
      ) : screen === 'capture' ? (
        <CaptureScreen
          onPressBack={goHome}
          onPressAddMenu={handleAddMenu}
          onPressNextMenu={handleOpenMenuPicker}
          onPressPickCompareImage={pickCompareImageFromLibrary}
          selectedMenuImageUri={selectedMenu?.imageUri}
          selectedMenuName={selectedMenu?.name}
          onCaptured={handleCapturedFromCamera}
        />
      ) : (
        <ResultScreen
        onPressBackToHome={goHome}
        onPressBackToCapture={goCapture}
        templateImageUri={selectedMenu?.imageUri ?? null}
        capturedImageUri={capturedImageUri}
        onPressAddMenu={handleAddMenu}
        onPressChangeTemplate={handleOpenMenuPicker}
        onPressChangeCapturedFromLibrary={pickCompareImageFromLibrary}
        />
      )
      }

      {/* メニュー関連のモーダルは専用コンポーネントに委譲 */}
      <MenuModals
        menus={menus}
        selectedMenuId={selectedMenuId}
        isNameModalVisible={isNameModalVisible}
        newMenuName={newMenuName}
        onChangeNewMenuName={setNewMenuName}
        onConfirmAddMenu={handleConfirmAddMenu}
        onCancelAddMenu={handleCancelAddMenu}
        isMenuPickerVisible={isMenuPickerVisible}
        onSelectMenu={handleSelectMenu}
        onCloseMenuPicker={() => setIsMenuPickerVisible(false)}
        onDeleteMenu={handleDeleteMenu}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
