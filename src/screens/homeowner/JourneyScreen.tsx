import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Engagement, JourneyStage } from '../../types';
import { api } from '../../api/client';

// ── Canonical stage name arrays (must match server + desktop) ─────────────────
const BUY_STAGE_NAMES = [
  'Market Exploration', 'Sign Buyer Agreement', 'Pre-Approval',
  'Search Listings', 'Property Viewing', 'Opinion of Value',
  'Make Offer', 'Offer Negotiation', 'Mutual Agreement',
  'Earnest Deposit', 'Loan Application', 'Formal Appraisal',
  'House Inspection', 'Final Walk-through', 'Verification',
  'Closing', 'After Sale Service',
];
const SELL_STAGE_NAMES = [
  'Market Analysis', 'Sign Seller Agreement', 'Pre-Appraisal',
  'Pre-Inspection', 'Prepare for Listing', 'Listing Price Decision',
  'Listing Property', 'Listing Management', 'Showing',
  'Offers Review', 'Offer Negotiation', 'Mutual Agreement',
  'Escrow', 'Closing', 'After Sale Service',
];

const BUY_STAGE_DURATIONS  = [7, 2, 7, 21, 14, 3, 3, 5, 1, 2, 5, 14, 10, 1, 3, 3, 7];
const SELL_STAGE_DURATIONS = [5, 2, 5,  5, 14,  2, 2,  7, 21, 3, 3,  1, 30, 3, 7];

// Map stages show an "Open Map" button in the detail panel
const MAP_STAGES = new Set([
  'Market Exploration', 'Search Listings', 'Property Viewing', 'Opinion of Value',
  'Market Analysis', 'Listing Price Decision', 'Listing Management',
]);

// ── Rich stage data (from desktop buyerJourney / sellerJourney) ───────────────
type Priority = 'H' | 'M' | 'L';

interface StepData {
  title:     string;
  timing:    string;
  priority?: Priority;
  done?:     boolean;
}

interface StageInfo {
  description: string;
  steps:       StepData[];
  tools?:      string[];
}

