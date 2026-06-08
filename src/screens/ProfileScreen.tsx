import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, Pressable, Alert, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Role } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { normalizeUser } from '../context/AuthContext';

const ROLE_LABELS: Record<Role, string> = {
  homeowner: 'Homeowner',
  broker: 'Broker',
  provider: 'Provider',
  admin: 'Admin',
};

function ChangePasswordModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [current, setCurrent]   = useState('');
  const [next, setNext]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!current || !next || !confirm) { Alert.alert('Error', 'All fields required.'); return; }
    if (next !== confirm) { Alert.alert('Error', 'New passwords do not match.'); return; }
    if (next.length < 8)  { Alert.alert('Error', 'Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await api.auth.changePassword(current, next);
      Alert.alert('Success', 'Password updated.');
      setCurrent(''); setNext(''); setConfirm('');
      onClose();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Change Password</Text>
        {[
          { label: 'Current Password', value: current, onChange: setCurrent },
          { label: 'New Password',     value: next,    onChange: setNext },
          { label: 'Confirm New',      value: confirm, onChange: setConfirm },
        ].map(field => (
          <View key={field.label}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              style={styles.input}
              placeholderTextColor={Colors.textMuted}
              placeholder="••••••••"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveBtnText}>Update Password</Text>
          }
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [pwModalVisible, setPwModalVisible] = useState(false);

  if (!user) return null;

  const handleSignOut = () =>
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 48 }}>
      {/* Avatar */}
      <View style={styles.heroSection}>
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>{user.name[0]}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={Typography.sm}>{user.email}</Text>
        {user.brokerage ? <Text style={[Typography.sm, { marginTop: 4 }]}>{user.brokerage}</Text> : null}

        <View style={styles.roleChips}>
          {(['homeowner', 'broker', 'provider', 'admin'] as Role[])
            .filter(r => user.roles.includes(r))
            .map(role => (
              <View key={role} style={[styles.roleChip, user.role === role && styles.roleChipActive]}>
                <Text style={[styles.roleChipText, user.role === role && { color: Colors.primary }]}>
                  {ROLE_LABELS[role]}
                </Text>
              </View>
            ))}
        </View>
      </View>

      {/* Account settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {[
            { icon: 'lock-closed-outline', label: 'Change Password', onPress: () => setPwModalVisible(true) },
            { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Coming soon') },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.listRow, i < 1 && styles.listRowBorder]} onPress={item.onPress}>
              <View style={styles.listIcon}>
                <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          {[
            { icon: 'help-circle-outline',   label: 'Help & Support' },
            { icon: 'document-text-outline', label: 'Terms of Service' },
            { icon: 'shield-outline',        label: 'Privacy Policy' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[styles.listRow, i < 2 && styles.listRowBorder]} onPress={() => {}}>
              <View style={styles.listIcon}>
                <Ionicons name={item.icon as any} size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>TARS v1.0.0 · © 2026 TARS USA</Text>

      <ChangePasswordModal visible={pwModalVisible} onClose={() => setPwModalVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: Colors.bgBase },
  heroSection:   { alignItems: 'center', paddingVertical: Spacing.xl, backgroundColor: Colors.bgSurface, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  avatarFallback:{ width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarInitial: { color: '#fff', fontSize: 36, fontWeight: '700' },
  userName:      { ...Typography.h2, marginBottom: 4 },
  roleChips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.md, justifyContent: 'center' },
  roleChip:      { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.bgBorder },
  roleChipActive:{ borderColor: Colors.primary, backgroundColor: Colors.primary + '22' },
  roleChipText:  { color: Colors.textMuted, fontSize: 12, fontWeight: '500' },
  section:       { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle:  { ...Typography.label, marginBottom: Spacing.sm },
  card:          { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.bgBorder, overflow: 'hidden' },
  listRow:       { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  listRowBorder: { borderBottomWidth: 1, borderColor: Colors.bgBorder },
  listIcon:      { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  listLabel:     { flex: 1, color: Colors.textPrimary, fontSize: 15 },
  signOutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger + '44' },
  signOutText:   { color: Colors.danger, fontSize: 15, fontWeight: '600' },
  version:       { color: Colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: Spacing.xl },

  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:       { backgroundColor: Colors.bgSurface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1, borderColor: Colors.bgBorder },
  sheetHandle: { width: 40, height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  sheetTitle:  { ...Typography.h2, marginBottom: Spacing.md },
  inputLabel:  { ...Typography.label, marginBottom: 6 },
  input:       { backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.bgBorder, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.textPrimary, fontSize: 15, marginBottom: Spacing.md },
  saveBtn:     { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.sm },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
