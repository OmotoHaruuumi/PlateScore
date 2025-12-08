// src/screens/CaptureScreen.tsx
import React, {useRef} from 'react';
import { View, Text, Button, StyleSheet, Image , Dimensions} from 'react-native';
import {CameraView, useCameraPermissions} from  'expo-camera'


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
    // カメラ権限の状態と，権限リクエスト関数
    const [permission, requestPermission] = useCameraPermissions();

    // カメラを使う
    const cameraRef = useRef<CameraView | null>(null);

    //シャッターを押された時の処理
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
    
    // permissionがnullの場合，まだ権限の確認が終わっていない
    if (!permission) {
       return (
        <View style={styles.container}>
            <Text>カメラ権限を確認しています．．．</Text>
        </View>
       )
    }

    // 権限がまだ許可されていない場合
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>
                    カメラを使うには権限が必要です
                </Text>
                <Button title="カメラ権限を許可する" onPress={requestPermission} />
                <View style = {{height:16}}/>
                <Button title="ホームに戻る" onPress={onPressBack} />
                </View>
        );
    }

    //権限が許可されている場合→カメラプレビューを表示
    return (
        <View style={styles.container}>
            {/* カメラプレビュー表示部分 */}
            <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef}/>
            
            {/* 画面上に重ねるUI（戻るボタンなど） */}
            {selectedMenuImageUri && (
                <Image
                    source = {{uri: selectedMenuImageUri}}
                    style={{
                        width: width,   // 画面の幅
                        height: height, // 画面の高さ
                        opacity: 0.2, 
                    }}
                    resizeMode = "cover"
                />
            )}


            <View style={styles.overlayTop}>
                <Button title="ホームに戻る" onPress={onPressBack} />
            </View>

            <View style={styles.overlayBottom}>
                <Text style={styles.helpText}>
                    器を中央に合わせてください
                </Text>

                <View style={styles.menuButtonRow}>
                    <View style={styles.menuButtonWrapper}>
                        <Button title='新規メニュー登録' onPress={onPressAddMenu}/>
                    </View>
                    <View style={styles.menuButtonWrapper}>
                        <Button title='メニュー切り替え' onPress={onPressNextMenu}/>
                    </View>
                </View>
            <View style={{ marginTop: 16 }}>
                <Button title="シャッター" onPress={handlePressShutter} />
            </View>
                <View style={{marginTop:50}}>
                    <Button
                        title = "手持ちの画像と比較"
                        onPress = {onPressPickCompareImage}
                    />
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
  overlayTop: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
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
  menuLabel: {
    color: 'white',
    fontSize: 14,
  },
  menuButtonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  menuButtonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
});

