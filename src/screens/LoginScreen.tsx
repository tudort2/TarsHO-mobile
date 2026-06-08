import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Animated, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animated glow for the button
  const glowAnim = useRef(new Animated.Value(0)).current;

  const pulseGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();
  };

  React.useEffect(() => { pulseGlow(); }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (e: any) {
      setError(e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.bgBase, Colors.gradientMid, Colors.gradientEnd]}
      style={styles.container}
    >
      {/* Glowing orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>T</Text>
          </View>
          <Text style={styles.logoText}>TARS</Text>
        </View>
        <Text style={styles.tagline}>Your home ownership platform</Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() => Alert.alert('Reset Password', 'A reset link will be sent to your email.')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Animated Sign In Button */}
          <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            <Animated.View style={[styles.btnGlow, { opacity: glowOpacity }]} />
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Sign In</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 TARS USA · Powered by AI</Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: Spacing.lg },
  orb: { position: 'absolute', borderRadius: Radius.full },
  orb1: { width: 300, height: 300, top: -80, right: -80, backgroundColor: Colors.primary, opacity: 0.08 },
  orb2: { width: 200, height: 200, bottom: 100, left: -60, backgroundColor: Colors.buy, opacity: 0.08 },

  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  logoMark: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoMarkText: { ...Typography.h2, color: '#fff' },
  logoText: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 2 },
  tagline: { ...Typography.sm, textAlign: 'center', marginBottom: Spacing.xl },

  card: { backgroundColor: Colors.bgSurface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.bgBorder },
  cardTitle: { ...Typography.h1, marginBottom: 4 },
  cardSubtitle: { ...Typography.sm, marginBottom: Spacing.md },

  errorBanner: { backgroundColor: '#450a0a', borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.danger },
  errorText: { color: '#fca5a5', fontSize: 13 },

  inputLabel: { ...Typography.label, marginBottom: 6 },
  input: { backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.bgBorder, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.textPrimary, fontSize: 15, marginBottom: Spacing.md },

  forgotRow: { alignItems: 'flex-end', marginBottom: Spacing.lg, marginTop: -8 },
  forgotText: { color: Colors.primary, fontSize: 13 },

  btnGlow: { position: 'absolute', top: 4, left: 8, right: 8, bottom: -4, backgroundColor: Colors.primary, borderRadius: Radius.lg, zIndex: -1 },
  btn: { borderRadius: Radius.lg, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  footer: { ...Typography.xs, textAlign: 'center', marginTop: Spacing.xl },
});
