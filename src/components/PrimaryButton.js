import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';

export default function PrimaryButton({ title, onPress, secondary = false, icon }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={[styles.button, secondary && styles.secondary]}>
      {icon ? <Ionicons name={icon} size={18} color={secondary ? COLORS.green : COLORS.white} style={{ marginRight: 8 }} /> : null}
      <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.green, borderRadius: 15, minHeight: 51, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 18, marginTop: 11 },
  secondary: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#C8DEC5' },
  text: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 14 },
  secondaryText: { color: COLORS.green }
});