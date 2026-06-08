import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { MOCK_PROPERTIES, MOCK_TASKS } from '../../data/mockData';
import { Task } from '../../types';

const { width } = Dimensions.get('window');

function fmt(n: number) {
  return n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : `$${(n / 1000).toFixed(0)}K`;
}

function NetWorthStrip() {
  const portfolio = MOCK_PROPERTIES.reduce((s, p) => s + p.currentValue, 0);
  const mortgage = MOCK_PROPERTIES.reduce((s, p) => s + p.mortgageBalance, 0);
  const equity = portfolio - mortgage;

  return (
    <LinearGradient colors={[Colors.bgElevated, Colors.bgSurface]} style={styles.strip}>
      {[
        { label: 'Portfolio', value: fmt(portfolio), color: Colors.primary },
        { label: 'Mortgage', value: fmt(mortgage), color: Colors.sell },
        { label: 'Equity', value: fmt(equity), color: Colors.success },
      ].map((item, i) => (
        <View key={i} style={[styles.stripCell, i < 2 && styles.stripDivider]}>
          <Text style={[styles.stripValue, { color: item.color }]}>{item.value}</Text>
          <Text style={Typography.label}>{item.label}</Text>
        </View>
      ))}
    </LinearGradient>
  );
}

function JourneyBanner({ type }: { type: 'buy' | 'sell' }) {
  const isBuy = type === 'buy';
  const color = isBuy ? Colors.buy : Colors.sell;
  const progress = isBuy ? 3 / 16 : 3 / 16;
  return (
    <LinearGradient
      colors={isBuy ? ['#1e1b4b', '#312e81'] : ['#0f2e2b', '#134e4a']}
      style={styles.banner}
    >
      <View style={styles.bannerRow}>
        <View>
          <Text style={styles.bannerLabel}>{isBuy ? 'Buy Journey' : 'Sell Journey'}</Text>
          <Text style={styles.bannerStage}>{isBuy ? 'Stage 3 · Make an Offer' : 'Stage 3 · List Property'}</Text>
        </View>
        <View style={[styles.bannerBadge, { backgroundColor: color + '33', borderColor: color }]}>
          <Text style={[styles.bannerBadgeText, { color }]}>3/16</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </LinearGradient>
  );
}

function PropertyCard({ property }: { property: typeof MOCK_PROPERTIES[0] }) {
  const nav = useNavigation<any>();
  const equityPct = property.equity / property.currentValue;
  return (
    <TouchableOpacity style={styles.propCard} onPress={() => nav.navigate('PropertyDetail', { property })} activeOpacity={0.85}>
      <Image source={{ uri: property.imageUrl }} style={styles.propImage} />
      <View style={styles.propBody}>
        <Text style={Typography.h3}>{property.address}</Text>
        <Text style={Typography.sm}>{property.city}, {property.state}</Text>
        <View style={styles.propStats}>
          <Text style={styles.propValue}>{fmt(property.currentValue)}</Text>
          <Text style={styles.propEquity}>Equity: {fmt(property.equity)}</Text>
        </View>
        <View style={styles.equityTrack}>
          <View style={[styles.equityFill, { width: `${equityPct * 100}%` }]} />
        </View>
        <Text style={styles.equityLabel}>{(equityPct * 100).toFixed(0)}% equity</Text>
      </View>
    </TouchableOpacity>
  );
}

function TaskList() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const priorityColor: Record<string, string> = { high: Colors.danger, medium: Colors.warning, low: Colors.success };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tasks</Text>
      {tasks.filter(t => !t.completed).slice(0, 4).map(task => (
        <TouchableOpacity key={task.id} style={styles.taskRow} onPress={() => toggle(task.id)}>
          <View style={[styles.taskDot, { backgroundColor: priorityColor[task.priority] }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={Typography.xs}>Due {task.dueDate}</Text>
          </View>
          <Ionicons name="ellipse-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <NetWorthStrip />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Journeys</Text>
        <JourneyBanner type="sell" />
        <JourneyBanner type="buy" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Properties</Text>
        {MOCK_PROPERTIES.map(p => <PropertyCard key={p.id} property={p} />)}
      </View>

      <TaskList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgBase },
  section: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm, color: Colors.textSecondary, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },

  strip: { flexDirection: 'row', paddingVertical: Spacing.md, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  stripCell: { flex: 1, alignItems: 'center' },
  stripDivider: { borderRightWidth: 1, borderColor: Colors.bgBorder },
  stripValue: { fontSize: 20, fontWeight: '700', marginBottom: 2 },

  banner: { borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.bgBorder },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  bannerLabel: { color: Colors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  bannerStage: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  bannerBadge: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  bannerBadgeText: { fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },

  propCard: { backgroundColor: Colors.bgSurface, borderRadius: Radius.lg, marginBottom: Spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: Colors.bgBorder },
  propImage: { width: '100%', height: 160 },
  propBody: { padding: Spacing.md },
  propStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, marginBottom: Spacing.xs },
  propValue: { color: Colors.textPrimary, fontSize: 17, fontWeight: '700' },
  propEquity: { color: Colors.success, fontSize: 14, fontWeight: '600' },
  equityTrack: { height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, marginBottom: 4 },
  equityFill: { height: 4, borderRadius: 2, backgroundColor: Colors.success },
  equityLabel: { color: Colors.textMuted, fontSize: 11 },

  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1, borderColor: Colors.bgBorder },
  taskDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  taskTitle: { color: Colors.textPrimary, fontSize: 14, marginBottom: 2 },
});
