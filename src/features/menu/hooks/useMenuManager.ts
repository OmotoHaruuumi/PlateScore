// src/features/menu/hooks/useMenuManager.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Menu } from '../types';

export function useMenuManager() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [isMenuPickerVisible, setIsMenuPickerVisible] = useState(false);

  const selectedMenu = menus.find((m) => m.id === selectedMenuId) ?? null;

  // 新規メニュー登録（画像選択 → 名前入力モーダルを開く）
  const handleAddMenu = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '権限が必要です',
        'ギャラリーから画像を選ぶには権限が必要です。'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    setPendingImageUri(asset.uri);
    setNewMenuName('');
    setIsNameModalVisible(true);
  };

  // 名前入力モーダル「登録」
  const handleConfirmAddMenu = () => {
    if (!pendingImageUri) {
      setIsNameModalVisible(false);
      return;
    }

    const trimmedName = newMenuName.trim();
    if (!trimmedName) {
      Alert.alert('名前を入力してください');
      return;
    }

    const newMenu: Menu = {
      id: String(Date.now()),
      name: trimmedName,
      imageUri: pendingImageUri,
    };

    setMenus((prev) => [...prev, newMenu]);
    setSelectedMenuId(newMenu.id);

    setPendingImageUri(null);
    setNewMenuName('');
    setIsNameModalVisible(false);
  };

  // 名前入力モーダル「キャンセル」
  const handleCancelAddMenu = () => {
    setPendingImageUri(null);
    setNewMenuName('');
    setIsNameModalVisible(false);
  };

  // メニュー選択モーダルを開く
  const handleOpenMenuPicker = () => {
    if (menus.length === 0) {
      Alert.alert(
        'メニューがありません',
        'まずは「新規メニュー登録」でお手本を追加してください。'
      );
      return;
    }
    setIsMenuPickerVisible(true);
  };

  // メニュー一覧から選択
  const handleSelectMenu = (menuId: string) => {
    setSelectedMenuId(menuId);
    setIsMenuPickerVisible(false);
  };

  const handleDeleteMenu = (menuId: string) => {
    const target = menus.find((menu) => menu.id === menuId);
    if (!target) return;

    Alert.alert(
      'このメニューを削除しますか?',
      `「${target.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setMenus((prev) => prev.filter((menu) => menu.id !== menuId));
            setSelectedMenuId((prev) => {
              if (prev !== menuId) return prev;
              const remaining = menus.filter((menu) => menu.id !== menuId);
              return remaining[0]?.id ?? null;
            });
          },
        },
      ]
    );
  };

  return {
    menus,
    selectedMenu,
    selectedMenuId,
    isNameModalVisible,
    newMenuName,
    isMenuPickerVisible,
    setNewMenuName,
    setIsMenuPickerVisible,
    handleAddMenu,
    handleConfirmAddMenu,
    handleCancelAddMenu,
    handleOpenMenuPicker,
    handleSelectMenu,
    handleDeleteMenu,
  };
}