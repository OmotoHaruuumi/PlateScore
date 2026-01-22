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
  comment: string | null;
  loading: boolean;
  error: string | null;
};

type ScoreTheme = {
  screen: object;
  scoreBlock: object;
  scoreTitle: object;
  scoreValue: object;
  scoreNote: object;
  rankPill: object;
  rankText: object;
  orbOne: object;
  orbTwo: object;
  orbThree: object;
  rankLabel: string;
};

const getScoreTheme = (scoreValue: number | null): ScoreTheme | null => {
  if (scoreValue == null || scoreValue === 0) return null;
  if (scoreValue >= 90) {
    return {
      screen: { backgroundColor: '#FFF7E6' },
      scoreBlock: { backgroundColor: '#FFE9B0', borderColor: '#FFC857' },
      scoreTitle: { color: '#8A5A00' },
      scoreValue: { color: '#8A5A00' },
      scoreNote: { color: '#7A4F00' },
      rankPill: { backgroundColor: '#FFB703' },
      rankText: { color: '#3B2500' },
      orbOne: { backgroundColor: '#FFD46B', width: 220, height: 220, top: -80, left: -60 },
      orbTwo: { backgroundColor: '#FFE9B0', width: 180, height: 180, top: 120, right: -50 },
      orbThree: { backgroundColor: '#FFC857', width: 140, height: 140, bottom: 40, left: 20 },
      rankLabel: 'RANK S',
    };
  }
  if (scoreValue >= 75) {
    return {
      screen: { backgroundColor: '#ECFFF6' },
      scoreBlock: { backgroundColor: '#CFF7E6', borderColor: '#5FD3A6' },
      scoreTitle: { color: '#1A6B4F' },
      scoreValue: { color: '#1A6B4F' },
      scoreNote: { color: '#1A6B4F' },
      rankPill: { backgroundColor: '#2ECC9B' },
      rankText: { color: '#083D2B' },
      orbOne: { backgroundColor: '#B6F2DD', width: 220, height: 220, top: -70, left: -50 },
      orbTwo: { backgroundColor: '#DFFAF0', width: 170, height: 170, top: 140, right: -40 },
      orbThree: { backgroundColor: '#9BE8CD', width: 130, height: 130, bottom: 50, left: 40 },
      rankLabel: 'RANK A',
    };
  }
  if (scoreValue >= 60) {
    return {
      screen: { backgroundColor: '#EEF6FF' },
      scoreBlock: { backgroundColor: '#D7EBFF', borderColor: '#6FB1FF' },
      scoreTitle: { color: '#0F4C81' },
      scoreValue: { color: '#0F4C81' },
      scoreNote: { color: '#0F4C81' },
      rankPill: { backgroundColor: '#4C8DFF' },
      rankText: { color: '#0B2C4A' },
      orbOne: { backgroundColor: '#C9E2FF', width: 220, height: 220, top: -80, left: -50 },
      orbTwo: { backgroundColor: '#E2F0FF', width: 170, height: 170, top: 130, right: -40 },
      orbThree: { backgroundColor: '#A7CCFF', width: 140, height: 140, bottom: 40, left: 30 },
      rankLabel: 'RANK B',
    };
  }
  if (scoreValue >= 40) {
    return {
      screen: { backgroundColor: '#FFF1E8' },
      scoreBlock: { backgroundColor: '#FFD8C2', borderColor: '#FF9A6B' },
      scoreTitle: { color: '#8A3D00' },
      scoreValue: { color: '#8A3D00' },
      scoreNote: { color: '#7A3600' },
      rankPill: { backgroundColor: '#FF8A4D' },
      rankText: { color: '#3B1A00' },
      orbOne: { backgroundColor: '#FFD0B8', width: 220, height: 220, top: -70, left: -50 },
      orbTwo: { backgroundColor: '#FFE5D6', width: 170, height: 170, top: 140, right: -40 },
      orbThree: { backgroundColor: '#FFB78F', width: 140, height: 140, bottom: 40, left: 30 },
      rankLabel: 'RANK C',
    };
  }
  return {
    screen: { backgroundColor: '#FFF0F0' },
    scoreBlock: { backgroundColor: '#FFD6D6', borderColor: '#FF8A8A' },
    scoreTitle: { color: '#8A1E1E' },
    scoreValue: { color: '#8A1E1E' },
    scoreNote: { color: '#8A1E1E' },
    rankPill: { backgroundColor: '#FF6B6B' },
    rankText: { color: '#3B0A0A' },
    orbOne: { backgroundColor: '#FFD1D1', width: 220, height: 220, top: -70, left: -50 },
    orbTwo: { backgroundColor: '#FFE7E7', width: 170, height: 170, top: 140, right: -40 },
    orbThree: { backgroundColor: '#FFB3B3', width: 140, height: 140, bottom: 40, left: 30 },
    rankLabel: 'RANK D',
  };
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
  comment,
  loading,
  error,
}) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const scoreValue = typeof score === 'number' ? score : null;
  const scoreTheme = getScoreTheme(scoreValue);
  const showTheme = Boolean(scoreTheme) && !loading;

  const guidanceText = !templateImageUri
    ? 'お手本画像を追加してください'
    : !capturedImageUri
      ? '比較画像を追加してください'
      : null;

  const noteText = error
    ? error
    : comment
      ? comment
      : guidanceText
        ? guidanceText
        : loading || score !== null
          ? ''
          : 'Error: スコア計算を確認してください';

  return (
    <ScrollView
      style={[styles.screen, showTheme ? scoreTheme?.screen : null]}
      contentContainerStyle={styles.container}
    >
      {showTheme && scoreTheme && (
        <View style={styles.effects} pointerEvents="none">
          <View style={[styles.orb, scoreTheme.orbOne]} />
          <View style={[styles.orb, scoreTheme.orbTwo]} />
          <View style={[styles.orb, scoreTheme.orbThree]} />
        </View>
      )}
      <View style={styles.contentLayer}>
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

      <View style={[styles.scoreBlock, showTheme ? styles.scoreBlockThemed : null, showTheme ? scoreTheme?.scoreBlock : null]}>
        {showTheme && scoreTheme ? (
          <View style={[styles.rankPill, scoreTheme.rankPill]}>
            <Text style={[styles.rankPillText, scoreTheme.rankText]}>{scoreTheme.rankLabel}</Text>
          </View>
        ) : null}
        <Text style={[styles.scoreTitle, showTheme ? scoreTheme?.scoreTitle : null]}>得点</Text>
        {loading ? (
          <Text style={[styles.scoreValue, showTheme ? scoreTheme?.scoreValue : null]}>採点中です...</Text>
        ) : (
          <Text style={[styles.scoreValue, showTheme ? scoreTheme?.scoreValue : null]}>{score ?? '？'}点 </Text>
        )}
        <Text style={[styles.scoreNote, showTheme ? scoreTheme?.scoreNote : null]}>
          {noteText}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingTop: 100,
    paddingBottom: 100,
  },
  contentLayer: {
    position: 'relative',
    zIndex: 1,
  },
  effects: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
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
  scoreBlockThemed: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 28,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
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
  rankPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  rankPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
