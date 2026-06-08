import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  Modal, Pressable, Image, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { MOCK_CONTACTS, MOCK_PIPELINE } from '../../data/mockData';
import { Contact, ContactStatus, ContactType } from '../../types';

const STATUS_COLORS: Record<ContactStatus, string> = {
  Active: Colors.success,
  Passive: Colors.warning,
  Lead: Colors.primary,
  'Non-Client': Colors.textMuted,
};

function StatsStrip() {
  const active = MOCK_CONTACTS.filter(c => c.status === 'Active').length;
  const leads = MOCK_CONTACTS.filter(c => c.status === 'Lead').length;
  const buyers = MOCK_CONTACTS.filter(c => c.type === 'Buyer').length;
  const sellers = MOCK_CONTACTS.filter(c => c.type === 'Seller').length;
  return (
    <View style={styles.strip}>
      {[
        { label: 'Total', value: MOCK_CONTACTS.length, color: Colors.primary },
        { label: 'Active', value: active, color: Colors.success },
        { label: 'Leads', value: leads, color: Colors.buy },
        { label: 'Buyers', value: buyers, color: Colors.sell },
      ].map((s, i) => (
        <View key={i} style={[styles.stripCell, i < 3 && styles.stripDivider]}>
          <Text style={[styles.stripValue, { color: s.color }]}>{s.value}</Text>
          <Text style={Typography.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

function ContactRow({ contact, onPress }: { contact: Contact; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.contactRow} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: contact.avatarUrl }} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={Typography.sm}>{contact.address}</Text>
        <Text style={Typography.xs}>Last contact: {contact.lastContact}</Text>
      </View>
      <View style={styles.contactRight}>
        <View style={[styles.statusChip, { backgroundColor: STATUS_COLORS[contact.status] + '22', borderColor: STATUS_COLORS[contact.status] }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[contact.status] }]}>{contact.status}</Text>
        </View>
        <View style={[styles.typeChip, { backgroundColor: contact.type === 'Buyer' ? Colors.buy + '22' : Colors.sell + '22' }]}>
          <Text style={[styles.typeText, { color: contact.type === 'Buyer' ? Colors.buy : Colors.sell }]}>{contact.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function BrokerCRMScreen() {
  const nav = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ContactStatus | 'All'>('All');

  const filtered = useMemo(() => {
    return MOCK_CONTACTS.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus]);

  return (
    <View style={styles.screen}>
      <StatsStrip />

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchText}
          />
        </View>
      </View>

      {/* Status filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}>
        {(['All', 'Active', 'Lead', 'Passive', 'Non-Client'] as const).map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterChipText, filterStatus === status && { color: Colors.primary }]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contact list */}
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.listHeader}>{filtered.length} contacts</Text>
        {filtered.map(contact => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onPress={() => nav.navigate('ContactDetail', { contact })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgBase },
  strip: { flexDirection: 'row', backgroundColor: Colors.bgSurface, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  stripCell: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  stripDivider: { borderRightWidth: 1, borderColor: Colors.bgBorder },
  stripValue: { fontSize: 22, fontWeight: '700', marginBottom: 2 },

  searchRow: { padding: Spacing.md, paddingBottom: 0 },
  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgSurface, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, borderWidth: 1, borderColor: Colors.bgBorder },
  searchText: { flex: 1, color: Colors.textPrimary, fontSize: 14 },

  filterRow: { paddingVertical: Spacing.sm },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.bgBorder },
  filterChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '22' },
  filterChipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '500' },

  listHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, color: Colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },

  contactRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgSurface, marginHorizontal: Spacing.md, marginBottom: Spacing.xs, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: Spacing.md },
  contactInfo: { flex: 1 },
  contactName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  contactRight: { alignItems: 'flex-end', gap: 4 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '600' },
  typeChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  typeText: { fontSize: 11, fontWeight: '600' },
});
