import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Spacing, Radius, Typography } from '../../theme';
import { useColors } from '../../context/ThemeContext';
import { api } from '../../api/client';
import { Contact } from '../../types';
import { getInitials } from '../../utils/initials';

type HoFilter = 'All' | 'Broker' | 'Provider' | 'Personal';

const FILTER_META: Record<HoFilter, { color: string; icon: string }> = {
  All:      { color: '#64748B', icon: 'people-outline' },
  Broker:   { color: '#2563EB', icon: 'briefcase-outline' },
  Provider: { color: '#8B5CF6', icon: 'construct-outline' },
  Personal: { color: '#06B6D4', icon: 'person-outline' },
};

const HO_TYPES = ['Broker', 'Provider', 'Personal'];
function isHomeownerContact(c: Contact) { return HO_TYPES.includes(c.type as string); }

// ── Add Contact Modal ────────────────────────────────────────────────────────
function AddContactModal({ visible, onClose, onSaved }: {
  visible: boolean; onClose: () => void; onSaved: (c: Contact) => void;
}) {
  const C = useColors();
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [phone,       setPhone]       = useState('');
  const [contactType, setContactType] = useState<'Broker' | 'Provider' | 'Personal'>('Broker');
  const [notes,       setNotes]       = useState('');
  const [saving,      setSaving]      = useState(false);

  const reset = () => {
    setFirstName(''); setLastName(''); setEmail(''); setPhone('');
    setContactType('Broker'); setNotes('');
  };

  const handleSave = async () => {
    if (!firstName.trim()) { Alert.alert('First name is required'); return; }
    setSaving(true);
    try {
      const created = await api.contacts.create({
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim() || undefined,
        phone:     phone.trim() || undefined,
        contactType: contactType.toLowerCase(),
        notes:     notes.trim() || undefined,
      });
      reset();
      onSaved(created);
    } catch (e: any) { Alert.alert('Error', e.message || 'Could not create contact.'); }
    finally { setSaving(false); }
  };

  const meta = FILTER_META[contactType];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[styles.sheetHandle, { backgroundColor: C.bgBorder }]} />
        <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>New Contact</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>FIRST NAME *</Text>
            <TextInput value={firstName} onChangeText={setFirstName} placeholder="First"
              placeholderTextColor={C.textMuted}
              style={[styles.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>LAST NAME</Text>
            <TextInput value={lastName} onChangeText={setLastName} placeholder="Last"
              placeholderTextColor={C.textMuted}
              style={[styles.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
          </View>
        </View>

        <View style={{ marginBottom: Spacing.sm }}>
          <Text style={[styles.fieldLabel, { color: C.textMuted }]}>EMAIL</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="email@example.com"
            keyboardType="email-address" autoCapitalize="none" placeholderTextColor={C.textMuted}
            style={[styles.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
        </View>
        <View style={{ marginBottom: Spacing.sm }}>
          <Text style={[styles.fieldLabel, { color: C.textMuted }]}>PHONE</Text>
          <TextInput value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000"
            keyboardType="phone-pad" placeholderTextColor={C.textMuted}
            style={[styles.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
        </View>

        <Text style={[styles.fieldLabel, { color: C.textMuted }]}>TYPE</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.sm }}>
          {(['Broker', 'Provider', 'Personal'] as const).map(t => {
            const m = FILTER_META[t];
            const active = contactType === t;
            return (
              <TouchableOpacity key={t}
                style={[styles.typeCard, { flex: 1,
                  borderColor: active ? m.color : C.bgBorder,
                  backgroundColor: active ? m.color + '18' : C.bgElevated }]}
                onPress={() => setContactType(t)}
              >
                <Ionicons name={m.icon as any} size={16} color={active ? m.color : C.textMuted} style={{ marginBottom: 2 }} />
                <Text style={{ color: active ? m.color : C.textSecondary, fontSize: 12, fontWeight: '600' }}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.fieldLabel, { color: C.textMuted }]}>NOTES</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline numberOfLines={2}
          placeholder="Optional notes..." placeholderTextColor={C.textMuted}
          style={[styles.fieldInput, { height: 60, textAlignVertical: 'top',
            backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary, marginBottom: Spacing.md }]} />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: meta.color }]}
          onPress={handleSave} disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveBtnText}>Add {contactType} Contact</Text>
          }
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Edit Contact Modal ───────────────────────────────────────────────────────
function EditContactModal({ contact, visible, onClose, onSaved }: {
  contact: Contact | null; visible: boolean;
  onClose: () => void; onSaved: (updated: Contact) => void;
}) {
  const C = useColors();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [notes,     setNotes]     = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (contact) {
      const parts = contact.name.trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setNotes(contact.notes || '');
    }
  }, [contact]);

  const handleSave = async () => {
    if (!contact || !firstName.trim()) { Alert.alert('First name is required'); return; }
    setSaving(true);
    try {
      const updated = await api.contacts.update(contact.id, {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        phone:     phone.trim(),
        email:     email.trim(),
        notes:     notes.trim(),
      });
      onSaved(updated);
    } catch (e: any) { Alert.alert('Error', e.message || 'Could not save.'); }
    finally { setSaving(false); }
  };

  if (!contact) return null;

  const fields = [
    { label: 'First Name', value: firstName, onChange: setFirstName, placeholder: 'First name' },
    { label: 'Last Name',  value: lastName,  onChange: setLastName,  placeholder: 'Last name' },
    { label: 'Phone',      value: phone,     onChange: setPhone,     placeholder: '+1 (555) 000-0000' },
    { label: 'Email',      value: email,     onChange: setEmail,     placeholder: 'email@example.com' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[styles.sheetHandle, { backgroundColor: C.bgBorder }]} />
        <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>Edit Contact</Text>
        {fields.map(f => (
          <View key={f.label} style={{ marginBottom: Spacing.sm }}>
            <Text style={[styles.fieldLabel, { color: C.textMuted }]}>{f.label}</Text>
            <TextInput value={f.value} onChangeText={f.onChange} placeholder={f.placeholder}
              placeholderTextColor={C.textMuted}
              style={[styles.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
            />
          </View>
        ))}
        <Text style={[styles.fieldLabel, { color: C.textMuted }]}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline numberOfLines={3}
          placeholder="Any notes about this contact..." placeholderTextColor={C.textMuted}
          style={[styles.fieldInput, { height: 80, textAlignVertical: 'top',
            backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
        />
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: C.primary, marginTop: Spacing.md }]}
          onPress={handleSave} disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Action Sheet ─────────────────────────────────────────────────────────────
function ActionSheet({ contact, visible, onClose, onEdit }: {
  contact: Contact | null; visible: boolean; onClose: () => void; onEdit: () => void;
}) {
  const C = useColors();
  if (!contact) return null;
  const actions = [
    { icon: 'call-outline',       label: 'Call',             color: C.textPrimary,
      onPress: () => Alert.alert('Call', contact.phone || 'No phone on file') },
    { icon: 'mail-outline',       label: 'Send Email',       color: C.textPrimary,
      onPress: () => Alert.alert('Email', contact.email || 'No email on file') },
    { icon: 'chatbubble-outline', label: 'Log Interaction',  color: C.primary,
      onPress: () => Alert.alert('Log Interaction', 'Coming soon') },
    { icon: 'create-outline',     label: 'Edit Contact',     color: C.textPrimary, onPress: onEdit },
    { icon: 'trash-outline',      label: 'Remove',           color: C.danger,
      onPress: () => { onClose(); Alert.alert('Remove', `Remove ${contact.name} from your contacts?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {} },
      ]); } },
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[styles.sheetHandle, { backgroundColor: C.bgBorder }]} />
        <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>{contact.name}</Text>
        <Text style={[Typography.sm, { color: C.textMuted, marginBottom: Spacing.md }]}>
          {contact.type} · {contact.email || contact.phone || ''}
        </Text>
        {actions.map((a, i) => (
          <TouchableOpacity key={i}
            style={[styles.actionRow, { borderTopColor: C.bgBorder }]}
            onPress={() => { if (a.label !== 'Remove') onClose(); a.onPress(); }}
          >
            <View style={[styles.actionIcon, { backgroundColor: a.color === C.danger ? C.danger + '15' : C.bgElevated }]}>
              <Ionicons name={a.icon as any} size={18} color={a.color} />
            </View>
            <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            {a.label !== 'Remove' && <Ionicons name="chevron-forward" size={16} color={C.textMuted} />}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

// ── Contact row ──────────────────────────────────────────────────────────────
function ContactRow({ contact, onPress, onAction }: { contact: Contact; onPress: () => void; onAction: () => void }) {
  const C    = useColors();
  const t    = contact.type as HoFilter;
  const meta = FILTER_META[t] ?? FILTER_META.Personal;
  const ini  = getInitials(contact.name);

  return (
    <TouchableOpacity style={[styles.row, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.avatar, { backgroundColor: meta.color + '22', borderColor: meta.color + '66' }]}>
        <Text style={[styles.avatarText, { color: meta.color }]}>{ini}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowName, { color: C.textPrimary }]}>{contact.name}</Text>
        {contact.email ? <Text style={[Typography.xs, { color: C.textMuted }]} numberOfLines={1}>{contact.email}</Text> : null}
        {contact.phone ? <Text style={[Typography.xs, { color: C.textMuted }]}>{contact.phone}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        <View style={[styles.typePill, { backgroundColor: meta.color + '20' }]}>
          <Text style={[styles.pillText, { color: meta.color }]}>{t}</Text>
        </View>
        <TouchableOpacity style={styles.dotBtn} onPress={onAction} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.dots, { color: C.textMuted }]}>···</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function HomeownerContactsScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();
  const [contacts,    setContacts]    = useState<Contact[]>([]);
  const [filter,      setFilter]      = useState<HoFilter>('All');
  const [search,      setSearch]      = useState('');
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [menuTarget,  setMenuTarget]  = useState<Contact | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editTarget,  setEditTarget]  = useState<Contact | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible,  setAddVisible]  = useState(false);

  const load = useCallback(async () => {
    try {
      const all = await api.contacts.list();
      setContacts(all.filter(isHomeownerContact));
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = () => {
    setMenuVisible(false);
    setTimeout(() => { setEditTarget(menuTarget); setEditVisible(true); }, 300);
  };

  const handleSaved = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditVisible(false);
  };

  const filtered = contacts.filter(c => {
    const matchFilter = filter === 'All' || c.type === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return <View style={[styles.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>
      <View style={styles.searchPad}>
        <View style={[styles.searchBox, { backgroundColor: C.bgSurface, borderColor: C.bgBorder, flex: 1 }]}>
          <Ionicons name="search-outline" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search contacts..."
            placeholderTextColor={C.textMuted} style={[styles.searchInput, { color: C.textPrimary }]} />
        </View>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: C.primary }]} onPress={() => setAddVisible(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(['All', 'Broker', 'Provider', 'Personal'] as HoFilter[]).map(f => {
          const active = filter === f;
          const meta   = FILTER_META[f];
          return (
            <TouchableOpacity key={f}
              style={[styles.filterChip, { borderColor: active ? meta.color : C.bgBorder, backgroundColor: active ? meta.color + '22' : C.bgSurface }]}
              onPress={() => setFilter(f)}
            >
              <Ionicons name={meta.icon as any} size={12} color={active ? meta.color : C.textMuted} />
              <Text style={[styles.filterText, { color: active ? meta.color : C.textSecondary }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={C.primary} />}
      >
        <Text style={[styles.listMeta, { color: C.textMuted }]}>{filtered.length} contact{filtered.length !== 1 ? 's' : ''}</Text>
        {filtered.length === 0
          ? <View style={[styles.empty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Ionicons name="people-outline" size={36} color={C.bgBorder2} />
              <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm, textAlign: 'center' }]}>
                {search ? 'No contacts found.' : 'No contacts yet.\nTap + to add one.'}
              </Text>
            </View>
          : filtered.map(c => (
              <ContactRow key={c.id} contact={c}
                onPress={() => nav.navigate('HomeownerContactDetail', { contactId: c.id, contact: c })}
                onAction={() => { setMenuTarget(c); setMenuVisible(true); }}
              />
            ))
        }
      </ScrollView>

      <ActionSheet contact={menuTarget} visible={menuVisible} onClose={() => setMenuVisible(false)} onEdit={openEdit} />
      <EditContactModal contact={editTarget} visible={editVisible} onClose={() => setEditVisible(false)} onSaved={handleSaved} />
      <AddContactModal visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSaved={newContact => {
          setAddVisible(false);
          setContacts(prev => [newContact, ...prev]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  centered:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchPad:  { flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.md, paddingBottom: Spacing.sm },
  searchBox:  { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, borderWidth: 1 },
  searchInput:{ flex: 1, fontSize: 14 },
  addBtn:     { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  filterRow:  { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 6, marginBottom: Spacing.sm },
  filterChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1 },
  filterText: { fontSize: 12, fontWeight: '600' },
  listMeta:   { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, fontSize: 12 },
  row:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, marginBottom: Spacing.xs, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1 },
  avatar:     { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginRight: Spacing.md },
  avatarText: { fontSize: 14, fontWeight: '700' },
  rowBody:    { flex: 1 },
  rowName:    { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  rowRight:   { alignItems: 'flex-end', gap: 4 },
  typePill:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  pillText:   { fontSize: 11, fontWeight: '600' },
  dotBtn:     { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  dots:       { fontSize: 20, letterSpacing: 1, lineHeight: 24 },
  empty:      { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.xl, alignItems: 'center', marginHorizontal: Spacing.md },

  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  sheetTitle:  { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  actionRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderTopWidth: 1 },
  actionIcon:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  fieldLabel:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5, marginTop: 2 },
  fieldInput:  { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, fontSize: 14 },
  typeCard:    { borderWidth: 1.5, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center' },
  saveBtn:     { borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
