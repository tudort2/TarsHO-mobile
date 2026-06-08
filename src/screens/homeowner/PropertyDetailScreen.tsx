import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { Property, Task } from '../../types';
import { api } from '../../api/client';

const { width } = Dimensions.get('window');

function fmt(n: number) { return `$${n.toLocaleString()}`; }

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={Typography.label}>{label}</Text>
    </View>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const priorityColor: Record<string, string> = { high: Colors.danger, medium: Colors.warning, low: Colors.success };
  return (
    <TouchableOpacity style={styles.taskRow} onPress={onToggle}>
      <View style={[styles.taskDot, { backgroundColor: priorityColor[task.priority] }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, task.completed && styles.taskDone]}>{task.title}</Text>
        {task.dueDate && <Text style={Typography.xs}>Due {task.dueDate}</Text>}
      </View>
      <Ionicons name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={task.completed ? Colors.success : Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function PropertyDetailScreen() {
  const nav   = useNavigation();
  const route = useRoute<any>();
  const property: Property = route.params?.property;

  const [tasks, setTasks]     = useState<Task[]>(property?.tasks || []);
  const [loading, setLoading] = useState(false);

  // Fetch tasks if not passed
  useEffect(() => {
    if (property && (!property.tasks || property.tasks.length === 0)) {
      setLoading(true);
      api.properties.tasks.list(property.id)
        .then(setTasks)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [property?.id]);

  const toggleTask = async (task: Task) => {
    try {
      const updated = await api.properties.tasks.update(property.id, task.id, task.completed ? 'pending' : 'done');
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch { /* silent */ }
  };

  if (!property) return null;

  const appreciation    = property.currentValue - property.purchasePrice;
  const appreciationPct = property.purchasePrice > 0 ? (appreciation / property.purchasePrice) * 100 : 0;
  const equityPct       = property.currentValue > 0 ? (property.equity / property.currentValue) * 100 : 0;

  return (
    <View style={styles.screen}>
      {/* Hero band */}
      <LinearGradient colors={['#1e3a5f', '#1d4ed8']} style={styles.heroBand}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="home-outline" size={48} color="rgba(255,255,255,0.3)" />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Address */}
        <View style={styles.addrSection}>
          <Text style={Typography.h1}>{property.address}</Text>
          <Text style={Typography.sm}>{property.city}, {property.state} {property.zip}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCell label="Current Value"  value={fmt(property.currentValue)} />
          <StatCell label="Equity"         value={fmt(property.equity)} />
          <StatCell label="Sqft"           value={property.sqft ? property.sqft.toLocaleString() : '—'} />
          <StatCell label="Beds/Baths"     value={property.beds ? `${property.beds}bd/${property.baths}ba` : '—'} />
          <StatCell label="Year Built"     value={property.yearBuilt ? `${property.yearBuilt}` : '—'} />
          <StatCell label="Appreciation"   value={property.purchasePrice ? `+${appreciationPct.toFixed(1)}%` : '—'} />
        </View>

        {/* AVM range */}
        {property.avmLow && property.avmHigh && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Valuation Range</Text>
            <View style={styles.avmCard}>
              <Text style={styles.avmText}>
                {fmt(property.avmLow)} – {fmt(property.avmHigh)}
              </Text>
              <Text style={[Typography.xs, { marginTop: 4 }]}>Quantarium AVM estimate</Text>
            </View>
          </View>
        )}

        {/* Equity bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equity Breakdown</Text>
          <View style={styles.equityCard}>
            <View style={styles.equityRow}>
              <Text style={Typography.body}>Equity</Text>
              <Text style={{ color: Colors.success, fontWeight: '700' }}>{fmt(property.equity)} ({equityPct.toFixed(0)}%)</Text>
            </View>
            <View style={styles.equityTrack}>
              <View style={[styles.equityFill, { width: `${Math.min(equityPct, 100)}%` }]} />
            </View>
            <View style={styles.equityLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
                <Text style={Typography.xs}>Equity {fmt(property.equity)}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
                <Text style={Typography.xs}>Mortgage {fmt(property.mortgageBalance)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mortgage */}
        {property.purchasePrice > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mortgage</Text>
            <View style={styles.mortgageCard}>
              <View style={styles.mortRow}>
                <Text style={Typography.sm}>Purchase Price</Text>
                <Text style={Typography.body}>{fmt(property.purchasePrice)}</Text>
              </View>
              <View style={styles.mortRow}>
                <Text style={Typography.sm}>Current Balance</Text>
                <Text style={[Typography.body, { color: Colors.danger }]}>{fmt(property.mortgageBalance)}</Text>
              </View>
              {property.mortgageRate && (
                <View style={styles.mortRow}>
                  <Text style={Typography.sm}>Rate</Text>
                  <Text style={Typography.body}>{property.mortgageRate}%</Text>
                </View>
              )}
              {property.purchasePrice > 0 && (
                <View style={styles.mortRow}>
                  <Text style={Typography.sm}>Appreciation</Text>
                  <Text style={[Typography.body, { color: Colors.success }]}>+{fmt(appreciation)} (+{appreciationPct.toFixed(1)}%)</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {loading
            ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
            : tasks.length === 0
              ? <Text style={[Typography.sm, { marginTop: 8 }]}>No tasks yet.</Text>
              : tasks.map(t => <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t)} />)
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.bgBase },
  heroBand:    { width, height: 160, alignItems: 'center', justifyContent: 'center' },
  backBtn:     { position: 'absolute', top: 48, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  addrSection: { padding: Spacing.md, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  statsGrid:   { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: Spacing.sm },
  statCell:    { width: '30%', backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.bgBorder, flex: 1, minWidth: '30%' },
  statValue:   { color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  section:     { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle:{ ...Typography.label, marginBottom: Spacing.sm },
  avmCard:     { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder, alignItems: 'center' },
  avmText:     { color: Colors.primary, fontSize: 18, fontWeight: '700' },
  equityCard:  { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  equityRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  equityTrack: { height: 8, backgroundColor: Colors.bgBorder, borderRadius: 4, marginBottom: Spacing.sm },
  equityFill:  { height: 8, borderRadius: 4, backgroundColor: Colors.success },
  equityLegend:{ flexDirection: 'row', gap: Spacing.md },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:   { width: 8, height: 8, borderRadius: 4 },
  mortgageCard:{ backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  mortRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  taskRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1, borderColor: Colors.bgBorder },
  taskDot:     { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  taskTitle:   { color: Colors.textPrimary, fontSize: 14, marginBottom: 2 },
  taskDone:    { color: Colors.textMuted, textDecorationLine: 'line-through' },
});
