import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'primary';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

export const ActionButton: React.FC<Props> = ({ title, onPress, variant = 'default', style, textStyle }) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.button, isPrimary && styles.primaryButton, style]}
    >
      <Text style={[styles.buttonText, isPrimary && styles.primaryButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
  primaryButton: {
    backgroundColor: '#2f95dc',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ActionButton;
