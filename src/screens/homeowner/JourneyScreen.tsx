import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, Pressable,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { Engagement, JourneyStage, ChecklistItem } from '../../types';
import { api } from '../../api/client';

const STAGE_META: Record<string, { description: string; checklist: string[] }> = {
  'Get Pre-Approved':    { description: 'Work with a lender to get pre-approved and understand your budget.', checklist: ['Contact 2–3 lenders', 'Gather W-2s and bank statements', 'Get pre-approval letter'] },
  'Define Criteria':     { description: 'Define must-haves vs. nice-to-haves for your future home.', checklist: ['Set bedroom/bathroom requirements', 'Choose target neighborhoods', 'Set max budget'] },
  'Select Broker':       { description: 'Interview agents and select one who knows your target market.', checklist: ['Interview 2+ agents', 'Check references', 'Sign buyer agreement'] },
  'Search Listings':     { description: 'Browse MLS listings that meet your criteria.', checklist: ['Set up auto-alerts', 'Review new listings daily', 'Track favorites'] },
  'Tour Homes':          { description: 'Schedule and attend showings for shortlisted properties.', checklist: ['Schedule showings', 'Take notes on each home', 'Narrow to top 3'] },
  'Make Offer':          { description: 'Prepare and submit a competitive offer.', checklist: ['Review comps with agent', 'Decide on offer price', 'Submit written offer'] },
  'Negotiate':           { description: 'Respond to counter-offers and negotiate terms.', checklist: ['Review seller counter', 'Decide on concessions', 'Reach mutual acceptance'] },
  'Accepted Offer':      { description: 'Offer is accepted — open escrow and start due diligence.', checklist: ['Open escrow', 'Wire earnest money', 'Order inspection'] },
  'Inspection':          { description: 'Complete home inspection and review findings.', checklist: ['Attend inspection', 'Review report', 'Request repairs or credits'] },
  'Appraisal':           { description: 'Lender orders appraisal to confirm property value.', checklist: ['Wait for appraisal', 'Review value vs. offer price', 'Address any shortfall'] },
  'Loan Processing':     { description: 'Provide any outstanding documents to your lender.', checklist: ['Respond to conditions', 'Lock interest rate', 'Avoid new credit inquiries'] },
  'Clear Contingencies': { description: 'Remove inspection, appraisal, and loan contingencies.', checklist: ['Sign contingency removal', 'Confirm loan approval', 'Notify seller'] },
  'Final Walkthrough':   { description: 'Verify the property condition before closing.', checklist: ['Confirm repairs completed', 'Check all fixtures', 'Note any new issues'] },
  'Signing':             { description: 'Sign closing documents at escrow or title company.', checklist: ['Review closing disclosure', 'Bring valid ID', 'Sign loan docs'] },
  'Funding':             { description: 'Lender funds the loan and down payment is transferred.', checklist: ['Wire down payment', 'Confirm wire received', 'Wait for funding notice'] },
  'Close':               { description: 'Congratulations — you now own the home!', checklist: ['Receive keys', 'Record deed', 'Update address with USPS'] },
  'Decide to Sell':      { description: 'Confirm your motivations and timeline for selling.', checklist: ['Calculate net proceeds', 'Review market conditions', 'Set target close date'] },
  'Set List Price':      { description: 'Work with your broker to price the home competitively.', checklist: ['Review CMA report', 'Agree on list price', 'Understand pricing strategy'] },
  'Prepare Home':        { description: 'Make repairs and improvements to maximize value.', checklist: ['Complete deferred maintenance', 'Deep clean', 'Stage key rooms'] },
  'Professional Photos': { description: 'Hire a professional photographer for listing photos.', checklist: ['Schedule photographer', 'Review and approve photos', 'Order floor plan if needed'] },
  'List on MLS':         { description: 'Go live on the MLS and major home search sites.', checklist: ['Review listing details', 'Confirm syndication', 'Announce to network'] },
  'Market Property':     { description: 'Active marketing to drive showings and offers.', checklist: ['Post on social media', 'Hold open house', 'Track showing feedback'] },
  'Show Home':           { description: 'Accommodate buyer showings and collect feedback.', checklist: ['Keep home show-ready', 'Respond to requests same day', 'Collect broker feedback'] },
  'Review Offers':       { description: 'Evaluate and compare all offers received.', checklist: ['Review all terms', 'Compare net proceeds', 'Discuss strategy with broker'] },
  'Accept Offer':        { description: 'Accept the best offer and open escrow.', checklist: ['Sign acceptance', 'Open escrow', 'Notify other interested parties'] },
};

function buildStages(engagement: Engagement): JourneyStage[] {
  return engagement.stages.map(s => {
    const meta = STAGE_META[s.name] || { description: '', checklist: [] };
    const status: JourneyStage['status'] =
      s.status === 'done'    ? 'completed' :
      s.status === 'current' ? 'active'    : 'pending';
    return {
      id: s.stageNumber,
      title: s.name,
      description: meta.description,
      status,
      checklist: meta.checklist.map((label, i) => ({
        id: `${s.stageNumber}-${i}`,
        label,
        completed: status === 'completed',
      })),
    };
  });
}

