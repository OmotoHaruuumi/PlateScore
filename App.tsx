// app.tsx
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { useMenuManager } from './src/features/menu/hooks/useMenuManager';
import { MenuModals } from './src/features/menu/components/MenuModals';

type ScreenName = 'home' | 'capture';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('home');

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
  } = useMenuManager();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {screen === 'home' ? (
        <HomeScreen
          onPressStartCapture={() => setScreen('capture')}
          onPressAddMenu={handleAddMenu}
          onPressNextMenu={handleOpenMenuPicker}
          selectedMenuName={selectedMenu?.name}
        />
      ) : (
        <CaptureScreen
          onPressBack={() => setScreen('home')}
          onPressAddMenu={handleAddMenu}
          onPressNextMenu={handleOpenMenuPicker}
          selectedMenuImageUri={selectedMenu?.imageUri}
          selectedMenuName={selectedMenu?.name}
        />
      )}

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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});