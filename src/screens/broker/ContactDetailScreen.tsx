import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { Contact } from '../../types';
import { api } from '../../api/client';

function fmt(n: number) { return `$${(n / 1000).toFixed(0)}K`; }

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const ini = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarInitial}>{ini.toUpperCase()}</Text>
    </View>
  );
}

export default function ContactDetailScreen() {
  const nav   = useNavigation();
  const route = useRoute<any>();
  const contactId: string = route.params?.contactId;

  const [contact, setContact] = useState<Contact | null>(route.params?.contact || null);
  const [loading, setLoading] = useState(!route.params?.contact);

  useEffect(() => {
    if (!contactId && !contact) return;
    const id = contactId || contact?.id;
    if (!id) return;
    api.contacts.get(id)
      .then(setContact)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [contactId]);

  if (loading || !contact) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Initials name={contact.name} />
          <Text style={Typography.h1}>{contact.name}</Text>
          {contact.address ? <Text style={Typography.sm}>{contact.address}</Text> : null}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: contact.type === 'Buyer' ? Colors.buy + '33' : Colors.sell + '33' }]}>
              <Text style={[styles.badgeText, { color: contact.type === 'Buyer' ? Colors.buy : Colors.sell }]}>{contact.type}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.primary + '22' }]}>
              <Text style={[styles.badgeText, { color: Colors.primary }]}>{contact.status}</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        {(contact.phone || contact.email) && (
          <View style={styles.actionsRow}>
            {contact.phone && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Ionicons name="call-outline" size={20} color={Colors.success} />
                <Text style={[styles.actionText, { color: Colors.success }]}>Call</Text>
              </TouchableOpacity>
            )}
            {contact.email && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`mailto:${contact.email}`)}>
                <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                <Text style={[styles.actionText, { color: Colors.primary }]}>Email</Text>
              </TouchableOpacity>
            )}
            {contact.phone && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`sms:${contact.phone}`)}>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.sell} />
                <Text style={[styles.actionText, { color: Colors.sell }]}>Text</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Contact info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.infoCard}>
            {contact.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={Colors.textMuted} />
                <Text style={styles.infoText}>{contact.phone}</Text>
              </View>
            )}
            {contact.email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={16} color={Colors.textMuted} />
                <Text style={styles.infoText}>{contact.email}</Text>
              </View>
            )}
            {contact.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
                <Text style={styles.infoText}>{contact.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Desired property */}
        {contact.desiredProperty && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desired Property</Text>
            <View style={styles.infoCard}>
              <View style={styles.dpGrid}>
                {[
                  { label: 'Sqft',   value: contact.desiredProperty.minSqft ? `${contact.desiredProperty.minSqft.toLocaleString()}+` : '—' },
                  { label: 'Beds',   value: contact.desiredProperty.beds ? `${contact.desiredProperty.beds}+` : '—' },
                  { label: 'Baths',  value: contact.desiredProperty.baths ? `${contact.desiredProperty.baths}+` : '—' },
                  { label: 'Budget', value: contact.desiredProperty.minBudget ? `${fmt(contact.desiredProperty.minBudget)}–${fmt(contact.desiredProperty.maxBudget)}` : '—' },
                  { label: 'Timing', value: contact.desiredProperty.timing || '—' },
                  { label: 'City',   value: contact.desiredProperty.city || '—' },
                ].map((item, i) => (
                  <View key={i} style={styles.dpCell}>
                    <Text style={Typography.label}>{item.label}</Text>
                    <Text style={styles.dpValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        {contact.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{contact.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Interaction history */}
        {contact.interactions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interaction History</Text>
            {contact.interactions.map(interaction => (
              <View key={interaction.id} style={styles.interactionRow}>
                <View style={styles.interactionDot} />
                <View style={{ flex: 1 }}>
                  <View style={styles.interactionHeader}>
                    <Text style={styles.interactionType}>{interaction.type}</Text>
                    <Text style={Typography.xs}>{interaction.date}</Text>
                  </View>
                  <Text style={Typography.sm}>{interaction.note}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.bgBase },
  centered:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgBase },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: 56, backgroundColor: Colors.bgSurface, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  backBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ ...Typography.h3 },
  profileCard:{ alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.bgSurface, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  avatarFallback:{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, borderWidth: 3, borderColor: Colors.primary },
  avatarInitial: { color: Colors.primary, fontSize: 28, fontWeight: '700' },
  badgeRow:   { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  badge:      { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  badgeText:  { fontSize: 12, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.md },
  actionBtn:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.bgSurface, borderRadius: Radius.md, paddingVertical: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  actionText: { fontWeight: '600', fontSize: 14 },
  section:    { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sectionTitle:{ ...Typography.label, marginBottom: Spacing.sm },
  infoCard:   { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  infoRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6 },
  infoText:   { color: Colors.textPrimary, fontSize: 14 },
  dpGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dpCell:     { width: '30%', flex: 1, minWidth: '28%' },
  dpValue:    { color: Colors.textPrimary, fontSize: 14, fontWeight: '600', marginTop: 2 },
  notesCard:  { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgBorder },
  notesText:  { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
  interactionRow: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  interactionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 5 },
  interactionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  interactionType:{ color: Colors.primary, fontSize: 13, fontWeight: '600' },
});
