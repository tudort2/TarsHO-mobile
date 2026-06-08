import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Contact, ContactStatus } from '../../types';
import { api } from '../../api/client';

type FilterType = 'All' | 'Buyer' | 'Seller' | 'Both';

// Cycling house images — same set as desktop
// Exact same HOMES array as desktop index.html — same order, same indices
const HOUSE_IMAGES = [
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80', // 0
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', // 1
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80', // 2
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80', // 3
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', // 4
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80', // 5
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80', // 6
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&q=80', // 7
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=400&q=80', // 8
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', // 9
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=80', // 10
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', // 11
  'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=400&q=80', // 12
];

const STATUS_COLORS: Record<ContactStatus, string> = {
  Active: '#22c55e', Passive: '#f59e0b', Lead: '#3b82f6', 'Non-Client': '#94a3b8',
};

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const C = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[Typography.xs, { color: C.textMuted }]}>{label}</Text>
    </View>
  );
}

function ContactTile({ contact, index, onPress }: {
  contact: Contact; index: number; onPress: () => void;
}) {
  const C    = useColors();
  const img  = HOUSE_IMAGES[index % HOUSE_IMAGES.length];
  const sc   = STATUS_COLORS[contact.status] ?? C.textMuted;
  const typeColor = contact.type === 'Buyer' ? C.buy : contact.type === 'Seller' ? C.sell : C.primary;

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* House image — full height of tile on left */}
      <Image source={{ uri: img }} style={styles.tileImg} resizeMode="cover" />

      {/* Right content */}
      <View style={styles.tileBody}>
        <Text style={[styles.tileName, { color: C.textPrimary }]} numberOfLines={1}>
          {contact.name}
        </Text>

        <View style={styles.tileChips}>
          <View style={[styles.chip, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[styles.chipText, { color: typeColor }]}>{contact.type}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: sc + '22', borderColor: sc }]}>
            <Text style={[styles.chipText, { color: sc }]}>{contact.status}</Text>
          </View>
        </View>

        {contact.email ? (
          <Text style={[Typography.xs, { color: C.textMuted }]} numberOfLines={1}>{contact.email}</Text>
        ) : null}
        {contact.phone ? (
          <Text style={[Typography.xs, { color: C.textMuted }]}>{contact.phone}</Text>
        ) : null}

        <View style={styles.tileFooter}>
          <Text style={[Typography.xs, { color: C.textMuted }]}>Last contact: {contact.lastContact}</Text>
          <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MyWorkScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();
  const [contacts,   setContacts]   = useState<Contact[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter,     setFilter]     = useState<FilterType>('All');

  const load = useCallback(async () => {
    try {
      const all = await api.contacts.list();
      // My Work = broker's clients: Buyer, Seller, Both — and only Active contacts
      setContacts(all.filter(c => ['Buyer','Seller','Both'].includes(c.type as string) && c.status === 'Active'));
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = contacts.filter(c =>
    filter === 'All' ? true : c.type === filter
  );

  const buyers  = contacts.filter(c => c.type === 'Buyer').length;
  const sellers = contacts.filter(c => c.type === 'Seller').length;
  const both    = contacts.filter(c => c.type === 'Both').length;

  if (loading) {
    return <View style={[styles.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>
      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <StatCard label="Active"  value={contacts.length} color={C.primary} />
        <StatCard label="Buyers"  value={buyers}          color={C.buy} />
        <StatCard label="Sellers" value={sellers}         color={C.sell} />
        <StatCard label="Both"    value={both}            color={C.warning} />
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { borderBottomColor: C.bgBorder }]}>
        {(['All','Buyer','Seller','Both'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && { borderBottomWidth: 2, borderBottomColor: C.primary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, { color: filter === f ? C.primary : C.textMuted }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tiles */}
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={C.primary} />}
      >
        <Text style={[Typography.label, { color: C.textMuted, marginBottom: Spacing.sm }]}>
          {filtered.length} active client{filtered.length !== 1 ? 's' : ''}
        </Text>

        {filtered.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <Ionicons name="briefcase-outline" size={40} color={C.bgBorder2} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm }]}>No active clients</Text>
          </View>
        ) : (
          filtered.map((c, i) => (
            <ContactTile
              key={c.id}
              contact={c}
              index={i}
              onPress={() => nav.navigate('EngagementDetail', { contactId: c.id, contactName: c.name })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1 },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statsRow:  { flexDirection: 'row', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs, borderBottomWidth: 1 },
  statCard:  { flex: 1, alignItems: 'center', paddingVertical: Spacing.xs, borderRadius: Radius.sm, marginHorizontal: 3, borderWidth: 1 },
  statValue: { fontSize: 20, fontWeight: '700' },
  filterRow: { flexDirection: 'row', borderBottomWidth: 1 },
  filterBtn: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm },
  filterText:{ fontSize: 13, fontWeight: '600' },
  tile:      { flexDirection: 'row', borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.sm, overflow: 'hidden', height: 110 },
  tileImg:   { width: 110, height: '100%' },
  tileBody:  { flex: 1, padding: Spacing.sm, justifyContent: 'space-between' },
  tileName:  { fontSize: 15, fontWeight: '700' },
  tileChips: { flexDirection: 'row', gap: 5, marginVertical: 3 },
  chip:      { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full, borderWidth: 1 },
  chipText:  { fontSize: 10, fontWeight: '700' },
  tileFooter:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  empty:     { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.xl, alignItems: 'center' },
});
