import React from 'react';
import { View } from 'react-native';
import {
  NavigationContainer, DefaultTheme, DarkTheme,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useColors, useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/initials';

import LoginScreen                  from '../screens/LoginScreen';
import DashboardScreen              from '../screens/homeowner/DashboardScreen';
import PropertyDetailScreen         from '../screens/homeowner/PropertyDetailScreen';
import JourneyScreen                from '../screens/homeowner/JourneyScreen';
import AddScreen                    from '../screens/homeowner/AddScreen';
import HomeownerContactsScreen      from '../screens/homeowner/HomeownerContactsScreen';
import HomeownerContactDetailScreen from '../screens/homeowner/HomeownerContactDetailScreen';
import BrokerCRMScreen              from '../screens/broker/BrokerCRMScreen';
import ContactDetailScreen          from '../screens/broker/ContactDetailScreen';
import MyWorkScreen                 from '../screens/broker/MyWorkScreen';
import EngagementDetailScreen       from '../screens/broker/EngagementDetailScreen';
import MarketMapScreen              from '../screens/MarketMapScreen';
import BuySavedScreen               from '../screens/homeowner/BuySavedScreen';
import ProfileScreen                from '../screens/ProfileScreen';
import TopBar                       from '../components/TopBar';

const Tab    = createBottomTabNavigator();
const BuyTab = createBottomTabNavigator();
const Stack  = createNativeStackNavigator();

// ── Placeholder screen for BuyHome tab (tabPress listener handles navigation) ─
function PlaceholderScreen() {
  return <View style={{ flex: 1 }} />;
}

// ── Center label for outer tabs ───────────────────────────────────────────────
function centerLabelForTab(tabName: string): string {
  switch (tabName) {
    case 'AddTab':      return 'Add';
    case 'ResearchTab': return 'Research';
    case 'ContactsTab': return 'Contacts';
    case 'CRMTab':      return 'Contacts';
    default:            return '';
  }
}

// ── Buy context — replaces the outer tab bar while active ─────────────────────
// Tapping "Home" pops BuyContext from HomeStack → returns to Dashboard.
// Search and Saved both render MarketMapScreen; Saved auto-opens the saved panel.
function BuyContextNavigator() {
  const colors = useColors();

  const buyIcons: Record<string, string> = {
    BuyHome:    'home-outline',
    BuySearch:  'search-outline',
    BuySaved:   'heart-outline',
    BuyJourney: 'map-outline',
  };

  return (
    <BuyTab.Navigator
      initialRouteName="BuySearch"
      screenOptions={({ route }) => ({
        headerShown: false,   // outer AppShell TopBar provides the header
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={(buyIcons[route.name] ?? 'ellipse-outline') as any} size={size} color={color} />
        ),
        tabBarActiveTintColor:   colors.buy,   // #8B5CF6
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgSurface,
          borderTopColor:  colors.bgBorder,
        },
        tabBarItemStyle:  { justifyContent: 'center', alignItems: 'center', paddingVertical: 2 },
        tabBarLabelStyle: { fontSize: 11 },
      })}
    >
      {/* Home — listener pops BuyContext back to Dashboard */}
      <BuyTab.Screen
        name="BuyHome"
        component={PlaceholderScreen}
        options={{ title: 'Home' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('Dashboard');
          },
        })}
      />

      {/* Search — full Bellevue map, Saved button hidden (it lives in the bottom nav) */}
      <BuyTab.Screen
        name="BuySearch"
        component={MarketMapScreen}
        options={{ title: 'Search' }}
        initialParams={{ title: 'Search Listings', hideHeader: true, hideSavedButton: true }}
      />

      {/* Saved — list / map toggle; reads saved props from the map's localStorage */}
      <BuyTab.Screen
        name="BuySaved"
        component={BuySavedScreen}
        options={{ title: 'Saved' }}
      />

      {/* Journey — buy timeline */}
      <BuyTab.Screen
        name="BuyJourney"
        component={JourneyScreen}
        options={{ title: 'Journey' }}
        initialParams={{ journeyType: 'buy' }}
      />
    </BuyTab.Navigator>
  );
}

