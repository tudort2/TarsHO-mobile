import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Contact, Engagement } from '../../types';
import { api } from '../../api/client';

type FilterType = 'All' | 'Buyer' | 'Seller' | 'Both';

const HOUSE_IMAGES = [
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&q=80',
];

// ── Create action sheet ───────────────────────────────────────────────────────
function CreateSheet({ visible, onClose, onPick }: {
  visible: boolean;
  onClose: () => void;
  onPick: (side: 'buyer' | 'seller') => void;
}) {
  const C = useColors();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={cs.backdrop} onPress={onClose} />
      <View style={[cs.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[cs.grip, { backgroundColor: C.bgBorder2 }]} />
        <Text style={[cs.cap, { color: C.textMuted }]}>Create task card</Text>

        <TouchableOpacity
          style={[cs.item, { borderColor: C.bgBorder }]}
          onPress={() => { onClose(); onPick('buyer'); }}
          activeOpacity={0.75}
        >
          <View style={[cs.itemIcon, { backgroundColor: '#8B5CF622' }]}>
            <Ionicons name="person-outline" size={22} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[cs.itemTitle, { color: C.textPrimary }]}>New buyer</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Represent a home buyer</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[cs.item, { borderColor: C.bgBorder }]}
          onPress={() => { onClose(); onPick('seller'); }}
          activeOpacity={0.75}
        >
          <View style={[cs.itemIcon, { backgroundColor: '#06B6D422' }]}>
            <Ionicons name="home-outline" size={22} color="#06B6D4" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[cs.itemTitle, { color: C.textPrimary }]}>New seller</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>List a seller's property</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[cs.cancel, { borderColor: C.bgBorder }]}
          onPress={onClose}
        >
          <Text style={[cs.cancelText, { color: C.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Work tile ─────────────────────────────────────────────────────────────────
function WorkTile({ contact, engagement, index, onPress }: {
  contact: Contact;
  engagement: Engagement | undefined;
  index: number;
  onPress: () => void;
}) {
  const C         = useColors();
  const img       = HOUSE_IMAGES[index % HOUSE_IMAGES.length];
  const typeColor = contact.type === 'Buyer' ? '#8B5CF6' : contact.type === 'Seller' ? '#06B6D4' : C.primary;
  const stageName = engagement
    ? (engagement.stages.find(s => s.stageNumber === engagement.currentStage)?.name ?? `Stage ${engagement.currentStage}`)
    : null;
  const stageProgress = engagement
    ? `${engagement.currentStage} / ${engagement.totalStages}`
    : null;

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* House photo — left column */}
      <Image source={{ uri: img }} style={styles.tileImg} resizeMode="cover" />

      {/* Content */}
      <View style={styles.tileBody}>
        {/* Name + type badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[styles.tileName, { color: C.textPrimary }]} numberOfLines={1}>
            {contact.name}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>{contact.type}</Text>
          </View>
        </View>

        {/* Stage name */}
        {stageName && (
          <Text style={[Typography.xs, { color: C.textMuted, marginTop: 3 }]} numberOfLines={1}>
            {stageName}
          </Text>
        )}

        {/* Progress bar */}
        {engagement && (
          <View style={{ marginTop: 6 }}>
            <View style={[styles.progTrack, { backgroundColor: C.bgBorder }]}>
              <View style={[styles.progFill, {
                width: `${Math.round((engagement.currentStage / engagement.totalStages) * 100)}%` as any,
                backgroundColor: typeColor,
              }]} />
            </View>
            <Text style={[Typography.xs, { color: C.textMuted, marginTop: 3 }]}>
              Stage {stageProgress}
            </Text>
          </View>
        )}

        {/* Footer row */}
        <View style={styles.tileFooter}>
          <Text style={[Typography.xs, { color: C.textMuted }]}>
            {contact.email ?? contact.phone ?? ''}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function MyWorkScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();

  const [contacts,    setContacts]    = useState<Contact[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [filter,      setFilter]      = useState<FilterType>('All');
  const [sheetOpen,   setSheetOpen]   = useState(false);

  const load = useCallback(async () => {
    try {
      const [allContacts, allEngagements] = await Promise.all([
        api.contacts.list(),
        api.engagements.list(),
      ]);
      setContacts(allContacts.filter(c => ['Buyer', 'Seller', 'Both'].includes(c.type as string) && c.status === 'Active'));
      setEngagements(allEngagements);
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

  const handleCreatePick = (side: 'buyer' | 'seller') => {
    // Navigate to broker CRM contacts tab to add new contact
    nav.navigate('BrokerCRM');
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

      {/* ── Header bar ──────────────────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>My Work</Text>
          <Text style={[Typography.xs, { color: C.textMuted }]}>Active clients</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: C.primary }]}
          onPress={() => setSheetOpen(true)}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Summary stats ───────────────────────────────────────────── */}
      <View style={[styles.summary, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        {[
          { label: 'Buyers',  value: buyers,          color: '#8B5CF6' },
          { label: 'Sellers', value: sellers,         color: '#06B6D4' },
          { label: 'Both',    value: both,            color: C.primary },
          { label: 'Active',  value: contacts.length, color: C.success },
        ].map((stat, i) => (
          <View key={i} style={[styles.stat, i < 3 && { borderRightWidth: 1, borderRightColor: C.bgBorder }]}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Filter chips ────────────────────────────────────────────── */}
      <View style={[styles.chipsRow, { borderBottomColor: C.bgBorder }]}>
        {(['All', 'Buyer', 'Seller', 'Both'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.chip,
              { borderColor: C.bgBorder, backgroundColor: C.bgSurface },
              filter === f && { borderColor: C.primary, backgroundColor: C.primary + '18' },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, { color: filter === f ? C.primary : C.textSecondary }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Work list ───────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor={C.primary}
          />
        }
      >
        <Text style={[Typography.label, { color: C.textMuted, marginBottom: Spacing.sm }]}>
          {filtered.length} active client{filtered.length !== 1 ? 's' : ''}
        </Text>

        {filtered.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <Ionicons name="briefcase-outline" size={40} color={C.bgBorder2} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm, textAlign: 'center' }]}>
              No active clients.{'\n'}Tap + to add a new client.
            </Text>
          </View>
        ) : (
          filtered.map((c, i) => {
            const eng = engagements.find(e => e.contactName === c.name);
            return (
              <WorkTile
                key={c.id}
                contact={c}
                engagement={eng}
                index={i}
                onPress={() => {
                  if (eng) {
                    nav.navigate('EngagementDetail', { engagement: eng, contactName: c.name });
                  } else {
                    nav.navigate('EngagementDetail', { contactId: c.id, contactName: c.name });
                  }
                }}
              />
            );
          })
        )}
      </ScrollView>

      {/* ── Create sheet ──────────────────────────────────────────── */}
      <CreateSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onPick={handleCreatePick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header:      { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  addBtn:      { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },

  summary:   { flexDirection: 'row', borderBottomWidth: 1 },
  stat:      { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statValue: { fontSize: 22, fontWeight: '700', marginBottom: 2 },

  chipsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  chip:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },

  tile:      { flexDirection: 'row', borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm, overflow: 'hidden', height: 120 },
  tileImg:   { width: 110, height: '100%' },
  tileBody:  { flex: 1, padding: Spacing.sm, justifyContent: 'space-between' },
  tileName:  { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm, borderWidth: 1 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  progTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progFill:  { height: 4, borderRadius: 2 },
  tileFooter:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  empty:    { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.xl, alignItems: 'center' },
});

const cs = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  grip:        { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  cap:         { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.md },
  item:        { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm, gap: Spacing.md },
  itemIcon:    { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  itemTitle:   { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cancel:      { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  cancelText:  { fontSize: 15, fontWeight: '600' },
});
