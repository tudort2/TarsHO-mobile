import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Modal, Pressable, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getInitials } from '../../utils/initials';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Contact, ContactStatus } from '../../types';
import { api } from '../../api/client';

// Status color + label config
const STATUS_CONFIG: Record<ContactStatus, { color: string; label: string }> = {
  Active:       { color: '#22C55E', label: 'Active' },
  Lead:         { color: '#3B82F6', label: 'Lead' },
  Passive:      { color: '#F59E0B', label: 'Passive' },
  'Non-Client': { color: '#94A3B8', label: 'Network' },
};

const STATUS_ORDER: ContactStatus[] = ['Active', 'Lead', 'Passive', 'Non-Client'];

// ── Add Contact Modal ────────────────────────────────────────────────────────
function AddContactModal({ visible, onClose, onSaved }: {
  visible: boolean; onClose: () => void; onSaved: (c: Contact) => void;
}) {
  const C = useColors();
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [phone,       setPhone]       = useState('');
  const [contactType, setContactType] = useState<'Buyer' | 'Seller' | 'Both'>('Buyer');
  const [status,      setStatus]      = useState<ContactStatus>('Lead');
  const [notes,       setNotes]       = useState('');
  const [saving,      setSaving]      = useState(false);

  const reset = () => {
    setFirstName(''); setLastName(''); setEmail(''); setPhone('');
    setContactType('Buyer'); setStatus('Lead'); setNotes('');
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
        status:    status.toLowerCase().replace('-', '_'),
        notes:     notes.trim() || undefined,
      });
      reset();
      onSaved(created);
    } catch (e: any) { Alert.alert('Error', e.message || 'Could not create contact.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sht.backdrop} onPress={onClose} />
      <View style={[sht.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[sht.grip, { backgroundColor: C.bgBorder }]} />
        <Text style={[sht.title, { color: C.textPrimary }]}>New Contact</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={[sht.fieldLabel, { color: C.textMuted }]}>FIRST NAME *</Text>
            <TextInput value={firstName} onChangeText={setFirstName} placeholder="First"
              placeholderTextColor={C.textMuted} autoFocus
              style={[sht.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[sht.fieldLabel, { color: C.textMuted }]}>LAST NAME</Text>
            <TextInput value={lastName} onChangeText={setLastName} placeholder="Last"
              placeholderTextColor={C.textMuted}
              style={[sht.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]} />
          </View>
        </View>

        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>EMAIL</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="email@example.com"
          keyboardType="email-address" autoCapitalize="none" placeholderTextColor={C.textMuted}
          style={[sht.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary, marginBottom: Spacing.sm }]} />

        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>PHONE</Text>
        <TextInput value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000"
          keyboardType="phone-pad" placeholderTextColor={C.textMuted}
          style={[sht.fieldInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary, marginBottom: Spacing.sm }]} />

        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>TYPE</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.sm }}>
          {(['Buyer', 'Seller', 'Both'] as const).map(t => (
            <TouchableOpacity key={t}
              style={[sht.selChip, { flex: 1,
                borderColor: contactType === t ? C.primary : C.bgBorder,
                backgroundColor: contactType === t ? C.primary + '22' : C.bgElevated }]}
              onPress={() => setContactType(t)}
            >
              <Text style={{ color: contactType === t ? C.primary : C.textSecondary, fontSize: 13, fontWeight: '600', textAlign: 'center' }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>STATUS</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: Spacing.sm }}>
          {(['Lead', 'Active', 'Passive'] as ContactStatus[]).map(st => (
            <TouchableOpacity key={st}
              style={[sht.selChip, { flex: 1,
                borderColor: status === st ? C.primary : C.bgBorder,
                backgroundColor: status === st ? C.primary + '22' : C.bgElevated }]}
              onPress={() => setStatus(st)}
            >
              <Text style={{ color: status === st ? C.primary : C.textSecondary, fontSize: 12, fontWeight: '500', textAlign: 'center' }}>{st}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>NOTES</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline numberOfLines={2}
          placeholder="Optional notes..." placeholderTextColor={C.textMuted}
          style={[sht.fieldInput, { height: 60, textAlignVertical: 'top',
            backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary, marginBottom: Spacing.md }]} />

        <TouchableOpacity style={[sht.saveBtn, { backgroundColor: C.primary }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={sht.saveBtnText}>Create Contact</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Start Engagement Modal ────────────────────────────────────────────────────
function StartEngagementModal({ contact, visible, onClose, onCreated }: {
  contact: Contact | null; visible: boolean; onClose: () => void;
  onCreated: (eng: any) => void;
}) {
  const C = useColors();
  const [type, setType]     = useState<'buy' | 'sell'>('buy');
  const [saving, setSaving] = useState(false);
  if (!contact) return null;

  const handleCreate = async () => {
    setSaving(true);
    try {
      const eng = await api.engagements.create({ type });
      onCreated(eng);
    } catch (e: any) { Alert.alert('Error', e.message || 'Could not start engagement.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sht.backdrop} onPress={onClose} />
      <View style={[sht.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[sht.grip, { backgroundColor: C.bgBorder }]} />
        <Text style={[sht.title, { color: C.textPrimary }]}>Start Engagement</Text>
        <Text style={[Typography.sm, { color: C.textMuted, marginBottom: Spacing.lg }]}>for {contact.name}</Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: Spacing.xl }}>
          {([
            { key: 'buy' as const,  icon: 'home-outline',  label: 'Buy',  color: '#8B5CF6', sub: '17 stages' },
            { key: 'sell' as const, icon: 'pricetag-outline', label: 'Sell', color: '#06B6D4', sub: '15 stages' },
          ]).map(opt => (
            <TouchableOpacity key={opt.key}
              style={[sht.engCard, { flex: 1,
                borderColor: type === opt.key ? opt.color : C.bgBorder,
                backgroundColor: type === opt.key ? opt.color + '15' : C.bgElevated }]}
              onPress={() => setType(opt.key)}
            >
              <Ionicons name={opt.icon as any} size={28} color={opt.color} style={{ marginBottom: 8 }} />
              <Text style={[sht.engCardLabel, { color: type === opt.key ? opt.color : C.textSecondary }]}>{opt.label}</Text>
              <Text style={[Typography.xs, { color: C.textMuted, textAlign: 'center' }]}>{opt.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[sht.saveBtn, { backgroundColor: type === 'buy' ? '#8B5CF6' : '#06B6D4' }]}
          onPress={handleCreate} disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={sht.saveBtnText}>Start {type === 'buy' ? 'Buy' : 'Sell'} Engagement</Text>
          }
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Contact action sheet ──────────────────────────────────────────────────────
function ContactActionSheet({ contact, visible, onClose, onView, onLogInteraction, onStartEngagement, onEdit, onDelete }: {
  contact: Contact | null; visible: boolean; onClose: () => void;
  onView: () => void; onLogInteraction: () => void; onStartEngagement: () => void;
  onEdit: () => void; onDelete: () => void;
}) {
  const C = useColors();
  if (!contact) return null;
  const sc = STATUS_CONFIG[contact.status] ?? STATUS_CONFIG.Lead;
  const actions = [
    { icon: 'arrow-forward-outline', label: 'View Engagement', color: C.primary,      onPress: onView,             primary: true },
    { icon: 'call-outline',          label: 'Call',            color: C.textPrimary,   onPress: () => {} },
    { icon: 'chatbubble-outline',    label: 'Message',         color: C.textPrimary,   onPress: () => {} },
    { icon: 'create-outline',        label: 'Edit',            color: C.textPrimary,   onPress: onEdit },
    { icon: 'trash-outline',         label: 'Delete',          color: C.danger,        onPress: onDelete, danger: true },
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sht.backdrop} onPress={onClose} />
      <View style={[sht.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[sht.grip, { backgroundColor: C.bgBorder }]} />
        {/* Contact identity */}
        <View style={[sht.sheetId, { borderBottomColor: C.bgBorder }]}>
          <Text style={[sht.sheetName, { color: C.textPrimary }]}>{contact.name}</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
            <View style={[sht.pill, { backgroundColor: sc.color + '22', borderColor: sc.color }]}>
              <View style={[sht.pillDot, { backgroundColor: sc.color }]} />
              <Text style={[sht.pillText, { color: sc.color }]}>{sc.label}</Text>
            </View>
            <View style={[sht.pill, { backgroundColor: C.bgElevated, borderColor: C.bgBorder }]}>
              <Text style={[sht.pillText, { color: C.textSecondary }]}>{contact.type}</Text>
            </View>
          </View>
        </View>
        {/* Actions */}
        {actions.map((a, i) => (
          <TouchableOpacity key={i}
            style={[
              sht.actionRow,
              { borderBottomColor: C.bgBorder },
              (a as any).primary && { backgroundColor: C.primary + '0A' },
            ]}
            onPress={() => { onClose(); a.onPress(); }}
          >
            <View style={[sht.actionIcon, {
              backgroundColor: (a as any).danger ? C.danger + '15' : (a as any).primary ? C.primary + '15' : C.bgElevated,
            }]}>
              <Ionicons name={a.icon as any} size={18} color={a.color} />
            </View>
            <Text style={[sht.actionLabel, { color: a.color }]}>{a.label}</Text>
            {!(a as any).danger && <Ionicons name="chevron-forward" size={16} color={C.textMuted} />}
          </TouchableOpacity>
        ))}
        {/* Also: start engagement */}
        <TouchableOpacity
          style={[sht.actionRow, { borderBottomColor: 'transparent' }]}
          onPress={() => { onClose(); onStartEngagement(); }}
        >
          <View style={[sht.actionIcon, { backgroundColor: C.bgElevated }]}>
            <Ionicons name="briefcase-outline" size={18} color={C.textPrimary} />
          </View>
          <Text style={[sht.actionLabel, { color: C.textPrimary }]}>Start Engagement</Text>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={[sht.cancel, { borderColor: C.bgBorder }]} onPress={onClose}>
          <Text style={[sht.cancelText, { color: C.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Log Interaction Modal ─────────────────────────────────────────────────────
function LogModal({ contact, visible, onClose, onSaved }: {
  contact: Contact | null; visible: boolean; onClose: () => void; onSaved: () => void;
}) {
  const C = useColors();
  const [type, setType]     = useState('Call');
  const [note, setNote]     = useState('');
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
      <Pressable style={sht.backdrop} onPress={onClose} />
      <View style={[sht.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[sht.grip, { backgroundColor: C.bgBorder }]} />
        <Text style={[sht.title, { color: C.textPrimary }]}>Log Interaction</Text>
        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>TYPE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {TYPES.map(t => (
              <TouchableOpacity key={t}
                style={[sht.selChip,
                  { borderColor: type === t ? C.primary : C.bgBorder, backgroundColor: type === t ? C.primary + '22' : C.bgElevated }]}
                onPress={() => setType(t)}
              >
                <Text style={{ color: type === t ? C.primary : C.textSecondary, fontSize: 13, fontWeight: '500' }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={[sht.fieldLabel, { color: C.textMuted }]}>NOTES</Text>
        <TextInput value={note} onChangeText={setNote} multiline numberOfLines={4}
          placeholder="What happened in this interaction?" placeholderTextColor={C.textMuted}
          style={[sht.fieldInput, { height: 100, textAlignVertical: 'top',
            backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary, marginBottom: Spacing.md }]}
        />
        <TouchableOpacity style={[sht.saveBtn, { backgroundColor: C.primary }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={sht.saveBtnText}>Save</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Contact row ───────────────────────────────────────────────────────────────
function ContactRow({ contact, onPress }: {
  contact: Contact; onPress: () => void;
}) {
  const C  = useColors();
  const sc = STATUS_CONFIG[contact.status] ?? STATUS_CONFIG.Lead;
  const ini = getInitials(contact.name);
  const typeColor = contact.type === 'Buyer' ? '#8B5CF6' : contact.type === 'Seller' ? '#06B6D4' : C.primary;

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: C.bgBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: sc.color + '22', borderColor: sc.color + '66' }]}>
        <Text style={[styles.avatarText, { color: sc.color }]}>{ini}</Text>
      </View>

      {/* Name + meta */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowName, { color: C.textPrimary }]}>{contact.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
          <View style={[styles.statusPip, { backgroundColor: sc.color + '22', borderColor: sc.color }]}>
            <View style={[styles.pipDot, { backgroundColor: sc.color }]} />
            <Text style={[styles.pipText, { color: sc.color }]}>{sc.label}</Text>
          </View>
          {contact.phone && (
            <Text style={[Typography.xs, { color: C.textMuted }]}>{contact.phone}</Text>
          )}
        </View>
      </View>

      {/* Right: date + type */}
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {contact.lastContact && contact.lastContact !== 'Never' && (
          <Text style={[Typography.xs, { color: C.textMuted }]}>{contact.lastContact}</Text>
        )}
        <View style={[styles.typePill, { backgroundColor: typeColor + '15', borderColor: typeColor + '44' }]}>
          <Text style={[styles.typePillText, { color: typeColor }]}>{contact.type}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={14} color={C.textMuted} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function GroupHeader({ status, count }: { status: ContactStatus; count: number }) {
  const C  = useColors();
  const sc = STATUS_CONFIG[status] ?? STATUS_CONFIG.Lead;
  return (
    <View style={[styles.groupHead, { backgroundColor: C.bgBase }]}>
      <View style={[styles.groupDot, { backgroundColor: sc.color }]} />
      <Text style={[styles.groupTitle, { color: C.textSecondary }]}>{sc.label}</Text>
      <Text style={[styles.groupCount, { color: C.textMuted, backgroundColor: C.bgElevated, borderColor: C.bgBorder }]}>{count}</Text>
      <View style={[styles.groupLine, { backgroundColor: C.bgBorder }]} />
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function BrokerCRMScreen() {
  const C   = useColors();
  const nav = useNavigation<any>();

  const [contacts,     setContacts]     = useState<Contact[]>([]);
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState<ContactStatus | 'All'>('All');
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const [menuTarget, setMenuTarget]   = useState<Contact | null>(null);
  const [menuVisible,setMenuVisible]  = useState(false);
  const [logTarget,  setLogTarget]    = useState<Contact | null>(null);
  const [logVisible, setLogVisible]   = useState(false);
  const [addVisible, setAddVisible]   = useState(false);
  const [engTarget,  setEngTarget]    = useState<Contact | null>(null);
  const [engVisible, setEngVisible]   = useState(false);

  const load = useCallback(async () => {
    try {
      const params: any = {};
      if (filterStatus !== 'All') params.status = filterStatus.toLowerCase().replace('-', '_');
      if (search) params.search = search;
      const all = await api.contacts.list(params);
      setContacts(all.filter(c => ['Buyer', 'Seller', 'Both'].includes(c.type as string)));
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
        setContacts(prev => prev.filter(x => x.id !== c.id));
        try { await api.contacts.delete(c.id); } catch { /* optimistic */ }
      }},
    ]);
  };

  // Build grouped list
  const groups = useMemo(() => {
    const filtered = contacts.filter(c =>
      (filterStatus === 'All' || c.status === filterStatus) &&
      (!search.trim() || c.name.toLowerCase().includes(search.trim().toLowerCase()))
    );
    if (filterStatus !== 'All') {
      return [{ status: filterStatus as ContactStatus, rows: filtered }];
    }
    return STATUS_ORDER
      .map(st => ({ status: st, rows: filtered.filter(c => c.status === st) }))
      .filter(g => g.rows.length > 0);
  }, [contacts, filterStatus, search]);

  const totalShown = groups.reduce((n, g) => n + g.rows.length, 0);
  const activeCount= contacts.filter(c => c.status === 'Active').length;
  const leadCount  = contacts.filter(c => c.status === 'Lead').length;

  if (loading && contacts.length === 0) {
    return <View style={[styles.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  const FILTER_TABS: Array<ContactStatus | 'All'> = ['All', 'Active', 'Lead', 'Passive', 'Non-Client'];

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={[styles.head, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <View style={styles.headTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.h1, { color: C.textPrimary }]}>Contacts</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>
              <Text style={{ fontWeight: '600', color: C.textSecondary }}>{contacts.length}</Text> people ·{' '}
              <Text style={{ fontWeight: '600', color: C.textSecondary }}>{activeCount}</Text> active ·{' '}
              <Text style={{ fontWeight: '600', color: C.textSecondary }}>{leadCount}</Text> leads
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: C.primary }]}
            onPress={() => setAddVisible(true)}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: C.bgElevated, borderColor: C.bgBorder }]}>
          <Ionicons name="search-outline" size={16} color={C.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts..."
            placeholderTextColor={C.textMuted}
            style={[styles.searchText, { color: C.textPrimary }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          {FILTER_TABS.map(st => {
            const label = st === 'Non-Client' ? 'Network' : st;
            const active = filterStatus === st;
            const sc = st !== 'All' ? STATUS_CONFIG[st as ContactStatus] : null;
            return (
              <TouchableOpacity
                key={st}
                style={[
                  styles.filterTab,
                  { borderColor: C.bgBorder },
                  active && { borderColor: sc?.color ?? C.primary, backgroundColor: (sc?.color ?? C.primary) + '18' },
                ]}
                onPress={() => setFilterStatus(st)}
              >
                {sc && active && <View style={[styles.tabDot, { backgroundColor: sc.color }]} />}
                <Text style={[styles.filterTabText, { color: active ? (sc?.color ?? C.primary) : C.textSecondary }]}>
                  {label}
                </Text>
                <Text style={[styles.filterTabCount, { color: active ? (sc?.color ?? C.primary) : C.textMuted }]}>
                  {contacts.filter(c => st === 'All' || c.status === st).length}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Grouped list ────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor={C.primary}
          />
        }
      >
        {totalShown === 0 && !loading ? (
          <View style={[styles.empty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <Ionicons name="people-outline" size={40} color={C.bgBorder2} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm, textAlign: 'center' }]}>
              No contacts yet.{'\n'}Tap + to add your first client.
            </Text>
          </View>
        ) : (
          groups.map(group => (
            <View key={group.status}>
              {filterStatus === 'All' && (
                <GroupHeader status={group.status} count={group.rows.length} />
              )}
              <View style={[styles.groupList, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
                {group.rows.map((c, i) => (
                  <ContactRow
                    key={c.id}
                    contact={c}
                    onPress={() => openMenu(c)}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Sheets ──────────────────────────────────────────────────── */}
      <ContactActionSheet
        contact={menuTarget}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onView={() => menuTarget && nav.navigate('ContactDetail', { contactId: menuTarget.id })}
        onLogInteraction={() => { setLogTarget(menuTarget); setLogVisible(true); }}
        onStartEngagement={() => { setEngTarget(menuTarget); setEngVisible(true); }}
        onEdit={() => menuTarget && nav.navigate('ContactDetail', { contactId: menuTarget.id, openEdit: true })}
        onDelete={() => menuTarget && handleDelete(menuTarget)}
      />

      <LogModal
        contact={logTarget}
        visible={logVisible}
        onClose={() => setLogVisible(false)}
        onSaved={() => { setLogVisible(false); load(); }}
      />

      <AddContactModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSaved={newContact => { setAddVisible(false); setContacts(prev => [newContact, ...prev]); }}
      />

      <StartEngagementModal
        contact={engTarget}
        visible={engVisible}
        onClose={() => setEngVisible(false)}
        onCreated={eng => {
          setEngVisible(false);
          nav.navigate('EngagementDetail', {
            engagement: eng,
            contactName: engTarget?.name ?? 'Client',
          });
        }}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:   { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  head:       { borderBottomWidth: 1 },
  headTop:    { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  h1:         { fontSize: 28, fontWeight: '800', marginBottom: 3 },
  addBtn:     { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginTop: 4 },

  searchBox:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, marginBottom: Spacing.sm, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, borderWidth: 1 },
  searchText: { flex: 1, fontSize: 14 },

  filterTabs:    { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, gap: 8, flexDirection: 'row' },
  filterTab:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, gap: 5 },
  filterTabText: { fontSize: 13, fontWeight: '600' },
  filterTabCount:{ fontSize: 11, fontWeight: '500' },
  tabDot:        { width: 6, height: 6, borderRadius: 3 },

  groupHead:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 8 },
  groupDot:   { width: 8, height: 8, borderRadius: 4 },
  groupTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  groupCount: { fontSize: 11, fontWeight: '600', paddingHorizontal: 6, paddingVertical: 1, borderRadius: Radius.sm, borderWidth: 1 },
  groupLine:  { flex: 1, height: 1 },

  groupList: { marginHorizontal: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.sm, overflow: 'hidden' },

  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: 1, gap: Spacing.sm },
  avatar:     { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarText: { fontSize: 14, fontWeight: '700' },
  rowName:    { fontSize: 15, fontWeight: '600', marginBottom: 1 },
  statusPip:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1, gap: 5 },
  pipDot:     { width: 6, height: 6, borderRadius: 3 },
  pipText:    { fontSize: 11, fontWeight: '600' },
  typePill:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, borderWidth: 1 },
  typePillText:{ fontSize: 11, fontWeight: '600' },

  empty:    { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.xl, alignItems: 'center', marginHorizontal: Spacing.md, marginTop: Spacing.md },
});

const sht = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  grip:        { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title:       { fontSize: 17, fontWeight: '700', marginBottom: 4 },

  sheetId:     { paddingBottom: Spacing.md, marginBottom: Spacing.sm, borderBottomWidth: 1 },
  sheetName:   { fontSize: 18, fontWeight: '700' },
  pill:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1, gap: 5 },
  pillDot:     { width: 6, height: 6, borderRadius: 3 },
  pillText:    { fontSize: 11, fontWeight: '600' },

  actionRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  actionIcon:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  cancel:     { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  cancelText: { fontSize: 15, fontWeight: '600' },

  fieldLabel:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5, marginTop: 2 },
  fieldInput:  { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, fontSize: 14 },
  selChip:     { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, alignItems: 'center' },
  saveBtn:     { borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  engCard:     { borderWidth: 2, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center' },
  engCardLabel:{ fontSize: 16, fontWeight: '700', marginBottom: 4 },
});