// ── Homeowner stacks ──────────────────────────────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard"      component={DashboardScreen} />
      <Stack.Screen name="BuyContext"     component={BuyContextNavigator} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <Stack.Screen name="Journey"        component={JourneyScreen} />
      <Stack.Screen name="MarketMap"      component={MarketMapScreen} />
      <Stack.Screen name="Profile"        component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function AddStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" component={AddScreen} />
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

// ── Broker stacks ─────────────────────────────────────────────────────────────
function BrokerCRMStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrokerCRM"        component={BrokerCRMScreen} />
      <Stack.Screen name="ContactDetail"    component={ContactDetailScreen} />
      <Stack.Screen name="EngagementDetail" component={EngagementDetailScreen} />
      <Stack.Screen name="MarketMap"        component={MarketMapScreen} />
    </Stack.Navigator>
  );
}

function MyWorkStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyWork"           component={MyWorkScreen} />
      <Stack.Screen name="EngagementDetail" component={EngagementDetailScreen} />
      <Stack.Screen name="MarketMap"        component={MarketMapScreen} />
    </Stack.Navigator>
  );
}

function ResearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarketMap" component={MarketMapScreen} />
    </Stack.Navigator>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────────
function AppShell() {
  const { user }  = useAuth();
  const colors    = useColors();
  const role      = user?.role ?? 'homeowner';
  const initials  = user?.name ? getInitials(user.name) : '';

  const iconMap: Record<string, string> = {
    HomeTab:     'home-outline',
    AddTab:      'add-circle-outline',
    ResearchTab: 'map-outline',
    ContactsTab: 'people-outline',
    MyWorkTab:   'briefcase-outline',
    CRMTab:      'people-outline',
    ProfileTab:  'person-circle-outline',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={(iconMap[route.name] ?? 'ellipse-outline') as any} size={size} color={color} />
        ),
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        // Hide outer tab bar when BuyContext is the active HomeStack screen
        tabBarStyle: (() => {
          if (route.name === 'HomeTab') {
            const focused = getFocusedRouteNameFromRoute(route) ?? '';
            if (focused === 'BuyContext' || focused === 'PropertyDetail') return { display: 'none' };
          }
          return {
            backgroundColor: colors.bgSurface,
            borderTopColor:  colors.bgBorder,
          };
        })(),
        tabBarItemStyle:  { justifyContent: 'center', alignItems: 'center', paddingVertical: 2 },
        tabBarLabelStyle: { fontSize: 11 },
        header: () => {
          const label = centerLabelForTab(route.name);
          if (role === 'homeowner') {
            return (
              <TopBar
                title="TARS"
                centerLabel={label}
                onTitlePress={() => navigation.navigate('HomeTab', { screen: 'Dashboard' })}
                showProfile
                profileInitials={initials}
                onProfilePress={() => navigation.navigate('HomeTab', { screen: 'Profile' })}
              />
            );
          }
          return <TopBar title="TARS" centerLabel={label} />;
        },
      })}
    >
      {role === 'homeowner' ? (
        <>
          <Tab.Screen name="HomeTab"     component={HomeStack}              options={{ title: 'Home' }} />
          <Tab.Screen name="AddTab"      component={AddStack}               options={{ title: 'Add' }} />
          <Tab.Screen name="ResearchTab" component={ResearchStack}          options={{ title: 'Research' }} />
          <Tab.Screen name="ContactsTab" component={HomeownerContactsStack} options={{ title: 'Contacts' }} />
        </>
      ) : role === 'broker' ? (
        <>
          <Tab.Screen
            name="MyWorkTab"
            component={MyWorkStack}
            options={{ title: 'My Work' }}
            listeners={({ navigation }) => ({
              tabPress: () => { navigation.navigate('MyWorkTab', { screen: 'MyWork' }); },
            })}
          />
          <Tab.Screen name="CRMTab"      component={BrokerCRMStack} options={{ title: 'Contacts' }} />
          <Tab.Screen name="ResearchTab" component={ResearchStack}  options={{ title: 'Research' }} />
          <Tab.Screen name="ProfileTab"  component={ProfileScreen}  options={{ title: 'Profile' }} />
        </>
      ) : (
        <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
      )}
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
