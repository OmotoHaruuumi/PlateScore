// app.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useMenuManager } from './src/features/menu/hooks/useMenuManager';
import { MenuModals } from './src/features/menu/components/MenuModals';
import { useComparisonFlow } from './src/features/evaluation/hooks/useComparisonFlow';
import { usePlateScore } from './src/features/evaluation/hooks/usePlateScore';

export default function App() {
  const [scoringCriteria, setScoringCriteria] = useState<string>('');
  const {
    menus,
    selectedMenu,
    selectedMenuId,
    isNameModalVisible,
    newMenuName,
    isMenuPickerVisible,
    isEditModalVisible,
    editMenuName,
    setNewMenuName,
    setIsMenuPickerVisible,
    setEditMenuName,
    handleAddMenu,
    handleConfirmAddMenu,
    handleCancelAddMenu,
    handleOpenMenuPicker,
    handleSelectMenu,
    handleDeleteMenu,
    handleStartEditMenu,
    handleConfirmEditMenu,
    handleCancelEditMenu,
    updateMenuCriteria,
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
    comment,
    loading,
    error,
    croppedTemplateUri,
    croppedCompareUri,
  } = usePlateScore(
    selectedMenu?.imageUri ?? null,
    capturedImageUri,
    scoringCriteria,
    screen === 'result',
  );

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
    setScoringCriteria(selectedMenu?.scoringCriteria ?? '');
  }, [selectedMenu?.id, selectedMenu?.scoringCriteria]);

  const isScoreValid =
    Boolean(selectedMenu?.imageUri) &&
    Boolean(capturedImageUri) &&
    selectedMenu?.imageUri === lastScoredTemplateUriRef.current &&
    capturedImageUri === lastScoredCompareUriRef.current;
  const homeScore = isScoreValid ? score : null;
  const homeComment = isScoreValid ? comment : null;
  const safeAreaEdges = screen === 'capture'
    ? ['left', 'right', 'bottom'] as const
    : ['top', 'left', 'right', 'bottom'] as const;
  const handleStartScoring = () => {
    if (selectedMenuId) {
      updateMenuCriteria(selectedMenuId, scoringCriteria);
    }
    goResult();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, screen === 'capture' && styles.captureSafeArea]}
        edges={safeAreaEdges}
      >
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
          scoreComment={homeComment}
          scoreLoading={loading}
          scoreError={error}
          onPressStartScoring={handleStartScoring}
          scoringCriteria={scoringCriteria}
          onChangeScoringCriteria={setScoringCriteria}
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
            handleCapturedFromCamera(uri, false)
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
        comment={comment}
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
        isEditModalVisible={isEditModalVisible}
        editMenuName={editMenuName}
        onChangeEditMenuName={setEditMenuName}
        onConfirmEditMenu={handleConfirmEditMenu}
        onCancelEditMenu={handleCancelEditMenu}
        onSelectMenu={handleSelectMenu}
        onCloseMenuPicker={() => setIsMenuPickerVisible(false)}
        onDeleteMenu={handleDeleteMenu}
        onStartEditMenu={handleStartEditMenu}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  captureSafeArea: {
    backgroundColor: '#000',
  },
});
