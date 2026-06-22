import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationState } from '@react-navigation/native';
import { useColors } from '../context/ThemeContext';
import { Spacing, Radius } from '../theme';

interface Props {
  title: string;
  centerLabel?: string;
  right?: React.ReactNode;
  onTitlePress?: () => void;
  showProfile?: boolean;
  onProfilePress?: () => void;
  profileInitials?: string;
}

export default function TopBar({
  title,
  centerLabel,
  right,
  onTitlePress,
  showProfile,
  onProfilePress,
  profileInitials,
}: Props) {
  const C      = useColors();
  const insets = useSafeAreaInsets();

  // Derive label from the active nested screen within the active tab.
  // TopBar is rendered as a Tab.Navigator header — it IS inside the nav tree,
  // so useNavigationState works here (unlike AppShell which creates the navigator).
  const nestedLabel = useNavigationState(state => {
    if (!state) return undefined;
    const tabRoute = state.routes[state.index];
    if (!tabRoute || tabRoute.name !== 'HomeTab') return undefined;

    const nestedState = tabRoute.state;
    if (!nestedState?.routes) return undefined;

    const idx   = typeof nestedState.index === 'number' ? nestedState.index : 0;
    const route = nestedState.routes[idx];
    // BuyContext is itself a Tab.Navigator — go one level deeper for label
    if (route?.name === 'BuyContext') {
      const buyTabState = route.state;
      if (!buyTabState?.routes) return 'Buy';
      const buyIdx   = typeof buyTabState.index === 'number' ? buyTabState.index : 0;
      const buyRoute = (buyTabState.routes as any[])[buyIdx];
      switch (buyRoute?.name) {
        case 'BuySearch':  return 'Search';
        case 'BuySaved':   return 'Saved';
        case 'BuyJourney': return 'Journey';
        default:           return 'Buy';
      }
    }

    const params = route?.params as any;
    switch (route?.name) {
      case 'PropertyDetail': return 'Home Digest';
      case 'Journey':        return params?.journeyType === 'sell' ? 'Sell' : 'Buy';
      case 'Profile':        return 'Profile';
      default:               return undefined;
    }
  });

  // nestedLabel (from navigation state) overrides the centerLabel prop
  const effectiveLabel = nestedLabel !== undefined ? nestedLabel : (centerLabel ?? '');

  return (
    <View style={[
      styles.bar,
      {
        paddingTop:      insets.top + 8,
        backgroundColor: C.bgSurface,
        borderBottomColor: C.bgBorder,
      },
    ]}>
      {/* Center label — fills full bar height so justifyContent:center aligns with the pill */}
      {!!effectiveLabel && (
        <View style={[styles.centerLabelWrap, { top: insets.top }]} pointerEvents="none">
          <Text
            style={[styles.centerLabel, { color: C.textSecondary }]}
            numberOfLines={1}
          >
            {effectiveLabel}
          </Text>
        </View>
      )}

      {/* TARS glass pill */}
      <TouchableOpacity
        onPress={onTitlePress}
        activeOpacity={onTitlePress ? 0.7 : 1}
        style={[styles.pill, { backgroundColor: C.primary + '18', borderColor: C.primary + '33' }]}
        disabled={!onTitlePress}
      >
        <Text style={[styles.brand, { color: C.primary }]}>{title}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      {right ? <View style={styles.right}>{right}</View> : null}

      {showProfile && (
        <TouchableOpacity
          onPress={onProfilePress}
          style={[styles.profileBtn, { backgroundColor: C.primary + '22', borderColor: C.primary + '55' }]}
          activeOpacity={0.75}
        >
          {profileInitials
            ? <Text style={[styles.profileInitials, { color: C.primary }]}>{profileInitials}</Text>
            : <Ionicons name="person" size={16} color={C.primary} />
          }
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: Spacing.md,
    paddingBottom:     10,
    borderBottomWidth: 1,
  },

  // Wrapper spans the full bar height — justifyContent:center aligns with TARS pill
  centerLabelWrap: {
    position:        'absolute',
    left:            0,
    right:           0,
    top:             0,
    bottom:          0,
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          0,
  },
  centerLabel: {
    textAlign:     'center',
    fontSize:      14,
    fontWeight:    '500',
    letterSpacing: 0.2,
  },

  pill: {
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:      Radius.full,
    borderWidth:       1,
    zIndex:            1,
  },
  brand: { fontSize: 14, fontWeight: '800', letterSpacing: 2 },

  right: { flexDirection: 'row', alignItems: 'center', marginRight: 8, zIndex: 1 },

  profileBtn: {
    width:          32,
    height:         32,
    borderRadius:   16,
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth:    1,
    zIndex:         1,
  },
  profileInitials: { fontSize: 12, fontWeight: '700' },
});
