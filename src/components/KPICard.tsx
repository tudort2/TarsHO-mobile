/**
 * KPICard — stat display card matching the desktop .kpi-card component.
 * Shows a large metric value, a label, and an optional trend indicator.
 *
 * Usage:
 *   <KPICard value="$1.2M" label="Portfolio Value" trend="+12%" trendUp />
 *   <KPICard value="8" label="Active Clients" icon="👥" />
 *   <KPICard value="Stage 3" label="Current Stage" variant="buy" />
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../context/ThemeContext';
import { Radius, Shadow, Spacing, Typography } from '../theme';

type Variant = 'default' | 'primary' | 'buy' | 'sell' | 'success' | 'warning' | 'danger';

interface Props {
  value: string | number;
  label: string;
  /** Optional emoji or text icon displayed above the value */
  icon?: string;
  /** Optional trend string e.g. "+12%" */
  trend?: string;
  /** Whether the trend is positive (green) or negative (red) */
  trendUp?: boolean;
  variant?: Variant;
  style?: object;
}

export default function KPICard({
  value,
  label,
  icon,
  trend,
  trendUp,
  variant = 'default',
  style,
}: Props) {
  const C = useColors();

  const accentColor = resolveAccent(variant, C);
  const trendColor = trendUp ? C.success : C.danger;

  return (
    <View style={[
      styles.card,
      { backgroundColor: C.bgSurface, borderColor: C.bgBorder },
      Shadow.sm,
      style,
    ]}>
      {icon ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : (
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      )}

      <Text style={[styles.value, { color: accentColor !== C.textPrimary ? accentColor : C.textPrimary }]}>
        {value}
      </Text>

      <Text style={[styles.label, { color: C.textSecondary }]}>{label}</Text>

      {trend ? (
        <View style={[styles.trendPill, { backgroundColor: trendColor + '18' }]}>
          <Text style={[styles.trendText, { color: trendColor }]}>
            {trendUp ? '▲ ' : '▼ '}{trend}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function resolveAccent(v: Variant, C: ReturnType<typeof useColors>): string {
  switch (v) {
    case 'primary': return C.primary;
    case 'buy':     return C.buy;
    case 'sell':    return C.sell;
    case 'success': return C.success;
    case 'warning': return C.warning;
    case 'danger':  return C.danger;
    default:        return C.textPrimary;
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    minWidth: 120,
    alignItems: 'flex-start',
    gap: 4,
  },
  accentBar: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginBottom: 4,
  },
  icon: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 4,
  },
  value: {
    ...Typography.monoLg,
  },
  label: {
    ...Typography.label,
    marginTop: 2,
  },
  trendPill: {
    marginTop: 6,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
