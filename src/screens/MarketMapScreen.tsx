import React, { useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  Platform, StatusBar,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors, useTheme } from '../context/ThemeContext';
import { Spacing, Radius, Typography } from '../theme';

const MAP_URL = 'https://tarsho-production.up.railway.app/bellevue-map.html';

export default function MarketMapScreen() {
  const C          = useColors();
  const { mode }   = useTheme();
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const webRef     = useRef<WebView>(null);

  const screenTitle:    string  = route.params?.title            ?? 'Market Research';
  const hideHeader:     boolean = route.params?.hideHeader        ?? false;
  const autoOpenSaved:  boolean = route.params?.autoOpenSaved     ?? false;
  const hideSavedButton: boolean = route.params?.hideSavedButton  ?? false;

  const injectTheme = useCallback(() => {
    const js = `window.postMessage(JSON.stringify({tarsTheme:'${mode}'}), '*'); true;`;
    webRef.current?.injectJavaScript(js);
    webRef.current?.injectJavaScript(
      `(function(){var s=document.createElement('style');` +
      `s.textContent=` +
      `'.leaflet-popup-content-wrapper{width:calc((100vw - 32px)*0.67)!important;max-width:calc((100vw - 32px)*0.67)!important;box-sizing:border-box!important;padding:0!important;overflow:hidden!important}` +
      `.leaflet-popup-content{width:auto!important;margin:0!important}` +
      `.pp{flex-direction:column!important;width:calc((100vw - 32px)*0.67)!important}` +
      `.pp-media{width:auto!important;min-height:0!important;height:120px!important;border:0!important;border-bottom:1px solid #E2E8F0!important;flex-shrink:0!important}` +
      `.pp-body{padding:8px 10px!important;flex:1!important}` +
      `.pp-stats{grid-template-columns:repeat(3,1fr)!important;gap:2px!important;margin-bottom:4px!important;padding:4px 0!important}` +
      `.pp-si{font-size:10px!important}` +
      `.pp-addr{font-size:11px!important;white-space:normal!important}` +
      `.pp-price{font-size:13px!important}` +
      `';document.head.appendChild(s);})();true;`
    );
    if (hideSavedButton) {
      webRef.current?.injectJavaScript(
        `(function(){var s=document.createElement('style');` +
        `s.textContent='#saved-btn{display:none!important}';` +
        `document.head.appendChild(s);})();true;`
      );
    }
    if (autoOpenSaved) {
      setTimeout(() => {
        webRef.current?.injectJavaScript(
          `(function(){var b=document.getElementById('saved-btn');` +
          `if(b&&!document.getElementById('saved-panel').classList.contains('open')){b.click();}` +
          `})();true;`
        );
      }, 800);
    }
  }, [mode, hideSavedButton, autoOpenSaved]);

  const src = `${MAP_URL}?theme=${mode}&title=${encodeURIComponent(screenTitle)}`;
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[s.screen, { backgroundColor: C.bgBase }]}>
      {!hideHeader && (
        <View style={[s.topBar, { backgroundColor: C.bgSurface, borderBottomColor: C.bgBorder }]}>
          {canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
              <Ionicons name="chevron-back" size={22} color={C.primary} />
            </TouchableOpacity>
          ) : (
            <View style={s.backBtn} />
          )}
          <View style={s.titleBlock}>
            <Text style={[s.title, { color: C.textPrimary }]}>{screenTitle}</Text>
            <Text style={[Typography.xs, { color: C.textMuted }]}>644 listings · June 2026</Text>
          </View>
          <TouchableOpacity
            onPress={() => webRef.current?.reload()}
            style={s.reloadBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="refresh-outline" size={20} color={C.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      <WebView
        ref={webRef}
        source={{ uri: src }}
        style={{ flex: 1, backgroundColor: C.bgBase }}
        onLoad={injectTheme}
        onMessage={(_e: WebViewMessageEvent) => {}}
        startInLoadingState
        renderLoading={() => (
          <View style={[s.loader, { backgroundColor: C.bgBase }]}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.md }]}>
              Loading market data…
            </Text>
          </View>
        )}
        renderError={(_e, _c, desc) => (
          <View style={[s.loader, { backgroundColor: C.bgBase }]}>
            <Ionicons name="wifi-outline" size={48} color={C.bgBorder2} />
            <Text style={[Typography.sm, { color: C.textMuted, marginTop: Spacing.md, textAlign: 'center' }]}>
              {desc || 'Could not load map.\nCheck your connection.'}
            </Text>
            <TouchableOpacity
              style={[s.retryBtn, { backgroundColor: C.primary }]}
              onPress={() => webRef.current?.reload()}
            >
              <Text style={s.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        cacheEnabled
      />
    </View>
  );
}

const TOP_INSET = Platform.OS === 'ios' ? (StatusBar.currentHeight ?? 44) : 0;

const s = StyleSheet.create({
  screen:     { flex: 1 },
  topBar:     {
    paddingTop: TOP_INSET + Spacing.sm,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  backBtn:    { width: 32, padding: 4 },
  titleBlock: { flex: 1 },
  title:      { fontSize: 15, fontWeight: '700' },
  reloadBtn:  { padding: 4 },
  loader:     {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  retryBtn:   {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  retryText:  { color: '#fff', fontSize: 14, fontWeight: '600' },
});
