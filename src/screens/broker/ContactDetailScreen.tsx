import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Linking, TextInput,
  Modal, Pressable, KeyboardAvoidingView, Platform,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getInitials } from '../../utils/initials';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Contact, BrokerContactType, ContactStatus } from '../../types';
import { api } from '../../api/client';

function fmt(n: number) { return '$' + (n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n); }

// ── Edit Broker Contact Modal ─────────────────────────────────────────────────
function EditBrokerModal({ contact, visible, onClose, onSaved }: {
  contact: Contact | null; visible: boolean;
  onClose: () => void; onSaved: (u: Contact) => void;
}) {
  const C = useColors();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [type,      setType]      = useState<BrokerContactType>('Buyer');
  const [status,    setStatus]    = useState<ContactStatus>('Active');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [city,      setCity]      = useState('');
  const [beds,      setBeds]      = useState('');
  const [minSqft,   setMinSqft]   = useState('');
  const [maxSqft,   setMaxSqft]   = useState('');
  const [timing,    setTiming]    = useState('');
  const [notes,     setNotes]     = useState('');
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (contact && visible) {
      const parts = contact.name.trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setType((contact.type as BrokerContactType) || 'Buyer');
      setStatus(contact.status || 'Active');
      setNotes(contact.notes || '');
      const dp = contact.desiredProperty;
      if (dp) {
        setMinBudget(dp.minBudget ? String(dp.minBudget) : '');
        setMaxBudget(dp.maxBudget ? String(dp.maxBudget) : '');
        setCity(dp.city || '');
        setBeds(dp.beds ? String(dp.beds) : '');
        setMinSqft(dp.minSqft ? String(dp.minSqft) : '');
        setMaxSqft(dp.maxSqft ? String(dp.maxSqft) : '');
        setTiming(dp.timing || '');
      }
    }
  }, [contact, visible]);

  const save = async () => {
    if (!contact || !firstName.trim()) { Alert.alert('First name is required'); return; }
    setSaving(true);
    try {
      const u = await api.contacts.update(contact.id, {
        firstName: firstName.trim(), lastName: lastName.trim(),
        phone: phone.trim(), email: email.trim(), notes: notes.trim(),
        type, status,
        desiredProperty: {
          minBudget: parseInt(minBudget) || 0, maxBudget: parseInt(maxBudget) || 0,
          city: city.trim(), beds: parseInt(beds) || 0,
          minSqft: parseInt(minSqft) || 0, maxSqft: parseInt(maxSqft) || 0,
          timing: timing.trim(),
        },
      });
      onSaved(u);
    } catch (e: any) { Alert.alert('Error', e.message || 'Could not save.'); }
    finally { setSaving(false); }
  };

  if (!contact) return null;

  const TYPES: BrokerContactType[] = ['Buyer', 'Seller', 'Both'];
  const STATUSES: ContactStatus[]  = ['Active', 'Lead', 'Passive', 'Non-Client'];
  const typeColor   = (t: string) => t === 'Buyer' ? C.buy : t === 'Seller' ? C.sell : C.primary;
  const statusColor = (st: string) => ({ Active: C.success, Lead: C.primary, Passive: C.warning, 'Non-Client': C.textMuted } as any)[st] ?? C.textMuted;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Backdrop — only fills space above the sheet */}
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        {/* Sheet — sits at the bottom, NOT absolutely positioned */}
        <View style={[es.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
          <View style={[es.handle, { backgroundColor: C.bgBorder }]} />
          <Text style={[es.title, { color: C.textPrimary }]}>Edit Contact</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Basic fields */}
            {[
              { label: 'First Name', value: firstName, set: setFirstName, ph: 'First name' },
              { label: 'Last Name',  value: lastName,  set: setLastName,  ph: 'Last name' },
              { label: 'Phone',      value: phone,     set: setPhone,     ph: '+1 (555) 000-0000' },
              { label: 'Email',      value: email,     set: setEmail,     ph: 'email@example.com' },
            ].map(f => (
              <View key={f.label} style={{ marginBottom: Spacing.sm }}>
                <Text style={[es.label, { color: C.textMuted }]}>{f.label}</Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.ph}
                  placeholderTextColor={C.textMuted}
                  autoCorrect={false}
                  autoCapitalize="words"
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
                />
              </View>
            ))}

            {/* Type chips */}
            <Text style={[es.label, { color: C.textMuted }]}>Type</Text>
            <View style={[es.chipRow, { marginBottom: Spacing.sm }]}>
              {TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[es.chip, { borderColor: type === t ? typeColor(t) : C.bgBorder, backgroundColor: type === t ? typeColor(t) + '22' : C.bgElevated }]}
                  onPress={() => setType(t)}
                >
                  <Text style={{ color: type === t ? typeColor(t) : C.textSecondary, fontSize: 13, fontWeight: '600' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status chips */}
            <Text style={[es.label, { color: C.textMuted }]}>Status</Text>
            <View style={[es.chipRow, { marginBottom: Spacing.md }]}>
              {STATUSES.map(st => (
                <TouchableOpacity
                  key={st}
                  style={[es.chip, { borderColor: status === st ? statusColor(st) : C.bgBorder, backgroundColor: status === st ? statusColor(st) + '22' : C.bgElevated }]}
                  onPress={() => setStatus(st)}
                >
                  <Text style={{ color: status === st ? statusColor(st) : C.textSecondary, fontSize: 13, fontWeight: '600' }}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Desired Property */}
            <Text style={[es.sectionLabel, { color: C.textPrimary }]}>Desired Property</Text>
            <View style={es.twoCol}>
              <View style={{ flex: 1, marginRight: Spacing.xs }}>
                <Text style={[es.label, { color: C.textMuted }]}>Min Budget ($)</Text>
                <TextInput value={minBudget} onChangeText={setMinBudget} keyboardType="numeric" placeholder="300000"
                  placeholderTextColor={C.textMuted}
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.xs }}>
                <Text style={[es.label, { color: C.textMuted }]}>Max Budget ($)</Text>
                <TextInput value={maxBudget} onChangeText={setMaxBudget} keyboardType="numeric" placeholder="600000"
                  placeholderTextColor={C.textMuted}
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
              </View>
            </View>
            <View style={[es.twoCol, { marginTop: Spacing.xs }]}>
              <View style={{ flex: 1, marginRight: Spacing.xs }}>
                <Text style={[es.label, { color: C.textMuted }]}>Min Sqft</Text>
                <TextInput value={minSqft} onChangeText={setMinSqft} keyboardType="numeric" placeholder="1000"
                  placeholderTextColor={C.textMuted}
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.xs }}>
                <Text style={[es.label, { color: C.textMuted }]}>Max Sqft</Text>
                <TextInput value={maxSqft} onChangeText={setMaxSqft} keyboardType="numeric" placeholder="3000"
                  placeholderTextColor={C.textMuted}
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
              </View>
            </View>
            <View style={[es.twoCol, { marginTop: Spacing.xs }]}>
              <View style={{ flex: 1, marginRight: Spacing.xs }}>
                <Text style={[es.label, { color: C.textMuted }]}>Beds (min)</Text>
                <TextInput value={beds} onChangeText={setBeds} keyboardType="numeric" placeholder="2"
                  placeholderTextColor={C.textMuted}
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.xs }}>
                <Text style={[es.label, { color: C.textMuted }]}>City</Text>
                <TextInput value={city} onChangeText={setCity} placeholder="Austin"
                  placeholderTextColor={C.textMuted}
                  style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
              </View>
            </View>
            <View style={{ marginTop: Spacing.xs, marginBottom: Spacing.sm }}>
              <Text style={[es.label, { color: C.textMuted }]}>Timing</Text>
              <TextInput value={timing} onChangeText={setTiming} placeholder="e.g. 3–6 months"
                placeholderTextColor={C.textMuted}
                style={[es.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
            </View>

            {/* Notes */}
            <Text style={[es.label, { color: C.textMuted }]}>Notes</Text>
            <TextInput
              value={notes} onChangeText={setNotes} multiline numberOfLines={3}
              placeholder="Notes about this client..."
              placeholderTextColor={C.textMuted}
              style={[es.input, es.notesInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
            />

            <View style={es.btnRow}>
              <TouchableOpacity
                style={[es.cancelBtn, { backgroundColor: C.bgElevated, borderColor: C.bgBorder }]}
                onPress={onClose}
                disabled={saving}
              >
                <Text style={[es.cancelBtnText, { color: C.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[es.saveBtn, { backgroundColor: C.primary }]}
                onPress={save}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={es.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function ContactDetailScreen() {
  const C     = useColors();
  const nav   = useNavigation();
  const route = useRoute<any>();
  const contactId: string = route.params?.contactId;

  const [contact,  setContact]  = useState<Contact | null>(route.params?.contact || null);
  const [loading,  setLoading]  = useState(!route.params?.contact);
  const [editOpen, setEditOpen] = useState(route.params?.openEdit === true);

  useEffect(() => {
    const id = contactId || contact?.id;
    if (!id) return;
    api.contacts.get(id).then(setContact).catch(() => {}).finally(() => setLoading(false));
  }, [contactId]);

  if (loading || !contact) {
    return <View style={[s.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  const STATUS_COLOR: Record<string, string> = {
    Active: C.success, Passive: C.warning, Lead: C.primary, 'Non-Client': C.textMuted,
  };
  const ini = getInitials(contact.name);
  const sc  = STATUS_COLOR[contact.status] ?? C.primary;
  const tc  = contact.type === 'Buyer' ? C.buy : contact.type === 'Seller' ? C.sell : C.primary;

  return (
    <View style={[s.screen, { backgroundColor: C.bgBase }]}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <TouchableOpacity style={s.iconBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color={C.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: C.textPrimary }]}>Contact</Text>
        <TouchableOpacity style={s.iconBtn} onPress={() => setEditOpen(true)}>
          <Ionicons name="create-outline" size={20} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={[s.hero, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
          <View style={[s.avatar, { backgroundColor: sc + '22', borderColor: sc }]}>
            <Text style={[s.avatarText, { color: sc }]}>{ini}</Text>
          </View>
          <Text style={[s.name, { color: C.textPrimary }]}>{contact.name}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={[s.chip, { backgroundColor: sc + '22', borderColor: sc }]}>
              <Text style={[s.chipText, { color: sc }]}>{contact.status}</Text>
            </View>
            <View style={[s.chip, { backgroundColor: tc + '22', borderColor: tc }]}>
              <Text style={[s.chipText, { color: tc }]}>{contact.type}</Text>
            </View>
          </View>
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
              onPress={() => Alert.alert('Log', 'Use ··· from the contacts list to log.')}>
              <Ionicons name="chatbubble-outline" size={18} color={C.success} />
              <Text style={[s.actionText, { color: C.success }]}>Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: tc + '15', borderColor: tc }]}
              onPress={() => setEditOpen(true)}>
              <Ionicons name="create-outline" size={18} color={tc} />
              <Text style={[s.actionText, { color: tc }]}>Edit</Text>
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

        {/* Desired property */}
        {contact.desiredProperty && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: C.textMuted }]}>Desired Property</Text>
            <View style={[s.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              {[
                { label: 'Budget',  value: `${fmt(contact.desiredProperty.minBudget)} – ${fmt(contact.desiredProperty.maxBudget)}` },
                { label: 'Size',    value: `${contact.desiredProperty.minSqft}–${contact.desiredProperty.maxSqft} sqft` },
                { label: 'Beds',    value: `${contact.desiredProperty.beds}+ bd` },
                { label: 'City',    value: contact.desiredProperty.city || '—' },
                { label: 'Timing',  value: contact.desiredProperty.timing || '—' },
              ].map((row, i, arr) => (
                <View key={i} style={[s.infoRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder }]}>
                  <Text style={[Typography.sm, { color: C.textSecondary, width: 90 }]}>{row.label}</Text>
                  <Text style={[Typography.sm, { color: C.textPrimary, flex: 1 }]}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {contact.notes ? (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: C.textMuted }]}>Notes</Text>
            <View style={[s.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Text style={[Typography.sm, { color: C.textPrimary, lineHeight: 20, padding: Spacing.sm }]}>{contact.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Interactions */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: C.textMuted }]}>Interaction History ({contact.interactions.length})</Text>
          {contact.interactions.length === 0 ? (
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: 4 }]}>No interactions logged yet.</Text>
          ) : contact.interactions.map(ix => (
            <View key={ix.id} style={[s.interactionRow, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <View style={[s.interactionIcon, { backgroundColor: C.primary + '15' }]}>
                <Ionicons name="chatbubble-outline" size={14} color={C.primary} />
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

      <EditBrokerModal
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
  headerTitle:    { fontSize: 17, fontWeight: '600' },
  iconBtn:        { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hero:           { alignItems: 'center', paddingVertical: Spacing.xl, borderBottomWidth: 1 },
  avatar:         { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: Spacing.md },
  avatarText:     { fontSize: 28, fontWeight: '700' },
  name:           { fontSize: 22, fontWeight: '700' },
  chip:           { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  chipText:       { fontSize: 12, fontWeight: '600' },
  actionsRow:     { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg, flexWrap: 'wrap', justifyContent: 'center' },
  actionBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md, borderWidth: 1 },
  actionText:     { fontSize: 13, fontWeight: '600' },
  section:        { paddingHorizontal: Spacing.md },
  sectionTitle:   { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  card:           { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.lg },
  infoRow:        { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.md },
  interactionRow: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1, gap: Spacing.sm },
  interactionIcon:{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});

const es = StyleSheet.create({
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, maxHeight: '88%', borderTopWidth: 1 },
  handle:      { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title:       { fontSize: 17, fontWeight: '700', marginBottom: Spacing.md },
  sectionLabel:{ fontSize: 14, fontWeight: '700', marginTop: Spacing.sm, marginBottom: Spacing.sm },
  label:       { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5 },
  input:       { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 11, fontSize: 15 },
  notesInput:  { height: 80, textAlignVertical: 'top' },
  chipRow:     { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
  twoCol:      { flexDirection: 'row' },
  btnRow:       { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn:    { flex: 1, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1 },
  cancelBtnText:{ fontSize: 15, fontWeight: '600' },
  saveBtn:      { flex: 1, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  saveBtnText:  { color: '#fff', fontSize: 15, fontWeight: '600' },
});
