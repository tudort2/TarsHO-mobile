import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, Pressable, Alert, StyleSheet, ActivityIndicator, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, Typography } from '../theme';
import { useColors, useTheme } from '../context/ThemeContext';
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
  const C = useColors();
  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

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
      <View style={[styles.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[styles.sheetHandle, { backgroundColor: C.bgBorder }]} />
        <Text style={[styles.sheetTitle, { color: C.textPrimary }]}>Change Password</Text>
        {[
          { label: 'Current Password', value: current, onChange: setCurrent },
          { label: 'New Password',     value: next,    onChange: setNext },
          { label: 'Confirm New',      value: confirm, onChange: setConfirm },
        ].map(field => (
          <View key={field.label}>
            <Text style={[styles.inputLabel, { color: C.textMuted }]}>{field.label}</Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              style={[styles.input, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
              placeholderTextColor={C.textMuted}
              placeholder="••••••••"
            />
          </View>
        ))}
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: C.primary }]} onPress={handleSubmit} disabled={loading}>
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
  const C = useColors();
  const { mode, setMode } = useTheme();
  const { user, logout } = useAuth();
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const isDark = mode === 'dark';

  if (!user) return null;

  const handleSignOut = () =>
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: C.bgBase }]} contentContainerStyle={{ paddingBottom: 48 }}>
      {/* Avatar */}
      <View style={[styles.heroSection, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <View style={[styles.avatarFallback, { backgroundColor: C.primary }]}>
          <Text style={styles.avatarInitial}>{user.name[0]}</Text>
        </View>
        <Text style={[styles.userName, { color: C.textPrimary }]}>{user.name}</Text>
        <Text style={[Typography.sm, { color: C.textMuted }]}>{user.email}</Text>
        {user.brokerage ? <Text style={[Typography.sm, { color: C.textMuted, marginTop: 4 }]}>{user.brokerage}</Text> : null}

        <View style={styles.roleChips}>
          {(['homeowner', 'broker', 'provider', 'admin'] as Role[])
            .filter(r => user.roles.includes(r))
            .map(role => (
              <View key={role} style={[
                styles.roleChip,
                { backgroundColor: C.bgElevated, borderColor: C.bgBorder },
                user.role === role && { borderColor: C.primary, backgroundColor: C.primary + '22' },
              ]}>
                <Text style={[styles.roleChipText, { color: user.role === role ? C.primary : C.textMuted }]}>
                  {ROLE_LABELS[role]}
                </Text>
              </View>
            ))}
        </View>
      </View>

      {/* Appearance */}
      <View style={[styles.section]}>
        <Text style={[styles.sectionTitle, { color: C.textMuted }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          <View style={styles.listRow}>
            <View style={[styles.listIcon, { backgroundColor: C.bgElevated }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={18} color={C.primary} />
            </View>
            <Text style={[styles.listLabel, { color: C.textPrimary }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={v => setMode(v ? 'dark' : 'light')}
              trackColor={{ false: C.bgBorder, true: C.primary + '88' }}
              thumbColor={isDark ? C.primary : C.bgSurface}
            />
          </View>
        </View>
      </View>

      {/* Account settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: C.textMuted }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          {[
            { icon: 'lock-closed-outline', label: 'Change Password', onPress: () => setPwModalVisible(true) },
            { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Coming soon') },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.listRow, i < 1 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder }]}
              onPress={item.onPress}
            >
              <View style={[styles.listIcon, { backgroundColor: C.bgElevated }]}>
                <Ionicons name={item.icon as any} size={18} color={C.primary} />
              </View>
              <Text style={[styles.listLabel, { color: C.textPrimary }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App links */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: C.textMuted }]}>App</Text>
        <View style={[styles.card, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          {[
            { icon: 'help-circle-outline',   label: 'Help & Support' },
            { icon: 'document-text-outline', label: 'Terms of Service' },
            { icon: 'shield-outline',        label: 'Privacy Policy' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.listRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder }]}
              onPress={() => {}}
            >
              <View style={[styles.listIcon, { backgroundColor: C.bgElevated }]}>
                <Ionicons name={item.icon as any} size={18} color={C.textSecondary} />
              </View>
              <Text style={[styles.listLabel, { color: C.textPrimary }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: C.bgSurface, borderColor: C.danger + '44' }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={18} color={C.danger} />
          <Text style={[styles.signOutText, { color: C.danger }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: C.textMuted }]}>TARS v1.0.0 · © 2026 TARS USA</Text>

      <ChangePasswordModal visible={pwModalVisible} onClose={() => setPwModalVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:        { flex: 1 },
  heroSection:   { alignItems: 'center', paddingVertical: Spacing.xl, borderBottomWidth: 1 },
  avatarFallback:{ width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarInitial: { color: '#fff', fontSize: 36, fontWeight: '700' },
  userName:      { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  roleChips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.md, justifyContent: 'center' },
  roleChip:      { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  roleChipText:  { fontSize: 12, fontWeight: '500' },
  section:       { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  card:          { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  listRow:       { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  listIcon:      { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  listLabel:     { flex: 1, fontSize: 15 },
  signOutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1 },
  signOutText:   { fontSize: 15, fontWeight: '600' },
  version:       { fontSize: 11, textAlign: 'center', marginTop: Spacing.xl },
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  sheetTitle:  { fontSize: 20, fontWeight: '700', marginBottom: Spacing.md },
  inputLabel:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 6, marginTop: Spacing.sm },
  input:       { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, fontSize: 14, marginBottom: 4 },
  saveBtn:     { borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.md },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
