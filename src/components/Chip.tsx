/**
 * Chip — icon + label pill matching the desktop .chip design system component.
 *
 * Usage:
 *   <Chip icon="🏠" label="Properties" variant="primary" />
 *   <Chip icon="📋" label="3 active" variant="buy" onPress={() => ...} />
 */
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useColors } from '../context/ThemeContext';
import { Radius, Spacing, Typography } from '../theme';

type Variant = 'primary' | 'buy' | 'sell' | 'success' | 'warning' | 'danger' | 'muted';

interface Props {
  /** Emoji or short text icon */
  icon?: string;
  label: string;
  variant?: Variant;
  /** Optional numeric count displayed as a small pill after the label */
  count?: number;
  onPress?: () => void;
  style?: object;
}

export default function Chip({ icon, label, variant = 'primary', count, onPress, style }: Props) {
  const C = useColors();

  const { fg, bg } = resolveVariant(variant, C);

  const content = (
    <View style={[styles.chip, { backgroundColor: bg }, style]}>
      {icon ? <Text style={[styles.icon]}>{icon}</Text> : null}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
      {count !== undefined ? (
        <View style={[styles.countPill, { backgroundColor: fg + '22' }]}>
          <Text style={[styles.countText, { color: fg }]}>{count}</Text>
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

function resolveVariant(v: Variant, C: ReturnType<typeof useColors>) {
  switch (v) {
    case 'buy':     return { fg: C.buy,     bg: C.indigo2 };
    case 'sell':    return { fg: C.sell,    bg: C.cyan2 };
    case 'success': return { fg: C.success, bg: C.success2 };
    case 'warning': return { fg: C.warning, bg: C.warning2 };
    case 'danger':  return { fg: C.danger,  bg: C.danger2 };
    case 'muted':   return { fg: C.textMuted, bg: C.bgElevated };
    default:        return { fg: C.primary, bg: C.primary2 };
  }
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  icon: {
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    ...Typography.smMd,
  },
  countPill: {
    borderRadius: Radius.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
});
