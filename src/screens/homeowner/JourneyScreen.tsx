import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, Pressable, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { BUY_STAGES, SELL_STAGES } from '../../data/mockData';
import { JourneyStage, ChecklistItem } from '../../types';

type Tab = 'buy' | 'sell';

function StageRow({ stage, onPress }: { stage: JourneyStage; onPress: () => void }) {
  const isCompleted = stage.status === 'completed';
  const isActive = stage.status === 'active';
  const dotColor = isCompleted ? Colors.success : isActive ? Colors.primary : Colors.bgBorder;
  const lineColor = isCompleted ? Colors.success : Colors.bgBorder;

  return (
    <TouchableOpacity style={styles.stageRow} onPress={onPress} activeOpacity={0.8}>
      {/* Rail */}
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: dotColor, borderColor: isActive ? Colors.primary : 'transparent', borderWidth: isActive ? 3 : 0 }]}>
          {isCompleted && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        {stage.id < 16 && <View style={[styles.line, { backgroundColor: lineColor }]} />}
      </View>

      {/* Content */}
      <View style={[styles.stageCard, isActive && styles.stageCardActive]}>
        <View style={styles.stageHeader}>
          <Text style={styles.stageNum}>Stage {stage.id}</Text>
          <View style={[styles.statusChip, {
            backgroundColor: isCompleted ? Colors.success + '22' : isActive ? Colors.primary + '22' : Colors.bgBorder + '55',
          }]}>
            <Text style={[styles.statusChipText, {
              color: isCompleted ? Colors.success : isActive ? Colors.primary : Colors.textMuted,
            }]}>
              {isCompleted ? 'Complete' : isActive ? 'In Progress' : 'Upcoming'}
            </Text>
          </View>
        </View>
        <Text style={styles.stageTitle}>{stage.title}</Text>
        <Text style={styles.stageDesc} numberOfLines={2}>{stage.description}</Text>
        <Text style={styles.checklistCount}>
          {stage.checklist.filter(c => c.completed).length}/{stage.checklist.length} tasks done
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function StageModal({ stage, onClose }: { stage: JourneyStage | null; onClose: () => void }) {
  const [items, setItems] = useState<ChecklistItem[]>(stage?.checklist || []);
  if (!stage) return null;

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));

  return (
    <Modal visible={!!stage} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetStageNum}>Stage {stage.id}</Text>
        <Text style={styles.sheetTitle}>{stage.title}</Text>
        <Text style={styles.sheetDesc}>{stage.description}</Text>
        <Text style={[Typography.label, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>Checklist</Text>
        {items.map(item => (
          <TouchableOpacity key={item.id} style={styles.checkRow} onPress={() => toggle(item.id)}>
            <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
              {item.completed && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={[styles.checkLabel, item.completed && styles.checkLabelDone]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

export default function JourneyScreen() {
  const [tab, setTab] = useState<Tab>('buy');
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  const stages = tab === 'buy' ? BUY_STAGES : SELL_STAGES;

  return (
    <View style={styles.screen}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['buy', 'sell'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && { color: t === 'buy' ? Colors.buy : Colors.sell }]}>
              {t === 'buy' ? '🏠 Buy Journey' : '🔑 Sell Journey'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}>
        {/* Progress summary */}
        <View style={styles.progressSummary}>
          <Text style={Typography.sm}>
            {stages.filter(s => s.status === 'completed').length} of 16 stages complete
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {
              width: `${(stages.filter(s => s.status === 'completed').length / 16) * 100}%`,
              backgroundColor: tab === 'buy' ? Colors.buy : Colors.sell,
            }]} />
          </View>
        </View>

        {stages.map(stage => (
          <StageRow key={stage.id} stage={stage} onPress={() => setSelectedStage(stage)} />
        ))}
      </ScrollView>

      <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgBase },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.bgSurface, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },

  progressSummary: { marginBottom: Spacing.md },
  progressTrack: { height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, marginTop: 6 },
  progressFill: { height: 4, borderRadius: 2 },

  stageRow: { flexDirection: 'row', marginBottom: 0 },
  rail: { alignItems: 'center', width: 32, marginRight: Spacing.sm },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bgBorder, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, minHeight: 16 },

  stageCard: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.bgBorder },
  stageCardActive: { borderColor: Colors.primary },
  stageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stageNum: { color: Colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  statusChipText: { fontSize: 11, fontWeight: '600' },
  stageTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  stageDesc: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6 },
  checklistCount: { color: Colors.textMuted, fontSize: 11 },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: Colors.bgSurface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 48, maxHeight: '80%', borderTopWidth: 1, borderColor: Colors.bgBorder },
  sheetHandle: { width: 40, height: 4, backgroundColor: Colors.bgBorder, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.md },
  sheetStageNum: { color: Colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  sheetTitle: { ...Typography.h2, marginBottom: Spacing.xs },
  sheetDesc: { ...Typography.sm, marginBottom: Spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.bgBorder },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Colors.bgBorder, marginRight: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkLabel: { color: Colors.textPrimary, fontSize: 14, flex: 1 },
  checkLabelDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
});
