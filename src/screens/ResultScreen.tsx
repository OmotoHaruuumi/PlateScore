// src/screens/ResultScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { HomeBackButton } from '../ui/HomeBackButton';
import { ActionButton } from '../ui/ActionButton';


type ResultScreenProps = {
  onPressBackToHome: () => void;
  onPressBackToCapture: () => void;
  templateImageUri: string | null;
  capturedImageUri: string | null;
  onPressAddMenu: () => void;
  onPressChangeTemplate: () => void; 
  onPressChangeCapturedFromLibrary: () => void; 
  croppedTemplateUri: string | null;
  croppedCompareUri: string | null;
  score: number | null;
  loading: boolean;
  error: string | null;
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  onPressBackToHome,
  onPressBackToCapture,
  templateImageUri,
  capturedImageUri, 
  onPressAddMenu,
  onPressChangeTemplate,
  onPressChangeCapturedFromLibrary,
  croppedTemplateUri,
  croppedCompareUri,
  score,
  loading,
  error,
}) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const guidanceText = !templateImageUri
    ? 'お手本画像を追加してください'
    : !capturedImageUri
      ? '比較画像を追加してください'
      : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topLeftButton}>
        <HomeBackButton onPress={onPressBackToHome} />
      </View>
      <Text style={styles.title}>採点結果</Text>

      <View style={styles.row}>
        <View style={styles.imageBlock}>
          <Text style={styles.label}>お手本</Text>
          {croppedTemplateUri ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setPreviewUri(croppedTemplateUri)}
            >
              <Image source={{ uri: croppedTemplateUri }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.placeholder}>メニューが選択されていません</Text>
          )}
        </View>

        <View style={styles.imageBlock}>
          <Text style={styles.label}>比較対象</Text>
          {croppedCompareUri ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setPreviewUri(croppedCompareUri)}
            >
              <Image source={{ uri: croppedCompareUri }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.placeholder}>画像がありません</Text>
          )}
        </View>
      </View>

      <View style={styles.scoreBlock}>
        <Text style={styles.scoreTitle}>得点</Text>
        {loading ? (
          <Text style={styles.scoreValue}>採点中です...</Text>
        ) : (
          <Text style={styles.scoreValue}>{score ?? '？点'} </Text>
        )}
        <Text style={styles.scoreNote}>
          {error ? error : guidanceText ? guidanceText : 'Error: スコア計算を確認してください'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Text style={styles.SettingTitle}>{'画像を変更する'}</Text>
        <ActionButton
          title={'お手本を追加する'}
          onPress={onPressAddMenu}
          style={styles.actionSpacing}
        />
        <ActionButton
          title={'お手本を変更する'}
          onPress={onPressChangeTemplate}
          style={styles.actionSpacing}
        />
        <ActionButton
          title={'比較画像を変更する'}
          onPress={onPressChangeCapturedFromLibrary}
          style={styles.actionSpacing}
        />
        <ActionButton
          title={'カメラで撮影する'}
          variant="primary"
          onPress={onPressBackToCapture}
          style={styles.actionSpacingLast}
        />
      </View>

      <Modal
        visible={Boolean(previewUri)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUri(null)}
      >
        <View style={styles.previewBackdrop}>
          <TouchableOpacity
            style={styles.previewCloseArea}
            activeOpacity={1}
            onPress={() => setPreviewUri(null)}
          />
          {previewUri && (
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={() => setPreviewUri(null)}
            activeOpacity={0.8}
          >
            <Text style={styles.previewCloseText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 100,
  },
  topLeftButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 46,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 60,
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
    marginBottom: 60,
  },
  scoreTitle: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreNote: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  SettingTitle: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  previewImage: {
    width: '92%',
    height: '92%',
  },
  previewCloseButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  previewCloseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  /* ボタン周りのスタイルを追加 */
  actions: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  actionSpacing: {
    marginBottom: 16,
  },
  actionSpacingLast: {
    marginBottom: 0,
  },
});
