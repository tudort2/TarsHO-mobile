import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';
import { Role } from '../types';

interface Props {
  role: Role;
  userName: string;
  avatarUrl?: string;
  onRoleTap: () => void;
}

const ROLE_LABELS: Record<Role, string> = {
  homeowner: 'Homeowner',
  broker: 'Broker',
  provider: 'Provider',
  admin: 'Admin',
};

export default function TopBar({ role, userName, avatarUrl, onRoleTap }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.brand}>TARS</Text>
      <TouchableOpacity style={styles.roleChip} onPress={onRoleTap} activeOpacity={0.75}>
        <Text style={styles.roleText}>{ROLE_LABELS[role]}</Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>{userName[0]?.toUpperCase()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgSurface, paddingHorizontal: Spacing.md, paddingBottom: 12, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  brand: { flex: 1, fontSize: 20, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 2 },
  roleChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgElevated, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.primary },
  roleText: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginRight: 4 },
  chevron: { color: Colors.primary, fontSize: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: Colors.primary },
  avatarFallback: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
