// src/features/menu/hooks/useMenuManager.ts
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu } from '../types';

const STORAGE_MENUS_KEY = 'platescore.menus.v1';
const STORAGE_SELECTED_MENU_ID_KEY = 'platescore.selectedMenuId.v1';

export function useMenuManager() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [isMenuPickerVisible, setIsMenuPickerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editMenuId, setEditMenuId] = useState<string | null>(null);
  const [editMenuName, setEditMenuName] = useState('');

  const selectedMenu = menus.find((m) => m.id === selectedMenuId) ?? null;

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [menusJson, selectedId] = await Promise.all([
          AsyncStorage.getItem(STORAGE_MENUS_KEY),
          AsyncStorage.getItem(STORAGE_SELECTED_MENU_ID_KEY),
        ]);
        if (menusJson) {
          const parsed = JSON.parse(menusJson) as Menu[];
          if (Array.isArray(parsed)) {
            setMenus(parsed);
          }
        }
        if (selectedId) {
          setSelectedMenuId(selectedId);
        }
      } catch {
        // Ignore hydration errors and fall back to empty state.
      } finally {
        setIsHydrated(true);
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const persist = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_MENUS_KEY, JSON.stringify(menus));
      } catch {
        // Ignore persistence errors.
      }
    };
    persist();
  }, [menus, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    const persistSelected = async () => {
      try {
        if (selectedMenuId) {
          await AsyncStorage.setItem(STORAGE_SELECTED_MENU_ID_KEY, selectedMenuId);
        } else {
          await AsyncStorage.removeItem(STORAGE_SELECTED_MENU_ID_KEY);
        }
      } catch {
        // Ignore persistence errors.
      }
    };
    persistSelected();
  }, [selectedMenuId, isHydrated]);

  // 新規メニュー登録（画像選択 → 名前入力モーダルを開く）
  const handlePickImageFromLibrary = async () => {
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

  const handleCaptureImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('権限が必要です', 'カメラを使うには権限が必要です。');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const handleAddMenu = () => {
    Alert.alert('画像の選択', '追加する画像を選んでください', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'ライブラリから選ぶ', onPress: handlePickImageFromLibrary },
      { text: 'カメラで撮影', onPress: handleCaptureImageFromCamera },
    ]);
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
      scoringCriteria: '',
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

  const handleStartEditMenu = (menuId: string) => {
    const target = menus.find((menu) => menu.id === menuId);
    if (!target) return;
    setEditMenuId(menuId);
    setEditMenuName(target.name);
    setIsMenuPickerVisible(false);
    setIsEditModalVisible(true);
  };

  const handleConfirmEditMenu = () => {
    if (!editMenuId) {
      setIsEditModalVisible(false);
      return;
    }
    const trimmedName = editMenuName.trim();
    if (!trimmedName) {
      Alert.alert('名前を入力してください');
      return;
    }
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === editMenuId ? { ...menu, name: trimmedName } : menu
      )
    );
    setIsEditModalVisible(false);
    setEditMenuId(null);
    setEditMenuName('');
  };

  const handleCancelEditMenu = () => {
    setIsEditModalVisible(false);
    setEditMenuId(null);
    setEditMenuName('');
  };

  const updateMenuCriteria = (menuId: string, criteria: string) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === menuId
          ? { ...menu, scoringCriteria: criteria }
          : menu
      )
    );
  };

  return {
    menus,
    selectedMenu,
    selectedMenuId,
    isNameModalVisible,
    newMenuName,
    isMenuPickerVisible,
    isEditModalVisible,
    editMenuName,
    setNewMenuName,
    setIsMenuPickerVisible,
    setEditMenuName,
    handleAddMenu,
    handleConfirmAddMenu,
    handleCancelAddMenu,
    handleOpenMenuPicker,
    handleSelectMenu,
    handleDeleteMenu,
    handleStartEditMenu,
    handleConfirmEditMenu,
    handleCancelEditMenu,
    updateMenuCriteria,
  };
}
