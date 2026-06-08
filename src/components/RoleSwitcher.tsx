import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Role } from '../types';
import { useAuth } from '../context/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ALL_ROLES: { id: Role; label: string; icon: string; description: string }[] = [
  { id: 'homeowner', label: 'Homeowner',  icon: 'home-outline',      description: 'Manage your properties and journeys' },
  { id: 'broker',    label: 'Broker',     icon: 'briefcase-outline',  description: 'CRM, pipeline, and client management' },
  { id: 'provider',  label: 'Provider',   icon: 'construct-outline',  description: 'Service requests and scheduling' },
  { id: 'admin',     label: 'Admin',      icon: 'shield-outline',     description: 'Platform settings and user management' },
];

export default function RoleSwitcher({ visible, onClose }: Props) {
  const { user, switchRole } = useAuth();
  const [loading, setLoading] = useState<Role | null>(null);

  if (!user) return null;

  const availableRoles = ALL_ROLES.filter(r => user.roles.includes(r.id));

  const handleSelect = async (role: Role) => {
    if (role === user.role) { onClose(); return; }
    setLoading(role);
    try {
      await switchRole(role);
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not switch role.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Switch Role</Text>
        {availableRoles.map(role => (
          <TouchableOpacity
            key={role.id}
            style={[styles.row, user.role === role.id && styles.rowActive]}
            onPress={() => handleSelect(role.id)}
            disabled={loading !== null}
          >
            <View style={[styles.iconWrap, user.role === role.id && styles.iconWrapActive]}>
              <Ionicons name={role.icon as any} size={20} color={user.role === role.id ? '#fff' : Colors.textSecondary} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.roleLabel, user.role === role.id && styles.roleLabelActive]}>{role.label}</Text>
              <Text style={styles.roleDesc}>{role.description}</Text>
            </View>
            {loading === role.id
              ? <ActivityIndicator size="small" color={Colors.primary} />
              : user.role === role.id
                ? <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                : null
            }
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:          { backgroundColor: Colors.bgSurface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 40, borderTopWidth: 1, borderColor: Colors.bgBorder },
  handle:         { width: 40, height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  title:          { ...Typography.h2, marginBottom: Spacing.md },
  row:            { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.sm, backgroundColor: Colors.bgElevated },
  rowActive:      { borderWidth: 1, borderColor: Colors.primary },
  iconWrap:       { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.bgBorder, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  iconWrapActive: { backgroundColor: Colors.primary },
  rowText:        { flex: 1 },
  roleLabel:      { ...Typography.body, fontWeight: '600' },
  roleLabelActive:{ color: Colors.primary },
  roleDesc:       { ...Typography.sm, marginTop: 2 },
});
