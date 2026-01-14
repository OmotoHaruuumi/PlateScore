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
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#1c1c1c',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    fontSize: 16,
    color: '#f5f5f5',
  },
  primaryButton: {
    backgroundColor: '#2f95dc',
    borderColor: 'rgba(47,149,220,0.9)',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ActionButton;
