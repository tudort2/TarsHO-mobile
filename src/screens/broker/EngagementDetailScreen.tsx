import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, Pressable,
  TextInput, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Engagement, EngagementStage } from '../../types';
import { api } from '../../api/client';
import { getInitials } from '../../utils/initials';

// ── Stage definitions ─────────────────────────────────────────────────────────
const STAGE_DURATION: Record<string, number> = {
  'Market Exploration': 7, 'Sign Buyer Agreement': 2, 'Pre-Approval': 7,
  'Search Listings': 21, 'Property Viewing': 14, 'Opinion of Value': 5,
  'Make Offer': 3, 'Offer Negotiation': 5, 'Mutual Agreement': 1,
  'Earnest Deposit': 1, 'Loan Application': 14, 'Formal Appraisal': 14,
  'House Inspection': 10, 'Final Walk-through': 1, 'Verification': 3,
  'Closing': 1, 'After Sale Service': 7,
  'Market Analysis': 5, 'Sign Seller Agreement': 2, 'Pre-Appraisal': 5,
  'Pre-Inspection': 5, 'Prepare for Listing': 14, 'Listing Price Decision': 3,
  'Listing Property': 3, 'Listing Management': 30, 'Showing': 21,
  'Offers Review': 5, 'Escrow': 14,
};

const STAGE_DESC: Record<string, string> = {
  'Market Exploration':
    "Get a feel for neighborhoods, prices, and timing before committing. Browse the map, review trends, set your target zones.",
  'Sign Buyer Agreement':
    "Formalize representation with your broker. Review agreement terms and e-Sign via DocuSign.",
  'Pre-Approval':
    "Know your true budget and strengthen your offers. Share financials with a lender and receive a pre-approval letter.",
  'Search Listings':
    "Active search phase. Review MLS listings daily, set saved-search filters, and shortlist 5-8 strong candidates.",
  'Property Viewing':
    "Schedule in-person showings. Evaluate condition, layout, and neighborhood. Take notes and photos at each home.",
  'Opinion of Value':
    "Anchor to data before you make an offer. Run a QCMA on your top candidate and compare to the list price.",
  'Make Offer':
    "Set price and terms with confidence. Test offer prices in scenarios, choose contingencies, and prepare your offer.",
  'Offer Negotiation':
    "Counter-offer rounds with the seller. Submit offer, review counteroffer, and negotiate terms to mutual agreement.",
  'Mutual Agreement':
    "Both sides agree; the purchase agreement is signed. Confirm mutually accepted terms and receive signed agreement.",
  'Earnest Deposit':
    "Show good faith via escrow. Wire earnest money and confirm escrow receipt.",
  'Loan Application':
    "Lock financing in motion. Complete full loan application and lock your interest rate.",
  'Formal Appraisal':
    "Lender confirms the home value. Appraisal is scheduled and reviewed against the purchase price.",
  'House Inspection':
    "Understand the home condition. Hire an inspector, attend the inspection, and negotiate repairs.",
  'Final Walk-through':
    "Verify condition right before closing. Confirm repairs completed and home is ready to close.",
  'Verification':
    "Review title and disclosures. Review preliminary title report and verify seller disclosures.",
  'Closing':
    "Sign, fund, record - then keys. Sign closing documents, confirm wiring, and receive keys.",
  'After Sale Service':
    "Make your new home sticky in TARS. Set up your Home Digest and turn on maintenance reminders.",
  'Market Analysis':
    "Understand likely price range and timing. Review market research and Quantarium valuation & comps.",
  'Sign Seller Agreement':
    "Engage your broker formally. Review listing terms & commission and e-Sign via DocuSign.",
  'Pre-Appraisal':
    "Optional value check before listing. Schedule a pre-appraisal to benchmark your expected sale price.",
  'Pre-Inspection':
    "Surface issues early to avoid surprises. Book a pre-inspection and review findings & plan repairs.",
  'Prepare for Listing':
    "Repairs, landscaping, decluttering, cleaning, staging, photos, and signpost. First impressions drive offers.",
  'Listing Price Decision':
    "Choose your list price from data. Compare TerraPlot scenarios and set a strategic list price.",
  'Listing Property':
    "Submit to NWMLS and syndicate. Sign the Listing Agreement and approve marketing photos.",
  'Listing Management':
    "Go live and start promotion. Confirm listing is live on NWMLS and launch your marketing campaign.",
  'Showing':
    "Buyers tour; you receive showing reports. Approve showing schedule and review showing feedback.",
  'Offers Review':
    "Evaluate incoming offers against the market. Review all offers vs. comps and discuss strategy with broker.",
  'Escrow':
    "Track inspections, appraisal, and financing. Provide access for inspection & appraisal and respond to repair requests.",
};