const BUY_STAGE_DATA: Record<string, StageInfo> = {
  'Market Exploration': {
    description: 'Get a feel for neighborhoods, prices, and timing before committing.',
    steps: [
      { title: 'Explore neighborhoods in TerraPlot',    timing: 'Before shortlisting' },
      { title: 'Set budget and must-haves',              timing: 'Before shortlisting' },
      { title: 'Review price & time-on-market trends',  timing: 'Before shortlisting' },
    ],
    tools: ['TerraPlot · market trends'],
  },
  'Sign Buyer Agreement': {
    description: 'Formalize representation if you choose to work with a broker.',
    steps: [
      { title: 'Review agreement terms', timing: 'With your broker' },
      { title: 'e-Sign via DocuSign',    timing: 'With your broker' },
    ],
  },
  'Pre-Approval': {
    description: 'Know your true budget and strengthen your offers.',
    steps: [
      { title: 'Share financials with a lender', timing: 'Gather W-2s and bank statements' },
      { title: 'Receive pre-approval letter',    timing: 'Valid 90 days from issue' },
    ],
  },
  'Search Listings': {
    description: 'We pull live NWMLS listings matching your profile and overlay them on TerraPlot.',
    steps: [
      { title: 'Set saved-search filters in TerraPlot', timing: 'Set up once' },
      { title: 'Shortlist 5-8 candidate listings',      timing: 'Ongoing', priority: 'M' },
      { title: 'Schedule first round of showings',      timing: 'Weekends recommended', priority: 'L' },
      { title: 'Refresh pre-approval letter',           timing: 'Before making offers', priority: 'H' },
    ],
    tools: ['TerraPlot · Search canvas', 'Property Report', 'Online HPI', 'QCMA (preview)'],
  },
  'Property Viewing': {
    description: 'Tour homes and capture notes to compare later.',
    steps: [
      { title: 'Book showings for shortlisted homes', timing: 'Upcoming', priority: 'M' },
      { title: 'Capture notes & photos per home',     timing: 'During each showing' },
    ],
  },
  'Opinion of Value': {
    description: 'Anchor to data before you make an offer.',
    steps: [
      { title: 'Run QCMA on your top candidate', timing: 'Before writing offer' },
      { title: 'Compare estimate to list price', timing: 'Before writing offer' },
    ],
    tools: ['QCMA · Qedge · QBPO', 'Q Desktop Valuation'],
  },
  'Make Offer': {
    description: 'Set price and terms with confidence.',
    steps: [
      { title: 'Test offer prices in TerraPlot scenarios', timing: 'Before submitting' },
      { title: 'Choose contingencies',                     timing: 'With your broker' },
      { title: 'Prepare and route offer to broker',        timing: 'When ready to submit' },
    ],
  },
  'Offer Negotiation': {
    description: 'Work through counters to reach agreement.',
    steps: [
      { title: 'Submit offer',         timing: 'Day 1' },
      { title: 'Review counteroffer',  timing: 'Within 48 hrs of counter' },
      { title: 'Negotiate terms',      timing: 'Until mutual acceptance' },
    ],
  },
  'Mutual Agreement': {
    description: 'Both sides agree; the purchase agreement is signed.',
    steps: [
      { title: 'Confirm mutually accepted terms',     timing: 'After final counter' },
      { title: 'Receive signed purchase agreement',   timing: 'Same day as acceptance' },
    ],
  },
  'Earnest Deposit': {
    description: 'Show good faith via escrow.',
    steps: [
      { title: 'Wire earnest money to escrow', timing: 'Within 2 business days', priority: 'H' },
      { title: 'Confirm escrow receipt',       timing: 'Same day as wire' },
    ],
  },
  'Loan Application': {
    description: 'Lock financing in motion.',
    steps: [
      { title: 'Complete full loan application', timing: 'Within 3 days of mutual acceptance' },
      { title: 'Lock your rate',                 timing: 'When rate is favorable' },
    ],
  },
  'Formal Appraisal': {
    description: "Lender confirms the home's value.",
    steps: [
      { title: 'Appraisal scheduled by lender', timing: 'Lender arranges' },
      { title: 'Review appraisal vs. price',    timing: 'After appraisal report' },
    ],
  },
  'House Inspection': {
    description: "Understand the home's condition.",
    steps: [
      { title: 'Hire an inspector',               timing: 'Within inspection period' },
      { title: 'Review report & request repairs', timing: 'Within inspection period' },
    ],
  },
  'Final Walk-through': {
    description: 'Verify condition right before closing.',
    steps: [
      { title: 'Confirm repairs completed', timing: '1-2 days before closing' },
      { title: 'Verify readiness to close', timing: '1-2 days before closing' },
    ],
  },
  'Verification': {
    description: 'Review title and disclosures.',
    steps: [
      { title: 'Review preliminary title report', timing: 'Before closing' },
      { title: 'Verify seller disclosures',       timing: 'Before closing' },
    ],
  },
  'Closing': {
    description: 'Sign, fund, record — then keys.',
    steps: [
      { title: 'Sign closing documents',      timing: 'Closing day', priority: 'H' },
      { title: 'Funds wired & deed recorded', timing: 'Closing day' },
      { title: 'Receive keys',                timing: 'After recording' },
    ],
  },
  'After Sale Service': {
    description: 'Make your new home "sticky" in TARS.',
    steps: [
      { title: 'Set up your Home Digest',       timing: 'First week after closing' },
      { title: 'Turn on maintenance reminders', timing: 'First week after closing' },
    ],
  },
};

