import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../context/ThemeContext';
import { Spacing } from '../theme';

interface Props {
  title: string;
  right?: React.ReactNode;
}

export default function TopBar({ title, right }: Props) {
  const C      = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.bar,
      {
        paddingTop: insets.top + 8,
        backgroundColor: C.bgSurface,
        borderBottomColor: C.bgBorder,
      },
    ]}>
      <Text style={[styles.brand, { color: C.textPrimary }]}>{title}</Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingBottom: 12, borderBottomWidth: 1 },
  brand: { flex: 1, fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  right: { flexDirection: 'row', alignItems: 'center' },
});
