import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Platform, StatusBar,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useColors, useTheme } from '../../context/ThemeContext';
import { Spacing, Radius, Typography } from '../../theme';

const MAP_URL = 'https://tarsho-production.up.railway.app/bellevue-map.html';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SavedProp {
  address:  string;
  price:    number;
  beds?:    string | number;
  baths?:   string | number;
  sqft?:    string | number;
  ppsf?:    number;
  type?:    string;
  zip?:     string;
  dom?:     number;
  hoa?:     number;
  built?:   number | string;
  lotSqft?: number;
  url?:     string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtPrice(n: number): string {
  if (!n) return '—';
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(0)}K`;
}

// ── Saved property card ───────────────────────────────────────────────────────
function SavedCard({ item, colors }: { item: SavedProp; colors: ReturnType<typeof useColors> }) {
  const C = colors;
  return (
    <View style={[card.wrap, { backgroundColor: C.bgSurface, borderColor: C.bgBorder }]}>
      <View style={card.headerRow}>
        <Text style={[card.price, { color: C.textPrimary }]}>{fmtPrice(item.price)}</Text>
        {!!item.type && (
          <View style={[card.badge, { backgroundColor: C.buy + '22' }]}>
            <Text style={[card.badgeText, { color: C.buy }]}>{item.type}</Text>
          </View>
        )}
        {item.dom != null && (
          <Text style={[card.dom, { color: C.textMuted }]}>{item.dom}d</Text>
        )}
      </View>
      <Text style={[card.address, { color: C.textPrimary }]} numberOfLines={1}>
        {item.address}
      </Text>
      <Text style={[card.stats, { color: C.textMuted }]}>
        {[
          item.beds  ? `${item.beds} bd`  : null,
          item.baths ? `${item.baths} ba` : null,
          item.sqft  ? `${Number(item.sqft).toLocaleString()} sqft` : null,
          item.ppsf  ? `$${item.ppsf}/sf` : null,
        ].filter(Boolean).join(' · ')}
      </Text>
    </View>
  );
}

const card = StyleSheet.create({
  wrap:      {
    marginHorizontal: Spacing.md,
    marginVertical:   5,
    padding:          14,
    borderRadius:     Radius.md,
    borderWidth:      1,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  price:     { fontSize: 18, fontWeight: '800' },
  badge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  badgeText: { fontSize: 11, fontWeight: '600' },
  dom:       { marginLeft: 'auto' as any, fontSize: 12 },
  address:   { fontSize: 13, fontWeight: '500', marginBottom: 3 },
  stats:     { fontSize: 12 },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export default function BuySavedScreen() {
  const C          = useColors();
  const { mode }   = useTheme();
  const webRef     = useRef<WebView>(null);

  const [view,      setView]      = useState<'list' | 'map'>('list');
  const [items,     setItems]     = useState<SavedProp[]>([]);
  const [webLoaded, setWebLoaded] = useState(false);

  // JS injected after WebView loads:
  //  • posts saved items from localStorage back to RN
  //  • hides #filter-btn and #saved-btn (both moved to the mobile nav)
  //  • caps popup tile width to the phone screen width
  //  • overrides applyFilters() to show ONLY saved-property pins (no off-market, no unrelated listings)
  //  • applies the app theme
  const buildInjectJS = useCallback(() => {
    return `
      (function(){
        // 1. Post saved items to React Native for the list view
        var saved = localStorage.getItem('bv-saved');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SAVED_ITEMS',
          data: saved ? JSON.parse(saved) : []
        }));

        // 2. Hide unused toolbar controls
        var st = document.createElement('style');
        st.textContent = '#filter-btn,#saved-btn{display:none!important}';
        document.head.appendChild(st);

        // 3. Compact popup (column layout: photo top, text below) + hide parcel squares
        var ps = document.createElement('style');
        ps.textContent = '.leaflet-popup-content-wrapper{width:calc((100vw - 32px)*0.67)!important;max-width:calc((100vw - 32px)*0.67)!important;box-sizing:border-box!important;padding:0!important;overflow:hidden!important}.leaflet-popup-content{width:auto!important;margin:0!important}.pp{flex-direction:column!important;width:calc((100vw - 32px)*0.67)!important}.pp-media{width:auto!important;min-height:0!important;height:120px!important;border:0!important;border-bottom:1px solid #E2E8F0!important;flex-shrink:0!important}.pp-body{padding:8px 10px!important;flex:1!important}.pp-stats{grid-template-columns:repeat(3,1fr)!important;gap:2px!important;margin-bottom:4px!important;padding:4px 0!important}.pp-si{font-size:10px!important}.pp-addr{font-size:11px!important;white-space:normal!important}.pp-price{font-size:13px!important}.leaflet-parcels-pane{display:none!important}';
        document.head.appendChild(ps);

        // 4. Apply theme
        window.postMessage(JSON.stringify({tarsTheme:'${mode}'}), '*');

        // 5. After map initialises, override applyFilters to show ONLY saved pins
        setTimeout(function(){
          window.applyFilters = function(){
            if(typeof mg==='undefined'||typeof allMarkers==='undefined') return;
            mg.clearLayers();
            var cnt=0;
            allMarkers.forEach(function(m){
              var k=propKey(m._p);
              if(savedProps.has(k)){
                m.setIcon(makeIcon(getColor(m._p),true));
                mg.addLayer(m);
                cnt++;
              }
            });
            updateCount(cnt);
            // Zoom to saved pins
            if(cnt>0){try{var _lls=[];mg.eachLayer(function(m){_lls.push(m.getLatLng());});if(_lls.length>0){map.fitBounds(L.latLngBounds(_lls).pad(0.12));}}catch(e){}}
          };
          applyFilters();
        }, 800);
      })(); true;
    `;
  }, [mode]);

  // Re-read saved items whenever this tab comes into focus
  // (so saves made in the Search tab appear immediately here)
  useFocusEffect(useCallback(() => {
    if (webLoaded) {
      webRef.current?.injectJavaScript(`
        (function(){
          var saved = localStorage.getItem('bv-saved');
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SAVED_ITEMS',
            data: saved ? JSON.parse(saved) : []
          }));
        })(); true;
      `);
    }
  }, [webLoaded]));

  const onLoad = useCallback(() => {
    webRef.current?.injectJavaScript(buildInjectJS());
    setWebLoaded(true);
  }, [buildInjectJS]);

  const onMessage = useCallback((e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === 'SAVED_ITEMS') setItems(msg.data || []);
    } catch {}
  }, []);

  const src = `${MAP_URL}?theme=${mode}&title=${encodeURIComponent('Saved Homes')}`;

  return (
    <View style={[s.root, { backgroundColor: C.bgBase }]}>

      {/* ── List / Map toggle ──────────────────────────────────────────── */}
      <View style={[s.toggleBar, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
        {(['list', 'map'] as const).map(v => {
          const active = view === v;
          return (
            <TouchableOpacity
              key={v}
              style={[
                s.pill,
                active && { backgroundColor: C.buy + '1A', borderColor: C.buy },
                !active && { borderColor: 'transparent' },
              ]}
              onPress={() => setView(v)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={v === 'list' ? 'list-outline' : 'map-outline'}
                size={14}
                color={active ? C.buy : C.textMuted}
              />
              <Text style={[s.pillLabel, { color: active ? C.buy : C.textMuted }]}>
                {v === 'list' ? 'List' : 'Map'}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* Saved count */}
        {items.length > 0 && (
          <Text style={[s.countLabel, { color: C.textMuted }]}>
            {items.length} saved
          </Text>
        )}
      </View>

      {/* ── List content (shown in list mode) ──────────────────────────── */}
      {view === 'list' && (
        !webLoaded ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.md }]}>
              Loading saved homes…
            </Text>
          </View>
        ) : items.length === 0 ? (
          <View style={s.center}>
            <Ionicons name="heart-outline" size={52} color={C.bgBorder2 ?? C.bgBorder} />
            <Text style={[Typography.sm, {
              color: C.textMuted,
              marginTop: Spacing.md,
              textAlign: 'center',
              lineHeight: 20,
            }]}>
              {'No saved homes yet.\nTap ☆ on any listing in Search\nto save it here.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, i) => item.url || item.address || String(i)}
            renderItem={({ item }) => <SavedCard item={item} colors={C} />}
            contentContainerStyle={{ paddingVertical: Spacing.sm }}
            showsVerticalScrollIndicator={false}
          />
        )
      )}

      {/* ── Map WebView — always mounted (absolute + opacity:0 behind list) ─
           This lets us read localStorage even when the user is on list view,
           and avoids a reload when toggling back to map.               */}
      <View
        pointerEvents={view === 'map' ? 'auto' : 'none'}
        style={view === 'map' ? s.mapVisible : s.mapHidden}
      >
        <WebView
          ref={webRef}
          source={{ uri: src }}
          style={{ flex: 1, backgroundColor: C.bgBase }}
          onLoad={onLoad}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          cacheEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={[s.center, { backgroundColor: C.bgBase }]}>
              <ActivityIndicator size="large" color={C.primary} />
            </View>
          )}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    </View>
  );
}

const TOP_PAD = Platform.OS === 'ios' ? (StatusBar.currentHeight ?? 0) : 0;

const s = StyleSheet.create({
  root:       { flex: 1 },
  toggleBar:  {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.xs,
    borderBottomWidth: 1,
    gap:               Spacing.xs,
  },
  pill:       {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:      Radius.full,
    borderWidth:       1,
  },
  pillLabel:  { fontSize: 13, fontWeight: '600' },
  countLabel: { fontSize: 12, color: undefined, marginLeft: 'auto' as any },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  mapVisible: { flex: 1 },
  mapHidden:  { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