const SELL_STAGE_DATA: Record<string, StageInfo> = {
  'Market Analysis': {
    description: 'Understand likely price range and timing.',
    steps: [
      { title: 'Review TerraPlot market research',    timing: 'Before pricing' },
      { title: 'Review Quantarium valuation & comps', timing: 'Before pricing' },
    ],
  },
  'Sign Seller Agreement': {
    description: 'Engage your broker formally.',
    steps: [
      { title: 'Review listing terms & commission', timing: 'With your broker' },
      { title: 'e-Sign via DocuSign',               timing: 'With your broker' },
    ],
  },
  'Pre-Appraisal': {
    description: 'Optional value check before listing.',
    steps: [
      { title: 'Schedule pre-appraisal', timing: 'Optional — recommended for unique homes' },
    ],
  },
  'Pre-Inspection': {
    description: 'Surface issues early to avoid surprises.',
    steps: [
      { title: 'Book pre-inspection',            timing: 'Before listing', priority: 'M' },
      { title: 'Review findings & plan repairs', timing: 'After inspection report' },
    ],
  },
  'Prepare for Listing': {
    description: 'Repairs, landscaping, decluttering, cleaning, staging, photos, forms, signpost.',
    steps: [
      { title: 'Complete repairs & cleaning', timing: 'Before staging' },
      { title: 'Stage the unit',              timing: 'Before photos' },
      { title: 'Order signpost',              timing: 'Before go-live' },
    ],
  },
  'Listing Price Decision': {
    description: 'Choose your list price from data.',
    steps: [
      { title: 'Compare TerraPlot scenarios', timing: 'Before agreement' },
      { title: 'Set list price',              timing: 'With your broker' },
    ],
    tools: ['QCMA', 'TerraPlot'],
  },
  'Listing Property': {
    description: 'We submit to NWMLS and syndicate. Two items need your sign-off before going live.',
    steps: [
      { title: 'Sign the Listing Agreement', timing: 'Required before go-live', priority: 'H' },
      { title: 'Approve marketing photos',   timing: '12 photos by Astor Studios', priority: 'M' },
      { title: 'Stage the unit',             timing: 'Completed before photos' },
      { title: 'Order signpost',             timing: 'Installed before go-live' },
    ],
    tools: ['QCMA · Listing comps', 'TerraPlot · Days-on-market', 'AdX'],
  },
  'Listing Management': {
    description: 'Go live and start promotion.',
    steps: [
      { title: 'Confirm listing is live on NWMLS', timing: 'Day 1 of listing' },
      { title: 'Launch marketing campaign',        timing: 'Day 1 of listing' },
    ],
  },
  'Showing': {
    description: 'Buyers tour; you receive showing reports.',
    steps: [
      { title: 'Approve showing schedule', timing: 'Ongoing during listing period' },
      { title: 'Review showing reports',   timing: 'After each showing' },
    ],
  },
  'Offers Review': {
    description: 'Evaluate incoming offers against the market.',
    steps: [
      { title: 'Review offers vs. QCMA & comps', timing: 'When offers arrive' },
    ],
    tools: ['QCMA', 'TerraPlot'],
  },
  'Offer Negotiation': {
    description: 'Counter and refine terms.',
    steps: [
      { title: 'Counter or accept offers',        timing: 'Within offer deadline' },
      { title: 'Negotiate terms & contingencies', timing: 'Until mutual acceptance' },
    ],
  },
  'Mutual Agreement': {
    description: 'Sign the purchase & sale agreement.',
    steps: [
      { title: 'Sign purchase & sale agreement', timing: 'Day of mutual acceptance' },
    ],
  },
  'Escrow': {
    description: 'Track inspections, appraisal, and financing.',
    steps: [
      { title: 'Provide access for inspection & appraisal', timing: 'Per buyer schedule' },
      { title: 'Respond to repair requests',                timing: 'Within inspection period' },
    ],
  },
  'Closing': {
    description: 'Sign, notarize, and transfer.',
    steps: [
      { title: 'Sign closing documents', timing: 'Closing day', priority: 'H' },
      { title: 'Confirm funds transfer', timing: 'Closing day' },
    ],
  },
  'After Sale Service': {
    description: 'Wrap up and stay connected.',
    steps: [
      { title: 'Leave a review for your broker',          timing: 'First week post-close' },
      { title: 'Keep provider relationships in Contacts', timing: 'Ongoing' },
    ],
  },
};

