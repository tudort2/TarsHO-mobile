import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet,
  Dimensions, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Property } from '../../types';

const { width } = Dimensions.get('window');
const TOP_INSET = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 0);
const HERO_H = 240;

function fmt(n: number)  { return '$' + (n ?? 0).toLocaleString(); }
function fmtK(n: number) {
  if (!n) return '—';
  return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`;
}

// ── Mock maintenance data ─────────────────────────────────────────────────────
type Priority = 'H' | 'M' | 'L';
type MaintStatus = 'upcoming' | 'overdue' | 'done';

interface MaintEvent {
  id:       number;
  title:    string;
  note?:    string;
  vendor?:  string;
  cost?:    number;
  date:     string;
  status:   MaintStatus;
  priority?: Priority;
}

const MOCK_UPCOMING: MaintEvent[] = [
  { id: 1, title: 'Roof inspection',         note: 'Customary cadence: every 5 years', date: 'Due Jun 2026', status: 'upcoming', priority: 'H' },
  { id: 2, title: 'HVAC annual service',      note: 'Schedule before summer peak',      date: 'Due Jul 2026', status: 'upcoming', priority: 'M' },
  { id: 3, title: 'Clean gutters',            note: 'After tree pollen season',          date: 'Due Aug 2026', status: 'upcoming', priority: 'L' },
  { id: 4, title: 'Re-stain back deck',       note: 'Suggested — low urgency',           date: 'Due Sep 2026', status: 'upcoming', priority: 'L' },
  { id: 5, title: 'Review homeowners policy', note: 'Allstate renewal — compare rates',  date: 'Due Oct 2026', status: 'upcoming', priority: 'M' },
];

const MOCK_HISTORY: MaintEvent[] = [
  { id: 10, title: 'Clean gutters',    vendor: 'BlueSky Gutter',   cost: 185,  date: 'May 2026', status: 'done' },
  { id: 11, title: 'Refinanced',       note: '15-yr fixed @ 4.625% · LTV 56%',date: 'Oct 2024', status: 'done' },
  { id: 12, title: 'HVAC service',     vendor: 'Mr. Cool HVAC',    cost: 325,  date: 'May 2023', status: 'done' },
  { id: 13, title: 'Exterior paint',   vendor: 'B&G Painting',     cost: 7400, date: 'Aug 2022', status: 'done' },
  { id: 14, title: 'Purchased',        note: '$988,000 · 30-yr fixed @ 2.9%', date: 'Apr 2021', status: 'done' },
];

// ── Priority pill ─────────────────────────────────────────────────────────────
function PriPill({ p, C }: { p?: Priority; C: any }) {
  if (!p) return null;
  const cfg = {
    H: { label: 'High', bg: '#FEE2E2', text: '#DC2626' },
    M: { label: 'Med',  bg: '#FEF3C7', text: '#B45309' },
    L: { label: 'Low',  bg: C.bgBorder, text: C.textMuted },
  }[p];
  return (
    <View style={[s.priPill, { backgroundColor: cfg.bg }]}>
      <Text style={[s.priPillTxt, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

// ── Maintenance event row (Journey-style) ─────────────────────────────────────
function MaintRow({ ev, expanded, onToggle }: {
  ev: MaintEvent;
  expanded: boolean;
  onToggle: () => void;
}) {
  const C = useColors();
  const isDone = ev.status === 'done';

  return (
    <View>
      <View style={s.maintRow}>
        {/* Rail */}
        <View style={s.rail}>
          <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.7}
            style={[
              s.dot,
              expanded
                ? { backgroundColor: C.bgSurface, borderColor: C.primary, borderWidth: 3 }
                : isDone
                ? { backgroundColor: C.success,   borderColor: C.success,  borderWidth: 2 }
                : { backgroundColor: C.bgSurface, borderColor: C.bgBorder, borderWidth: 2 },
            ]}
          >
            {isDone && !expanded && <Ionicons name="checkmark" size={12} color="#fff" />}
          </TouchableOpacity>
          <View style={[s.railLine, { backgroundColor: isDone ? C.success : C.bgBorder }]} />
        </View>

        {/* Card */}
        <TouchableOpacity
          style={[s.maintCard, { backgroundColor: C.bgSurface, borderColor: expanded ? C.primary : C.bgBorder }]}
          onPress={onToggle}
          activeOpacity={0.85}
        >
          <View style={s.maintCardRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[s.maintTitle, { color: C.textPrimary }]} numberOfLines={1}>{ev.title}</Text>
              <Text style={[s.maintDate, { color: C.textMuted }]}>{ev.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {!isDone && <PriPill p={ev.priority} C={C} />}
              {isDone && ev.cost != null && (
                <View style={[s.costChip, { backgroundColor: C.success + '18' }]}>
                  <Text style={[s.costChipTxt, { color: C.success }]}>{fmt(ev.cost)}</Text>
                </View>
              )}
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={C.textMuted} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Expanded detail */}
      {expanded && (
        <View style={[s.maintDetail, { marginLeft: 32 + Spacing.sm, backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          {!!ev.note && (
            <Text style={[s.maintNote, { color: C.textSecondary }]}>{ev.note}</Text>
          )}
          {!!ev.vendor && (
            <View style={s.vendorRow}>
              <Ionicons name="person-outline" size={13} color={C.primary} />
              <Text style={[s.vendorTxt, { color: C.textPrimary }]}>{ev.vendor}</Text>
              {ev.cost != null && (
                <Text style={[s.vendorCost, { color: C.textMuted }]}>{fmt(ev.cost)}</Text>
              )}
            </View>
          )}
          {!isDone && (
            <TouchableOpacity
              style={[s.findBtn, { backgroundColor: C.primary + '12', borderColor: C.primary + '44' }]}
              activeOpacity={0.75}
            >
              <Ionicons name="search-outline" size={13} color={C.primary} />
              <Text style={[s.findBtnTxt, { color: C.primary }]}>Find provider</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ── Stat cell ─────────────────────────────────────────────────────────────────
function StatCell({ label, value, color, C }: { label: string; value: string; color?: string; C: any }) {
  return (
    <View style={[s.statCell, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
      <Text style={[s.statVal, { color: color ?? C.primary }]}>{value}</Text>
      <Text style={[s.statLbl, { color: C.textMuted }]}>{label}</Text>
    </View>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ title, children, C }: { title: string; children: React.ReactNode; C: any }) {
  return (
    <View style={[s.sCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
      <Text style={[s.sCardTitle, { color: C.textMuted }]}>{title}</Text>
      {children}
    </View>
  );
}

function DataRow({ label, value, valueColor, C }: { label: string; value: string; valueColor?: string; C: any }) {
  return (
    <View style={[s.dataRow, { borderBottomColor: C.bgBorder }]}>
      <Text style={[Typography.sm, { color: C.textSecondary }]}>{label}</Text>
      <Text style={{ color: valueColor ?? C.textPrimary, fontWeight: '600', fontSize: 14 }}>{value}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
type DigestTab = 'home' | 'valuation' | 'financing' | 'maintenance';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
];

export default function PropertyDetailScreen() {
  const C        = useColors();
  const nav      = useNavigation<any>();
  const route    = useRoute<any>();
  const property: Property = route.params?.property;

  const [tab,          setTab]          = useState<DigestTab>('home');
  const [expandedMaint, setExpandedMaint] = useState<Set<number>>(new Set());

  if (!property) return null;

  const imgUrl = PROPERTY_IMAGES[(property.id ?? 0) % PROPERTY_IMAGES.length];

  const appreciation    = (property.currentValue ?? 0) - (property.purchasePrice ?? 0);
  const appreciationPct = (property.purchasePrice ?? 0) > 0 ? (appreciation / property.purchasePrice) * 100 : 0;
  const equityPct       = (property.currentValue ?? 0) > 0 ? ((property.equity ?? 0) / property.currentValue) * 100 : 0;
  const ltv             = (property.currentValue ?? 0) > 0 ? (((property.mortgageBalance ?? 0) / property.currentValue) * 100).toFixed(0) : '—';

  const toggleMaint = (id: number) => setExpandedMaint(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // ── Tab: Home ─────────────────────────────────────────────────────────────
  const renderHome = () => (
    <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}>
      {/* Value hero */}
      <View style={[s.valueHero, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
        <Text style={[s.valueLabel, { color: C.textMuted }]}>Estimated Value</Text>
        <Text style={[s.valueBig, { color: C.primary }]}>{fmtK(property.currentValue)}</Text>
        <View style={s.valueRow}>
          {property.avmLow && property.avmHigh && (
            <Text style={[s.valueRange, { color: C.textMuted }]}>
              Range: {fmtK(property.avmLow)} – {fmtK(property.avmHigh)}
            </Text>
          )}
          {appreciationPct !== 0 && (
            <View style={[s.apprChip, { backgroundColor: C.success + '18' }]}>
              <Text style={[s.apprChipTxt, { color: C.success }]}>▲ +{appreciationPct.toFixed(1)}%</Text>
            </View>
          )}
        </View>
        <Text style={[s.avmSrc, { color: C.textMuted }]}>Quantarium AVM</Text>
      </View>

      {/* Key stats grid */}
      <View style={s.statsGrid}>
        <StatCell label="Equity"      value={fmtK(property.equity)}          color={C.success}  C={C} />
        <StatCell label="LTV"         value={ltv !== '—' ? `${ltv}%` : '—'}  color={C.warning}  C={C} />
        <StatCell label="Sqft"        value={property.sqft?.toLocaleString() ?? '—'} C={C} />
        <StatCell label="Beds/Baths"  value={property.beds ? `${property.beds}/${property.baths}` : '—'} C={C} />
        <StatCell label="Year Built"  value={property.yearBuilt ? `${property.yearBuilt}` : '—'} C={C} />
        <StatCell label="Gain"        value={appreciation > 0 ? `+${fmtK(appreciation)}` : '—'} color={C.success} C={C} />
      </View>

      {/* Equity bar */}
      <SectionCard title="EQUITY SNAPSHOT" C={C}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={[Typography.sm, { color: C.textSecondary }]}>Your equity</Text>
          <Text style={{ color: C.success, fontWeight: '700', fontSize: 14 }}>
            {fmt(property.equity)} ({equityPct.toFixed(0)}%)
          </Text>
        </View>
        <View style={[s.track, { backgroundColor: C.bgBorder }]}>
          <View style={[s.fill, { width: `${Math.min(equityPct, 100)}%`, backgroundColor: C.success }]} />
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.lg, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={[s.legend, { backgroundColor: C.success }]} />
            <Text style={[Typography.xs, { color: C.textMuted }]}>Equity {fmtK(property.equity)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={[s.legend, { backgroundColor: C.danger }]} />
            <Text style={[Typography.xs, { color: C.textMuted }]}>Mortgage {fmtK(property.mortgageBalance)}</Text>
          </View>
        </View>
      </SectionCard>

      {/* Your people */}
      <SectionCard title="YOUR PEOPLE" C={C}>
        {[
          { name: 'Maria Chen',  role: 'Broker',       firm: 'Compass',  icon: 'person' },
          { name: 'Jeff Liu',    role: 'Loan officer', firm: 'BECU',     icon: 'person' },
        ].map((p, i) => (
          <View key={i} style={[s.personRow, i > 0 && { borderTopWidth: 1, borderTopColor: C.bgBorder }]}>
            <View style={[s.personAvatar, { backgroundColor: C.primary + '22' }]}>
              <Ionicons name="person" size={16} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.personName, { color: C.textPrimary }]}>{p.name}</Text>
              <Text style={[Typography.xs, { color: C.textMuted }]}>{p.role} · {p.firm}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );

  // ── Tab: Valuation ────────────────────────────────────────────────────────
  const renderValuation = () => (
    <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}>
      {/* AVM */}
      <View style={[s.avmBanner, { backgroundColor: C.primary + '10', borderColor: C.primary + '33' }]}>
        <Text style={[s.avmBig, { color: C.primary }]}>{fmtK(property.currentValue)}</Text>
        <Text style={[Typography.xs, { color: C.primary }]}>Quantarium AVM · updated today</Text>
        {property.avmLow && property.avmHigh && (
          <Text style={[s.avmConf, { color: C.textMuted }]}>
            Confidence range: {fmtK(property.avmLow)} – {fmtK(property.avmHigh)}
          </Text>
        )}
      </View>

      {/* KPI strip */}
      <View style={s.kpiRow}>
        {[
          { label: 'Equity',       value: fmtK(property.equity),          sub: '+18.4% / 12 mo', color: C.success },
          { label: 'Mortgage',     value: fmtK(property.mortgageBalance),  sub: '−$11k paid down', color: C.danger },
          { label: 'Zip Median',   value: '$1.36M',                        sub: '+5.8% / 12 mo',   color: C.textPrimary },
        ].map((k, i) => (
          <View key={i} style={[s.kpiCell, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
            <Text style={[s.kpiVal, { color: k.color }]}>{k.value}</Text>
            <Text style={[s.kpiLabel, { color: C.textMuted }]}>{k.label}</Text>
            <Text style={[s.kpiSub, { color: C.textMuted }]}>{k.sub}</Text>
          </View>
        ))}
      </View>

      {/* Appreciation */}
      <SectionCard title="APPRECIATION" C={C}>
        <DataRow label="Purchase price"  value={fmt(property.purchasePrice)}                             C={C} />
        <DataRow label="Current value"   value={fmt(property.currentValue)}    valueColor={C.primary}    C={C} />
        <DataRow label="Total gain"      value={`+${fmt(appreciation)} (+${appreciationPct.toFixed(1)}%)`} valueColor={C.success} C={C} />
        <DataRow label="Since"           value={property.yearBuilt ? `${property.yearBuilt}` : 'Purchase'} C={C} />
      </SectionCard>

      {/* Quantarium tools */}
      <View style={[s.sCard, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
        <Text style={[s.sCardTitle, { color: C.textMuted }]}>QUANTARIUM TOOLS</Text>
        <View style={s.toolsGrid}>
          {['QCMA', 'Qedge', 'QBPO', 'Desktop Valuation', 'Property Report', 'Online HPI'].map((t, i) => (
            <TouchableOpacity key={i} style={[s.toolChip, { borderColor: C.primary + '55', backgroundColor: C.primary + '0A' }]}>
              <Ionicons name="cube-outline" size={12} color={C.primary} />
              <Text style={[s.toolChipTxt, { color: C.primary }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Micro-market */}
      <SectionCard title="YOUR MICRO-MARKET · 98006" C={C}>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          {[
            { label: 'Median price', value: '$1.36M' },
            { label: 'Median DOM',   value: '14 days' },
            { label: 'YoY change',   value: '+2.4%'   },
          ].map((m, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[s.microVal, { color: C.textPrimary }]}>{m.value}</Text>
              <Text style={[Typography.xs, { color: C.textMuted, textAlign: 'center' }]}>{m.label}</Text>
            </View>
          ))}
        </View>
        <Text style={[Typography.xs, { color: C.textMuted, marginTop: 8 }]}>Source: TerraPlot · Bellevue</Text>
      </SectionCard>
    </ScrollView>
  );

  // ── Tab: Financing ────────────────────────────────────────────────────────
  const renderFinancing = () => (
    <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}>
      {/* Mortgage details */}
      <SectionCard title="MORTGAGE" C={C}>
        <DataRow label="Purchase price"    value={fmt(property.purchasePrice)}                                          C={C} />
        <DataRow label="Current balance"   value={fmt(property.mortgageBalance)}  valueColor={C.danger}                 C={C} />
        <DataRow label="Rate"              value={property.mortgageRate ? `${property.mortgageRate}%` : '4.625%'}        C={C} />
        <DataRow label="Loan type"         value="15-yr fixed"                                                           C={C} />
        <DataRow label="LTV"               value={`${ltv}%`}                      valueColor={C.warning}                C={C} />
        <DataRow label="Equity"            value={`${fmt(property.equity)} (${equityPct.toFixed(0)}%)`} valueColor={C.success} C={C} />
      </SectionCard>

      {/* Refi opportunity */}
      <View style={[s.oppCard, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
        <View style={s.oppHeader}>
          <Ionicons name="trending-down-outline" size={18} color="#EA580C" />
          <Text style={[s.oppTitle, { color: '#EA580C' }]}>Refinance opportunity</Text>
        </View>
        <Text style={[s.oppDesc, { color: '#9A3412' }]}>
          Refinance could save ~$312/mo. 15-yr fixed near 4.10% (was 4.625%). Break-even in 18 months.
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <TouchableOpacity style={[s.oppBtn, { backgroundColor: '#EA580C' }]}>
            <Text style={s.oppBtnTxt}>Talk to a lender</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.oppBtnOutline, { borderColor: '#EA580C' }]}>
            <Text style={[s.oppBtnOutlineTxt, { color: '#EA580C' }]}>Run scenarios</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sell readiness */}
      <View style={[s.oppCard, { backgroundColor: '#F0FDFA', borderColor: '#99F6E4' }]}>
        <View style={s.oppHeader}>
          <Ionicons name="pricetag-outline" size={18} color="#0D9488" />
          <Text style={[s.oppTitle, { color: '#0D9488' }]}>Sell readiness</Text>
        </View>
        <Text style={[s.oppDesc, { color: '#134E4A' }]}>
          If you listed today, likely price $1.43M – $1.52M. Median DOM 14 days, closing at 99.2% of list (TerraPlot).
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <TouchableOpacity style={[s.oppBtn, { backgroundColor: '#0D9488' }]}>
            <Text style={s.oppBtnTxt}>Start Sell engagement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.oppBtnOutline, { borderColor: '#0D9488' }]}>
            <Text style={[s.oppBtnOutlineTxt, { color: '#0D9488' }]}>Open TerraPlot</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loan officer */}
      <SectionCard title="YOUR LOAN OFFICER" C={C}>
        <View style={s.personRow}>
          <View style={[s.personAvatar, { backgroundColor: C.primary + '22' }]}>
            <Ionicons name="person" size={16} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.personName, { color: C.textPrimary }]}>Jeff Liu</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>Loan officer · BECU · Refi model ready</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </View>
      </SectionCard>
    </ScrollView>
  );

  // ── Tab: Maintenance ──────────────────────────────────────────────────────
  const renderMaintenance = () => (
    <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}>
      {/* Upcoming */}
      <Text style={[s.maintSection, { color: C.textMuted }]}>UPCOMING</Text>
      {MOCK_UPCOMING.map(ev => (
        <MaintRow
          key={ev.id}
          ev={ev}
          expanded={expandedMaint.has(ev.id)}
          onToggle={() => toggleMaint(ev.id)}
        />
      ))}

      {/* Divider */}
      <View style={[s.histDivider, { borderColor: C.bgBorder }]}>
        <View style={[s.histLine, { backgroundColor: C.bgBorder }]} />
        <Text style={[s.histLabel, { color: C.textMuted, backgroundColor: C.bgBase }]}>HISTORY</Text>
        <View style={[s.histLine, { backgroundColor: C.bgBorder }]} />
      </View>

      {/* History */}
      {MOCK_HISTORY.map(ev => (
        <MaintRow
          key={ev.id}
          ev={ev}
          expanded={expandedMaint.has(ev.id)}
          onToggle={() => toggleMaint(ev.id)}
        />
      ))}
    </ScrollView>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  const TABS: { key: DigestTab; label: string; icon: string }[] = [
    { key: 'home',        label: 'Home',        icon: 'home-outline' },
    { key: 'valuation',   label: 'Valuation',   icon: 'trending-up-outline' },
    { key: 'financing',   label: 'Financing',   icon: 'cash-outline' },
    { key: 'maintenance', label: 'Maintenance', icon: 'construct-outline' },
  ];

  return (
    <View style={[s.screen, { backgroundColor: C.bgBase }]}>
      {/* ── Hero image ──────────────────────────────────────────────────── */}
      <View style={s.hero}>
        <Image source={{ uri: imgUrl }} style={s.heroImg} resizeMode="cover" />
        {/* Back button */}
        <TouchableOpacity style={[s.backBtn, { top: TOP_INSET + 8 }]} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        {/* Address overlay */}
        <View style={s.heroOverlay}>
          <Text style={s.heroAddr} numberOfLines={1}>{property.address}</Text>
          <Text style={s.heroSub}>{property.city}, {property.state} {property.zip}</Text>
          {/* Chip strip */}
          <View style={s.heroChips}>
            {property.beds   && <View style={s.heroChip}><Text style={s.heroChipTxt}>{property.beds}bd</Text></View>}
            {property.baths  && <View style={s.heroChip}><Text style={s.heroChipTxt}>{property.baths}ba</Text></View>}
            {property.sqft   && <View style={s.heroChip}><Text style={s.heroChipTxt}>{property.sqft.toLocaleString()} sqft</Text></View>}
            {property.yearBuilt && <View style={s.heroChip}><Text style={s.heroChipTxt}>Built {property.yearBuilt}</Text></View>}
          </View>
        </View>
      </View>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {tab === 'home'        && renderHome()}
        {tab === 'valuation'   && renderValuation()}
        {tab === 'financing'   && renderFinancing()}
        {tab === 'maintenance' && renderMaintenance()}
      </View>

      {/* ── Bottom tab bar ───────────────────────────────────────────────── */}
      <View style={[s.tabBar, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={s.tabItem}
              onPress={() => setTab(t.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={t.icon as any}
                size={20}
                color={active ? C.primary : C.textMuted}
              />
              <Text style={[s.tabLabel, { color: active ? C.primary : C.textMuted }]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const BOTTOM_INSET = Platform.OS === 'ios' ? 20 : 0;

const s = StyleSheet.create({
  screen:      { flex: 1 },

  // Hero
  hero:        { width, height: HERO_H, position: 'relative' },
  heroImg:     { width, height: HERO_H },
  backBtn:     {
    position: 'absolute', left: 12, width: 34, height: 34,
    borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.md, paddingBottom: 12, paddingTop: 40,
    // gradient-like fade via backgroundColor
    backgroundColor: 'rgba(0,0,0,0)',
  },
  heroAddr:    { color: '#fff', fontSize: 17, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 8, textShadowOffset: { width: 0, height: 1 } },
  heroSub:     { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } },
  heroChips:   { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 7 },
  heroChip:    { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  heroChipTxt: { color: '#fff', fontSize: 11, fontWeight: '600' },

  // Stats grid
  statsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  statCell:    { flex: 1, minWidth: '30%', borderRadius: Radius.md, padding: 10, alignItems: 'center', borderWidth: 1 },
  statVal:     { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  statLbl:     { fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Value hero
  valueHero:   { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.sm },
  valueLabel:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  valueBig:    { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  valueRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  valueRange:  { fontSize: 12 },
  apprChip:    { paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full },
  apprChipTxt: { fontSize: 12, fontWeight: '700' },
  avmSrc:      { fontSize: 10, marginTop: 6 },

  // Section card
  sCard:       { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  sCardTitle:  { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },

  // Equity bar
  track:       { height: 8, borderRadius: 4, overflow: 'hidden', marginVertical: Spacing.xs },
  fill:        { height: 8, borderRadius: 4 },
  legend:      { width: 8, height: 8, borderRadius: 4 },

  // Data row
  dataRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1 },

  // People
  personRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: Spacing.sm },
  personAvatar:{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  personName:  { fontSize: 14, fontWeight: '600', marginBottom: 2 },

  // AVM banner
  avmBanner:   { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.sm },
  avmBig:      { fontSize: 30, fontWeight: '800' },
  avmConf:     { fontSize: 12, marginTop: 4 },

  // KPI row
  kpiRow:      { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.sm },
  kpiCell:     { flex: 1, borderRadius: Radius.md, borderWidth: 1, padding: 10, alignItems: 'center' },
  kpiVal:      { fontSize: 14, fontWeight: '700' },
  kpiLabel:    { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  kpiSub:      { fontSize: 10, marginTop: 1 },

  // Tools
  toolsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  toolChip:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1 },
  toolChipTxt: { fontSize: 12, fontWeight: '600' },

  // Micro-market
  microVal:    { fontSize: 16, fontWeight: '700' },

  // Opportunity cards
  oppCard:     { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  oppHeader:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  oppTitle:    { fontSize: 15, fontWeight: '700' },
  oppDesc:     { fontSize: 13, lineHeight: 19 },
  oppBtn:      { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full },
  oppBtnTxt:   { color: '#fff', fontSize: 12, fontWeight: '700' },
  oppBtnOutline:    { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1 },
  oppBtnOutlineTxt: { fontSize: 12, fontWeight: '700' },

  // Maintenance
  maintSection:{ fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  maintRow:    { flexDirection: 'row', marginBottom: 0 },
  rail:        { alignItems: 'center', width: 32, marginRight: Spacing.sm },
  dot:         { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  railLine:    { width: 2, flex: 1, minHeight: 16 },
  maintCard:   { flex: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 11, marginBottom: Spacing.sm, borderWidth: 1 },
  maintCardRow:{ flexDirection: 'row', alignItems: 'center' },
  maintTitle:  { fontSize: 14, fontWeight: '600' },
  maintDate:   { fontSize: 11, marginTop: 2 },
  costChip:    { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full },
  costChipTxt: { fontSize: 11, fontWeight: '600' },
  priPill:     { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  priPillTxt:  { fontSize: 10, fontWeight: '700' },
  maintDetail: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm, marginTop: -4 },
  maintNote:   { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  vendorRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  vendorTxt:   { fontSize: 13, fontWeight: '600', flex: 1 },
  vendorCost:  { fontSize: 13 },
  findBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 7 },
  findBtnTxt:  { fontSize: 13, fontWeight: '600' },
  histDivider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: Spacing.md },
  histLine:    { flex: 1, height: 1 },
  histLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingHorizontal: 4 },

  // Bottom tab bar
  tabBar:      {
    flexDirection:  'row',
    borderTopWidth: 1,
    paddingBottom:  BOTTOM_INSET,
  },
  tabItem:     { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 3 },
  tabLabel:    { fontSize: 10, fontWeight: '600' },
});
