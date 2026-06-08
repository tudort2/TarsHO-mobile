import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../theme';
import { Role, User } from '../types';
import { MOCK_USER } from '../data/mockData';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/homeowner/DashboardScreen';
import PropertyDetailScreen from '../screens/homeowner/PropertyDetailScreen';
import JourneyScreen from '../screens/homeowner/JourneyScreen';
import BrokerCRMScreen from '../screens/broker/BrokerCRMScreen';
import ContactDetailScreen from '../screens/broker/ContactDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoleSwitcher from '../components/RoleSwitcher';
import TopBar from '../components/TopBar';

// Each navigator instance must be created once at module scope
const RootStack   = createNativeStackNavigator();
const DashStack   = createNativeStackNavigator(); // Dashboard → PropertyDetail
const ContactStack = createNativeStackNavigator(); // Contacts  → ContactDetail
const HomeTab     = createBottomTabNavigator();
const BrokerTab   = createBottomTabNavigator();

// ─── Dashboard stack (handles PropertyDetail navigation) ─────────────────────
function DashboardStackNav() {
  return (
    <DashStack.Navigator screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="DashboardHome" component={DashboardScreen} />
      <DashStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </DashStack.Navigator>
  );
}

// ─── Contacts stack (handles ContactDetail navigation) ───────────────────────
function ContactsStackNav() {
  return (
    <ContactStack.Navigator screenOptions={{ headerShown: false }}>
      <ContactStack.Screen name="ContactList" component={BrokerCRMScreen} />
      <ContactStack.Screen name="ContactDetail" component={ContactDetailScreen} />
    </ContactStack.Navigator>
  );
}

// ─── Homeowner tabs ───────────────────────────────────────────────────────────
function HomeownerTabs({ user }: { user: User }) {
  return (
    <HomeTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.bgSurface, borderTopColor: Colors.bgBorder },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Dashboard: 'grid-outline',
            Journey:   'map-outline',
            Profile:   'person-outline',
          };
          return (
            <Ionicons
              name={(icons[route.name] ?? 'ellipse-outline') as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <HomeTab.Screen name="Dashboard" component={DashboardStackNav} />
      <HomeTab.Screen name="Journey"   component={JourneyScreen} />
      <HomeTab.Screen name="Profile">
        {() => <ProfileScreen user={user} />}
      </HomeTab.Screen>
    </HomeTab.Navigator>
  );
}

// ─── Broker tabs ──────────────────────────────────────────────────────────────
function BrokerTabs({ user }: { user: User }) {
  return (
    <BrokerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.bgSurface, borderTopColor: Colors.bgBorder },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            Contacts: 'people-outline',
            Profile:  'person-outline',
          };
          return (
            <Ionicons
              name={(icons[route.name] ?? 'ellipse-outline') as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <BrokerTab.Screen name="Contacts" component={ContactsStackNav} />
      <BrokerTab.Screen name="Profile">
        {() => <ProfileScreen user={user} />}
      </BrokerTab.Screen>
    </BrokerTab.Navigator>
  );
}

// ─── Main app shell (shown after login) ──────────────────────────────────────
interface ShellProps {
  user: User;
  onRoleTap: () => void;
}

function AppShell({ user, onRoleTap }: ShellProps) {
  return (
    <View style={styles.shell}>
      <TopBar
        role={user.role}
        userName={user.name}
        avatarUrl={user.avatarUrl}
        onRoleTap={onRoleTap}
      />
      {/* key={user.role} resets the navigator when the role changes */}
      <View key={user.role} style={styles.content}>
        {user.role === 'broker'
          ? <BrokerTabs user={user} />
          : <HomeownerTabs user={user} />
        }
      </View>
    </View>
  );
}

// ─── Root navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [roleSwitcherVisible, setRoleSwitcherVisible] = useState(false);

  const handleLogin = async (email: string, password: string): Promise<void> => {
    // Replace with: await api.auth.login(email, password)
    await new Promise(r => setTimeout(r, 800));
    if (password.length < 4) throw new Error('Invalid credentials');
    setLoggedIn(true);
  };

  const handleRoleChange = (role: Role) => {
    setUser(prev => ({ ...prev, role }));
  };

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {!loggedIn ? (
            <RootStack.Screen name="Login">
              {() => <LoginScreen onLogin={handleLogin} />}
            </RootStack.Screen>
          ) : (
            <RootStack.Screen name="App">
              {() => (
                <AppShell
                  user={user}
                  onRoleTap={() => setRoleSwitcherVisible(true)}
                />
              )}
            </RootStack.Screen>
          )}
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Role switcher lives outside NavigationContainer intentionally —
          it is a plain Modal and needs no navigation context */}
      <RoleSwitcher
        currentRole={user.role}
        onSelect={handleRoleChange}
        visible={roleSwitcherVisible}
        onClose={() => setRoleSwitcherVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  shell:   { flex: 1, backgroundColor: Colors.bgBase },
  content: { flex: 1 },
});
