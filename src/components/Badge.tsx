/**
 * Badge — compact status tag matching the desktop .badge-ds component.
 *
 * Usage:
 *   <Badge label="Active" variant="success" />
 *   <Badge label="Buyer" variant="buy" />
 *   <Badge label="Stage 3 of 17" variant="primary" />
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../context/ThemeContext';
import { Radius, Typography } from '../theme';

type Variant = 'primary' | 'buy' | 'sell' | 'success' | 'warning' | 'danger' | 'muted';

interface Props {
  label: string;
  variant?: Variant;
  /** Dot indicator before label */
  dot?: boolean;
  style?: object;
}

export default function Badge({ label, variant = 'primary', dot = false, style }: Props) {
  const C = useColors();
  const { fg, bg } = resolveVariant(variant, C);

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: fg }]} /> : null}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
}

function resolveVariant(v: Variant, C: ReturnType<typeof useColors>) {
  switch (v) {
    case 'buy':     return { fg: C.buy,       bg: C.indigo2 };
    case 'sell':    return { fg: C.sell,      bg: C.cyan2 };
    case 'success': return { fg: C.success,   bg: C.success2 };
    case 'warning': return { fg: C.warning,   bg: C.warning2 };
    case 'danger':  return { fg: C.danger,    bg: C.danger2 };
    case 'muted':   return { fg: C.textMuted, bg: C.bgElevated };
    default:        return { fg: C.primary,   bg: C.primary2 };
  }
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...Typography.xs,
    fontWeight: '600',
  },
});
