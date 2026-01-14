// app.tsx
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useMenuManager } from './src/features/menu/hooks/useMenuManager';
import { MenuModals } from './src/features/menu/components/MenuModals';
import { useComparisonFlow } from './src/features/evaluation/hooks/useComparisonFlow';
import { usePlateScore } from './src/features/evaluation/hooks/usePlateScore';

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

  const {
    score,
    loading,
    error,
    croppedTemplateUri,
    croppedCompareUri,
  } = usePlateScore(
    selectedMenu?.imageUri ?? null,
    capturedImageUri,
    screen === 'result',
  );

  const prevCompleteRef = useRef(false);
  const prevTemplateUriRef = useRef<string | null | undefined>(undefined);
  const prevCompareUriRef = useRef<string | null>(null);
  const lastScoredTemplateUriRef = useRef<string | null>(null);
  const lastScoredCompareUriRef = useRef<string | null>(null);

  useEffect(() => {
    if (screen !== 'result') {
      return;
    }
    if (loading || error || score === null) {
      return;
    }
    if (!selectedMenu?.imageUri || !capturedImageUri) {
      return;
    }
    lastScoredTemplateUriRef.current = selectedMenu.imageUri;
    lastScoredCompareUriRef.current = capturedImageUri;
  }, [
    screen,
    loading,
    error,
    score,
    selectedMenu?.imageUri,
    capturedImageUri,
  ]);

  useEffect(() => {
    if (screen !== 'home') {
      prevCompleteRef.current = Boolean(selectedMenu?.imageUri && capturedImageUri);
      prevTemplateUriRef.current = selectedMenu?.imageUri;
      prevCompareUriRef.current = capturedImageUri;
      return;
    }
    const hasTemplate = Boolean(selectedMenu?.imageUri);
    const hasCompare = Boolean(capturedImageUri);
    const isComplete = hasTemplate && hasCompare;
    const wasComplete = prevCompleteRef.current;
    const prevTemplateUri = prevTemplateUriRef.current;
    const prevCompareUri = prevCompareUriRef.current;
    prevCompleteRef.current = isComplete;
    prevTemplateUriRef.current = selectedMenu?.imageUri;
    prevCompareUriRef.current = capturedImageUri;
    if (!hasTemplate) {
      return;
    }
    const templateChanged = hasCompare && prevTemplateUri !== selectedMenu?.imageUri;
    const compareChanged = prevCompareUri !== capturedImageUri;
    if (templateChanged && hasTemplate) {
      goResult();
      return;
    }
    if (compareChanged && hasCompare && hasTemplate) {
      goResult();
      return;
    }
    if (!wasComplete && isComplete) {
      goResult();
    }
  }, [screen, selectedMenu?.imageUri, capturedImageUri, goResult]);

  const isScoreValid =
    Boolean(selectedMenu?.imageUri) &&
    Boolean(capturedImageUri) &&
    selectedMenu?.imageUri === lastScoredTemplateUriRef.current &&
    capturedImageUri === lastScoredCompareUriRef.current;
  const homeScore = isScoreValid ? score : null;

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
          selectedCompareImageUri={croppedCompareUri ?? capturedImageUri}
          currentScore={homeScore}
          scoreLoading={loading}
          scoreError={error}
        />
      ) : screen === 'capture' ? (
        <CaptureScreen
          onPressBack={goHome}
          onPressAddMenu={handleAddMenu}
          onPressNextMenu={handleOpenMenuPicker}
          onPressPickCompareImage={pickCompareImageFromLibrary}
          selectedMenuImageUri={selectedMenu?.imageUri}
          selectedMenuName={selectedMenu?.name}
          onCaptured={(uri) =>
            handleCapturedFromCamera(uri, Boolean(selectedMenu?.imageUri))
          }
        />
      ) : (
        <ResultScreen
        onPressBackToHome={goHome}
        onPressBackToCapture={goCapture}
        templateImageUri={selectedMenu?.imageUri ?? null}
        capturedImageUri={capturedImageUri}
        croppedTemplateUri={croppedTemplateUri}
        croppedCompareUri={croppedCompareUri}
        score={score}
        loading={loading}
        error={error}
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
