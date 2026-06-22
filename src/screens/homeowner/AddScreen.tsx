import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';
import { Property } from '../../types';
import { api } from '../../api/client';

type AddMode = 'property' | 'buy' | 'sell';

const TIMING_OPTIONS = ['ASAP', '3 months', '6 months', '1 year', 'Flexible'];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
  'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
  'TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

// ── Shared input components ───────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  const C = useColors();
  return (
    <View style={f.wrap}>
      <Text style={[f.label, { color: C.textMuted }]}>
        {label}{required ? <Text style={{ color: C.danger }}> *</Text> : null}
      </Text>
      {children}
    </View>
  );
}

function Input({
  value, onChangeText, placeholder, keyboardType, style,
}: {
  value: string; onChangeText: (v: string) => void; placeholder?: string;
  keyboardType?: any; style?: any;
}) {
  const C = useColors();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? ''}
      placeholderTextColor={C.textMuted}
      keyboardType={keyboardType ?? 'default'}
      style={[f.input, { backgroundColor: C.bgElevated ?? C.bgSurface, borderColor: C.bgBorder, color: C.textPrimary }, style]}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

function Row({ children, gap }: { children: React.ReactNode; gap?: number }) {
  return <View style={[f.row, { gap: gap ?? 12 }]}>{children}</View>;
}

function SectionHeader({ title }: { title: string }) {
  const C = useColors();
  return (
    <View style={[f.sectionHeader, { borderBottomColor: C.bgBorder }]}>
      <Text style={[f.sectionTitle, { color: C.textMuted }]}>{title}</Text>
    </View>
  );
}

