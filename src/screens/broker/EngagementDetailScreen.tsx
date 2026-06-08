import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, Pressable,
  TextInput, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Engagement, EngagementStage } from '../../types';
import { api } from '../../api/client';
import { getInitials } from '../../utils/initials';

// ── Stage definitions ─────────────────────────────────────────────────────────
const STAGE_DAYS: Record<number, number> = {
  1:1, 2:3, 3:7, 4:30, 5:3, 6:2, 7:10, 8:14, 9:1, 10:3, 11:7,
};
const STAGE_NAMES: Record<number, string> = {
  1:'Initial Contact',   2:'Needs Assessment', 3:'Pre-Approval',
  4:'Property Search',   5:'Offer Submitted',  6:'Under Contract',
  7:'Inspection',        8:'Appraisal',         9:'Final Walkthrough',
  10:'Closing',          11:'Post-Close',
};
const STAGE_DESC: Record<number, string> = {
  1: 'First outreach or referral. Confirm contact details and set expectations for the journey ahead.',
  2: 'Understand the client\'s goals, timeline, budget, and property preferences in detail.',
  3: 'Client works with lender to obtain pre-approval letter. Confirm budget ceiling before searching.',
  4: 'Active search phase. Schedule showings, review listings, and refine criteria with the client.',
  5: 'Draft and submit offer. Negotiate price, contingencies, and terms with the seller\'s agent.',
  6: 'Offer accepted. Open escrow, deposit earnest money, and begin all due-diligence work.',
  7: 'Schedule and attend home inspection. Review report, then negotiate repairs or credits.',
  8: 'Lender orders independent appraisal. Ensure the property value meets the loan threshold.',
  9: 'Walk the property 24 h before closing. Verify agreed-upon repairs and overall condition.',
  10: 'Sign closing documents, transfer funds, record the deed, and hand over the keys.',
  11: 'Follow up with client post-move. Ensure smooth transition. Request referrals.',
};

// ── Stage builder ──────────────────────────────────────────────────────────────
type StageItem = EngagementStage & { dayStart: number; dayDuration: number };

function buildStages(eng: Engagement): StageItem[] {
  const base = eng.stages.length > 0
    ? eng.stages
    : Array.from({ length: eng.totalStages }, (_, i) => ({
        stageNumber: i + 1,
        name: STAGE_NAMES[i + 1] ?? `Stage ${i + 1}`,
        status: (i + 1 < eng.currentStage ? 'done' : i + 1 === eng.currentStage ? 'current' : 'pending') as 'done' | 'current' | 'pending',
      }));
  let running = 1;
  return base.map(s => {
    const dur = STAGE_DAYS[s.stageNumber] ?? 5;
    const item: StageItem = { ...s, dayStart: running, dayDuration: dur };
    running += dur;
    return item;
  });
}

