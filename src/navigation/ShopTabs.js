import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import ShopScreen from '../screens/ShopScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminManageProductsScreen from '../screens/AdminManageProductsScreen';
import AdminCustomersScreen from '../screens/AdminCustomersScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { user, cart } = useShop();
  const cartCount = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const isAdmin = user?.role === 'Admin';

  return <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false, tabBarActiveTintColor: COLORS.green, tabBarInactiveTintColor: COLORS.muted,
    tabBarStyle: { height: 65, paddingTop: 7, paddingBottom: 6, borderTopColor: COLORS.border, backgroundColor: COLORS.white },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: 4 },
    tabBarIcon: ({ color, size }) => {
      const icons = {
        Shop: 'storefront-outline',
        Favorites: 'heart-outline',
        Cart: 'cart-outline',
        Profile: 'person-circle-outline',
        'Manage Products': 'cube-outline',
        'Customers': 'people-outline',
      };
      return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} />;
    }
  })}>
    <Tab.Screen name="Shop" component={ShopScreen} />
    
    {isAdmin ? (
      <>
        <Tab.Screen
          name="Manage Products"
          component={AdminManageProductsScreen}
          options={{ title: 'Products' }}
        />
        <Tab.Screen
          name="Customers"
          component={AdminCustomersScreen}
          options={{ title: 'Customers' }}
        />
      </>
    ) : null}

    {!isAdmin ? <Tab.Screen name="Favorites" component={FavoritesScreen} /> : null}
    {!isAdmin ? (
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarBadge: cartCount ? cartCount : undefined }} />
    ) : null}
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>;
}