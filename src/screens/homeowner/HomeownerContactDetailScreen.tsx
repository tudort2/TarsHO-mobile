import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable,
  StyleSheet, ActivityIndicator, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getInitials } from '../../utils/initials';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Contact } from '../../types';
import { api } from '../../api/client';

const TYPE_META: Record<string, { color: string; icon: string }> = {
  Broker:   { color: '#2563EB', icon: 'briefcase-outline' },
  Provider: { color: '#8B5CF6', icon: 'construct-outline' },
  Personal: { color: '#06B6D4', icon: 'person-outline' },
};

// ── Edit Modal (homeowner attributes) ────────────────────────────────────────
function EditModal({ contact, visible, onClose, onSaved }: {
  contact: Contact | null; visible: boolean;
  onClose: () => void; onSaved: (u: Contact) => void;
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
      setFirstName(parts[0] || ''); setLastName(parts.slice(1).join(' ') || '');
      setPhone(contact.phone || ''); setEmail(contact.email || ''); setNotes(contact.notes || '');
    }
  }, [contact]);

  const save = async () => {
    if (!contact || !firstName.trim()) { Alert.alert('First name is required'); return; }
    setSaving(true);
    try {
      const u = await api.contacts.update(contact.id, {
        firstName: firstName.trim(), lastName: lastName.trim(),
        phone: phone.trim(), email: email.trim(), notes: notes.trim(),
      });
      onSaved(u);
    } catch (e: any) { Alert.alert('Error', e.message || 'Could not save.'); }
    finally { setSaving(false); }
  };

  if (!contact) return null;
  const fields = [
    { label: 'First Name', value: firstName, set: setFirstName, ph: 'First name' },
    { label: 'Last Name',  value: lastName,  set: setLastName,  ph: 'Last name' },
    { label: 'Phone',      value: phone,     set: setPhone,     ph: '+1 (555) 000-0000' },
    { label: 'Email',      value: email,     set: setEmail,     ph: 'email@example.com' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={es.backdrop} onPress={onClose} />
      <View style={[es.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[es.handle, { backgroundColor: C.bgBorder }]} />
        <Text style={[es.title, { color: C.textPrimary }]}>Edit Contact</Text>
        {fields.map(f => (
          <View key={f.label} style={{ marginBottom: Spacing.sm }}>
            <Text style={[es.label, { color: C.textMuted }]}>{f.label}</Text>
            <TextInput value={f.value} onChangeText={f.set} placeholder={f.ph}
              placeholderTextColor={C.textMuted}
              style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
          </View>
        ))}
        <Text style={[es.label, { color: C.textMuted }]}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline numberOfLines={3}
          placeholder="Notes about this contact..." placeholderTextColor={C.textMuted}
          style={[es.input, es.notesInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
        <TouchableOpacity style={[es.saveBtn, { backgroundColor: C.primary }]} onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={es.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────
export default function HomeownerContactDetailScreen() {
  const C     = useColors();
  const nav   = useNavigation();
  const route = useRoute<any>();

  const [contact, setContact] = useState<Contact | null>(route.params?.contact || null);
  const [loading, setLoading] = useState(!route.params?.contact);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const id = route.params?.contactId || contact?.id;
    if (!id) return;
    api.contacts.get(id).then(setContact).catch(() => {}).finally(() => setLoading(false));
  }, [route.params?.contactId]);

  if (loading || !contact) {
    return <View style={[s.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  const meta = TYPE_META[contact.type] ?? TYPE_META.Personal;
  const ini  = getInitials(contact.name);

  return (
    <View style={[s.screen, { backgroundColor: C.bgBase }]}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color={C.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: C.textPrimary }]}>Contact</Text>
        <TouchableOpacity style={s.backBtn} onPress={() => setEditOpen(true)}>
          <Ionicons name="create-outline" size={20} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={[s.hero, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
          <View style={[s.avatar, { backgroundColor: meta.color + '22', borderColor: meta.color }]}>
            <Text style={[s.avatarText, { color: meta.color }]}>{ini}</Text>
          </View>
          <Text style={[s.name, { color: C.textPrimary }]}>{contact.name}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <View style={[s.chip, { backgroundColor: meta.color + '22', borderColor: meta.color }]}>
              <Ionicons name={meta.icon as any} size={11} color={meta.color} style={{ marginRight: 3 }} />
              <Text style={[s.chipText, { color: meta.color }]}>{contact.type}</Text>
            </View>
          </View>
          {/* Action buttons */}
          <View style={s.actionsRow}>
            {contact.phone ? (
              <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.primary + '15', borderColor: C.primary }]}
                onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Ionicons name="call-outline" size={18} color={C.primary} />
                <Text style={[s.actionText, { color: C.primary }]}>Call</Text>
              </TouchableOpacity>
            ) : null}
            {contact.email ? (
              <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.primary + '15', borderColor: C.primary }]}
                onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
                <Ionicons name="mail-outline" size={18} color={C.primary} />
                <Text style={[s.actionText, { color: C.primary }]}>Email</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.success + '15', borderColor: C.success }]}
              onPress={() => Alert.alert('Log', 'Log interaction coming soon')}>
              <Ionicons name="chatbubble-outline" size={18} color={C.success} />
              <Text style={[s.actionText, { color: C.success }]}>Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: meta.color + '15', borderColor: meta.color }]}
              onPress={() => setEditOpen(true)}>
              <Ionicons name="create-outline" size={18} color={meta.color} />
              <Text style={[s.actionText, { color: meta.color }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={[s.section, { paddingTop: Spacing.lg }]}>
          <Text style={[s.sectionTitle, { color: C.textMuted }]}>Contact Info</Text>
          <View style={[s.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            {[
              { icon: 'mail-outline',     label: 'Email',        value: contact.email || '—' },
              { icon: 'call-outline',     label: 'Phone',        value: contact.phone || '—' },
              { icon: 'location-outline', label: 'Address',      value: contact.address || '—' },
              { icon: 'time-outline',     label: 'Last Contact', value: contact.lastContact },
            ].map((row, i, arr) => (
              <View key={i} style={[s.infoRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder }]}>
                <Ionicons name={row.icon as any} size={16} color={C.textMuted} style={{ marginRight: Spacing.sm }} />
                <Text style={[Typography.sm, { color: C.textSecondary, width: 90 }]}>{row.label}</Text>
                <Text style={[Typography.sm, { color: C.textPrimary, flex: 1 }]}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        {contact.notes ? (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: C.textMuted }]}>Notes</Text>
            <View style={[s.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Text style={[Typography.sm, { color: C.textPrimary, lineHeight: 20, padding: Spacing.sm }]}>{contact.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Interaction History */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: C.textMuted }]}>Interaction History ({contact.interactions.length})</Text>
          {contact.interactions.length === 0 ? (
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: 4 }]}>No interactions logged yet.</Text>
          ) : contact.interactions.map(ix => (
            <View key={ix.id} style={[s.interactionRow, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <View style={[s.interactionIcon, { backgroundColor: meta.color + '15' }]}>
                <Ionicons name="chatbubble-outline" size={14} color={meta.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[Typography.sm, { color: C.textPrimary, fontWeight: '600' }]}>{ix.type}</Text>
                  <Text style={[Typography.xs, { color: C.textMuted }]}>{ix.date}</Text>
                </View>
                {ix.note ? <Text style={[Typography.xs, { color: C.textSecondary, marginTop: 3 }]}>{ix.note}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <EditModal
        contact={contact}
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={u => { setContact(u); setEditOpen(false); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:   { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingTop: 52, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  backBtn:  { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hero:     { alignItems: 'center', paddingVertical: Spacing.xl, borderBottomWidth: 1 },
  avatar:   { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: Spacing.md },
  avatarText: { fontSize: 28, fontWeight: '700' },
  name:     { fontSize: 22, fontWeight: '700' },
  chip:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg, flexWrap: 'wrap', justifyContent: 'center' },
  actionBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md, borderWidth: 1 },
  actionText: { fontSize: 13, fontWeight: '600' },
  section:  { paddingHorizontal: Spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  card:     { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.lg },
  infoRow:  { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.md },
  interactionRow: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1, gap: Spacing.sm },
  interactionIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});

const es = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  handle:      { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title:       { fontSize: 17, fontWeight: '700', marginBottom: Spacing.md },
  label:       { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5 },
  input:       { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, fontSize: 14 },
  notesInput:  { height: 80, textAlignVertical: 'top' },
  saveBtn:     { borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.md },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
