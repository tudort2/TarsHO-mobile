import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Property, Task } from '../../types';
import { api } from '../../api/client';

const { width } = Dimensions.get('window');
function fmt(n: number) { return '$' + n.toLocaleString(); }

export default function PropertyDetailScreen() {
  const C    = useColors();
  const nav  = useNavigation();
  const route = useRoute<any>();
  const property: Property = route.params?.property;

  const [tasks, setTasks]     = useState<Task[]>(property?.tasks || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property && (!property.tasks || property.tasks.length === 0)) {
      setLoading(true);
      api.properties.tasks.list(property.id)
        .then(setTasks).catch(() => {}).finally(() => setLoading(false));
    }
  }, [property?.id]);

  const toggleTask = async (task: Task) => {
    try {
      const updated = await api.properties.tasks.update(
        property.id, task.id, task.completed ? 'pending' : 'done'
      );
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch { /* silent */ }
  };

  if (!property) return null;

  const appreciation    = property.currentValue - property.purchasePrice;
  const appreciationPct = property.purchasePrice > 0 ? (appreciation / property.purchasePrice) * 100 : 0;
  const equityPct       = property.currentValue > 0 ? (property.equity / property.currentValue) * 100 : 0;

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>
      <LinearGradient colors={['#1e3a5f', '#1d4ed8']} style={styles.heroBand}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="home-outline" size={48} color="rgba(255,255,255,0.3)" />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.addrSection, { borderBottomColor: C.bgBorder }]}>
          <Text style={[Typography.h1, { color: C.textPrimary }]}>{property.address}</Text>
          <Text style={[Typography.sm, { color: C.textMuted }]}>{property.city}, {property.state} {property.zip}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Current Value',  value: fmt(property.currentValue) },
            { label: 'Equity',         value: fmt(property.equity) },
            { label: 'Sqft',           value: property.sqft ? property.sqft.toLocaleString() : '—' },
            { label: 'Beds/Baths',     value: property.beds ? `${property.beds}bd/${property.baths}ba` : '—' },
            { label: 'Year Built',     value: property.yearBuilt ? `${property.yearBuilt}` : '—' },
            { label: 'Appreciation',   value: property.purchasePrice ? `+${appreciationPct.toFixed(1)}%` : '—' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCell, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Text style={[styles.statValue, { color: C.primary }]}>{s.value}</Text>
              <Text style={[Typography.xs, { color: C.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* AVM range */}
        {property.avmLow && property.avmHigh && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: C.textMuted }]}>Valuation Range</Text>
            <View style={[styles.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder, alignItems: 'center' }]}>
              <Text style={[styles.avmText, { color: C.primary }]}>{fmt(property.avmLow)} – {fmt(property.avmHigh)}</Text>
              <Text style={[Typography.xs, { color: C.textMuted, marginTop: 4 }]}>Quantarium AVM estimate</Text>
            </View>
          </View>
        )}

        {/* Equity bar */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.textMuted }]}>Equity Breakdown</Text>
          <View style={[styles.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <View style={styles.row}>
              <Text style={[Typography.body, { color: C.textPrimary }]}>Equity</Text>
              <Text style={{ color: C.success, fontWeight: '700' }}>{fmt(property.equity)} ({equityPct.toFixed(0)}%)</Text>
            </View>
            <View style={[styles.track, { backgroundColor: C.bgBorder }]}>
              <View style={[styles.fill, { width: `${Math.min(equityPct, 100)}%`, backgroundColor: C.success }]} />
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.dot, { backgroundColor: C.success }]} />
                <Text style={[Typography.xs, { color: C.textMuted }]}>Equity {fmt(property.equity)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.dot, { backgroundColor: C.danger }]} />
                <Text style={[Typography.xs, { color: C.textMuted }]}>Mortgage {fmt(property.mortgageBalance)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mortgage */}
        {property.purchasePrice > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: C.textMuted }]}>Mortgage</Text>
            <View style={[styles.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              {[
                { label: 'Purchase Price',  value: fmt(property.purchasePrice),    color: C.textPrimary },
                { label: 'Current Balance', value: fmt(property.mortgageBalance),   color: C.danger },
                ...(property.mortgageRate ? [{ label: 'Rate', value: `${property.mortgageRate}%`, color: C.textPrimary }] : []),
                { label: 'Appreciation',   value: `+${fmt(appreciation)} (+${appreciationPct.toFixed(1)}%)`, color: C.success },
              ].map((item, i, arr) => (
                <View key={i} style={[styles.row, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder }]}>
                  <Text style={[Typography.sm, { color: C.textSecondary }]}>{item.label}</Text>
                  <Text style={{ color: item.color, fontWeight: '600' }}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tasks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.textMuted }]}>Tasks</Text>
          {loading
            ? <ActivityIndicator color={C.primary} style={{ marginTop: 16 }} />
            : tasks.length === 0
              ? <Text style={[Typography.sm, { color: C.textMuted, marginTop: 8 }]}>No tasks yet.</Text>
              : tasks.map(t => {
                  const priorityColor: Record<string, string> = { high: C.danger, medium: C.warning, low: C.success };
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.taskRow, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}
                      onPress={() => toggleTask(t)}
                    >
                      <View style={[styles.taskDot, { backgroundColor: priorityColor[t.priority] }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.taskTitle, { color: C.textPrimary }, t.completed && { color: C.textMuted, textDecorationLine: 'line-through' }]}>
                          {t.title}
                        </Text>
                        {t.dueDate && <Text style={[Typography.xs, { color: C.textMuted }]}>Due {t.dueDate}</Text>}
                      </View>
                      <Ionicons
                        name={t.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={t.completed ? C.success : C.textMuted}
                      />
                    </TouchableOpacity>
                  );
                })
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1 },
  heroBand:    { width, height: 160, alignItems: 'center', justifyContent: 'center' },
  backBtn:     { position: 'absolute', top: 48, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  addrSection: { padding: Spacing.md, borderBottomWidth: 1 },
  statsGrid:   { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: Spacing.sm },
  statCell:    { flex: 1, minWidth: '30%', borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', borderWidth: 1 },
  statValue:   { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  section:     { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle:{ fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  card:        { borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1 },
  avmText:     { fontSize: 18, fontWeight: '700' },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  track:       { height: 8, borderRadius: 4, marginVertical: Spacing.sm, overflow: 'hidden' },
  fill:        { height: 8, borderRadius: 4 },
  dot:         { width: 8, height: 8, borderRadius: 4 },
  taskRow:     { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1 },
  taskDot:     { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  taskTitle:   { fontSize: 14, marginBottom: 2 },
});
