import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useColors, useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

import LoginScreen                       from '../screens/LoginScreen';
import DashboardScreen                   from '../screens/homeowner/DashboardScreen';
import PropertyDetailScreen              from '../screens/homeowner/PropertyDetailScreen';
import JourneyScreen                     from '../screens/homeowner/JourneyScreen';
import HomeownerContactsScreen           from '../screens/homeowner/HomeownerContactsScreen';
import HomeownerContactDetailScreen      from '../screens/homeowner/HomeownerContactDetailScreen';
import BrokerCRMScreen                   from '../screens/broker/BrokerCRMScreen';
import ContactDetailScreen               from '../screens/broker/ContactDetailScreen';
import MyWorkScreen                      from '../screens/broker/MyWorkScreen';
import EngagementDetailScreen            from '../screens/broker/EngagementDetailScreen';
import ProfileScreen                     from '../screens/ProfileScreen';
import RoleSwitcher                      from '../components/RoleSwitcher';
import TopBar                            from '../components/TopBar';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard"      component={DashboardScreen} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
    </Stack.Navigator>
  );
}

function HomeownerContactsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeownerContacts"      component={HomeownerContactsScreen} />
      <Stack.Screen name="HomeownerContactDetail" component={HomeownerContactDetailScreen} />
    </Stack.Navigator>
  );
}

function BrokerCRMStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrokerCRM"     component={BrokerCRMScreen} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
    </Stack.Navigator>
  );
}

function MyWorkStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyWork"           component={MyWorkScreen} />
      <Stack.Screen name="EngagementDetail" component={EngagementDetailScreen} />
    </Stack.Navigator>
  );
}

function AppShell() {
  const { user } = useAuth();
  const colors   = useColors();
  const role     = user?.role ?? 'homeowner';

  const tabs =
    role === 'homeowner' ? [
      { name: 'HomeTab',     label: 'Home',     icon: 'home-outline',          component: HomeStack },
      { name: 'JourneyTab',  label: 'Journey',  icon: 'map-outline',           component: JourneyScreen },
      { name: 'ContactsTab', label: 'Contacts', icon: 'people-outline',        component: HomeownerContactsStack },
      { name: 'ProfileTab',  label: 'Profile',  icon: 'person-circle-outline', component: ProfileScreen },
    ] :
    role === 'broker' ? [
      { name: 'MyWorkTab',   label: 'My Work',  icon: 'briefcase-outline',     component: MyWorkStack },
      { name: 'CRMTab',      label: 'Contacts', icon: 'people-outline',        component: BrokerCRMStack },
      { name: 'ProfileTab',  label: 'Profile',  icon: 'person-circle-outline', component: ProfileScreen },
    ] : [
      { name: 'ProfileTab',  label: 'Profile',  icon: 'person-circle-outline', component: ProfileScreen },
    ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const tab = tabs.find(t => t.name === route.name);
          return <Ionicons name={(tab?.icon ?? 'ellipse-outline') as any} size={size} color={color} />;
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle:             { backgroundColor: colors.bgSurface, borderTopColor: colors.bgBorder },
        tabBarLabelStyle:        { fontSize: 11 },
        header: () => <TopBar title="TARS" right={<RoleSwitcher />} />,
      })}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.label }}
          listeners={tab.name === 'MyWorkTab' ? ({ navigation }) => ({
            tabPress: () => {
              // Always return to My Work list — don't restore EngagementDetail
              navigation.navigate('MyWorkTab', { screen: 'MyWork' });
            },
          }) : undefined}
        />
      ))}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, login } = useAuth();
  if (user) return <AppShell />;
  return <LoginScreen onLogin={login} />;
}

function ThemedApp() {
  const { mode, colors } = useTheme();
  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme : DefaultTheme).colors,
      background: colors.bgBase,
      card:       colors.bgSurface,
      text:       colors.textPrimary,
      border:     colors.bgBorder,
    },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
