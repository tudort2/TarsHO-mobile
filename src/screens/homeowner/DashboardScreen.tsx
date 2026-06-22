import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Property, Engagement } from '../../types';
import { api } from '../../api/client';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80',
];

function fmt(n: number) { return '$' + n.toLocaleString(); }

// ── Glass label overlay ───────────────────────────────────────────────────────
function GlassLabel({ label }: { label: string }) {
  return (
    <View style={[gl.wrap, { backgroundColor: 'rgba(15,23,42,0.55)', borderColor: 'rgba(255,255,255,0.22)' }]}>
      <Text style={gl.text}>{label}</Text>
    </View>
  );
}
const gl = StyleSheet.create({
  wrap: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  text: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});

// ── Tile action sheet ─────────────────────────────────────────────────────────
type TileTarget = { kind: 'property' | 'buy' | 'sell'; id: string; name: string };

function TileMenuSheet({ target, onClose, onSell, onDelete }: {
  target: TileTarget | null;
  onClose: () => void;
  onSell: (id: string, name: string) => void;
  onDelete: (t: TileTarget) => void;
}) {
  const C = useColors();
  if (!target) return null;
  return (
    <Modal visible={!!target} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={tm.backdrop} onPress={onClose} />
      <View style={[tm.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[tm.handle, { backgroundColor: C.bgBorder }]} />
        <Text style={[tm.name, { color: C.textPrimary }]} numberOfLines={1}>{target.name}</Text>

        {target.kind === 'property' && (
          <TouchableOpacity
            style={[tm.row, { borderBottomWidth: 1, borderBottomColor: C.bgBorder }]}
            onPress={() => { onClose(); onSell(target.id, target.name); }}
          >
            <View style={[tm.iconWrap, { backgroundColor: '#06B6D422' }]}>
              <Ionicons name="pricetag-outline" size={20} color="#06B6D4" />
            </View>
            <Text style={[tm.rowText, { color: C.textPrimary }]}>Sell</Text>
            <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={tm.row} onPress={() => { onClose(); onDelete(target); }}>
          <View style={[tm.iconWrap, { backgroundColor: '#EF444422' }]}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </View>
          <Text style={[tm.rowText, { color: '#EF4444' }]}>Delete</Text>
          <Ionicons name="chevron-forward" size={16} color="#EF4444" />
        </TouchableOpacity>

        <TouchableOpacity style={[tm.cancel, { borderColor: C.bgBorder }]} onPress={onClose}>
          <Text style={[tm.cancelText, { color: C.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
const tm = StyleSheet.create({
  backdrop:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:     { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  handle:    { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  name:      { fontSize: 14, fontWeight: '600', marginBottom: Spacing.md, textAlign: 'center' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  iconWrap:  { width: 38, height: 38, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  rowText:   { flex: 1, fontSize: 16, fontWeight: '500' },
  cancel:    { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  cancelText:{ fontSize: 15, fontWeight: '600' },
});

// ── Net Worth strip ───────────────────────────────────────────────────────────
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

// ── Property card ─────────────────────────────────────────────────────────────
function PropertyCard({ property, index, onPress, onMenu }: {
  property: Property; index: number; onPress: () => void; onMenu: () => void;
}) {
  const C      = useColors();
  const imgUrl = property.imageUrl || PROPERTY_IMAGES[index % PROPERTY_IMAGES.length];
  const equityPct = property.currentValue > 0
    ? Math.round((property.equity / property.currentValue) * 100) : 0;

  return (
    <TouchableOpacity
      style={[styles.propCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: imgUrl }} style={styles.propImg} resizeMode="cover" />
        <GlassLabel label="Home Digest" />
      </View>
      <View style={styles.propBody}>
        <View style={styles.titleRow}>
          <Text style={[styles.propAddress, { color: C.textPrimary, flex: 1 }]} numberOfLines={1}>
            {property.address}
          </Text>
          <TouchableOpacity onPress={onMenu} style={styles.menuBtn} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Ionicons name="ellipsis-horizontal" size={18} color={C.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={[Typography.xs, { color: C.textMuted, marginBottom: Spacing.sm }]}>
          {property.city}, {property.state}{property.beds ? ` · ${property.beds}bd/${property.baths}ba` : ''}
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

// ── Buy card ──────────────────────────────────────────────────────────────────
function BuyCard({ engagement, onMenu, onPress }: {
  engagement?: Engagement; onMenu: () => void; onPress: () => void;
}) {
  const C    = useColors();
  const done = engagement?.stages.filter(s => s.status === 'done').length ?? 0;
  const total = engagement?.totalStages ?? 0;
  const pct   = total > 0 ? (done / total) * 100 : 0;
  const currentStage = engagement?.stages.find(s => s.status === 'current');

  return (
    <TouchableOpacity
      style={[styles.propCard, { backgroundColor: C.bgSurface, borderColor: C.buy + '55', borderWidth: 1.5 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80' }}
          style={styles.propImg}
          resizeMode="cover"
        />
        <GlassLabel label="Buy" />
        <View style={[styles.journeyBadge, { backgroundColor: C.buy }]}>
          <Text style={styles.journeyBadgeText}>MY NEXT HOME</Text>
        </View>
      </View>
      <View style={styles.propBody}>
        <View style={styles.titleRow}>
          <Text style={[styles.propAddress, { color: C.textPrimary, flex: 1 }]}>
            {engagement ? 'Buy Journey Active' : 'Start Your Home Search'}
          </Text>
          {engagement && (
            <TouchableOpacity onPress={e => { e.stopPropagation?.(); onMenu(); }} style={styles.menuBtn} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Ionicons name="ellipsis-horizontal" size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        {engagement ? (
          <>
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
          <Text style={[Typography.xs, { color: C.textMuted }]}>
            Connect with a broker to begin your buying journey
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Sell card ─────────────────────────────────────────────────────────────────
function SellCard({ engagement, property, index, onMenu, onPress }: {
  engagement: Engagement; property?: Property; index: number;
  onMenu: () => void; onPress: () => void;
}) {
  const C     = useColors();
  const done  = engagement.stages.filter(s => s.status === 'done').length;
  const total = engagement.totalStages;
  const pct   = total > 0 ? (done / total) * 100 : 0;
  const currentStage = engagement.stages.find(s => s.status === 'current');

  // Use property image if available, otherwise fall back to generic sell image
  const fallbackImgs = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  ];
  const imgUrl = property?.imageUrl || PROPERTY_IMAGES[index % PROPERTY_IMAGES.length] || fallbackImgs[index % fallbackImgs.length];

  const equityPct = property && property.currentValue > 0
    ? Math.round((property.equity / property.currentValue) * 100) : 0;

  return (
    <TouchableOpacity
      style={[styles.propCard, { backgroundColor: C.bgSurface, borderColor: C.sell + '55', borderWidth: 1.5 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: imgUrl }} style={styles.propImg} resizeMode="cover" />
        <GlassLabel label="Sell" />
        <View style={[styles.journeyBadge, { backgroundColor: C.sell }]}>
          <Text style={styles.journeyBadgeText}>SELLING</Text>
        </View>
      </View>
      <View style={styles.propBody}>
        {/* Address row with (...) — shows property address when linked */}
        <View style={styles.titleRow}>
          <Text style={[styles.propAddress, { color: C.textPrimary, flex: 1 }]} numberOfLines={1}>
            {property?.address ?? 'Sell Journey Active'}
          </Text>
          <TouchableOpacity onPress={e => { e.stopPropagation?.(); onMenu(); }} style={styles.menuBtn} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Ionicons name="ellipsis-horizontal" size={18} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Property details row */}
        {property && (
          <Text style={[Typography.xs, { color: C.textMuted, marginBottom: 2 }]}>
            {property.city}, {property.state}{property.beds ? ` · ${property.beds}bd/${property.baths}ba` : ''}
          </Text>
        )}

        {/* Stage info */}
        <Text style={[Typography.xs, { color: C.sell, marginBottom: Spacing.sm }]}>
          {currentStage?.name ?? `Stage ${engagement.currentStage} of ${total}`}
        </Text>

        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: C.bgBorder }]}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: C.sell }]} />
        </View>
        <Text style={[Typography.xs, { color: C.textMuted, marginTop: 4, marginBottom: property ? Spacing.xs : 0 }]}>
          {done} of {total} stages complete
        </Text>

        {/* Property value stats — same layout as PropertyCard */}
        {property && (
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
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();

  const [properties,  setProperties]  = useState<Property[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [menuTarget,  setMenuTarget]  = useState<TileTarget | null>(null);

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

  // Reload whenever this screen comes into focus — covers returning from AddScreen,
  // navigating back from PropertyDetail, etc. Fixes stale tiles and missing new items.
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const buyEngagement   = engagements.find(e => e.type === 'buy');
  const sellEngagements = engagements.filter(e => e.type === 'sell');

  // ── Sell: create engagement directly without navigating away ────────────────
  const handleSell = (propertyId: string, propertyName: string) => {
    Alert.alert(
      'Start Sell Journey',
      `Start a sell journey for this property?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              const eng = await api.engagements.create({ type: 'sell', propertyId });
              // Add to state immediately — no reload needed
              setEngagements(prev => [...prev, eng]);
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Could not start sell journey.');
            }
          },
        },
      ],
    );
  };

  // ── Delete: remove from state optimistically, then call API ─────────────────
  // Avoids reload (which causes 429 on rapid taps) and eliminates the linger.
  const handleDelete = (target: TileTarget) => {
    Alert.alert('Delete', `Delete "${target.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          // Remove immediately from local state
          if (target.kind === 'property') {
            setProperties(prev => prev.filter(p => String(p.id) !== target.id));
          } else {
            setEngagements(prev => prev.filter(e => String(e.id) !== target.id));
          }
          // Fire API in background; restore on failure
          try {
            if (target.kind === 'property') {
              await api.properties.delete(target.id);
            } else {
              await api.engagements.delete(target.id);
            }
          } catch (e: any) {
            // Restore by reloading only on failure (rare path)
            Alert.alert('Error', e.message || 'Could not delete.');
            load();
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: C.bgBase }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>
      <ScrollView
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
          {/* Properties */}
          <Text style={[styles.sectionTitle, { color: C.textMuted }]}>My Properties</Text>
          {properties.length === 0 ? (
            <View style={[styles.empty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Ionicons name="home-outline" size={36} color={C.bgBorder} />
              <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm }]}>No properties yet.</Text>
            </View>
          ) : (
            properties.map((p, i) => (
              <PropertyCard
                key={p.id}
                property={p}
                index={i}
                onPress={() => nav.navigate('PropertyDetail', { property: p })}
                onMenu={() => setMenuTarget({ kind: 'property', id: String(p.id), name: p.address })}
              />
            ))
          )}

          {/* Buy */}
          <Text style={[styles.sectionTitle, { color: C.textMuted, marginTop: Spacing.lg }]}>My Next Home</Text>
          <BuyCard
            engagement={buyEngagement}
            onPress={() => buyEngagement && nav.navigate('BuyContext', { engagementId: String(buyEngagement.id) })}
            onMenu={() => buyEngagement && setMenuTarget({ kind: 'buy', id: String(buyEngagement.id), name: 'Buy Journey' })}
          />

          {/* Sell */}
          {sellEngagements.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: C.textMuted, marginTop: Spacing.lg }]}>Selling</Text>
              {sellEngagements.map((eng, i) => {
                const linkedProp = eng.propertyId
                  ? properties.find(p => String(p.id) === eng.propertyId)
                  : undefined;
                return (
                  <SellCard
                    key={eng.id}
                    engagement={eng}
                    property={linkedProp}
                    index={i}
                    onPress={() => nav.navigate('Journey', { journeyType: 'sell' })}
                    onMenu={() => setMenuTarget({ kind: 'sell', id: String(eng.id), name: linkedProp?.address ?? 'Sell Journey' })}
                  />
                );
              })}
            </>
          )}
        </View>
      </ScrollView>

      <TileMenuSheet
        target={menuTarget}
        onClose={() => setMenuTarget(null)}
        onSell={(id, name) => handleSell(id, name)}
        onDelete={handleDelete}
      />
    </View>
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

  titleRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  propAddress: { fontSize: 15, fontWeight: '700' },
  menuBtn:   { padding: 4, marginLeft: 8 },

  propStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },
  propStat:  { alignItems: 'center' },
  propStatValue: { fontSize: 14, fontWeight: '700' },

  journeyBadge:     { position: 'absolute', bottom: 10, left: 10, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  journeyBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: 6, borderRadius: 3 },

  empty: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.xl, alignItems: 'center' },
});
