import React, {useRef, useState} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { ActionButton } from '../ui/ActionButton';
import { HomeBackButton } from '../ui/HomeBackButton';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cameraRef = useRef<CameraView | null>(null);

    const handlePressShutter = async () => {
        if(!cameraRef.current || !onCaptured) return;

        try{
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                skipProcessing: true,
            });
            if (photo?.uri){
                onCaptured(photo.uri);
            }
        } catch (e) {
            console.warn('撮影に失敗しました', e);
        }
    };

    const handleMenuAction = (action: () => void) => {
        setIsMenuOpen(false);
        action();
    };

    if (!permission) {
       return (
        <View style={styles.container}>
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
            <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef}/>

            {selectedMenuImageUri && (
                <Image
                    source={{uri: selectedMenuImageUri}}
                    style={{
                        width: width,
                        height: height,
                        opacity: 0.2,
                    }}
                    resizeMode="contain"
                />
            )}

            <View style={styles.overlayTop}>
                <HomeBackButton onPress={onPressBack} />
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.menuTrigger}
                    onPress={() => setIsMenuOpen((prev) => !prev)}
                >
                    <Text style={styles.menuTriggerText}>MENU</Text>
                </TouchableOpacity>
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

            <View style={styles.overlayBottom}>
                <View style={{ marginTop: 16 }}>
                    <ActionButton title="シャッター" variant="primary" onPress={handlePressShutter} />
                </View>
                <Text style={styles.helpText}>
                    器を中央に合わせてください
                </Text>
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
  overlayTop: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 120,
    marginBottom: 0,
  },
  backButtonText: {
    fontSize: 14,
  },
  menuTrigger: {
    width: 64,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111',
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
  overlayBottom: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  helpText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
});