// ── Extended stage type ───────────────────────────────────────────────────────
type StageWithDur = JourneyStage & { duration: number; info: StageInfo };

function buildStages(engagement: Engagement): StageWithDur[] {
  const nameList = engagement.type === 'sell' ? SELL_STAGE_NAMES : BUY_STAGE_NAMES;
  const durList  = engagement.type === 'sell' ? SELL_STAGE_DURATIONS : BUY_STAGE_DURATIONS;
  const dataMap  = engagement.type === 'sell' ? SELL_STAGE_DATA : BUY_STAGE_DATA;

  const rawStages = engagement.stages.length > 0
    ? engagement.stages.map(s => ({
        ...s,
        name: /^Stage \d+$/i.test(s.name) ? (nameList[s.stageNumber - 1] ?? s.name) : s.name,
      }))
    : Array.from({ length: engagement.totalStages }, (_, i) => ({
        stageNumber: i + 1,
        name:   nameList[i] ?? `Stage ${i + 1}`,
        status: (
          i + 1 < engagement.currentStage ? 'done' :
          i + 1 === engagement.currentStage ? 'current' : 'pending'
        ) as 'done' | 'current' | 'pending',
      }));

  return rawStages.map(s => {
    const info: StageInfo = dataMap[s.name] ?? { description: '', steps: [] };
    const status: JourneyStage['status'] =
      s.status === 'done'    ? 'completed' :
      s.status === 'current' ? 'active'    : 'pending';
    return {
      id:          s.stageNumber,
      title:       s.name,
      description: info.description,
      status,
      duration:    durList[s.stageNumber - 1] ?? 7,
      checklist:   [],
      info,
    };
  });
}

// ── Checklist item type ───────────────────────────────────────────────────────
interface CheckItem {
  id:        string;
  label:     string;
  timing:    string;
  priority?: Priority;
  completed: boolean;
}

function initChecklist(info: StageInfo, status: JourneyStage['status'], stageId: number): CheckItem[] {
  return info.steps.map((step, i) => ({
    id:        `${stageId}-${i}`,
    label:     step.title,
    timing:    step.timing,
    priority:  step.priority,
    completed: status === 'completed' ? true : (step.done ?? false),
  }));
}

