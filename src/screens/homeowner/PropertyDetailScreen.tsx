import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { Property } from '../../types';

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

export default function PropertyDetailScreen() {
  const nav = useNavigation();
  const route = useRoute<any>();
  const property: Property = route.params?.property;

  const appreciation = property.currentValue - property.purchasePrice;
  const appreciationPct = (appreciation / property.purchasePrice) * 100;
  const equityPct = (property.equity / property.currentValue) * 100;

  return (
    <View style={styles.screen}>
      {/* Header image */}
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: property.imageUrl }} style={styles.heroImage} />
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Address */}
        <View style={styles.addrSection}>
          <Text style={Typography.h1}>{property.address}</Text>
          <Text style={Typography.sm}>{property.city}, {property.state} {property.zip}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCell label="Current Value" value={fmt(property.currentValue)} />
          <StatCell label="Equity" value={fmt(property.equity)} />
          <StatCell label="Sqft" value={property.sqft.toLocaleString()} />
          <StatCell label="Beds/Baths" value={`${property.beds}bd/${property.baths}ba`} />
          <StatCell label="Year Built" value={`${property.yearBuilt}`} />
          <StatCell label="Appreciation" value={`+${appreciationPct.toFixed(1)}%`} />
        </View>

        {/* Map placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color={Colors.textMuted} />
            <Text style={{ color: Colors.textMuted, marginTop: 8 }}>
              {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
            </Text>
            <Text style={Typography.xs}>{property.address}</Text>
          </View>
        </View>

        {/* Equity bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equity Breakdown</Text>
          <View style={styles.equityCard}>
            <View style={styles.equityRow}>
              <Text style={Typography.body}>Equity</Text>
              <Text style={{ color: Colors.success, fontWeight: '700' }}>{fmt(property.equity)} ({equityPct.toFixed(0)}%)</Text>
            </View>
            <View style={styles.equityTrack}>
              <View style={[styles.equityFill, { width: `${equityPct}%` }]} />
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

        {/* Mortgage section */}
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
            <View style={styles.mortRow}>
              <Text style={Typography.sm}>Appreciation</Text>
              <Text style={[Typography.body, { color: Colors.success }]}>+{fmt(appreciation)} (+{appreciationPct.toFixed(1)}%)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgBase },
  heroImage: { width, height: 240 },
  backBtn: { position: 'absolute', top: 48, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  addrSection: { padding: Spacing.md, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: Spacing.sm },
  statCell: { width: '30%', backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.bgBorder, flex: 1, minWidth: '30%' },
  statValue: { color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  section: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle: { ...Typography.label, marginBottom: Spacing.sm },
  mapPlaceholder: { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, height: 160, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.bgBorder },
  equityCard: { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  equityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  equityTrack: { height: 8, backgroundColor: Colors.bgBorder, borderRadius: 4, marginBottom: Spacing.sm },
  equityFill: { height: 8, borderRadius: 4, backgroundColor: Colors.success },
  equityLegend: { flexDirection: 'row', gap: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  mortgageCard: { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  mortRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderColor: Colors.bgBorder },
});
