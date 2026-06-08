import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { Property, Engagement, Task } from '../../types';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

function fmt(n: number) {
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`;
}

// ── Net worth strip ───────────────────────────────────────────────────────────
function NetWorthStrip({ properties }: { properties: Property[] }) {
  const portfolio = properties.reduce((s, p) => s + p.currentValue, 0);
  const mortgage  = properties.reduce((s, p) => s + p.mortgageBalance, 0);
  const equity    = portfolio - mortgage;

  return (
    <LinearGradient colors={[Colors.bgElevated, Colors.bgSurface]} style={styles.strip}>
      {[
        { label: 'Portfolio', value: fmt(portfolio), color: Colors.primary },
        { label: 'Mortgage',  value: fmt(mortgage),  color: Colors.sell },
        { label: 'Equity',    value: fmt(equity),    color: Colors.success },
      ].map((item, i) => (
        <View key={i} style={[styles.stripCell, i < 2 && styles.stripDivider]}>
          <Text style={[styles.stripValue, { color: item.color }]}>{item.value}</Text>
          <Text style={Typography.label}>{item.label}</Text>
        </View>
      ))}
    </LinearGradient>
  );
}

// ── Journey banner ────────────────────────────────────────────────────────────
function JourneyBanner({ engagement }: { engagement: Engagement }) {
  const isBuy = engagement.type === 'buy';
  const color = isBuy ? Colors.buy : Colors.sell;
  const progress = engagement.currentStage / engagement.totalStages;
  const currentStageName = engagement.stages.find(s => s.status === 'current')?.name
    || `Stage ${engagement.currentStage}`;

  return (
    <LinearGradient
      colors={isBuy ? ['#1e1b4b', '#312e81'] : ['#0f2e2b', '#134e4a']}
      style={styles.banner}
    >
      <View style={styles.bannerRow}>
        <View>
          <Text style={styles.bannerLabel}>{isBuy ? 'Buy Journey' : 'Sell Journey'}</Text>
          <Text style={styles.bannerStage}>Stage {engagement.currentStage} · {currentStageName}</Text>
        </View>
        <View style={[styles.bannerBadge, { backgroundColor: color + '33', borderColor: color }]}>
          <Text style={[styles.bannerBadgeText, { color }]}>
            {engagement.currentStage}/{engagement.totalStages}
          </Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </LinearGradient>
  );
}

// ── Property card ─────────────────────────────────────────────────────────────
const PROP_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
];

function PropertyCard({ property, index }: { property: Property; index: number }) {
  const nav = useNavigation<any>();
  const equityPct = property.currentValue > 0 ? property.equity / property.currentValue : 0;
  const imgUrl = PROP_IMAGES[index % PROP_IMAGES.length];

  return (
    <TouchableOpacity
      style={styles.propCard}
      onPress={() => nav.navigate('PropertyDetail', { property: { ...property, imageUrl: imgUrl } })}
      activeOpacity={0.85}
    >
      {/* Color band instead of image for speed */}
      <LinearGradient colors={['#1e3a5f', '#2563eb']} style={styles.propBand}>
        <Ionicons name="home-outline" size={32} color="rgba(255,255,255,0.4)" />
      </LinearGradient>
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

// ── Task list ─────────────────────────────────────────────────────────────────
function TaskList({ tasks, propertyId, onToggle }: {
  tasks: Task[];
  propertyId: string;
  onToggle: (taskId: string, done: boolean) => void;
}) {
  const priorityColor: Record<string, string> = { high: Colors.danger, medium: Colors.warning, low: Colors.success };
  const pending = tasks.filter(t => !t.completed).slice(0, 4);
  if (pending.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tasks</Text>
      {pending.map(task => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskRow}
          onPress={() => onToggle(task.id, !task.completed)}
        >
          <View style={[styles.taskDot, { backgroundColor: priorityColor[task.priority] }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.dueDate ? <Text style={Typography.xs}>Due {task.dueDate}</Text> : null}
          </View>
          <Ionicons name="ellipse-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const { user } = useAuth();
  const [properties, setProperties]   = useState<Property[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState('');

  const load = useCallback(async () => {
    try {
      const [props, engs] = await Promise.all([api.properties.list(), api.engagements.list()]);
      setProperties(props);
      setEngagements(engs.filter(e => e.status === 'active'));
      setError('');
    } catch (e: any) {
      setError(e.message || 'Could not load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleTask = async (propertyId: string, taskId: string, done: boolean) => {
    try {
      await api.properties.tasks.update(propertyId, taskId, done ? 'done' : 'pending');
      setProperties(prev => prev.map(p =>
        p.id === propertyId
          ? { ...p, tasks: (p.tasks || []).map(t => t.id === taskId ? { ...t, completed: done } : t) }
          : p
      ));
    } catch { /* silent */ }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}
    >
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <NetWorthStrip properties={properties} />

      {engagements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Journeys</Text>
          {engagements.map(e => <JourneyBanner key={e.id} engagement={e} />)}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Properties</Text>
        {properties.length === 0
          ? <Text style={[Typography.sm, { padding: Spacing.md }]}>No properties yet.</Text>
          : properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)
        }
      </View>

      {properties.map(p =>
        (p.tasks || []).length > 0 ? (
          <TaskList
            key={p.id}
            tasks={p.tasks!}
            propertyId={p.id}
            onToggle={(taskId, done) => handleToggleTask(p.id, taskId, done)}
          />
        ) : null
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Colors.bgBase },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgBase },
  errorBanner: { backgroundColor: '#450a0a', margin: Spacing.md, borderRadius: Radius.sm, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger },
  errorText: { color: '#fca5a5', fontSize: 13 },

  section:      { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm, color: Colors.textSecondary, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 },

  strip:        { flexDirection: 'row', paddingVertical: Spacing.md, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  stripCell:    { flex: 1, alignItems: 'center' },
  stripDivider: { borderRightWidth: 1, borderColor: Colors.bgBorder },
  stripValue:   { fontSize: 20, fontWeight: '700', marginBottom: 2 },

  banner:         { borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.bgBorder },
  bannerRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  bannerLabel:    { color: Colors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  bannerStage:    { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  bannerBadge:    { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  bannerBadgeText:{ fontSize: 12, fontWeight: '700' },
  progressTrack:  { height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2 },
  progressFill:   { height: 4, borderRadius: 2 },

  propCard:    { backgroundColor: Colors.bgSurface, borderRadius: Radius.lg, marginBottom: Spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: Colors.bgBorder },
  propBand:    { width: '100%', height: 80, alignItems: 'center', justifyContent: 'center' },
  propBody:    { padding: Spacing.md },
  propStats:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, marginBottom: Spacing.xs },
  propValue:   { color: Colors.textPrimary, fontSize: 17, fontWeight: '700' },
  propEquity:  { color: Colors.success, fontSize: 14, fontWeight: '600' },
  equityTrack: { height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, marginBottom: 4 },
  equityFill:  { height: 4, borderRadius: 2, backgroundColor: Colors.success },
  equityLabel: { color: Colors.textMuted, fontSize: 11 },

  taskRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1, borderColor: Colors.bgBorder },
  taskDot:   { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  taskTitle: { color: Colors.textPrimary, fontSize: 14, marginBottom: 2 },
});
