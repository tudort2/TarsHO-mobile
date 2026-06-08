import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../context/ThemeContext';
import { Spacing, Radius } from '../theme';
import { Role } from '../types';
import { useAuth } from '../context/AuthContext';

const ALL_ROLES: { id: Role; label: string; icon: string; description: string }[] = [
  { id: 'homeowner', label: 'Homeowner', icon: 'home-outline',     description: 'Manage your properties and journeys' },
  { id: 'broker',    label: 'Broker',    icon: 'briefcase-outline', description: 'CRM, pipeline, and client management' },
  { id: 'provider',  label: 'Provider',  icon: 'construct-outline', description: 'Service requests and scheduling' },
  { id: 'admin',     label: 'Admin',     icon: 'shield-outline',    description: 'Platform settings and user management' },
];

const ROLE_LABELS: Record<Role, string> = {
  homeowner: 'Homeowner', broker: 'Broker', provider: 'Provider', admin: 'Admin',
};

export default function RoleSwitcher() {
  const C = useColors();
  const { user, switchRole } = useAuth();
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState<Role | null>(null);

  if (!user) return null;

  const availableRoles = ALL_ROLES.filter(r => user.roles.includes(r.id));

  const handleSelect = async (role: Role) => {
    if (role === user.role) { setOpen(false); return; }
    setLoading(role);
    try {
      await switchRole(role);
      setOpen(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not switch role.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {/* Trigger chip */}
      <TouchableOpacity
        style={[styles.chip, { backgroundColor: C.primary + '15', borderColor: C.primary }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
      >
        <Text style={[styles.chipText, { color: C.primary }]}>{ROLE_LABELS[user.role]}</Text>
        <Ionicons name="chevron-down" size={12} color={C.primary} />
      </TouchableOpacity>

      {/* Sheet modal */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
          <View style={[styles.handle, { backgroundColor: C.bgBorder }]} />
          <Text style={[styles.title, { color: C.textPrimary }]}>Switch Role</Text>
          {availableRoles.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.row,
                { borderBottomColor: C.bgBorder },
                user.role === role.id && { backgroundColor: C.primary + '0A' },
              ]}
              onPress={() => handleSelect(role.id)}
              disabled={loading !== null}
            >
              <View style={[
                styles.iconWrap,
                { backgroundColor: user.role === role.id ? C.primary : C.bgElevated },
              ]}>
                <Ionicons
                  name={role.icon as any}
                  size={20}
                  color={user.role === role.id ? '#fff' : C.textSecondary}
                />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.roleLabel, { color: user.role === role.id ? C.primary : C.textPrimary }]}>
                  {role.label}
                </Text>
                <Text style={[styles.roleDesc, { color: C.textMuted }]}>{role.description}</Text>
              </View>
              {loading === role.id
                ? <ActivityIndicator size="small" color={C.primary} />
                : user.role === role.id
                  ? <Ionicons name="checkmark-circle" size={20} color={C.primary} />
                  : null
              }
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:    { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  handle:   { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title:    { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  rowText:  { flex: 1 },
  roleLabel:{ fontSize: 15, fontWeight: '600', marginBottom: 2 },
  roleDesc: { fontSize: 12 },
});
