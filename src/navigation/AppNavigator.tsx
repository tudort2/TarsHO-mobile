import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../theme';
import { Role } from '../types';
import { AuthProvider, useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/homeowner/DashboardScreen';
import PropertyDetailScreen from '../screens/homeowner/PropertyDetailScreen';
import JourneyScreen from '../screens/homeowner/JourneyScreen';
import BrokerCRMScreen from '../screens/broker/BrokerCRMScreen';
import ContactDetailScreen from '../screens/broker/ContactDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoleSwitcher from '../components/RoleSwitcher';
import TopBar from '../components/TopBar';

const RootStack    = createNativeStackNavigator();
const DashStack    = createNativeStackNavigator();
const ContactStack = createNativeStackNavigator();
const HomeTab      = createBottomTabNavigator();
const BrokerTab    = createBottomTabNavigator();

function DashboardStackNav() {
  return (
    <DashStack.Navigator screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="DashboardHome" component={DashboardScreen} />
      <DashStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </DashStack.Navigator>
  );
}

function ContactsStackNav() {
  return (
    <ContactStack.Navigator screenOptions={{ headerShown: false }}>
      <ContactStack.Screen name="ContactList" component={BrokerCRMScreen} />
      <ContactStack.Screen name="ContactDetail" component={ContactDetailScreen} />
    </ContactStack.Navigator>
  );
}

function HomeownerTabs() {
  const { user } = useAuth();
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
          return <Ionicons name={(icons[route.name] ?? 'ellipse-outline') as any} size={size} color={color} />;
        },
      })}
    >
      <HomeTab.Screen name="Dashboard" component={DashboardStackNav} />
      <HomeTab.Screen name="Journey"   component={JourneyScreen} />
      <HomeTab.Screen name="Profile"   component={ProfileScreen} />
    </HomeTab.Navigator>
  );
}

function BrokerTabs() {
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
          return <Ionicons name={(icons[route.name] ?? 'ellipse-outline') as any} size={size} color={color} />;
        },
      })}
    >
      <BrokerTab.Screen name="Contacts" component={ContactsStackNav} />
      <BrokerTab.Screen name="Profile"  component={ProfileScreen} />
    </BrokerTab.Navigator>
  );
}

function AppShell({ onRoleTap }: { onRoleTap: () => void }) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <View style={styles.shell}>
      <TopBar
        role={user.role}
        userName={user.name}
        avatarUrl={user.avatarUrl}
        onRoleTap={onRoleTap}
      />
      <View key={user.role} style={styles.content}>
        {user.role === 'broker' ? <BrokerTabs /> : <HomeownerTabs />}
      </View>
    </View>
  );
}

function RootNavigator() {
  const { user, login } = useAuth();
  const [roleSwitcherVisible, setRoleSwitcherVisible] = useState(false);

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <RootStack.Screen name="Login">
              {() => <LoginScreen onLogin={login} />}
            </RootStack.Screen>
          ) : (
            <RootStack.Screen name="App">
              {() => <AppShell onRoleTap={() => setRoleSwitcherVisible(true)} />}
            </RootStack.Screen>
          )}
        </RootStack.Navigator>
      </NavigationContainer>

      <RoleSwitcher
        visible={roleSwitcherVisible}
        onClose={() => setRoleSwitcherVisible(false)}
      />
    </>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  shell:   { flex: 1, backgroundColor: Colors.bgBase },
  content: { flex: 1 },
});