// ── Priority pill ─────────────────────────────────────────────────────────────
function PriorityPill({ priority, C }: { priority?: Priority; C: any }) {
  if (!priority) return null;
  const cfg = {
    H: { label: 'High', bg: '#FEE2E2', text: '#DC2626' },
    M: { label: 'Med',  bg: '#FEF3C7', text: '#B45309' },
    L: { label: 'Low',  bg: C.bgBorder, text: C.textMuted },
  }[priority];
  return (
    <View style={[styles.priPill, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.priPillText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

// ── Stage row ─────────────────────────────────────────────────────────────────
function StageRow({
  stage, totalStages, localDone, advancing,
  onMarkComplete, onNext, navigation, engType,
  expanded, onToggleExpand, dayOffset,
}: {
  stage:           StageWithDur;
  totalStages:     number;
  localDone:       boolean;
  advancing:       boolean;
  onMarkComplete:  () => void;
  onNext:          () => void;
  navigation:      any;
  engType:         'buy' | 'sell';
  expanded:        boolean;
  onToggleExpand:  () => void;
  dayOffset:       number;
}) {
  const C = useColors();

  const isCompleted = stage.status === 'completed' || localDone;
  const isActive    = stage.status === 'active' && !localDone;
  const isLast      = stage.id >= totalStages;
  const isMap       = MAP_STAGES.has(stage.title);
  const mapTitle    = engType === 'buy' ? 'Market Exploration' : 'Market Analysis';

  const [items, setItems] = useState<CheckItem[]>(() =>
    initChecklist(stage.info, stage.status, stage.id)
  );

  const toggleItem = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));

  const RAIL_W = 32 + Spacing.sm;

  return (
    <View>
      {/* ── Rail + tile row ─────────────────────────────────────────────── */}
      <View style={styles.stageRow}>
        {/* Timeline rail — dot is tappable to select/expand the stage */}
        <View style={styles.rail}>
          <TouchableOpacity
            onPress={onToggleExpand}
            activeOpacity={0.7}
            style={[
              styles.dot,
              // blue ring ONLY when expanded; otherwise completed=green, active/pending=white/gray
              expanded
                ? { backgroundColor: C.bgSurface, borderColor: C.primary, borderWidth: 3 }
                : isCompleted
                ? { backgroundColor: C.success,   borderColor: C.success,  borderWidth: 2 }
                : isActive
                ? { backgroundColor: C.bgSurface, borderColor: C.bgBorder, borderWidth: 2 }
                : { backgroundColor: C.bgBorder,  borderColor: C.bgBorder, borderWidth: 2 },
            ]}
          >
            {isCompleted && !expanded && <Ionicons name="checkmark" size={12} color="#fff" />}
          </TouchableOpacity>
          <View style={[styles.line, { backgroundColor: isCompleted ? C.success : C.bgBorder }]} />
        </View>

        {/* Tile — tap toggles inline detail panel */}
        <TouchableOpacity
          style={[
            styles.stageCard,
            { backgroundColor: C.bgSurface, borderColor: isActive ? C.primary : C.bgBorder },
          ]}
          onPress={onToggleExpand}
          activeOpacity={0.85}
        >
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              {isMap && (
                <Ionicons name="map-outline" size={13} color={C.primary} style={{ marginRight: 4, flexShrink: 0 }} />
              )}
              <Text style={[styles.stageTitle, { color: C.textPrimary }]} numberOfLines={1}>
                {stage.title}
              </Text>
            </View>
            <View style={styles.titleRight}>
              {isCompleted ? (
                <View style={[styles.dayChip, { backgroundColor: C.success + '22' }]}>
                  <Text style={[styles.dayChipText, { color: C.success }]}>Complete</Text>
                </View>
              ) : isActive ? (
                <View style={[styles.dayChip, { backgroundColor: C.primary + '18' }]}>
                  <Text style={[styles.dayChipText, { color: C.primary }]}>~ {dayOffset} days</Text>
                </View>
              ) : (
                <View style={[styles.dayChip, { backgroundColor: C.bgBorder }]}>
                  <Text style={[styles.dayChipText, { color: C.textMuted }]}>~ {dayOffset} days</Text>
                </View>
              )}
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={C.textMuted}
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Inline detail panel ──────────────────────────────────────────── */}
      {expanded && (
        <View style={[
          styles.detailPanel,
          { marginLeft: RAIL_W, backgroundColor: C.bgSurface, borderColor: isActive ? C.primary + '55' : C.bgBorder },
        ]}>

          {/* Action buttons row */}
          <View style={styles.panelBtnsRow}>
            {/* Mark Complete / Mark Incomplete */}
            <TouchableOpacity
              style={[
                styles.panelBtn,
                isCompleted
                  ? { backgroundColor: C.bgBorder, borderColor: C.bgBorder }
                  : { backgroundColor: C.success + '18', borderColor: C.success + '55' },
              ]}
              onPress={onMarkComplete}
              activeOpacity={0.75}
            >
              <Ionicons
                name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={13}
                color={isCompleted ? C.textMuted : C.success}
              />
              <Text style={[styles.panelBtnText, { color: isCompleted ? C.textMuted : C.success }]}>
                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>

            {/* Next → */}
            {!isLast && (
              <TouchableOpacity
                style={[
                  styles.panelBtn,
                  isActive
                    ? { backgroundColor: C.primary + '15', borderColor: C.primary + '55' }
                    : { backgroundColor: C.bgBorder, borderColor: C.bgBorder },
                ]}
                onPress={onNext}
                disabled={!isActive || advancing}
                activeOpacity={0.75}
              >
                {advancing && isActive ? (
                  <ActivityIndicator size="small" color={C.primary} />
                ) : (
                  <>
                    <Text style={[styles.panelBtnText, { color: isActive ? C.primary : C.textMuted }]}>
                      Next
                    </Text>
                    <Ionicons name="chevron-forward" size={13} color={isActive ? C.primary : C.textMuted} />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.panelDivider, { backgroundColor: C.bgBorder }]} />

          {/* Description */}
          {!!stage.info.description && (
            <Text style={[styles.detailDesc, { color: C.textSecondary }]}>
              {stage.info.description}
            </Text>
          )}

          {/* Map button */}
          {isMap && (
            <TouchableOpacity
              style={[styles.mapBtn, { backgroundColor: C.primary + '12', borderColor: C.primary + '44' }]}
              onPress={() => navigation.push('MarketMap', { title: mapTitle })}
              activeOpacity={0.75}
            >
              <Ionicons name="map-outline" size={15} color={C.primary} />
              <Text style={[styles.mapBtnText, { color: C.primary }]}>Open {mapTitle}</Text>
              <Ionicons name="chevron-forward" size={13} color={C.primary} />
            </TouchableOpacity>
          )}

          {/* Steps */}
          {items.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Steps</Text>
              {items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.stepRow,
                    idx < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.bgBorder },
                  ]}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.75}
                >
                  <View style={[
                    styles.checkbox,
                    { borderColor: C.bgBorder },
                    item.completed && { backgroundColor: C.success, borderColor: C.success },
                  ]}>
                    {item.completed && <Ionicons name="checkmark" size={11} color="#fff" />}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepLabel,
                      { color: item.completed ? C.textMuted : C.textPrimary },
                      item.completed && styles.stepLabelDone,
                    ]}>
                      {item.label}
                    </Text>
                    {!!item.timing && (
                      <Text style={[styles.stepTiming, { color: C.textMuted }]}>{item.timing}</Text>
                    )}
                  </View>
                  {item.priority && !item.completed && (
                    <PriorityPill priority={item.priority} C={C} />
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Tools section */}
          {stage.info.tools && stage.info.tools.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: C.textMuted, marginTop: Spacing.sm }]}>Tools</Text>
              {stage.info.tools.map((tool, i) => (
                <View key={i} style={[styles.toolRow, { borderColor: C.bgBorder }]}>
                  <Ionicons name="cube-outline" size={13} color={C.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.toolName, { color: C.textSecondary }]}>{tool}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
type TabType = 'buy' | 'sell';

export default function JourneyScreen() {
  const C          = useColors();
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();

  const journeyType: TabType | undefined = route.params?.journeyType;

  const [tab,         setTab]         = useState<TabType>(journeyType ?? 'buy');
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [localDone,   setLocalDone]   = useState<Set<number>>(new Set());
  const [advancing,   setAdvancing]   = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [stateReady,  setStateReady]  = useState(false);

  // ── Persist & restore state across navigations ───────────────────────────
  const KEYS = {
    tab:      '@tars_journey_tab',
    expanded: (id: number) => `@tars_journey_exp_${id}`,
    done:     (id: number) => `@tars_journey_done_${id}`,
  };

  // Restore tab on mount (journeyType prop overrides)
  useEffect(() => {
    if (journeyType) { setTab(journeyType); setStateReady(true); return; }
    AsyncStorage.getItem(KEYS.tab).then(v => {
      if (v === 'buy' || v === 'sell') setTab(v);
      setStateReady(true);
    }).catch(() => setStateReady(true));
  }, []);

  // Save tab when it changes
  useEffect(() => {
    if (stateReady) AsyncStorage.setItem(KEYS.tab, tab).catch(() => {});
  }, [tab, stateReady]);

  // Restore expandedIds + localDone when engagement loads
  const activeEng = engagements.find(e => e.type === tab);
  useEffect(() => {
    if (!activeEng) return;
    Promise.all([
      AsyncStorage.getItem(KEYS.expanded(activeEng.id)),
      AsyncStorage.getItem(KEYS.done(activeEng.id)),
    ]).then(([expRaw, doneRaw]) => {
      if (expRaw)  setExpandedIds(new Set(JSON.parse(expRaw) as number[]));
      if (doneRaw) setLocalDone(new Set(JSON.parse(doneRaw) as number[]));
    }).catch(() => {});
  }, [activeEng?.id]);

  // Save expandedIds whenever it changes
  useEffect(() => {
    if (!activeEng) return;
    AsyncStorage.setItem(KEYS.expanded(activeEng.id), JSON.stringify([...expandedIds])).catch(() => {});
  }, [expandedIds, activeEng?.id]);

  // Save localDone whenever it changes
  useEffect(() => {
    if (!activeEng) return;
    AsyncStorage.setItem(KEYS.done(activeEng.id), JSON.stringify([...localDone])).catch(() => {});
  }, [localDone, activeEng?.id]);

  const load = useCallback(async () => {
    try {
      const all = await api.engagements.list();
      const active = all.filter(e => e.status === 'active');
      const detailed = await Promise.all(
        active.map(e => api.engagements.get(e.id).catch(() => e))
      );
      setEngagements(detailed);
      // Note: do NOT reset localDone here — restored from AsyncStorage
    } catch { }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (journeyType) setTab(journeyType); }, [journeyType]);

  const stages    = activeEng ? buildStages(activeEng) : [];
  const completed = stages.filter(s => s.status === 'completed' || localDone.has(s.id)).length;
  const typeColor = tab === 'buy' ? C.buy : C.sell;

  const handleMarkComplete = (stageId: number) => {
    setLocalDone(prev => {
      const next = new Set(prev);
      next.has(stageId) ? next.delete(stageId) : next.add(stageId);
      return next;
    });
  };

  const toggleExpanded = (stageId: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(stageId) ? next.delete(stageId) : next.add(stageId);
      return next;
    });
  };

  const allExpanded = stages.length > 0 && expandedIds.size === stages.length;
  const toggleAll   = () => {
    setExpandedIds(allExpanded ? new Set() : new Set(stages.map(s => s.id)));
  };

  const handleAdvance = async () => {
    if (!activeEng || advancing) return;
    setAdvancing(true);
    try {
      await api.engagements.advance(activeEng.id);
      await load();
    } catch { }
    finally { setAdvancing(false); }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: C.bgBase }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>

      {/* Tab switcher */}
      {!journeyType && (
        <View style={[styles.tabBar, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
          {(['buy', 'sell'] as TabType[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && { borderBottomWidth: 2, borderBottomColor: t === 'buy' ? C.buy : C.sell }]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, { color: tab === t ? (t === 'buy' ? C.buy : C.sell) : C.textMuted }]}>
                {t === 'buy' ? 'Buy Journey' : 'Sell Journey'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor={typeColor}
          />
        }
      >
        {!activeEng ? (
          <View style={[styles.emptyState, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <Ionicons name={tab === 'buy' ? 'home-outline' : 'pricetag-outline'} size={40} color={C.bgBorder2} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.sm, textAlign: 'center' }]}>
              No active {tab === 'buy' ? 'buy' : 'sell'} journey found.
            </Text>
          </View>
        ) : (
          <>
            {/* Journey header: title + expand/collapse all */}
            <View style={styles.journeyHeader}>
              <Text style={[styles.journeyTitle, { color: C.textPrimary }]}>
                {tab === 'buy' ? "Buyer's Journey" : "Seller's Journey"}
              </Text>
              <TouchableOpacity onPress={toggleAll} activeOpacity={0.7} style={styles.expandAllBtn}>
                <Text style={[styles.expandAllText, { color: C.primary }]}>
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </Text>
                <Ionicons
                  name={allExpanded ? 'chevron-up' : 'chevron-down'}
                  size={13}
                  color={C.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Progress bar */}
            <View style={styles.progressSummary}>
              <Text style={[Typography.sm, { color: C.textSecondary }]}>
                {completed} of {stages.length} stages complete
              </Text>
              <View style={[styles.progressTrack, { backgroundColor: C.bgBorder }]}>
                <View style={[styles.progressFill, {
                  width: `${stages.length > 0 ? (completed / stages.length) * 100 : 0}%` as any,
                  backgroundColor: typeColor,
                }]} />
              </View>
            </View>

            {/* Stage list */}
            {stages.map((stage, idx) => {
              // Running total including this stage: sum of durations of stages[0..idx] that are NOT completed
              const dayOffset = stages.slice(0, idx + 1).reduce((sum, s) => {
                const done = s.status === 'completed' || localDone.has(s.id);
                return done ? sum : sum + s.duration;
              }, 0);
              return (
              <StageRow
                key={stage.id}
                stage={stage}
                totalStages={stages.length}
                localDone={localDone.has(stage.id)}
                advancing={advancing}
                onMarkComplete={() => handleMarkComplete(stage.id)}
                onNext={handleAdvance}
                navigation={navigation}
                engType={tab}
                expanded={expandedIds.has(stage.id)}
                onToggleExpand={() => toggleExpanded(stage.id)}
                dayOffset={dayOffset}
              />
            ); })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:   { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabBar:   { flexDirection: 'row', borderBottomWidth: 1 },
  tab:      { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabText:  { fontSize: 14, fontWeight: '600' },

  // Journey header
  journeyHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   Spacing.sm,
  },
  journeyTitle:  { fontSize: 17, fontWeight: '700' },
  expandAllBtn:  { flexDirection: 'row', alignItems: 'center', gap: 3 },
  expandAllText: { fontSize: 13, fontWeight: '600' },

  progressSummary: { marginBottom: Spacing.md },
  progressTrack:   { height: 4, borderRadius: 2, marginTop: 6 },
  progressFill:    { height: 4, borderRadius: 2 },

  // Timeline rail
  stageRow: { flexDirection: 'row', marginBottom: 0 },
  rail:     { alignItems: 'center', width: 32, marginRight: Spacing.sm },
  dot:      { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line:     { width: 2, flex: 1, minHeight: 16 },

  // Tile
  stageCard: {
    flex:              1,
    borderRadius:      Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical:   11,
    marginBottom:      Spacing.sm,
    borderWidth:       1,
  },
  titleRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleLeft:   { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  titleRight:  { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  stageTitle:  { fontSize: 14, fontWeight: '600', flexShrink: 1 },
  dayChip:     { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full },
  dayChipText: { fontSize: 11, fontWeight: '600' },

  // Inline detail panel
  detailPanel: {
    borderRadius: Radius.md,
    borderWidth:  1,
    padding:      Spacing.md,
    marginBottom: Spacing.sm,
    marginTop:    -4,
  },

  // Panel action buttons
  panelBtnsRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    marginBottom:  Spacing.sm,
    flexWrap:      'wrap',
  },
  panelBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: 9,
    paddingVertical:   5,
    borderRadius:      Radius.full,
    borderWidth:       1,
  },
  panelBtnText: { fontSize: 11, fontWeight: '600' },

  panelDivider: { height: 1, marginBottom: Spacing.sm },

  // Description
  detailDesc: { fontSize: 13, lineHeight: 19, marginBottom: Spacing.sm },

  // Map button
  mapBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 8, marginBottom: Spacing.sm },
  mapBtnText: { flex: 1, fontSize: 13, fontWeight: '700' },

  // Section labels
  sectionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },

  // Steps
  stepRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  checkbox:      { width: 20, height: 20, borderRadius: 4, borderWidth: 2, marginRight: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepContent:   { flex: 1, marginRight: 6 },
  stepLabel:     { fontSize: 13, lineHeight: 18 },
  stepLabelDone: { textDecorationLine: 'line-through' },
  stepTiming:    { fontSize: 11, marginTop: 1 },

  // Priority pill
  priPill:     { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full, flexShrink: 0 },
  priPillText: { fontSize: 10, fontWeight: '700' },

  // Tools
  toolRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1 },
  toolName: { fontSize: 12, fontWeight: '500' },

  // Empty state
  emptyState: {
    borderRadius: Radius.lg,
    borderWidth:  1,
    padding:      Spacing.xl,
    alignItems:   'center' as const,
    marginTop:    Spacing.xl,
  },
});
