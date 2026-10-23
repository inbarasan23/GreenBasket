import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function ScreenHeader({ title, subtitle }) {
  return <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  title: { color: COLORS.text, fontFamily: FONTS.black, fontSize: 27, letterSpacing: -0.8, marginBottom: 5 },
  subtitle: { color: COLORS.muted, fontFamily: FONTS.medium, fontSize: 13, lineHeight: 19 }
});