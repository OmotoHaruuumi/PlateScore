import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
};

export const HomeBackButton: React.FC<Props> = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Text style={styles.text}>Home</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    color: '#f5f5f5',
    fontSize: 12,
    fontWeight: '600',
  },
});
