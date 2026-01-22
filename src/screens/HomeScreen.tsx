// src/screens/HomeScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Modal, TouchableOpacity, Animated, Easing, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '../ui/ActionButton';

type HomeScreenProps = {
    onPressStartCapture: () => void;
    onPressAddMenu: () => void;
    onPressNextMenu: () => void;
    onPressPickCompareImage: () => void;
    selectedMenuImageUri?: string | null;
    selectedMenuName?: string;
    selectedCompareImageUri?: string | null;
    currentScore?: number | null;
    scoreComment?: string | null;
    scoreLoading?: boolean;
    scoreError?: string | null;
    onPressStartScoring?: () => void;
    scoringCriteria?: string | null;
    onChangeScoringCriteria?: (text: string) => void;
};

const BASE_WIDTH = 375;
const MAX_CONTENT_WIDTH = 520;

export const HomeScreen: React.FC<HomeScreenProps> = ({
    onPressStartCapture,
    onPressAddMenu,
    onPressNextMenu,
    onPressPickCompareImage,
    selectedMenuImageUri,
    selectedMenuName,
    selectedCompareImageUri,
    currentScore,
    scoreComment,
    scoreLoading,
    scoreError,
    onPressStartScoring,
    scoringCriteria,
    onChangeScoringCriteria,
}) => {
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const outerPadding = 8;
    const availableWidth = Math.max(0, screenWidth - outerPadding * 2);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);
    const scale = Math.min(1.2, availableWidth / BASE_WIDTH);
    const spacingSm = Math.max(8, Math.round(10 * scale));
    const contentPadding = Math.max(16, Math.round(20 * scale));
    const spacingMd = Math.max(12, Math.round(16 * scale));
    const spacingLg = Math.max(16, Math.round(22 * scale));
    const buttonPadding = Math.max(10, Math.round(12 * scale));

    const buttonStyle = { paddingVertical: buttonPadding, marginBottom: spacingSm };
    const buttonStyleLast = { paddingVertical: buttonPadding, marginBottom: 0 };

    const scoreLabel = scoreLoading
        ? '計算中...'
        : currentScore !== null && currentScore !== undefined
            ? `${currentScore}`
            : '？';
    const scoreNote =
        scoreError ??
        (currentScore !== null && currentScore !== undefined
            ? (scoreComment ?? '')
            : 'スコアはまだ計算されていません');
    const canScore = Boolean(selectedMenuImageUri && selectedCompareImageUri);
    const showScoreButton = canScore && Boolean(onPressStartScoring);
    const criteriaValue = scoringCriteria ?? '';

    useEffect(() => {
        if (!showScoreButton) {
            pulseLoopRef.current?.stop();
            pulseLoopRef.current = null;
            pulseAnim.setValue(1);
            return;
        }
        pulseLoopRef.current?.stop();
        pulseLoopRef.current = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.06,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulseLoopRef.current.start();
        return () => pulseLoopRef.current?.stop();
    }, [pulseAnim, showScoreButton]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Plate Score</Text>
                <Text style={[styles.subtitle, { marginBottom: spacingLg }]}>メニューと実物を比較するアプリ</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={[
                    styles.contentInner,
                    { paddingBottom: 30 + insets.bottom + spacingLg },
                    { paddingHorizontal: outerPadding },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.scaleStage,
                        { width: availableWidth, maxWidth: MAX_CONTENT_WIDTH },
                        { paddingHorizontal: contentPadding },
                    ]}
                >
                    <View style={[styles.section, { marginBottom: spacingMd }]}
                    >
                        <Text style={styles.sectionTitle}>現在の得点</Text>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreValue}>{scoreLabel}点</Text>
                            {showScoreButton && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={onPressStartScoring}
                                    style={styles.scoreActionWrapper}
                                >
                                    <Animated.View
                                        style={[
                                            styles.scoreAction,
                                            { transform: [{ scale: pulseAnim }] },
                                        ]}
                                    >
                                        <Text style={styles.scoreActionText}>採点</Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.scoreNote}>{scoreNote}</Text>
                    </View>

                    <View style={[styles.section, { marginBottom: spacingMd }]}>
                        <Text style={styles.sectionTitle}>お手本メニュー</Text>
                        <Text style={styles.menuLabel}>
                            選択中のお手本メニュー：{selectedMenuName ?? '未選択'}
                        </Text>

                        {selectedMenuImageUri ? (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => setPreviewUri(selectedMenuImageUri)}
                            >
                                <Image
                                    source={{ uri: selectedMenuImageUri }}
                                    style={styles.menuThumbnail}
                                />
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.menuPlaceholder}>
                                お手本画像がまだ登録されていません
                            </Text>
                        )}
                    </View>

                    <View style={[styles.buttonRow, { marginBottom: spacingMd }]}>
                        <View style={[styles.buttonWrapper, { marginRight: spacingSm }]}>
                            <ActionButton
                                title="新規メニュー登録"
                                onPress={onPressAddMenu}
                                style={buttonStyle}
                            />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <ActionButton
                                title="メニュー切り替え"
                                onPress={onPressNextMenu}
                                style={buttonStyle}
                            />
                        </View>
                    </View>

                    <View style={[styles.section, { marginBottom: spacingMd }]}>
                        <Text style={styles.sectionTitle}>採点基準</Text>
                        <TextInput
                            style={styles.criteriaInput}
                            placeholder="採点基準を入力（任意・50文字以内）"
                            value={criteriaValue}
                            onChangeText={(text) => onChangeScoringCriteria?.(text)}
                            maxLength={50}
                            editable={Boolean(onChangeScoringCriteria)}
                        />
                        <Text style={styles.criteriaHint}>空欄でも採点できます</Text>
                    </View>

                    <View style={[styles.section, { marginBottom: 0 }]}>
                        <Text style={styles.sectionTitle}>比較画像</Text>
                        {selectedCompareImageUri ? (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => setPreviewUri(selectedCompareImageUri)}
                            >
                                <Image
                                    source={{ uri: selectedCompareImageUri }}
                                    style={styles.menuThumbnail}
                                />
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.menuPlaceholder}>
                                比較画像がまだ登録されていません
                            </Text>
                        )}
                        <View style={{ marginTop: spacingSm }}>
                            <ActionButton
                                title="撮影スタート"
                                variant="primary"
                                onPress={onPressStartCapture}
                                style={buttonStyle}
                            />
                        </View>
                        <View style={{ marginTop: spacingSm }}>
                            <ActionButton
                                title="手持ちの画像と比較"
                                onPress={onPressPickCompareImage}
                                style={buttonStyleLast}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    header: {
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 30,
    },
    contentInner: {
        paddingTop: 30,
    },
    scaleStage: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'left',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    menuLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    menuThumbnail: {
        width: 120,
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginBottom: 12,
    },
    menuPlaceholder: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
    },
    criteriaInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: '#fafafa',
    },
    criteriaHint: {
        fontSize: 12,
        color: '#666',
        marginTop: 6,
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 260,
    },
    scoreActionWrapper: {
        marginLeft: 12,
    },
    scoreNote: {
        fontSize: 12,
        color: '#666',
    },
    scoreAction: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 999,
        backgroundColor: '#ff5a3c',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#ff5a3c',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    scoreActionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
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
    buttonRow: {
        flexDirection: 'row',
    },
    buttonWrapper: {
        flex: 1,
    },
});
