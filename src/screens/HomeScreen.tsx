// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type HomeScreenProps = {
    onPressStartCapture: () => void;
    onPressAddMenu: () => void;
    onPressNextMenu: () => void;
    onPressPickCompareImage: () => void;
    selectedMenuName?: string;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
    onPressStartCapture,
    onPressAddMenu,
    onPressNextMenu,
    onPressPickCompareImage,
    selectedMenuName,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Food Trainer</Text>
            <Text style={styles.subtitle}>盛り付けチェックアプリ </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>メニュー</Text>
                <Text style={styles.menuLabel}>
                    選択中メニュー：{selectedMenuName ?? "（未選択）"}
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <View style={styles.buttonWrapper}>
                    <Button title="新規メニュー登録" onPress={onPressAddMenu}/>
                </View>
                 <View style={styles.buttonWrapper}>
                    <Button title="メニュー切り替え" onPress={onPressNextMenu}/>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.startButtonWrapper}>
                    <Button title="撮影スタート" onPress={onPressStartCapture} />
                </View>
                <View style={styles.startButtonWrapper}>
                  <Button
                    title="手持ちの画像と比較"
                    onPress={onPressPickCompareImage}
                    />
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
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
  buttonRow: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    flex: 1,
    marginRight: 8,
  },
  startButtonWrapper: {
    marginTop: 8,
  },
});