import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { ActionButton } from '../ui/ActionButton';
import { HomeBackButton } from '../ui/HomeBackButton';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const TOP_BAR_HEIGHT = 70;
const BOTTOM_BAR_HEIGHT = 163;
const OVERLAY_OPACITY_MIN = 0.20;
const OVERLAY_OPACITY_MAX = 0.85;

type CaptureScreenProps = {
    onPressBack: () => void;
    onPressAddMenu: () => void;
    onPressNextMenu: () => void;
    onPressPickCompareImage: () => void;
    selectedMenuImageUri?: string | null;
    selectedMenuName?: string;
    onCaptured?: (uri: string) => void;
};

export const CaptureScreen: React.FC<CaptureScreenProps> = ({
    onPressBack,
    onPressAddMenu,
    onPressNextMenu,
    onPressPickCompareImage,
    selectedMenuImageUri,
    selectedMenuName,
    onCaptured
 }) => {
    // カメラ権限状態と権限リクエスト関数
    const [permission, requestPermission] = useCameraPermissions();
    const insets = useSafeAreaInsets();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [overlayOpacity, setOverlayOpacity] = useState(0.2);
    const [sliderWidth, setSliderWidth] = useState(1);

    const actualTopBarHeight = TOP_BAR_HEIGHT + insets.top;
    const frameTop = actualTopBarHeight;
    const frameHeight = Math.max(1, height - actualTopBarHeight - BOTTOM_BAR_HEIGHT);

    const cameraRef = useRef<CameraView | null>(null);

    const resolvePhotoSize = (uri: string, widthValue?: number, heightValue?: number) => {
        if (widthValue && heightValue) {
            return Promise.resolve({ width: widthValue, height: heightValue });
        }
        return new Promise<{ width: number; height: number }>((resolve, reject) => {
            Image.getSize(
                uri,
                (resolvedWidth, resolvedHeight) =>
                    resolve({ width: resolvedWidth, height: resolvedHeight }),
                (error) => reject(error)
            );
        });
    };

    const handlePressShutter = async () => {
        if(!cameraRef.current || !onCaptured) return;

        try{
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                skipProcessing: false,
            });
            if (photo?.uri){
                const { width: photoWidth, height: photoHeight } = await resolvePhotoSize(
                    photo.uri,
                    photo.width,
                    photo.height
                );
                if (photoWidth && photoHeight) {
                    const screenAspect = width / height;
                    const photoAspect = photoWidth / photoHeight;
                    let scale = 1;
                    let offsetX = 0;
                    let offsetY = 0;

                    if (photoAspect > screenAspect) {
                        scale = height / photoHeight;
                        offsetX = (width - photoWidth * scale) / 2;
                    } else {
                        scale = width / photoWidth;
                        offsetY = (height - photoHeight * scale) / 2;
                    }

                    const frameLeft = 0;
                    const frameTopLocal = frameTop;
                    const frameRight = width;
                    const frameBottom = frameTop + frameHeight;
                    const cropOriginX = Math.round((frameLeft - offsetX) / scale);
                    const cropOriginY = Math.round((frameTopLocal - offsetY) / scale);
                    const cropRight = Math.round((frameRight - offsetX) / scale);
                    const cropBottom = Math.round((frameBottom - offsetY) / scale);
                    const safeOriginX = Math.min(Math.max(cropOriginX, 0), photoWidth - 1);
                    const safeOriginY = Math.min(Math.max(cropOriginY, 0), photoHeight - 1);
                    const safeRight = Math.min(Math.max(cropRight, safeOriginX + 1), photoWidth);
                    const safeBottom = Math.min(Math.max(cropBottom, safeOriginY + 1), photoHeight);
                    const cropped = await ImageManipulator.manipulateAsync(
                        photo.uri,
                        [
                            {
                                crop: {
                                    originX: safeOriginX,
                                    originY: safeOriginY,
                                    width: safeRight - safeOriginX,
                                    height: safeBottom - safeOriginY,
                                },
                            },
                        ],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    onCaptured(cropped.uri);
                } else {
                    onCaptured(photo.uri);
                }
            }
        } catch (e) {
            console.warn('撮影に失敗しました', e);
        }
    };

    const handleMenuAction = (action: () => void) => {
        setIsMenuOpen(false);
        action();
    };

    const handleSliderUpdate = (locationX: number) => {
        const widthValue = Math.max(sliderWidth, 1);
        const clampedX = Math.min(Math.max(locationX, 0), widthValue);
        const ratio = clampedX / widthValue;
        const nextOpacity = OVERLAY_OPACITY_MIN + ratio * (OVERLAY_OPACITY_MAX - OVERLAY_OPACITY_MIN);
        setOverlayOpacity(nextOpacity);
    };

    const sliderRange = OVERLAY_OPACITY_MAX - OVERLAY_OPACITY_MIN;
    const sliderRatio = sliderRange === 0
        ? 0
        : Math.min(Math.max((overlayOpacity - OVERLAY_OPACITY_MIN) / sliderRange, 0), 1);
    const sliderThumbLeft = Math.min(Math.max(sliderRatio * sliderWidth - 10, 0), sliderWidth - 20);

    if (!permission) {
       return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="black" barStyle="light-content" />
            <Text>カメラ権限を確認しています...</Text>
        </View>
       );
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>
                    カメラを使うには権限が必要です
                </Text>
                <ActionButton title="カメラ権限を許可する" onPress={requestPermission} />
                <View style={{height:16}}/>
                <ActionButton title="ホームに戻る" onPress={onPressBack} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraFrame}>
                <CameraView
                    style={styles.cameraView}
                    facing="back"
                    ref={cameraRef}
                />
            </View>

            {selectedMenuImageUri && (
                <Image
                    source={{uri: selectedMenuImageUri}}
                    style={{
                        position: 'absolute',
                        top: frameTop,
                        left: 0,
                        width: width,
                        height: frameHeight,
                        opacity: overlayOpacity,
                    }}
                    resizeMode="cover"
                />
            )}

            <View
                pointerEvents="none"
                style={[styles.frameMaskTop, { height: frameTop }]}
            />
            <View
                pointerEvents="none"
                style={[styles.frameMaskBottom, { top: frameTop + frameHeight }]}
            />

            <View style={[styles.topBar, { height: actualTopBarHeight, paddingTop: 12 + insets.top }]}>
                <View style={styles.overlayTop}>
                    <HomeBackButton onPress={onPressBack} />
                    <View
                        style={styles.opacitySlider}
                        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
                        onStartShouldSetResponder={() => true}
                        onResponderGrant={(event) => handleSliderUpdate(event.nativeEvent.locationX)}
                        onResponderMove={(event) => handleSliderUpdate(event.nativeEvent.locationX)}
                    >
                        <View style={styles.opacityTrack} />
                        <View
                            style={[
                                styles.opacityThumb,
                                {
                                    left: sliderThumbLeft,
                                },
                            ]}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.menuTrigger}
                        onPress={() => setIsMenuOpen((prev) => !prev)}
                    >
                        <Text style={styles.menuTriggerText}>MENU</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isMenuOpen && (
                <View style={styles.menuPanel}>
                    <Text style={styles.menuTitle}>メニュー</Text>
                    <ActionButton
                        title="新規メニュー登録"
                        onPress={() => handleMenuAction(onPressAddMenu)}
                        style={styles.menuActionButton}
                        textStyle={styles.menuActionText}
                    />
                    <ActionButton
                        title="メニュー切り替え"
                        onPress={() => handleMenuAction(onPressNextMenu)}
                        style={styles.menuActionButton}
                        textStyle={styles.menuActionText}
                    />
                    <ActionButton
                        title="手持ちの画像と比較"
                        onPress={() => handleMenuAction(onPressPickCompareImage)}
                        style={styles.menuActionButton}
                        textStyle={styles.menuActionText}
                    />
                </View>
            )}

            <View style={styles.bottomBar}>
                <View style={styles.overlayBottom}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="シャッター"
                        activeOpacity={0.85}
                        style={styles.shutterButton}
                        onPress={handlePressShutter}
                    >
                        <View style={styles.shutterInner} />
                    </TouchableOpacity>
                    <Text style={styles.helpText}>
                        器を中央に合わせてください
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
  },
  overlayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  backButton: {
    width: 120,
    marginBottom: 0,
  },
  backButtonText: {
    fontSize: 14,
  },
  menuTrigger: {
    width: 68,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(17,17,17,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  menuTriggerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  opacitySlider: {
    flex: 1,
    marginHorizontal: 12,
    height: 28,
    justifyContent: 'center',
  },
  opacityTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  opacityThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  menuPanel: {
    position: 'absolute',
    top: 88,
    right: 16,
    width: 220,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  menuTitle: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  menuActionButton: {
    width: '100%',
    marginBottom: 8,
  },
  menuActionText: {
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_BAR_HEIGHT,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: 'rgba(0,0,0,1)',
    justifyContent: 'center',
  },
  overlayBottom: {
    alignItems: 'center',
  },
  cameraFrame: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  cameraView: {
    flex: 1,
  },
  frameMaskTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  frameMaskBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginBottom: 4,
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f5f5f5',
  },
  helpText: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 0,
  },
});