const f = StyleSheet.create({
  wrap:          { flex: 1, marginBottom: Spacing.sm },
  label:         { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5 },
  input:         { borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  row:           { flexDirection: 'row' },
  sectionHeader: { borderBottomWidth: 1, paddingBottom: 8, marginTop: Spacing.md, marginBottom: Spacing.md },
  sectionTitle:  { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
});

// ── Property form ─────────────────────────────────────────────────────────────

interface PropForm {
  addressLine1: string; addressLine2: string;
  city: string; state: string; zip: string;
  beds: string; baths: string; sqft: string; yearBuilt: string;
  purchasePrice: string; purchaseDate: string;
  mortgageBalance: string; mortgageRate: string;
}

const emptyPropForm: PropForm = {
  addressLine1: '', addressLine2: '', city: '', state: 'WA', zip: '',
  beds: '', baths: '', sqft: '', yearBuilt: '',
  purchasePrice: '', purchaseDate: '', mortgageBalance: '', mortgageRate: '',
};

function PropertyForm({ form, setForm }: { form: PropForm; setForm: (f: PropForm) => void }) {
  const set = (k: keyof PropForm) => (v: string) => setForm({ ...form, [k]: v });
  return (
    <>
      <Field label="Address" required>
        <Input value={form.addressLine1} onChangeText={set('addressLine1')} placeholder="123 Main St" />
      </Field>
      <Field label="Address Line 2">
        <Input value={form.addressLine2} onChangeText={set('addressLine2')} placeholder="Unit, Suite, etc." />
      </Field>
      <Row>
        <Field label="City" required>
          <Input value={form.city} onChangeText={set('city')} placeholder="Bellevue" />
        </Field>
        <Field label="State" required>
          <Input value={form.state} onChangeText={set('state')} placeholder="WA" style={{ flex: 0, width: 64 }} />
        </Field>
      </Row>
      <Row>
        <Field label="ZIP">
          <Input value={form.zip} onChangeText={set('zip')} placeholder="98004" keyboardType="numeric" />
        </Field>
        <Field label="Beds">
          <Input value={form.beds} onChangeText={set('beds')} placeholder="3" keyboardType="numeric" />
        </Field>
        <Field label="Baths">
          <Input value={form.baths} onChangeText={set('baths')} placeholder="2" keyboardType="decimal-pad" />
        </Field>
      </Row>
      <Row>
        <Field label="Sq Ft">
          <Input value={form.sqft} onChangeText={set('sqft')} placeholder="1800" keyboardType="numeric" />
        </Field>
        <Field label="Year Built">
          <Input value={form.yearBuilt} onChangeText={set('yearBuilt')} placeholder="2005" keyboardType="numeric" />
        </Field>
      </Row>
      <SectionHeader title="Purchase" />
      <Row>
        <Field label="Purchase Price ($)">
          <Input value={form.purchasePrice} onChangeText={set('purchasePrice')} placeholder="0" keyboardType="numeric" />
        </Field>
        <Field label="Purchase Date">
          <Input value={form.purchaseDate} onChangeText={set('purchaseDate')} placeholder="YYYY-MM-DD" />
        </Field>
      </Row>
      <SectionHeader title="Mortgage" />
      <Row>
        <Field label="Balance ($)">
          <Input value={form.mortgageBalance} onChangeText={set('mortgageBalance')} placeholder="0" keyboardType="numeric" />
        </Field>
        <Field label="Rate (%)">
          <Input value={form.mortgageRate} onChangeText={set('mortgageRate')} placeholder="6.75" keyboardType="decimal-pad" />
        </Field>
      </Row>
    </>
  );
}

// ── Buy form ──────────────────────────────────────────────────────────────────

interface BuyForm {
  budgetMin: string; budgetMax: string;
  beds: string; baths: string;
  targetArea: string; timing: string;
}

const emptyBuyForm: BuyForm = {
  budgetMin: '', budgetMax: '', beds: '', baths: '', targetArea: '', timing: 'Flexible',
};

function BuyForm({ form, setForm }: { form: BuyForm; setForm: (f: BuyForm) => void }) {
  const C   = useColors();
  const set = (k: keyof BuyForm) => (v: string) => setForm({ ...form, [k]: v });
  return (
    <>
      <SectionHeader title="Budget" />
      <Row>
        <Field label="Min Budget ($)">
          <Input value={form.budgetMin} onChangeText={set('budgetMin')} placeholder="500,000" keyboardType="numeric" />
        </Field>
        <Field label="Max Budget ($)" required>
          <Input value={form.budgetMax} onChangeText={set('budgetMax')} placeholder="800,000" keyboardType="numeric" />
        </Field>
      </Row>
      <SectionHeader title="Desired Property" />
      <Row>
        <Field label="Min Beds">
          <Input value={form.beds} onChangeText={set('beds')} placeholder="3" keyboardType="numeric" />
        </Field>
        <Field label="Min Baths">
          <Input value={form.baths} onChangeText={set('baths')} placeholder="2" keyboardType="decimal-pad" />
        </Field>
      </Row>
      <Field label="Target Area / Neighborhood">
        <Input value={form.targetArea} onChangeText={set('targetArea')} placeholder="Bellevue, Redmond, Kirkland…" />
      </Field>
      <SectionHeader title="Timeline" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm }}>
        {TIMING_OPTIONS.map(opt => {
          const active = form.timing === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.timingChip,
                { borderColor: active ? C.buy : C.bgBorder, backgroundColor: active ? C.buy + '18' : C.bgSurface },
              ]}
              onPress={() => set('timing')(opt)}
            >
              <Text style={[styles.timingChipText, { color: active ? C.buy : C.textSecondary }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

// ── Sell form (property picker) ───────────────────────────────────────────────

function SellForm({
  properties, loading, selectedId, onSelect,
}: {
  properties: Property[]; loading: boolean; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const C = useColors();

  if (loading) {
    return (
      <View style={styles.sellLoading}>
        <ActivityIndicator color={C.sell} />
        <Text style={[Typography.sm, { color: C.textMuted, marginTop: 8 }]}>Loading properties…</Text>
      </View>
    );
  }

  if (properties.length === 0) {
    return (
      <View style={[styles.sellEmpty, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
        <Ionicons name="home-outline" size={36} color={C.bgBorder} />
        <Text style={[Typography.sm, { color: C.textMuted, marginTop: 8, textAlign: 'center' }]}>
          No properties found.{'\n'}Add a property first, then start a sell journey.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={[styles.sellHint, { color: C.textMuted }]}>Select the property you want to sell:</Text>
      {properties.map(p => {
        const isSelected = selectedId === String(p.id);
        return (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.propPickRow,
              {
                backgroundColor: C.bgSurface,
                borderColor: isSelected ? C.sell : C.bgBorder,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            onPress={() => onSelect(String(p.id))}
            activeOpacity={0.8}
          >
            <View style={[styles.propPickRadio, { borderColor: isSelected ? C.sell : C.bgBorder }, isSelected && { backgroundColor: C.sell }]}>
              {isSelected && <View style={styles.propPickDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.propPickAddr, { color: C.textPrimary }]} numberOfLines={1}>{p.address}</Text>
              <Text style={[Typography.xs, { color: C.textMuted }]}>
                {p.city}, {p.state}{p.beds ? ` · ${p.beds}bd/${p.baths}ba` : ''}
              </Text>
              <Text style={[Typography.xs, { color: C.primary }]}>${p.currentValue.toLocaleString()}</Text>
            </View>
            {isSelected && <Ionicons name="checkmark-circle" size={22} color={C.sell} />}
          </TouchableOpacity>
        );
      })}
    </>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function AddScreen() {
  const C          = useColors();
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();

  const [mode, setMode]               = useState<AddMode>('property');
  const [propForm, setPropForm]       = useState<PropForm>(emptyPropForm);
  const [buyForm, setBuyForm]         = useState<BuyForm>(emptyBuyForm);
  const [selectedPropId, setSelected] = useState<string | null>(null);
  const [properties, setProperties]  = useState<Property[]>([]);
  const [propsLoading, setPropsLoading] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  // Pre-select from route params (e.g., tapping "Sell" on a property tile)
  useEffect(() => {
    const p = route.params;
    if (p?.mode) setMode(p.mode as AddMode);
    if (p?.propertyId) setSelected(String(p.propertyId));
  }, [route.params?.mode, route.params?.propertyId]);

  // Load properties when Sell mode is active
  const loadProperties = useCallback(async () => {
    setPropsLoading(true);
    try {
      const list = await api.properties.list();
      setProperties(list);
    } catch { /* silent */ }
    finally { setPropsLoading(false); }
  }, []);

  useEffect(() => {
    if (mode === 'sell') loadProperties();
  }, [mode, loadProperties]);

  const MODE_CONFIG = [
    { key: 'property' as AddMode, label: 'Property', icon: 'home-outline',        color: C.primary },
    { key: 'buy'      as AddMode, label: 'Buy',      icon: 'trending-up-outline', color: C.buy },
    { key: 'sell'     as AddMode, label: 'Sell',     icon: 'pricetag-outline',    color: C.sell },
  ];

  const activeColor = MODE_CONFIG.find(m => m.key === mode)?.color ?? C.primary;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (mode === 'property') {
        if (!propForm.addressLine1.trim()) throw new Error('Address is required.');
        if (!propForm.city.trim())        throw new Error('City is required.');
        if (!propForm.state.trim())       throw new Error('State is required.');
        await api.properties.create({
          addressLine1:    propForm.addressLine1.trim(),
          addressLine2:    propForm.addressLine2.trim() || undefined,
          city:            propForm.city.trim(),
          state:           propForm.state.trim().toUpperCase(),
          zip:             propForm.zip.trim(),
          beds:            propForm.beds    ? parseInt(propForm.beds)          : undefined,
          baths:           propForm.baths   ? parseFloat(propForm.baths)       : undefined,
          sqft:            propForm.sqft    ? parseInt(propForm.sqft)           : undefined,
          yearBuilt:       propForm.yearBuilt ? parseInt(propForm.yearBuilt)   : undefined,
          purchasePrice:   propForm.purchasePrice  ? parseFloat(propForm.purchasePrice.replace(/,/g, ''))  : undefined,
          purchaseDate:    propForm.purchaseDate.trim() || undefined,
          mortgageBalance: propForm.mortgageBalance ? parseFloat(propForm.mortgageBalance.replace(/,/g, '')) : undefined,
          mortgageRate:    propForm.mortgageRate ? parseFloat(propForm.mortgageRate) : undefined,
        });
        setPropForm(emptyPropForm);
        Alert.alert('Property added', 'Your property has been added.', [
          { text: 'OK', onPress: () => navigation.getParent()?.navigate('HomeTab', { screen: 'Dashboard' }) },
        ]);

      } else if (mode === 'buy') {
        if (!buyForm.budgetMax.trim()) throw new Error('Max budget is required.');
        await api.engagements.create({
          type:      'buy',
          budgetMin: buyForm.budgetMin ? parseFloat(buyForm.budgetMin.replace(/,/g, '')) : undefined,
          budgetMax: parseFloat(buyForm.budgetMax.replace(/,/g, '')),
        });
        setBuyForm(emptyBuyForm);
        Alert.alert('Buy journey started', 'Your buy journey has been created.', [
          { text: 'OK', onPress: () => navigation.getParent()?.navigate('HomeTab', { screen: 'Dashboard' }) },
        ]);

      } else if (mode === 'sell') {
        if (!selectedPropId) throw new Error('Please select a property to sell.');
        await api.engagements.create({ type: 'sell', propertyId: selectedPropId });
        setSelected(null);
        Alert.alert('Sell journey started', 'Your sell journey has been created.', [
          { text: 'OK', onPress: () => navigation.getParent()?.navigate('HomeTab', { screen: 'Dashboard' }) },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitLabel = mode === 'property' ? 'Add Property' : mode === 'buy' ? 'Start Buy Journey' : 'Start Sell Journey';

  return (
    <View style={[styles.screen, { backgroundColor: C.bgBase }]}>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Mode radio toggle ──────────────────────────────────────────── */}
        <View style={[styles.modeBar, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
          {MODE_CONFIG.map(m => {
            const active = mode === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.modeBtn,
                  active && { backgroundColor: m.color + '18', borderColor: m.color },
                  !active && { borderColor: 'transparent' },
                ]}
                onPress={() => setMode(m.key)}
                activeOpacity={0.75}
              >
                <Ionicons name={m.icon as any} size={18} color={active ? m.color : C.textMuted} />
                <Text style={[styles.modeBtnText, { color: active ? m.color : C.textMuted }]}>{m.label}</Text>
                {active && <View style={[styles.modeDot, { backgroundColor: m.color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Active form ────────────────────────────────────────────────── */}
        <View style={styles.formBody}>
          {mode === 'property' && <PropertyForm form={propForm} setForm={setPropForm} />}
          {mode === 'buy'      && <BuyForm form={buyForm} setForm={setBuyForm} />}
          {mode === 'sell'     && (
            <SellForm
              properties={properties}
              loading={propsLoading}
              selectedId={selectedPropId}
              onSelect={setSelected}
            />
          )}
        </View>
      </ScrollView>

      {/* ── Sticky submit ──────────────────────────────────────────────── */}
      <View style={[styles.footer, { backgroundColor: C.bgSurface, borderTopColor: C.bgBorder }]}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: activeColor }, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>{submitLabel}</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Mode radio toggle
  modeBar:    { flexDirection: 'row', borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.lg, padding: 4, gap: 4 },
  modeBtn:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.sm, borderWidth: 1.5, position: 'relative' },
  modeBtnText:{ fontSize: 13, fontWeight: '700' },
  modeDot:    { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2 },

  formBody: { paddingTop: 4 },

  // Timing chips (Buy form)
  timingChip:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1 },
  timingChipText: { fontSize: 13, fontWeight: '600' },

  // Sell form
  sellLoading: { alignItems: 'center', paddingVertical: Spacing.xl },
  sellEmpty:   { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.xl, alignItems: 'center', marginTop: Spacing.md },
  sellHint:    { fontSize: 13, marginBottom: Spacing.md },
  propPickRow:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  propPickRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  propPickDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  propPickAddr:  { fontSize: 14, fontWeight: '600', marginBottom: 2 },

  // Footer submit
  footer:     { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderTopWidth: 1 },
  submitBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, paddingVertical: 14 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
