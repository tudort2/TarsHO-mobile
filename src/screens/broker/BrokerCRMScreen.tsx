import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Modal, Pressable, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getInitials } from '../../utils/initials';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Contact, ContactStatus } from '../../types';
import { api } from '../../api/client';

// ── Dot-menu action sheet ────────────────────────────────────────────────────
type ActionSheetProps = {
  contact: Contact | null;
  visible: boolean;
  onClose: () => void;
  onView: () => void;
  onLogInteraction: () => void;
  onStartEngagement: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function ActionSheet({ contact, visible, onClose, onView, onLogInteraction, onStartEngagement, onEdit, onDelete }: ActionSheetProps) {
  const C = useColors();
  if (!contact) return null;
  const actions = [
    { icon: 'person-outline',        label: 'View contact',      color: C.textPrimary, onPress: onView },
    { icon: 'chatbubble-outline',    label: 'Log interaction',   color: C.textPrimary, onPress: onLogInteraction },
    { icon: 'briefcase-outline',     label: 'Start engagement',  color: C.primary,     onPress: onStartEngagement },
    { icon: 'create-outline',        label: 'Edit contact',      color: C.textPrimary, onPress: onEdit },
    { icon: 'trash-outline',         label: 'Delete contact',    color: C.danger,      onPress: onDelete },
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop]} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[styles.sheetHandle, { backgroundColor: C.bgBorder }]} />
        <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>{contact.name}</Text>
        <Text style={[Typography.sm, { color: C.textMuted, marginBottom: Spacing.md }]}>
          {contact.email || contact.phone || ''}
        </Text>
        {actions.map((a, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.actionRow, { borderTopColor: C.bgBorder }, i === actions.length - 1 && { marginTop: Spacing.sm }]}
            onPress={() => { onClose(); a.onPress(); }}
          >
            <View style={[styles.actionIcon, { backgroundColor: a.color === C.danger ? C.danger + '15' : C.bgElevated }]}>
              <Ionicons name={a.icon as any} size={18} color={a.color} />
            </View>
            <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            {a.label !== 'Delete contact' && (
              <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

// ── Log interaction modal ────────────────────────────────────────────────────
function LogModal({ contact, visible, onClose, onSaved }: {
  contact: Contact | null; visible: boolean;
  onClose: () => void; onSaved: () => void;
}) {
  const C = useColors();
  const [type, setType]   = useState('Call');
  const [note, setNote]   = useState('');
  const [saving, setSaving] = useState(false);
  const TYPES = ['Call', 'Email', 'Meeting', 'Text', 'Note'];
  const handleSave = async () => {
    if (!contact || !note.trim()) { Alert.alert('Note required'); return; }
    setSaving(true);
    try {
      await api.contacts.logInteraction(contact.id, type, note.trim());
      setNote(''); onSaved();
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setSaving(false); }
  };
  if (!contact) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[styles.sheetHandle, { backgroundColor: C.bgBorder }]} />
        <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>Log Interaction</Text>
        <Text style={[Typography.label, { color: C.textMuted, marginBottom: 8 }]}>TYPE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, { borderColor: type === t ? C.primary : C.bgBorder, backgroundColor: type === t ? C.primary + '22' : C.bgElevated }]}
                onPress={() => setType(t)}
              >
                <Text style={{ color: type === t ? C.primary : C.textSecondary, fontSize: 13, fontWeight: '500' }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={[Typography.label, { color: C.textMuted, marginBottom: 8 }]}>NOTES</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          placeholder="What happened in this interaction?"
          placeholderTextColor={C.textMuted}
          style={[styles.noteInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
        />
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: C.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Contact row ──────────────────────────────────────────────────────────────
function ContactRow({ contact, onPress, onDotPress }: {
  contact: Contact; onPress: () => void; onDotPress: () => void;
}) {
  const C = useColors();
  const STATUS_COLORS: Record<ContactStatus, string> = {
    Active: C.success, Passive: C.warning, Lead: C.primary, 'Non-Client': C.textMuted,
  };
  const ini = getInitials(contact.name);
  return (
    <TouchableOpacity
      style={[styles.contactRow, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.avatar, { backgroundColor: STATUS_COLORS[contact.status] + '22', borderColor: STATUS_COLORS[contact.status] + '66' }]}>
        <Text style={[styles.avatarText, { color: STATUS_COLORS[contact.status] }]}>{ini}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: C.textPrimary }]}>{contact.name}</Text>
        {contact.email ? <Text style={[Typography.xs, { color: C.textMuted }]}>{contact.email}</Text> : null}
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
          <View style={[styles.statusChip, { backgroundColor: STATUS_COLORS[contact.status] + '22', borderColor: STATUS_COLORS[contact.status] }]}>
            <Text style={[styles.chipText, { color: STATUS_COLORS[contact.status] }]}>{contact.status}</Text>
          </View>
          <View style={[styles.typeChipBadge, { backgroundColor: contact.type === 'Buyer' ? C.buy + '22' : C.sell + '22', borderColor: contact.type === 'Buyer' ? C.buy : C.sell }]}>
            <Text style={[styles.chipText, { color: contact.type === 'Buyer' ? C.buy : C.sell }]}>{contact.type}</Text>
          </View>
          {contact.lastContact !== 'Never' && (
            <Text style={[Typography.xs, { color: C.textMuted, alignSelf: 'center' }]}>{contact.lastContact}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.dotBtn} onPress={onDotPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={[styles.dots, { color: C.textMuted }]}>···</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip({ contacts }: { contacts: Contact[] }) {
  const C = useColors();
  const active  = contacts.filter(c => c.status === 'Active').length;
  const leads   = contacts.filter(c => c.status === 'Lead').length;
  const buyers  = contacts.filter(c => c.type === 'Buyer' || c.type === 'Both').length;
  return (
    <View style={[styles.strip, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
      {[
        { label: 'Total',  value: contacts.length, color: C.primary },
        { label: 'Active', value: active,           color: C.success },
        { label: 'Leads',  value: leads,            color: C.buy },
        { label: 'Buyers', value: buyers,           color: C.sell },
      ].map((s, i) => (
        <View key={i} style={[styles.stripCell, i < 3 && { borderRightWidth: 1, borderRightColor: C.bgBorder }]}>
          <Text style={[styles.stripValue, { color: s.color }]}>{s.value}</Text>
          <Text style={[Typography.xs, { color: C.textMuted }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function BrokerCRMScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();

  const [contacts, setContacts]       = useState<Contact[]>([]);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState<ContactStatus | 'All'>('All');
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);

  const [menuTarget, setMenuTarget]   = useState<Contact | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logTarget, setLogTarget]     = useState<Contact | null>(null);
  const [logVisible, setLogVisible]   = useState(false);

  const load = useCallback(async () => {
    try {
      const params: any = {};
      if (filterStatus !== 'All') params.status = filterStatus.toLowerCase().replace('-', '_');
      if (search) params.search = search;
      const all = await api.contacts.list(params);
      // Broker CRM only shows buyer/seller clients, not homeowner contacts
      setContacts(all.filter(c => ['Buyer','Seller','Both'].includes(c.type as string)));
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, [filterStatus, search]);

  useEffect(() => {
    const t = setTimeout(() => load(), search ? 400 : 0);
    return () => clearTimeout(t);
  }, [load]);

  const openMenu = (c: Contact) => { setMenuTarget(c); setMenuVisible(true); };

  const handleDelete = (c: Contact) => {
    Alert.alert('Delete Contact', `Remove ${c.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        // optimistic remove — API endpoint may not exist yet
        setContacts(prev => prev.filter(x => x.id !== c.id));
      }},
    ]);
  };

  if (loading && contacts.length === 0) {
    return <View style={[styles.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>
      <StatsStrip contacts={contacts} />

      <View style={[styles.searchRow]}>
        <View style={[styles.searchInput, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          <Ionicons name="search-outline" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts..."
            placeholderTextColor={C.textMuted}
            style={[styles.searchText, { color: C.textPrimary }]}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 5, marginBottom: Spacing.xs }}>
        {(['All', 'Active', 'Lead', 'Passive', 'Non-Client'] as const).map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, { flex: 1, backgroundColor: C.bgSurface, borderColor: C.bgBorder },
              filterStatus === status && { borderColor: C.primary, backgroundColor: C.primary + '22' }]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterChipText, { color: filterStatus === status ? C.primary : C.textSecondary }]} numberOfLines={1}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={C.primary} />}
      >
        <Text style={[styles.listHeader, { color: C.textMuted }]}>{contacts.length} contacts</Text>
        {contacts.map(contact => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onPress={() => nav.navigate('ContactDetail', { contactId: contact.id })}
            onDotPress={() => openMenu(contact)}
          />
        ))}
      </ScrollView>

      <ActionSheet
        contact={menuTarget}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onView={() => menuTarget && nav.navigate('ContactDetail', { contactId: menuTarget.id })}
        onLogInteraction={() => { setLogTarget(menuTarget); setLogVisible(true); }}
        onStartEngagement={() => Alert.alert('Start Engagement', `Starting engagement for ${menuTarget?.name}`)}
        onEdit={() => menuTarget && nav.navigate('ContactDetail', { contactId: menuTarget.id, openEdit: true })}
        onDelete={() => menuTarget && handleDelete(menuTarget)}
      />

      <LogModal
        contact={logTarget}
        visible={logVisible}
        onClose={() => setLogVisible(false)}
        onSaved={() => { setLogVisible(false); load(); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1 },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  strip:     { flexDirection: 'row', borderBottomWidth: 1 },
  stripCell: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  stripValue:{ fontSize: 22, fontWeight: '700', marginBottom: 2 },

  searchRow:   { padding: Spacing.md, paddingBottom: Spacing.sm },
  searchInput: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, borderWidth: 1 },
  searchText:  { flex: 1, fontSize: 14 },

  filterChip:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: '500' },

  listHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: 12 },

  contactRow:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, marginBottom: Spacing.xs, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1 },
  avatar:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginRight: Spacing.md },
  avatarText:  { fontSize: 14, fontWeight: '700' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  statusChip:  { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.sm, borderWidth: 1 },
  typeChipBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.sm, borderWidth: 1 },
  chipText:    { fontSize: 11, fontWeight: '600' },
  dotBtn:      { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  dots:        { fontSize: 22, letterSpacing: 1, lineHeight: 28 },

  // Action sheet
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  sheetTitle:  { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  actionRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderTopWidth: 1 },
  actionIcon:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  typeChip:   { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1 },
  noteInput:  { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, height: 100, textAlignVertical: 'top', marginBottom: Spacing.md, fontSize: 14 },
  saveBtn:    { borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  saveBtnText:{ color: '#fff', fontSize: 15, fontWeight: '600' },
});