function StageRow({ stage, onPress }: { stage: JourneyStage; onPress: () => void }) {
  const isCompleted = stage.status === 'completed';
  const isActive    = stage.status === 'active';
  const dotColor    = isCompleted ? Colors.success : isActive ? Colors.primary : Colors.bgBorder;

  return (
    <TouchableOpacity style={styles.stageRow} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: dotColor, borderColor: isActive ? Colors.primary : 'transparent', borderWidth: isActive ? 3 : 0 }]}>
          {isCompleted && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        <View style={[styles.line, { backgroundColor: isCompleted ? Colors.success : Colors.bgBorder }]} />
      </View>
      <View style={[styles.stageCard, isActive && styles.stageCardActive]}>
        <View style={styles.stageHeader}>
          <Text style={styles.stageNum}>Stage {stage.id}</Text>
          <View style={[styles.statusChip, { backgroundColor: isCompleted ? Colors.success + '22' : isActive ? Colors.primary + '22' : Colors.bgBorder + '55' }]}>
            <Text style={[styles.statusChipText, { color: isCompleted ? Colors.success : isActive ? Colors.primary : Colors.textMuted }]}>
              {isCompleted ? 'Complete' : isActive ? 'In Progress' : 'Upcoming'}
            </Text>
          </View>
        </View>
        <Text style={styles.stageTitle}>{stage.title}</Text>
        {stage.description ? <Text style={styles.stageDesc} numberOfLines={2}>{stage.description}</Text> : null}
        {stage.checklist.length > 0 && (
          <Text style={styles.checklistCount}>{stage.checklist.filter(c => c.completed).length}/{stage.checklist.length} tasks done</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function StageModal({ stage, onClose }: { stage: JourneyStage | null; onClose: () => void }) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  useEffect(() => { if (stage) setItems(stage.checklist); }, [stage]);
  if (!stage) return null;
  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  return (
    <Modal visible={!!stage} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetStageNum}>Stage {stage.id}</Text>
        <Text style={styles.sheetTitle}>{stage.title}</Text>
        {stage.description ? <Text style={styles.sheetDesc}>{stage.description}</Text> : null}
        {items.length > 0 && (
          <>
            <Text style={[Typography.label, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Checklist</Text>
            {items.map(item => (
              <TouchableOpacity key={item.id} style={styles.checkRow} onPress={() => toggle(item.id)}>
                <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                  {item.completed && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={[styles.checkLabel, item.completed && styles.checkLabelDone]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </Modal>
  );
}

type Tab = 'buy' | 'sell';

export default function JourneyScreen() {
  const [tab, setTab]                     = useState<Tab>('buy');
  const [engagements, setEngagements]     = useState<Engagement[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);

  const load = useCallback(async () => {
    try {
      const all = await api.engagements.list();
      setEngagements(all.filter(e => e.status === 'active'));
    } catch { }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeEng = engagements.find(e => e.type === tab);
  const stages    = activeEng ? buildStages(activeEng) : [];
  const completed = stages.filter(s => s.status === 'completed').length;

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.tabBar}>
        {(['buy', 'sell'] as Tab[]).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && { color: t === 'buy' ? Colors.buy : Colors.sell }]}>
              {t === 'buy' ? '🏠 Buy Journey' : '🔑 Sell Journey'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />}
      >
        {!activeEng ? (
          <Text style={[Typography.sm, { textAlign: 'center', marginTop: 40 }]}>No active {tab} journey found.</Text>
        ) : (
          <>
            <View style={styles.progressSummary}>
              <Text style={Typography.sm}>{completed} of {stages.length} stages complete</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, {
                  width: `${stages.length > 0 ? (completed / stages.length) * 100 : 0}%`,
                  backgroundColor: tab === 'buy' ? Colors.buy : Colors.sell,
                }]} />
              </View>
            </View>
            {stages.map(stage => (
              <StageRow key={stage.id} stage={stage} onPress={() => setSelectedStage(stage)} />
            ))}
          </>
        )}
      </ScrollView>

      <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Colors.bgBase },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgBase },
  tabBar:    { flexDirection: 'row', backgroundColor: Colors.bgSurface, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  tab:       { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: Colors.primary },
  tabText:   { fontSize: 14, fontWeight: '600', color: Colors.textMuted },

  progressSummary: { marginBottom: Spacing.md },
  progressTrack:   { height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, marginTop: 6 },
  progressFill:    { height: 4, borderRadius: 2 },

  stageRow:        { flexDirection: 'row', marginBottom: 0 },
  rail:            { alignItems: 'center', width: 32, marginRight: Spacing.sm },
  dot:             { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bgBorder, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line:            { width: 2, flex: 1, minHeight: 16 },
  stageCard:       { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.bgBorder },
  stageCardActive: { borderColor: Colors.primary },
  stageHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stageNum:        { color: Colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  statusChip:      { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  statusChipText:  { fontSize: 11, fontWeight: '600' },
  stageTitle:      { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  stageDesc:       { color: Colors.textSecondary, fontSize: 13, marginBottom: 6 },
  checklistCount:  { color: Colors.textMuted, fontSize: 11 },

  backdrop:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet:           { backgroundColor: Colors.bgSurface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, maxHeight: '80%', borderTopWidth: 1, borderColor: Colors.bgBorder },
  sheetHandle:     { width: 40, height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  sheetStageNum:   { color: Colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  sheetTitle:      { ...Typography.h2, marginBottom: Spacing.xs },
  sheetDesc:       { ...Typography.sm, marginBottom: Spacing.sm },
  checkRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  checkbox:        { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Colors.bgBorder, marginRight: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkLabel:      { color: Colors.textPrimary, fontSize: 14, flex: 1 },
  checkLabelDone:  { color: Colors.textMuted, textDecorationLine: 'line-through' },
});
