// src/screens/CaptureScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {CameraView, useCameraPermissions} from  'expo-camera'

type CaptureScreenProps = {
    onPressBack: () => void;
};

export const CaptureScreen: React.FC<CaptureScreenProps> = ({ onPressBack }) => {
    // カメラ権限の状態と，権限リクエスト関数
    const [permission, requestPermission] = useCameraPermissions();
    
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
            <CameraView style={StyleSheet.absoluteFill} facing="back" />
            
            {/* 画面上に重ねるUI（戻るボタンなど） */}
            <View style={styles.overlayTop}>
                <Button title="ホームに戻る" onPress={onPressBack} />
            </View>

            <View style={styles.overlayBottom}>
                <Text style={styles.helpText}>
                    器を中央に合わせてください
                </Text>
                {/* ここに将来「撮影ボタン」を追加します */}
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
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  helpText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
});

    