const MAP_STAGE_NAMES = new Set([
  'Market Exploration', 'Search Listings', 'Property Viewing', 'Opinion of Value',
  'Market Analysis', 'Listing Price Decision', 'Listing Management',
]);

const BUY_STAGE_NAMES = [
  'Market Exploration', 'Sign Buyer Agreement', 'Pre-Approval', 'Search Listings',
  'Property Viewing', 'Opinion of Value', 'Make Offer', 'Offer Negotiation',
  'Mutual Agreement', 'Earnest Deposit', 'Loan Application', 'Formal Appraisal',
  'House Inspection', 'Final Walk-through', 'Verification', 'Closing', 'After Sale Service',
];
const SELL_STAGE_NAMES = [
  'Market Analysis', 'Sign Seller Agreement', 'Pre-Appraisal', 'Pre-Inspection',
  'Prepare for Listing', 'Listing Price Decision', 'Listing Property', 'Listing Management',
  'Showing', 'Offers Review', 'Offer Negotiation', 'Mutual Agreement',
  'Escrow', 'Closing', 'After Sale Service',
];

type StageItem = EngagementStage & { dayStart: number; dayDuration: number };

function buildStages(eng: Engagement): StageItem[] {
  const nameList = eng.type === 'sell' ? SELL_STAGE_NAMES : BUY_STAGE_NAMES;
  const base = eng.stages.length > 0
    ? eng.stages.map(s => ({
        ...s,
        name: /^Stage \d+$/i.test(s.name) ? (nameList[s.stageNumber - 1] ?? s.name) : s.name,
      }))
    : Array.from({ length: eng.totalStages }, (_, i) => ({
        stageNumber: i + 1,
        name: nameList[i] ?? `Stage ${i + 1}`,
        status: (
          i + 1 < eng.currentStage ? 'done' :
          i + 1 === eng.currentStage ? 'current' : 'pending'
        ) as 'done' | 'current' | 'pending',
      }));
  let running = 1;
  return base.map(s => {
    const dur = STAGE_DURATION[s.name] ?? 3;
    const item: StageItem = { ...s, dayStart: running, dayDuration: dur };
    running += dur;
    return item;
  });
}

