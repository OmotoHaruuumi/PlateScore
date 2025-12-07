// src/features/menu/components/MenuModals.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Menu } from '../types';

type MenuModalsProps = {
  menus: Menu[];
  selectedMenuId: string | null;
  isNameModalVisible: boolean;
  newMenuName: string;
  onChangeNewMenuName: (name: string) => void;
  onConfirmAddMenu: () => void;
  onCancelAddMenu: () => void;
  isMenuPickerVisible: boolean;
  onSelectMenu: (menuId: string) => void;
  onCloseMenuPicker: () => void;
};

export const MenuModals: React.FC<MenuModalsProps> = ({
  menus,
  selectedMenuId,
  isNameModalVisible,
  newMenuName,
  onChangeNewMenuName,
  onConfirmAddMenu,
  onCancelAddMenu,
  isMenuPickerVisible,
  onSelectMenu,
  onCloseMenuPicker,
}) => {
  return (
    <>
      {/* 新規メニュー名入力モーダル */}
      <Modal
        visible={isNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={onCancelAddMenu}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新しいメニュー名を入力</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="例：醤油ラーメン、味噌ラーメン"
              value={newMenuName}
              onChangeText={onChangeNewMenuName}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={onCancelAddMenu}
              >
                <Text style={styles.modalButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOk]}
                onPress={onConfirmAddMenu}
              >
                <Text style={styles.modalButtonText}>登録</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* メニュー選択モーダル */}
      <Modal
        visible={isMenuPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={onCloseMenuPicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>メニューを選択</Text>
            {menus.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={styles.menuItem}
                onPress={() => onSelectMenu(menu.id)}
              >
                <Text style={styles.menuItemText}>
                  {menu.name}
                  {menu.id === selectedMenuId ? '（選択中）' : ''}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { marginTop: 12 }]}
              onPress={onCloseMenuPicker}
            >
              <Text style={styles.modalButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalButtonCancel: {
    backgroundColor: '#aaa',
  },
  modalButtonOk: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 16,
  },
});