// ── Step Detail Modal ─────────────────────────────────────────────────────────
function StepDetailModal({ stage, typeColor, visible, onClose, onMarkComplete, onMarkIncomplete }: {
  stage: StageItem | null;
  typeColor: string;
  visible: boolean;
  onClose: () => void;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
}) {
  const C = useColors();
  const [note, setNote] = useState('');
  if (!stage) return null;

  const isDone = stage.status === 'done';
  const desc   = STAGE_DESC[stage.stageNumber] ?? 'No description available.';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={md.backdrop} onPress={onClose} />
      <View style={[md.sheet, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <View style={[md.handle, { backgroundColor: C.bgBorder }]} />

        {/* Stage header */}
        <View style={md.stageHeader}>
          <View style={[md.stageDot, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[md.stageNum, { color: typeColor }]}>{stage.stageNumber}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[md.stageName, { color: C.textPrimary }]}>{stage.name}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>
              Day {stage.dayStart} · {stage.dayDuration} day{stage.dayDuration !== 1 ? 's' : ''} · {stage.status}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={md.closeBtn}>
            <Ionicons name="close" size={20} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={[md.sectionLabel, { color: C.textMuted }]}>About this step</Text>
        <Text style={[Typography.sm, { color: C.textSecondary, lineHeight: 20, marginBottom: Spacing.md }]}>{desc}</Text>

        {/* Notes */}
        <Text style={[md.sectionLabel, { color: C.textMuted }]}>Notes</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add notes for this step..."
          placeholderTextColor={C.textMuted}
          multiline
          numberOfLines={3}
          style={[md.noteInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
        />

        {/* Mark button */}
        <TouchableOpacity
          style={[md.markBtn, { backgroundColor: isDone ? C.warning + 'DD' : C.success }]}
          onPress={() => {
            isDone ? onMarkIncomplete() : onMarkComplete();
            onClose();
          }}
        >
          <Ionicons
            name={isDone ? 'arrow-undo-outline' : 'checkmark-circle-outline'}
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={md.markBtnText}>
            {isDone ? 'Mark Incomplete' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function EngagementDetailScreen() {
  const C     = useColors();
  const route = useRoute<any>();

  const initEng: Engagement | null = route.params?.engagement ?? null;
  const contactName: string = route.params?.contactName ?? initEng?.contactName ?? 'Client';

  const [eng,          setEng]         = useState<Engagement | null>(initEng);
  const [stages,       setStages]      = useState<StageItem[]>(initEng ? buildStages(initEng) : []);
  const [advancing,    setAdvancing]   = useState(false);
  const [loading,      setLoading]     = useState(!initEng);
  const [detailStage,  setDetailStage] = useState<StageItem | null>(null);
  const [detailVisible,setDetailVisible] = useState(false);

  // Scroll ref + row y-positions for auto-scroll
  const scrollRef  = useRef<ScrollView>(null);
  const rowYRef    = useRef<Record<number, number>>({});

  useEffect(() => {
    if (!initEng && route.params?.contactId) {
      api.engagements.list()
        .then(all => {
          const found = all.find(e => e.contactName === contactName) ?? all[0] ?? null;
          if (found) { setEng(found); setStages(buildStages(found)); }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  // Tap a row: make it current + open detail modal + scroll so it appears above modal
  const handleRowTap = useCallback((stage: StageItem) => {
    // Mark tapped stage as current locally
    setStages(prev => prev.map(s => ({
      ...s,
      status: s.stageNumber === stage.stageNumber
        ? (s.status === 'done' ? 'done' : 'current')   // keep done if already done
        : s.status === 'current' ? 'pending' : s.status, // demote previous current
    })));

    setDetailStage(stage);
    setDetailVisible(true);

    // Scroll so the tapped row is near the top — modal takes ~55% of screen from bottom
    const y = rowYRef.current[stage.stageNumber] ?? 0;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 20), animated: true });
    }, 80);
  }, []);

  const handleMarkComplete = useCallback(() => {
    if (!detailStage) return;
    setStages(prev => prev.map(s =>
      s.stageNumber === detailStage.stageNumber ? { ...s, status: 'done' } : s
    ));
  }, [detailStage]);

  const handleMarkIncomplete = useCallback(() => {
    if (!detailStage) return;
    setStages(prev => prev.map(s =>
      s.stageNumber === detailStage.stageNumber ? { ...s, status: 'current' } : s
    ));
  }, [detailStage]);

  const handleAdvance = () => {
    if (!eng) return;
    Alert.alert(
      'Advance Stage',
      `Move to: ${STAGE_NAMES[eng.currentStage + 1] ?? 'Next'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Advance', onPress: async () => {
          setAdvancing(true);
          try {
            const updated = await api.engagements.advance(eng.id);
            setEng(updated); setStages(buildStages(updated));
          } catch (e: any) { Alert.alert('Error', e.message); }
          finally { setAdvancing(false); }
        }},
      ]
    );
  };

  if (loading) {
    return <View style={[s.centered, { backgroundColor: C.bgBase }]}><ActivityIndicator size="large" color={C.primary} /></View>;
  }
  if (!eng) {
    return (
      <View style={[s.centered, { backgroundColor: C.bgBase }]}>
        <Ionicons name="briefcase-outline" size={48} color={C.bgBorder2} />
        <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.md }]}>No active engagement found.</Text>
      </View>
    );
  }

  const typeColor  = eng.type === 'buy' ? C.buy : C.sell;
  const ini        = getInitials(contactName);
  const totalDays  = stages.reduce((sum, s) => sum + s.dayDuration, 0);
  const closedDays = stages.filter(s => s.status === 'done').reduce((sum, s) => sum + s.dayDuration, 0);
  const openDays   = totalDays - closedDays;
  const pct        = totalDays > 0 ? (closedDays / totalDays) * 100 : 0;

  return (
    <View style={[s.screen, { backgroundColor: C.bgBase }]}>

      {/* ── Frozen header ───────────────────────────────────────────────── */}
      <View style={[s.frozenHeader, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <View style={s.heroRow}>
          <View style={[s.avatar, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[s.avatarText, { color: typeColor }]}>{ini}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={[s.clientName, { color: C.textPrimary }]}>{contactName}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>
              Stage {eng.currentStage} of {eng.totalStages} · {STAGE_NAMES[eng.currentStage] ?? ''}
            </Text>
          </View>
          <View style={[s.typeBadge, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[s.typeBadgeText, { color: typeColor }]}>{eng.type.toUpperCase()}</Text>
          </View>
        </View>

        {/* Days-based progress bar */}
        <View style={[s.progressTrack, { backgroundColor: C.bgBorder }]}>
          <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: typeColor }]} />
        </View>
        <Text style={[Typography.xs, { color: C.textMuted, textAlign: 'right', marginTop: 3 }]}>
          {closedDays} / {totalDays} days
        </Text>

        {/* Stats strip */}
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={[s.statValue, { color: C.success }]}>{closedDays}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Closed</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: C.bgBorder }]} />
          <View style={s.stat}>
            <Text style={[s.statValue, { color: typeColor }]}>{openDays}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Open</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: C.bgBorder }]} />
          <View style={s.stat}>
            <Text style={[s.statValue, { color: C.textPrimary }]}>{totalDays}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Total</Text>
          </View>
          <TouchableOpacity
            style={[s.advBtn, { backgroundColor: typeColor, opacity: advancing || eng.currentStage >= eng.totalStages ? 0.5 : 1 }]}
            onPress={handleAdvance}
            disabled={advancing || eng.currentStage >= eng.totalStages}
          >
            {advancing
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={s.advBtnText}>Advance ›</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable timeline ─────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 380 }}
      >
        <Text style={[Typography.label, { color: C.textMuted, marginBottom: Spacing.sm }]}>
          Tap any step to set as current and view details
        </Text>

        <View style={[s.timelineCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          {stages.map((stage, i) => {
            const isDone    = stage.status === 'done';
            const isCurrent = stage.status === 'current';
            const dotBg     = isDone ? C.success : isCurrent ? C.buy : 'transparent';
            const dotBorder = isDone ? C.success : isCurrent ? C.buy : C.bgBorder2;
            const nameColor = isDone ? C.textMuted : isCurrent ? C.textPrimary : C.textSecondary;

            return (
              <TouchableOpacity
                key={stage.stageNumber}
                activeOpacity={0.7}
                onPress={() => handleRowTap(stage)}
                onLayout={e => { rowYRef.current[stage.stageNumber] = e.nativeEvent.layout.y; }}
                style={[
                  s.stageRow,
                  isCurrent && { backgroundColor: typeColor + '0A' },
                  i < stages.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder },
                ]}
              >
                {/* Day column */}
                <View style={s.dayCol}>
                  <Text style={[s.dayLabel, { color: isDone ? C.textMuted : typeColor }]}>
                    Day {stage.dayStart}
                  </Text>
                  <Text style={[s.durLabel, { color: C.textMuted }]}>+{stage.dayDuration}d</Text>
                </View>

                {/* Connector */}
                <View style={s.connWrap}>
                  <View style={[s.dot, { backgroundColor: dotBg, borderColor: dotBorder }]}>
                    {isDone && <Ionicons name="checkmark" size={10} color="#fff" />}

                  </View>
                  {i < stages.length - 1 && (
                    <View style={[s.connLine, { backgroundColor: isDone ? C.success + '55' : C.bgBorder }]} />
                  )}
                </View>

                {/* Stage name + badges */}
                <View style={s.stageNameCol}>
                  <Text style={[s.stageName, {
                    color: nameColor,
                    fontWeight: isCurrent ? '700' : '400',
                    textDecorationLine: isDone ? 'line-through' : 'none',
                  }]}>
                    {stage.stageNumber}. {stage.name}
                  </Text>
                  {isCurrent && (
                    <View style={[s.curBadge, { backgroundColor: typeColor + '22' }]}>
                      <Text style={[s.curBadgeText, { color: typeColor }]}>Current</Text>
                    </View>
                  )}
                  {isDone && (
                    <View style={[s.curBadge, { backgroundColor: C.success + '22' }]}>
                      <Text style={[s.curBadgeText, { color: C.success }]}>Complete</Text>
                    </View>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Running total */}
        <View style={[s.totalRow, { backgroundColor: C.bgElevated, borderColor: C.bgBorder }]}>
          <Text style={[Typography.sm, { color: C.textSecondary }]}>Open stages total</Text>
          <Text style={[s.totalValue, { color: typeColor }]}>{openDays} days</Text>
        </View>
      </ScrollView>

      <StepDetailModal
        stage={detailStage}
        typeColor={typeColor}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onMarkComplete={handleMarkComplete}
        onMarkIncomplete={handleMarkIncomplete}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1 },
  centered:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frozenHeader: { borderBottomWidth: 1, paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  heroRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  avatar:       { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  avatarText:   { fontSize: 18, fontWeight: '700' },
  clientName:   { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  typeBadge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  typeBadgeText:{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  progressTrack:{ height: 6, borderRadius: 3, overflow: 'hidden', marginTop: Spacing.xs },
  progressFill: { height: 6, borderRadius: 3 },
  statsRow:     { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.xs },
  stat:         { flex: 1, alignItems: 'center' },
  statValue:    { fontSize: 20, fontWeight: '800' },
  statDivider:  { width: 1, height: 28 },
  advBtn:       { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md },
  advBtnText:   { color: '#fff', fontSize: 13, fontWeight: '700' },
  timelineCard: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.sm },
  stageRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: Spacing.xs },
  dayCol:       { width: 54, alignItems: 'flex-end', paddingRight: Spacing.sm },
  dayLabel:     { fontSize: 11, fontWeight: '700' },
  durLabel:     { fontSize: 10 },
  connWrap:     { width: 28, alignItems: 'center', alignSelf: 'stretch' },
  dot:          { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dotInner:     { width: 8, height: 8, borderRadius: 4 },
  connLine:     { width: 2, flex: 1, minHeight: 8, marginTop: 2 },
  stageNameCol: { flex: 1, paddingLeft: Spacing.xs },
  stageName:    { fontSize: 14, lineHeight: 20 },
  curBadge:     { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm, marginTop: 3 },
  curBadgeText: { fontSize: 10, fontWeight: '700' },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1 },
  totalValue:   { fontSize: 18, fontWeight: '800' },
});

const md = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:       { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, borderTopWidth: 1 },
  handle:      { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  stageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  stageDot:    { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginRight: Spacing.md },
  stageNum:    { fontSize: 16, fontWeight: '800' },
  stageName:   { fontSize: 17, fontWeight: '700' },
  closeBtn:    { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  sectionLabel:{ fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, marginTop: Spacing.xs },
  noteInput:   { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, height: 80, textAlignVertical: 'top', fontSize: 14, marginBottom: Spacing.md },
  markBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, padding: Spacing.md },
  markBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