// ── Timeline Bottom Sheet ─────────────────────────────────────────────────────
function TimelineSheet({ stages, typeColor, viewedStageNum, visible, onClose, onSelectStage }: {
  stages: StageItem[];
  typeColor: string;
  viewedStageNum: number;
  visible: boolean;
  onClose: () => void;
  onSelectStage: (stage: StageItem) => void;
}) {
  const C = useColors();
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={ts.backdrop} onPress={onClose} />
      <View style={[ts.sheet, { backgroundColor: C.bgSurface, borderTopColor: typeColor + '55' }]}>
        <View style={[ts.grip, { backgroundColor: C.bgBorder2 }]} />
        <View style={ts.header}>
          <Text style={[ts.title, { color: C.textPrimary }]}>Transaction Timeline</Text>
          <TouchableOpacity onPress={onClose} style={ts.closeBtn}>
            <Ionicons name="close" size={20} color={C.textMuted} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {stages.map((stage, i) => {
            const isDone    = stage.status === 'done';
            const isViewed  = stage.stageNumber === viewedStageNum;
            const dotBg     = isDone ? C.success : isViewed ? typeColor : 'transparent';
            const dotBorder = isDone ? C.success : isViewed ? typeColor : C.bgBorder2;
            return (
              <TouchableOpacity
                key={stage.stageNumber}
                style={[
                  ts.row,
                  { borderBottomColor: C.bgBorder },
                  isViewed && { backgroundColor: typeColor + '0A' },
                ]}
                onPress={() => { onSelectStage(stage); onClose(); }}
                activeOpacity={0.7}
              >
                <View style={ts.connWrap}>
                  <View style={[ts.dot, { backgroundColor: dotBg, borderColor: dotBorder }]}>
                    {isDone && <Ionicons name="checkmark" size={10} color="#fff" />}
                  </View>
                  {i < stages.length - 1 && (
                    <View style={[ts.line, { backgroundColor: isDone ? C.success + '44' : C.bgBorder }]} />
                  )}
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[ts.rowNum, { color: isDone ? C.textMuted : isViewed ? typeColor : C.textSecondary }]}>
                    {stage.stageNumber}.
                  </Text>
                  <Text style={[ts.rowName, {
                    flex: 1,
                    color: isDone ? C.textMuted : isViewed ? C.textPrimary : C.textSecondary,
                    fontWeight: isViewed ? '700' : '400',
                    textDecorationLine: isDone ? 'line-through' : 'none',
                  }]} numberOfLines={1}>
                    {stage.name}
                  </Text>
                  {isViewed && (
                    <View style={[ts.curPip, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
                      <Text style={[ts.curPipText, { color: typeColor }]}>Viewing</Text>
                    </View>
                  )}
                </View>
                <Text style={[ts.dayMeta, { color: C.textMuted }]}>+{stage.dayDuration}d</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function EngagementDetailScreen() {
  const C          = useColors();
  const route      = useRoute<any>();
  const navigation = useNavigation<any>();

  const initEng: Engagement | null = route.params?.engagement ?? null;
  const contactName: string = route.params?.contactName ?? initEng?.contactName ?? 'Client';

  const [eng,          setEng]         = useState<Engagement | null>(initEng);
  const [stages,       setStages]      = useState<StageItem[]>(initEng ? buildStages(initEng) : []);
  const [advancing,    setAdvancing]   = useState(false);
  const [loading,      setLoading]     = useState(true);
  const [timelineOpen, setTimelineOpen]= useState(false);
  const [selectedIdx,  setSelectedIdx] = useState<number | null>(null);
  const [note,         setNote]        = useState('');

  useEffect(() => {
    const fetchId: string | null = initEng?.id ?? route.params?.engagementId ?? null;
    if (fetchId) {
      api.engagements.get(fetchId)
        .then(found => { setEng(found); setStages(buildStages(found)); })
        .catch(() => { if (initEng) setStages(buildStages(initEng)); })
        .finally(() => setLoading(false));
    } else if (route.params?.contactId) {
      const cName = route.params?.contactName ?? '';
      api.engagements.list()
        .then(all => {
          const found = all.find(e => e.contactName === cName);
          return found ? api.engagements.get(found.id) : Promise.reject('not found');
        })
        .then(found => { setEng(found); setStages(buildStages(found)); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const viewedStage: StageItem | null = selectedIdx !== null
    ? (stages[selectedIdx] ?? null)
    : (stages.find(s => s.status === 'current') ?? stages[0] ?? null);

  const handleSelectStage = useCallback((stage: StageItem) => {
    const idx = stages.findIndex(s => s.stageNumber === stage.stageNumber);
    setSelectedIdx(idx >= 0 ? idx : null);
  }, [stages]);

  const handleMarkComplete = () => {
    if (!viewedStage) return;
    setStages(prev => prev.map(s =>
      s.stageNumber === viewedStage.stageNumber ? { ...s, status: 'done' } : s
    ));
  };

  const handleMarkIncomplete = () => {
    if (!viewedStage) return;
    setStages(prev => prev.map(s =>
      s.stageNumber === viewedStage.stageNumber ? { ...s, status: 'current' } : s
    ));
  };

  const handleAdvance = () => {
    if (!eng) return;
    const nextStage = stages.find(s => s.stageNumber === eng.currentStage + 1);
    const nextName  = nextStage?.name ?? 'next stage';
    Alert.alert('Advance Stage', `Move to: ${nextName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Advance', onPress: async () => {
        setAdvancing(true);
        try {
          const updated = await api.engagements.advance(eng.id);
          setEng(updated);
          setStages(buildStages(updated));
          setSelectedIdx(null);
        } catch (e: any) { Alert.alert('Error', e.message); }
        finally { setAdvancing(false); }
      }},
    ]);
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

  const typeColor      = eng.type === 'buy' ? C.buy : C.sell;
  const ini            = getInitials(contactName);
  const totalDays      = stages.reduce((sum, st) => sum + st.dayDuration, 0);
  const closedDays     = stages.filter(st => st.status === 'done').reduce((sum, st) => sum + st.dayDuration, 0);
  const openDays       = totalDays - closedDays;
  const pct            = totalDays > 0 ? Math.round((closedDays / totalDays) * 100) : 0;
  const completedCount = stages.filter(st => st.status === 'done').length;
  const atEnd          = eng.currentStage >= eng.totalStages;

  const isDone    = viewedStage?.status === 'done';
  const isCurrent = viewedStage?.status === 'current';
  const showMapBtn= viewedStage ? MAP_STAGE_NAMES.has(viewedStage.name) : false;
  const desc      = viewedStage ? (STAGE_DESC[viewedStage.name] ?? 'Complete this step to move the engagement forward.') : '';

  return (
    <View style={[s.screen, { backgroundColor: C.bgBase }]}>

      {/* ── App bar ─────────────────────────────────────────────────── */}
      <View style={[s.appbar, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <View style={s.appbarLeft}>
          <View style={[s.avatar, { backgroundColor: typeColor + '22', borderColor: typeColor }]}>
            <Text style={[s.avatarText, { color: typeColor }]}>{ini}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.clientName, { color: C.textPrimary }]} numberOfLines={1}>{contactName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[s.typePip, { backgroundColor: typeColor + '22' }]}>
                <Text style={[s.typePipText, { color: typeColor }]}>{eng.type.toUpperCase()}</Text>
              </View>
              <Text style={[Typography.xs, { color: C.textMuted }]}>
                Stage {eng.currentStage}/{eng.totalStages}
              </Text>
            </View>
          </View>
        </View>
        <View style={s.appbarActions}>
          <TouchableOpacity style={[s.iconBtn, { borderColor: C.bgBorder }]}>
            <Ionicons name="call-outline" size={18} color={C.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.iconBtn, { borderColor: C.bgBorder }]}>
            <Ionicons name="chatbubble-outline" size={18} color={C.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Progress ────────────────────────────────────────────────── */}
      <View style={[s.progSection, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        <View style={s.progTop}>
          <Text style={[s.progPct, { color: typeColor }]}>{pct}%</Text>
          <Text style={[Typography.xs, { color: C.textMuted }]}>
            {completedCount}/{eng.totalStages} stages · ~{openDays}d remaining
          </Text>
        </View>
        <View style={[s.progTrack, { backgroundColor: C.bgBorder }]}>
          <View style={[s.progFill, { width: `${pct}%` as any, backgroundColor: typeColor }]} />
        </View>
      </View>

      {/* ── Step launcher → timeline ────────────────────────────────── */}
      <TouchableOpacity
        style={[s.launcher, { backgroundColor: C.bgElevated, borderColor: C.bgBorder }]}
        onPress={() => setTimelineOpen(true)}
        activeOpacity={0.75}
      >
        <View style={{ flex: 1 }}>
          <Text style={[s.launcherEyebrow, { color: C.textMuted }]}>
            {viewedStage
              ? `Step ${viewedStage.stageNumber} of ${eng.totalStages} · tap to change`
              : `Step ${eng.currentStage} of ${eng.totalStages} · tap to view`}
          </Text>
          <Text style={[s.launcherName, { color: C.textPrimary }]} numberOfLines={1}>
            {viewedStage?.name ?? ''}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={typeColor} />
      </TouchableOpacity>

      {/* ── Step content ────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {viewedStage && (
          <>
            {/* Status pip */}
            <View style={s.stephd}>
              <View style={[s.statePip,
                isDone    ? { backgroundColor: C.success + '22', borderColor: C.success } :
                isCurrent ? { backgroundColor: typeColor + '22', borderColor: typeColor } :
                            { backgroundColor: C.bgBorder, borderColor: C.bgBorder2 }
              ]}>
                <View style={[s.pipDot, {
                  backgroundColor: isDone ? C.success : isCurrent ? typeColor : C.bgBorder2,
                }]} />
                <Text style={[s.statePipText, {
                  color: isDone ? C.success : isCurrent ? typeColor : C.textMuted,
                }]}>
                  {isDone ? 'Complete' : isCurrent ? 'In progress' : 'Not started'}
                </Text>
              </View>
              <Text style={[Typography.xs, { color: C.textMuted }]}>
                Day {viewedStage.dayStart} · {viewedStage.dayDuration}d
              </Text>
            </View>

            {/* Description */}
            <View style={[s.descCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Text style={[s.sectionLabel, { color: C.textMuted }]}>ABOUT THIS STEP</Text>
              <Text style={[Typography.sm, { color: C.textSecondary, lineHeight: 22 }]}>{desc}</Text>
            </View>

            {/* Map button */}
            {showMapBtn && (
              <TouchableOpacity
                style={[s.mapBtn, { backgroundColor: C.primary + '12', borderColor: C.primary + '44' }]}
                onPress={() => navigation.push('MarketMap', { title: viewedStage.name })}
                activeOpacity={0.75}
              >
                <View style={[s.mapBtnIcon, { backgroundColor: C.primary + '22' }]}>
                  <Text style={{ fontSize: 18 }}>🗺</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.mapBtnTitle, { color: C.primary }]}>Open Bellevue Market Map</Text>
                  <Text style={[Typography.xs, { color: C.textMuted }]}>644 listings · filter, compare, save</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={C.primary} />
              </TouchableOpacity>
            )}

            {/* Notes */}
            <View style={[s.noteCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
              <Text style={[s.sectionLabel, { color: C.textMuted }]}>NOTES</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add notes for this step..."
                placeholderTextColor={C.textMuted}
                multiline
                numberOfLines={4}
                style={[s.noteInput, { backgroundColor: C.bgElevated, borderColor: C.bgBorder, color: C.textPrimary }]}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Sticky footer ───────────────────────────────────────────── */}
      <View style={[s.footer, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        {viewedStage && (
          <TouchableOpacity
            style={[s.completeBtn, { backgroundColor: isDone ? C.warning : C.success }]}
            onPress={isDone ? handleMarkIncomplete : handleMarkComplete}
          >
            <Ionicons
              name={isDone ? 'arrow-undo-outline' : 'checkmark-circle-outline'}
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={s.completeBtnText}>{isDone ? 'Mark Incomplete' : 'Mark Complete'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[s.nextBtn, { backgroundColor: typeColor, opacity: advancing || atEnd ? 0.4 : 1 }]}
          onPress={handleAdvance}
          disabled={advancing || atEnd}
        >
          {advancing
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.nextBtnText}>Next →</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Timeline sheet ──────────────────────────────────────────── */}
      <TimelineSheet
        stages={stages}
        typeColor={typeColor}
        viewedStageNum={viewedStage?.stageNumber ?? eng.currentStage}
        visible={timelineOpen}
        onClose={() => setTimelineOpen(false)}
        onSelectStage={handleSelectStage}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:          { flex: 1 },
  centered:        { flex: 1, alignItems: 'center', justifyContent: 'center' },

  appbar:          { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1 },
  appbarLeft:      { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar:          { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  avatarText:      { fontSize: 16, fontWeight: '700' },
  clientName:      { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  typePip:         { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.sm },
  typePipText:     { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  appbarActions:   { flexDirection: 'row', gap: 8 },
  iconBtn:         { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  progSection:     { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  progTop:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progPct:         { fontSize: 15, fontWeight: '700' },
  progTrack:       { height: 5, borderRadius: 3, overflow: 'hidden' },
  progFill:        { height: 5, borderRadius: 3 },

  launcher:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, marginTop: Spacing.md, padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, gap: Spacing.sm },
  launcherEyebrow: { fontSize: 11, fontWeight: '500', marginBottom: 3 },
  launcherName:    { fontSize: 17, fontWeight: '700' },

  scrollContent:   { padding: Spacing.md, paddingBottom: 120 },

  stephd:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  statePip:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, gap: 6 },
  pipDot:          { width: 7, height: 7, borderRadius: 4 },
  statePipText:    { fontSize: 12, fontWeight: '600' },

  descCard:        { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  sectionLabel:    { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },

  mapBtn:          { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.sm },
  mapBtnIcon:      { width: 38, height: 38, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  mapBtnTitle:     { fontSize: 14, fontWeight: '600', marginBottom: 2 },

  noteCard:        { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md },
  noteInput:       { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.sm, minHeight: 80, textAlignVertical: 'top', fontSize: 14 },

  footer:          { flexDirection: 'row', padding: Spacing.md, borderTopWidth: 1, gap: Spacing.sm, paddingBottom: 32 },
  completeBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, padding: Spacing.md },
  completeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  nextBtn:         { paddingHorizontal: Spacing.lg, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', padding: Spacing.md },
  nextBtnText:     { color: '#fff', fontSize: 14, fontWeight: '700' },
});

const ts = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:       { maxHeight: '82%', borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderTopWidth: 2, paddingTop: Spacing.sm },
  grip:        { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.sm },
  header:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title:       { flex: 1, fontSize: 17, fontWeight: '700' },
  closeBtn:    { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  row:         { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingVertical: 12, borderBottomWidth: 1 },
  connWrap:    { width: 28, alignItems: 'center', alignSelf: 'stretch', marginRight: 8 },
  dot:         { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  line:        { width: 2, flex: 1, minHeight: 6, marginTop: 2 },
  rowNum:      { fontSize: 12, fontWeight: '600', width: 22 },
  rowName:     { fontSize: 14 },
  curPip:      { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm, borderWidth: 1 },
  curPipText:  { fontSize: 10, fontWeight: '700' },
  dayMeta:     { fontSize: 11, marginLeft: 4 },
});
