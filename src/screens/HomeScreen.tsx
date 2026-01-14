// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
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
    scoreLoading?: boolean;
    scoreError?: string | null;
};

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const HomeScreen: React.FC<HomeScreenProps> = ({
    onPressStartCapture,
    onPressAddMenu,
    onPressNextMenu,
    onPressPickCompareImage,
    selectedMenuImageUri,
    selectedMenuName,
    selectedCompareImageUri,
    currentScore,
    scoreLoading,
    scoreError,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const scale = Math.min(screenWidth / BASE_WIDTH, screenHeight / BASE_HEIGHT);
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
            : '？点';
    const scoreNote =
        scoreError ??
        ('スコアはまだ計算されていません');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Plate Score</Text>
                <Text style={[styles.subtitle, { marginBottom: spacingLg }]}>メニューと実物を比較するアプリ</Text>
            </View>

            <View style={styles.content}
            >
                <View style={[styles.scaleStage, { transform: [{ scale }] }, { paddingHorizontal: contentPadding }]}
                >
                    <View style={[styles.section, { marginBottom: spacingMd }]}
                    >
                        <Text style={styles.sectionTitle}>現在の得点</Text>
                        <Text style={styles.scoreValue}>{scoreLabel}</Text>
                        <Text style={styles.scoreNote}>{scoreNote}</Text>
                    </View>

                    <View style={[styles.section, { marginBottom: spacingMd }]}>
                        <Text style={styles.sectionTitle}>お手本メニュー</Text>
                        <Text style={styles.menuLabel}>
                            選択中のお手本メニュー：{selectedMenuName ?? '未選択'}
                        </Text>

                        {selectedMenuImageUri ? (
                            <Image
                                source={{ uri: selectedMenuImageUri }}
                                style={styles.menuThumbnail}
                            />
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

                    <View style={[styles.section, { marginBottom: 0 }]}>
                        <Text style={styles.sectionTitle}>比較画像</Text>
                        {selectedCompareImageUri ? (
                            <Image
                                source={{ uri: selectedCompareImageUri }}
                                style={styles.menuThumbnail}
                            />
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
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    header: {
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 30,
    },
    scaleStage: {
        width: BASE_WIDTH,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
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
        marginBottom: 24,
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
    scoreValue: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    scoreNote: {
        fontSize: 12,
        color: '#666',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    buttonWrapper: {
        flex: 1,
    },
});
