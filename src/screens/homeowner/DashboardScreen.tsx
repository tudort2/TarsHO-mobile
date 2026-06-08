import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Property, Engagement } from '../../types';
import { api } from '../../api/client';

// Unsplash property images (same palette as desktop)
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80',
];

function fmt(n: number) { return '$' + n.toLocaleString(); }

// ── Stats strip ──────────────────────────────────────────────────────────────
function NetWorthStrip({ properties }: { properties: Property[] }) {
  const C = useColors();
  const totalValue  = properties.reduce((s, p) => s + p.currentValue, 0);
  const totalEquity = properties.reduce((s, p) => s + p.equity, 0);
  const totalDebt   = properties.reduce((s, p) => s + p.mortgageBalance, 0);
  return (
    <View style={[styles.strip, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
      {[
        { label: 'Portfolio Value', value: fmt(totalValue),  color: C.primary },
        { label: 'Total Equity',    value: fmt(totalEquity), color: C.success },
        { label: 'Total Debt',      value: fmt(totalDebt),   color: C.danger  },
      ].map((s, i) => (
        <View key={i} style={[styles.stripCell, i < 2 && { borderRightWidth: 1, borderRightColor: C.bgBorder }]}>
          <Text style={[styles.stripValue, { color: s.color }]}>{s.value}</Text>
          <Text style={[Typography.xs, { color: C.textMuted }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Property card (vertical, full width) ────────────────────────────────────
function PropertyCard({ property, index, onPress }: {
  property: Property; index: number; onPress: () => void;
}) {
  const C = useColors();
  const imgUrl = property.imageUrl || PROPERTY_IMAGES[index % PROPERTY_IMAGES.length];
  const equityPct = property.currentValue > 0
    ? Math.round((property.equity / property.currentValue) * 100) : 0;

  return (
    <TouchableOpacity
      style={[styles.propCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: imgUrl }} style={styles.propImg} resizeMode="cover" />
      <View style={styles.propBody}>
        <Text style={[styles.propAddress, { color: C.textPrimary }]} numberOfLines={1}>
          {property.address}
        </Text>
        <Text style={[Typography.xs, { color: C.textMuted, marginBottom: Spacing.sm }]}>
          {property.city}, {property.state} · {property.beds ? `${property.beds}bd/${property.baths}ba` : ''}
        </Text>
        <View style={styles.propStats}>
          <View style={styles.propStat}>
            <Text style={[styles.propStatValue, { color: C.primary }]}>{fmt(property.currentValue)}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Est. Value</Text>
          </View>
          <View style={styles.propStat}>
            <Text style={[styles.propStatValue, { color: C.success }]}>{fmt(property.equity)}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Equity ({equityPct}%)</Text>
          </View>
          <View style={styles.propStat}>
            <Text style={[styles.propStatValue, { color: C.danger }]}>{fmt(property.mortgageBalance)}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Mortgage</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── My Next Home card ────────────────────────────────────────────────────────
function NextHomeCard({ engagement }: { engagement?: Engagement }) {
  const C = useColors();
  const done  = engagement?.stages.filter(s => s.status === 'done').length ?? 0;
  const total = engagement?.totalStages ?? 0;
  const pct   = total > 0 ? (done / total) * 100 : 0;
  const currentStage = engagement?.stages.find(s => s.status === 'current');

  return (
    <View style={[styles.propCard, { backgroundColor: C.bgSurface, borderColor: C.buy + '55', borderWidth: 1.5 }]}>
      {/* Real image for My Next Home */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80' }}
          style={styles.propImg}
          resizeMode="cover"
        />
        <View style={[styles.nextHomeBadge, { backgroundColor: C.buy }]}>
          <Text style={styles.nextHomeBadgeText}>MY NEXT HOME</Text>
        </View>
      </View>
      <View style={styles.propBody}>
        {engagement ? (
          <>
            <Text style={[styles.propAddress, { color: C.textPrimary }]}>Buy Journey Active</Text>
            <Text style={[Typography.xs, { color: C.textMuted, marginBottom: Spacing.sm }]}>
              {currentStage?.name ?? `Stage ${engagement.currentStage} of ${total}`}
            </Text>
            <View style={[styles.progressTrack, { backgroundColor: C.bgBorder }]}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: C.buy }]} />
            </View>
            <Text style={[Typography.xs, { color: C.textMuted, marginTop: 4 }]}>
              {done} of {total} stages complete
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.propAddress, { color: C.textPrimary }]}>Start Your Home Search</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>
              Connect with a broker to begin your buying journey
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();

  const [properties,  setProperties]  = useState<Property[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [props, engs] = await Promise.all([
        api.properties.list(),
        api.engagements.list(),
      ]);
      setProperties(props);
      setEngagements(engs.filter(e => e.status === 'active'));
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const buyEngagement = engagements.find(e => e.type === 'buy');

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: C.bgBase }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: C.bgBase }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={C.primary} />
      }
    >
      {error && (
        <View style={[styles.errorBanner, { backgroundColor: C.danger + '22', borderColor: C.danger }]}>
          <Ionicons name="warning-outline" size={16} color={C.danger} />
          <Text style={[styles.errorText, { color: C.danger }]}>{error}</Text>
        </View>
      )}

      <NetWorthStrip properties={properties} />

      <View style={styles.listPad}>
        {/* My properties */}
        <Text style={[styles.sectionTitle, { color: C.textMuted }]}>My Properties</Text>

        {properties.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <Ionicons name="home-outline" size={36} color={C.bgBorder2} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm }]}>No properties yet.</Text>
          </View>
        ) : (
          properties.map((p, i) => (
            <PropertyCard
              key={p.id}
              property={p}
              index={i}
              onPress={() => nav.navigate('PropertyDetail', { property: p })}
            />
          ))
        )}

        {/* My Next Home */}
        <Text style={[styles.sectionTitle, { color: C.textMuted, marginTop: Spacing.lg }]}>My Next Home</Text>
        <NextHomeCard engagement={buyEngagement} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: Spacing.md, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1 },
  errorText:   { fontSize: 13, flex: 1 },

  strip:     { flexDirection: 'row', borderBottomWidth: 1 },
  stripCell: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  stripValue:{ fontSize: 16, fontWeight: '700', marginBottom: 2 },

  listPad:      { padding: Spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },

  propCard:  { borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, marginBottom: Spacing.md },
  propImg:   { width: '100%', height: 140 },
  propBody:  { padding: Spacing.md },
  propAddress: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  propStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
  propStat:  { alignItems: 'center' },
  propStatValue: { fontSize: 14, fontWeight: '700' },

  nextHomeImg:   { backgroundColor: '#1a3a5c', alignItems: 'center', justifyContent: 'center' },
  nextHomeBadge: { position: 'absolute', top: 10, left: 10, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  nextHomeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: 6, borderRadius: 3 },

  empty: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.xl, alignItems: 'center' },
});
