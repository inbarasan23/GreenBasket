import React from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import ShopTabs from './ShopTabs';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminManageProductsScreen from '../screens/AdminManageProductsScreen';
import AdminCustomersScreen from '../screens/AdminCustomersScreen';
import { useShop } from '../context/ShopContext';
import { COLORS } from '../theme';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { user, signOut } = useShop();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.logo}><Ionicons name="leaf" size={26} color={COLORS.white} /></View>
        <Text style={styles.brand}>GreenBasket</Text>
        <Text style={styles.user}>{user?.name || 'Shopper'} · {user?.role || 'Guest'}</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.signout} onPress={() => {
        signOut();
        props.navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
        <Text style={styles.signoutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function MainDrawer({ navigation }) {
  const { user } = useShop();
  const isAdmin = user?.role === 'Admin';

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: 'GreenBasket',
        headerTintColor: COLORS.green,
        headerStyle: { backgroundColor: COLORS.white },
        drawerActiveTintColor: COLORS.green,
        drawerInactiveTintColor: COLORS.muted,
        drawerActiveBackgroundColor: COLORS.pale,
        drawerLabelStyle: { fontWeight: '700', marginLeft: -14 },
        sceneStyle: { backgroundColor: COLORS.background }
      }}
    >
      <Drawer.Screen name="Shop Home" component={ShopTabs} options={{
        title: 'Shop Catalogue',
        drawerIcon: ({ color, size }) => <Ionicons name="storefront-outline" color={color} size={size} />
      }} />

      {isAdmin && (
        <>
          <Drawer.Screen name="AdminProducts" component={AdminManageProductsScreen} options={{
            title: 'Manage Products (Add/Edit)',
            drawerIcon: ({ color, size }) => <Ionicons name="cube-outline" color={color} size={size} />
          }} />
          <Drawer.Screen name="AdminCustomers" component={AdminCustomersScreen} options={{
            title: 'View Customers (CRM)',
            drawerIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />
          }} />
        </>
      )}

      {!isAdmin ? <Drawer.Screen name="Favorites Menu" component={FavoritesScreen} options={{
        title: 'Favorites',
        drawerIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />
      }} /> : null}

      {!isAdmin ? <Drawer.Screen name="Cart Menu" component={CartScreen} options={{
        title: 'My Cart',
        drawerIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} />
      }} /> : null}

      <Drawer.Screen name="Profile Menu" component={ProfileScreen} options={{
        title: 'My Profile',
        drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />
      }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.pale, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 22, marginBottom: 8 },
  logo: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  brand: { color: COLORS.text, fontSize: 20, fontWeight: '900' },
  user: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  signout: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  signoutText: { color: COLORS.red, fontWeight: '800', fontSize: 14 }
});
