import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Role } from '../types';

interface Props {
  currentRole: Role;
  onSelect: (role: Role) => void;
  visible: boolean;
  onClose: () => void;
}

const ROLES: { id: Role; label: string; icon: string; description: string }[] = [
  { id: 'homeowner', label: 'Homeowner', icon: 'home-outline', description: 'Manage your properties and journeys' },
  { id: 'broker', label: 'Broker', icon: 'briefcase-outline', description: 'CRM, pipeline, and client management' },
  { id: 'provider', label: 'Provider', icon: 'construct-outline', description: 'Service requests and scheduling' },
  { id: 'admin', label: 'Admin', icon: 'shield-outline', description: 'Platform settings and user management' },
];

export default function RoleSwitcher({ currentRole, onSelect, visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Switch Role</Text>
        {ROLES.map(role => (
          <TouchableOpacity
            key={role.id}
            style={[styles.row, currentRole === role.id && styles.rowActive]}
            onPress={() => { onSelect(role.id); onClose(); }}
          >
            <View style={[styles.iconWrap, currentRole === role.id && styles.iconWrapActive]}>
              <Ionicons name={role.icon as any} size={20} color={currentRole === role.id ? '#fff' : Colors.textSecondary} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.roleLabel, currentRole === role.id && styles.roleLabelActive]}>{role.label}</Text>
              <Text style={styles.roleDesc}>{role.description}</Text>
            </View>
            {currentRole === role.id && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: Colors.bgSurface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 40, borderTopWidth: 1, borderColor: Colors.bgBorder },
  handle: { width: 40, height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title: { ...Typography.h2, marginBottom: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.sm, backgroundColor: Colors.bgElevated },
  rowActive: { borderWidth: 1, borderColor: Colors.primary },
  iconWrap: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.bgBorder, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  iconWrapActive: { backgroundColor: Colors.primary },
  rowText: { flex: 1 },
  roleLabel: { ...Typography.body, fontWeight: '600' },
  roleLabelActive: { color: Colors.primary },
  roleDesc: { ...Typography.sm, marginTop: 2 },
});
